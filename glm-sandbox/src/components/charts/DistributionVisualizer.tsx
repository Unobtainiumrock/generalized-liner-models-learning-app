import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { GLMError } from '@/types';

interface DistributionVisualizerProps {
  width?: number;
  height?: number;
}

type DistributionType = 'normal' | 'binomial' | 'bernoulli' | 'poisson' | 'gamma' | 'exponential' | 'beta';

interface DistributionInfo {
  name: string;
  type: 'continuous' | 'discrete';
  domain: [number, number];
  params: { name: string; value: number; min: number; max: number; step: number }[];
}

const DISTRIBUTIONS: Record<DistributionType, DistributionInfo> = {
  normal: {
    name: 'Normal',
    type: 'continuous',
    domain: [-4, 4],
    params: [
      { name: 'μ (mean)', value: 0, min: -3, max: 3, step: 0.5 },
      { name: 'σ² (variance)', value: 1, min: 0.1, max: 3, step: 0.1 }
    ]
  },
  poisson: {
    name: 'Poisson',
    type: 'discrete',
    domain: [0, 20],
    params: [
      { name: 'λ (rate)', value: 5, min: 0.5, max: 15, step: 0.5 }
    ]
  },
  binomial: {
    name: 'Binomial',
    type: 'discrete',
    domain: [0, 20],
    params: [
      { name: 'n (trials)', value: 20, min: 1, max: 50, step: 1 },
      { name: 'p (probability)', value: 0.5, min: 0.01, max: 0.99, step: 0.01 }
    ]
  },
  bernoulli: {
    name: 'Bernoulli',
    type: 'discrete',
    domain: [0, 1],
    params: [
      { name: 'p (probability)', value: 0.5, min: 0.01, max: 0.99, step: 0.01 }
    ]
  },
  gamma: {
    name: 'Gamma',
    type: 'continuous',
    domain: [0, 10],
    params: [
      { name: 'α (shape)', value: 2, min: 0.1, max: 10, step: 0.1 },
      { name: 'β (rate)', value: 1, min: 0.1, max: 5, step: 0.1 }
    ]
  },
  exponential: {
    name: 'Exponential',
    type: 'continuous',
    domain: [0, 5],
    params: [
      { name: 'λ (rate)', value: 1, min: 0.1, max: 5, step: 0.1 }
    ]
  },
  beta: {
    name: 'Beta',
    type: 'continuous',
    domain: [0, 1],
    params: [
      { name: 'α (shape1)', value: 2, min: 0.1, max: 10, step: 0.1 },
      { name: 'β (shape2)', value: 2, min: 0.1, max: 10, step: 0.1 }
    ]
  }
};

// Distribution probability functions
const normalPDF = (x: number, mu: number, sigma2: number): number => {
  const sigma = Math.sqrt(sigma2);
  return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
};

const poissonPMF = (k: number, lambda: number): number => {
  if (k < 0 || !Number.isInteger(k)) return 0;
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
};

const binomialPMF = (k: number, n: number, p: number): number => {
  if (k < 0 || k > n || !Number.isInteger(k) || !Number.isInteger(n)) return 0;
  return binomialCoefficient(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
};

const bernoulliPMF = (k: number, p: number): number => {
  if (k === 0) return 1 - p;
  if (k === 1) return p;
  return 0;
};

const gammaPDF = (x: number, alpha: number, beta: number): number => {
  if (x <= 0) return 0;
  return (Math.pow(beta, alpha) / gamma(alpha)) * Math.pow(x, alpha - 1) * Math.exp(-beta * x);
};

const exponentialPDF = (x: number, lambda: number): number => {
  if (x < 0) return 0;
  return lambda * Math.exp(-lambda * x);
};

const betaPDF = (x: number, alpha: number, beta: number): number => {
  if (x <= 0 || x >= 1) return 0;
  return (Math.pow(x, alpha - 1) * Math.pow(1 - x, beta - 1)) / betaFunction(alpha, beta);
};

// Helper functions
const factorial = (n: number): number => {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
};

const binomialCoefficient = (n: number, k: number): number => {
  if (k > n) return 0;
  if (k === 0 || k === n) return 1;
  return factorial(n) / (factorial(k) * factorial(n - k));
};

const gamma = (z: number): number => {
  // Stirling's approximation for gamma function
  if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  z -= 1;
  const g = 7;
  const C = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
  ];
  let x = C[0];
  for (let i = 1; i < g + 2; i++) {
    x += C[i] / (z + i);
  }
  const t = z + g + 0.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
};

const betaFunction = (alpha: number, beta: number): number => {
  return (gamma(alpha) * gamma(beta)) / gamma(alpha + beta);
};

export const DistributionVisualizer = React.memo(({ width = 600, height = 300 }: DistributionVisualizerProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [error, setError] = useState<GLMError | null>(null);
  const [selectedDist, setSelectedDist] = useState<DistributionType>('normal');
  const [params, setParams] = useState<Record<string, number>>({});

  // Initialize params for selected distribution
  useEffect(() => {
    const distInfo = DISTRIBUTIONS[selectedDist];
    const initialParams: Record<string, number> = {};
    distInfo.params.forEach(p => {
      initialParams[p.name] = p.value;
    });
    setParams(initialParams);
  }, [selectedDist]);

  const plotData = useMemo(() => {
    const distInfo = DISTRIBUTIONS[selectedDist];
    const [min, max] = distInfo.domain;
    const data: { x: number; y: number }[] = [];

    if (distInfo.type === 'continuous') {
      const step = (max - min) / 200;
      for (let x = min; x <= max; x += step) {
        let y = 0;
        switch (selectedDist) {
          case 'normal':
            y = normalPDF(x, params['μ (mean)'] || 0, params['σ² (variance)'] || 1);
            break;
          case 'gamma':
            y = gammaPDF(x, params['α (shape)'] || 2, params['β (rate)'] || 1);
            break;
          case 'exponential':
            y = exponentialPDF(x, params['λ (rate)'] || 1);
            break;
          case 'beta':
            y = betaPDF(x, params['α (shape1)'] || 2, params['β (shape2)'] || 2);
            break;
        }
        data.push({ x, y });
      }
    } else {
      // Discrete distributions
      for (let x = Math.floor(min); x <= Math.ceil(max); x++) {
        let y = 0;
        switch (selectedDist) {
          case 'poisson':
            y = poissonPMF(x, params['λ (rate)'] || 5);
            break;
          case 'binomial':
            const n = Math.floor(params['n (trials)'] || 20);
            y = binomialPMF(x, n, params['p (probability)'] || 0.5);
            break;
          case 'bernoulli':
            y = bernoulliPMF(x, params['p (probability)'] || 0.5);
            break;
        }
        data.push({ x, y });
      }
    }

    return data;
  }, [selectedDist, params]);

  const createPlot = useCallback(() => {
    if (!svgRef.current || plotData.length === 0) return;

    try {
      setError(null);
      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove();

      const margin = { top: 20, right: 20, bottom: 40, left: 60 };
      const distInfo = DISTRIBUTIONS[selectedDist];

      const xScale = d3.scaleLinear()
        .domain(distInfo.domain)
        .range([margin.left, width - margin.right]);

      const maxY = d3.max(plotData, d => d.y) || 1;
      const yScale = d3.scaleLinear()
        .domain([0, maxY * 1.1])
        .range([height - margin.bottom, margin.top]);

      if (distInfo.type === 'continuous') {
        // Draw continuous curve
        const line = d3.line<{ x: number; y: number }>()
          .x(d => xScale(d.x))
          .y(d => yScale(d.y))
          .curve(d3.curveMonotoneX);

        svg.append('path')
          .datum(plotData)
          .attr('fill', 'none')
          .attr('stroke', '#8b5cf6')
          .attr('stroke-width', 3)
          .attr('d', line);

        // Fill area under curve
        const area = d3.area<{ x: number; y: number }>()
          .x(d => xScale(d.x))
          .y0(yScale(0))
          .y1(d => yScale(d.y))
          .curve(d3.curveMonotoneX);

        svg.append('path')
          .datum(plotData)
          .attr('fill', '#8b5cf6')
          .attr('opacity', 0.2)
          .attr('d', area);
      } else {
        // Draw discrete bars
        const barWidth = (width - margin.left - margin.right) / (plotData.length + 1);
        
        svg.selectAll('.bar')
          .data(plotData)
          .enter()
          .append('rect')
          .attr('class', 'bar')
          .attr('x', d => xScale(d.x) - barWidth / 4)
          .attr('y', d => yScale(d.y))
          .attr('width', barWidth / 2)
          .attr('height', d => yScale(0) - yScale(d.y))
          .attr('fill', '#8b5cf6')
          .attr('opacity', 0.7);
      }

      // Add axes
      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale).ticks(5);

      svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(xAxis);

      svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(yAxis);

      // Add axis labels
      svg.append('text')
        .attr('transform', `translate(${width / 2}, ${height - 5})`)
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .text(distInfo.type === 'continuous' ? 'x' : 'k');

      svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 15)
        .attr('x', 0 - height / 2)
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .text(distInfo.type === 'continuous' ? 'f(x)' : 'P(X = k)');

    } catch (err) {
      setError({
        code: 'ESTIMATION_FAILED',
        message: 'Failed to create distribution plot',
        details: err
      });
    }
  }, [plotData, selectedDist, width, height]);

  useEffect(() => {
    createPlot();
  }, [createPlot]);

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

  return (
    <div className="w-full border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
      {/* Distribution selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Distribution
        </label>
        <select
          value={selectedDist}
          onChange={(e) => setSelectedDist(e.target.value as DistributionType)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
        >
          {Object.entries(DISTRIBUTIONS).map(([key, info]) => (
            <option key={key} value={key}>
              {info.name}
            </option>
          ))}
        </select>
      </div>

      {/* Parameter controls */}
      <div className="mb-4 space-y-3">
        {DISTRIBUTIONS[selectedDist].params.map((param) => (
          <div key={param.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {param.name}: {params[param.name]?.toFixed(2) || param.value.toFixed(2)}
            </label>
            <input
              type="range"
              min={param.min}
              max={param.max}
              step={param.step}
              value={params[param.name] || param.value}
              onChange={(e) => setParams(prev => ({ ...prev, [param.name]: parseFloat(e.target.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
          </div>
        ))}
      </div>

      {/* Plot */}
      <div className="flex justify-center">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          role="img"
          aria-label={`${DISTRIBUTIONS[selectedDist].name} distribution plot`}
        />
      </div>

      {/* Distribution type indicator */}
      <div className="mt-3 text-center text-sm text-gray-600">
        {DISTRIBUTIONS[selectedDist].type === 'continuous' ? 'Continuous' : 'Discrete'} Distribution
      </div>
    </div>
  );
});

