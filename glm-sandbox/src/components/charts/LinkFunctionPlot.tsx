import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { GLMError } from '@/types';

interface LinkFunctionPlotProps {
  width?: number;
  height?: number;
}

type LinkFunctionType = 'identity' | 'log' | 'logit' | 'probit' | 'cloglog' | 'inverse' | 'inverseSquared';

interface LinkFunctionInfo {
  name: string;
  formula: string;
  domain: [number, number];
  range: [number, number];
  canonical: string;
}

const LINK_FUNCTIONS: Record<LinkFunctionType, LinkFunctionInfo> = {
  identity: {
    name: 'Identity',
    formula: 'g(μ) = μ',
    domain: [-5, 5],
    range: [-5, 5],
    canonical: 'Normal'
  },
  log: {
    name: 'Log',
    formula: 'g(μ) = ln(μ)',
    domain: [0.01, 10],
    range: [-5, 2.5],
    canonical: 'Poisson'
  },
  logit: {
    name: 'Logit',
    formula: 'g(μ) = ln(μ/(1-μ))',
    domain: [0.01, 0.99],
    range: [-5, 5],
    canonical: 'Binomial/Bernoulli'
  },
  probit: {
    name: 'Probit',
    formula: 'g(μ) = Φ⁻¹(μ)',
    domain: [0.01, 0.99],
    range: [-3, 3],
    canonical: 'Binomial (alternative)'
  },
  cloglog: {
    name: 'Complementary log-log',
    formula: 'g(μ) = ln(-ln(1-μ))',
    domain: [0.01, 0.99],
    range: [-5, 3],
    canonical: 'Binomial (alternative)'
  },
  inverse: {
    name: 'Inverse',
    formula: 'g(μ) = 1/μ',
    domain: [0.1, 10],
    range: [-10, 10],
    canonical: 'Gamma/Exponential'
  },
  inverseSquared: {
    name: 'Inverse-squared',
    formula: 'g(μ) = 1/μ²',
    domain: [0.1, 10],
    range: [0, 100],
    canonical: 'Inverse Gaussian'
  }
};

const identityLink = (mu: number): number => mu;

const logLink = (mu: number): number => {
  if (mu <= 0) return NaN;
  return Math.log(mu);
};

const logitLink = (mu: number): number => {
  if (mu <= 0 || mu >= 1) return NaN;
  return Math.log(mu / (1 - mu));
};

const probitLink = (mu: number): number => {
  if (mu <= 0 || mu >= 1) return NaN;
  return inverseNormalCDF(mu);
};

const cloglogLink = (mu: number): number => {
  if (mu <= 0 || mu >= 1) return NaN;
  return Math.log(-Math.log(1 - mu));
};

const inverseLink = (mu: number): number => {
  if (mu === 0) return NaN;
  return 1 / mu;
};

const inverseSquaredLink = (mu: number): number => {
  if (mu === 0) return NaN;
  return 1 / (mu * mu);
};

const inverseNormalCDF = (p: number): number => {
  const a = [2.50662823884, -18.61500062529, 41.39119773534, -25.44106049637];
  const b = [-8.47351093090, 23.08336743743, -21.06224101826, 3.13082909833];
  const c = [0.3374754822726147, 0.9761690190917186, 0.1607979714918209,
            0.0276438810333863, 0.0038405729373609, 0.0003951896511919,
            0.0000321767881768, 0.0000002888167364, 0.0000003960315187];
  
  if (p < 0.02425) {
    const q = Math.sqrt(-2.0 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
           ((((q + c[6]) * q + c[7]) * q + c[8]) * q + 1);
  } else if (p <= 0.97575) {
    const q = p - 0.5;
    const r = q * q;
    return (((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * q /
           (((b[0] * r + b[1]) * r + b[2]) * r + b[3] * r + 1);
  } else {
    const q = Math.sqrt(-2.0 * Math.log(1 - p));
    return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
            ((((q + c[6]) * q + c[7]) * q + c[8]) * q + 1);
  }
};

const getLinkFunction = (type: LinkFunctionType): ((mu: number) => number) => {
  switch (type) {
    case 'identity': return identityLink;
    case 'log': return logLink;
    case 'logit': return logitLink;
    case 'probit': return probitLink;
    case 'cloglog': return cloglogLink;
    case 'inverse': return inverseLink;
    case 'inverseSquared': return inverseSquaredLink;
  }
};

export const LinkFunctionPlot = React.memo(({ width = 600, height = 300 }: LinkFunctionPlotProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [error, setError] = useState<GLMError | null>(null);
  const [selectedLink, setSelectedLink] = useState<LinkFunctionType>('logit');
  const [muValue, setMuValue] = useState<number>(0.5);

  const plotData = useMemo(() => {
    const linkInfo = LINK_FUNCTIONS[selectedLink];
    const linkFn = getLinkFunction(selectedLink);
    const [min, max] = linkInfo.domain;
    const data: { x: number; y: number }[] = [];
    
    const step = (max - min) / 200;
    for (let x = min; x <= max; x += step) {
      const y = linkFn(x);
      if (!isNaN(y) && isFinite(y)) {
        data.push({ x, y });
      }
    }
    
    return data;
  }, [selectedLink]);

  const currentEtaValue = useMemo(() => {
    const linkFn = getLinkFunction(selectedLink);
    return linkFn(muValue);
  }, [selectedLink, muValue]);

  const createPlot = useCallback(() => {
    if (!svgRef.current || plotData.length === 0) return;

    try {
      setError(null);
      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove();

      const margin = { top: 20, right: 20, bottom: 50, left: 70 };
      const linkInfo = LINK_FUNCTIONS[selectedLink];

      const xScale = d3.scaleLinear()
        .domain(linkInfo.domain)
        .range([margin.left, width - margin.right]);

      const yExtent = d3.extent(plotData, d => d.y) as [number, number];
      const yPadding = (yExtent[1] - yExtent[0]) * 0.1 || 1;
      
      const yScale = d3.scaleLinear()
        .domain([yExtent[0] - yPadding, yExtent[1] + yPadding])
        .range([height - margin.bottom, margin.top]);

      const line = d3.line<{ x: number; y: number }>()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y))
        .curve(d3.curveMonotoneX);

      svg.append('path')
        .datum(plotData)
        .attr('fill', 'none')
        .attr('stroke', '#10b981')
        .attr('stroke-width', 3)
        .attr('d', line);

      if (!isNaN(currentEtaValue) && isFinite(currentEtaValue)) {
        svg.append('line')
          .attr('x1', xScale(muValue))
          .attr('y1', yScale(0))
          .attr('x2', xScale(muValue))
          .attr('y2', yScale(currentEtaValue))
          .attr('stroke', '#ef4444')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '4,4')
          .attr('opacity', 0.6);

        svg.append('line')
          .attr('x1', margin.left)
          .attr('y1', yScale(currentEtaValue))
          .attr('x2', xScale(muValue))
          .attr('y2', yScale(currentEtaValue))
          .attr('stroke', '#3b82f6')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '4,4')
          .attr('opacity', 0.6);

        svg.append('circle')
          .attr('cx', xScale(muValue))
          .attr('cy', yScale(currentEtaValue))
          .attr('r', 5)
          .attr('fill', '#f59e0b')
          .attr('stroke', '#fff')
          .attr('stroke-width', 2);
      }

      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(xAxis);

      svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(yAxis);

      if (yExtent[0] <= 0 && yExtent[1] >= 0) {
        svg.append('line')
          .attr('x1', xScale(linkInfo.domain[0]))
          .attr('y1', yScale(0))
          .attr('x2', xScale(linkInfo.domain[1]))
          .attr('y2', yScale(0))
          .attr('stroke', '#9ca3af')
          .attr('stroke-width', 1)
          .attr('opacity', 0.3);
      }

      svg.append('text')
        .attr('transform', `translate(${width / 2}, ${height - 10})`)
        .style('text-anchor', 'middle')
        .style('font-size', '13px')
        .style('font-weight', '500')
        .text('μ (Mean)');

      svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 20)
        .attr('x', 0 - height / 2)
        .style('text-anchor', 'middle')
        .style('font-size', '13px')
        .style('font-weight', '500')
        .text('η = g(μ)');

    } catch (err) {
      setError({
        code: 'ESTIMATION_FAILED',
        message: 'Failed to create link function plot',
        details: err
      });
    }
  }, [plotData, selectedLink, muValue, currentEtaValue, width, height]);

  useEffect(() => {
    createPlot();
  }, [createPlot]);

  useEffect(() => {
    const linkInfo = LINK_FUNCTIONS[selectedLink];
    const midPoint = (linkInfo.domain[0] + linkInfo.domain[1]) / 2;
    setMuValue(midPoint);
  }, [selectedLink]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 border border-red-200 rounded-lg">
        <div className="text-center">
          <p className="text-red-600 font-medium">Error creating plot</p>
          <p className="text-red-500 text-sm mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  const linkInfo = LINK_FUNCTIONS[selectedLink];

  return (
    <div className="w-full border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Link Function
        </label>
        <select
          value={selectedLink}
          onChange={(e) => setSelectedLink(e.target.value as LinkFunctionType)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
        >
          {Object.entries(LINK_FUNCTIONS).map(([key, info]) => (
            <option key={key} value={key}>
              {info.name} - {info.formula}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4 p-3 bg-green-50 rounded-lg">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-600">Canonical for:</span>
            <span className="ml-2 font-semibold text-gray-800">{linkInfo.canonical}</span>
          </div>
          <div>
            <span className="text-gray-600">Domain:</span>
            <span className="ml-2 font-mono text-gray-800">
              {linkInfo.domain[0] === -5 ? '(-∞' : `(${linkInfo.domain[0]}`}, 
              {linkInfo.domain[1] === 5 ? ' ∞)' : ` ${linkInfo.domain[1]})`}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          μ value: {muValue.toFixed(3)}
        </label>
        <input
          type="range"
          min={linkInfo.domain[0]}
          max={linkInfo.domain[1]}
          step={(linkInfo.domain[1] - linkInfo.domain[0]) / 200}
          value={muValue}
          onChange={(e) => setMuValue(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
        />
        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">η = g(μ) =</span>
            <span className="text-lg font-mono font-semibold text-blue-600">
              {isNaN(currentEtaValue) || !isFinite(currentEtaValue) 
                ? 'undefined' 
                : currentEtaValue.toFixed(3)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          role="img"
          aria-label={`${linkInfo.name} link function plot`}
        />
      </div>

      <p className="text-xs text-gray-500 mt-3 text-center">
        Orange point shows current transformation: g({muValue.toFixed(2)}) = {
          isNaN(currentEtaValue) || !isFinite(currentEtaValue) 
            ? 'undefined' 
            : currentEtaValue.toFixed(2)
        }
      </p>
    </div>
  );
});

