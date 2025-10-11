import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { GLMError } from '@/types';

interface DomainTransformationPlotProps {
  width?: number;
  height?: number;
}

type TransformationExample = 'logit' | 'log' | 'identity';

interface TransformationStep {
  title: string;
  description: string;
  domain: [number, number];
  func: (x: number) => number;
  label: string;
}

const TRANSFORMATION_EXAMPLES: Record<TransformationExample, {
  name: string;
  initialDomain: string;
  steps: TransformationStep[];
}> = {
  logit: {
    name: 'Logit (for Binomial)',
    initialDomain: '(0, 1)',
    steps: [
      {
        title: 'Step 1: Original Domain',
        description: 'μ ∈ (0, 1) - bounded on both sides',
        domain: [0.01, 0.99],
        func: (x) => x,
        label: 'μ'
      },
      {
        title: 'Step 2a: Apply Odds Ratio',
        description: 'μ/(1-μ) maps (0,1) → (0,∞)',
        domain: [0.01, 0.99],
        func: (x) => x / (1 - x),
        label: 'μ/(1-μ)'
      },
      {
        title: 'Step 2b: Apply Logarithm',
        description: 'ln(μ/(1-μ)) maps (0,∞) → (-∞,∞)',
        domain: [0.01, 0.99],
        func: (x) => Math.log(x / (1 - x)),
        label: 'ln(μ/(1-μ))'
      }
    ]
  },
  log: {
    name: 'Log (for Poisson)',
    initialDomain: '(0, ∞)',
    steps: [
      {
        title: 'Step 1: Original Domain',
        description: 'μ ∈ (0, ∞) - bounded on one side',
        domain: [0.1, 10],
        func: (x) => x,
        label: 'μ'
      },
      {
        title: 'Step 2: Apply Logarithm',
        description: 'ln(μ) maps (0,∞) → (-∞,∞)',
        domain: [0.1, 10],
        func: (x) => Math.log(x),
        label: 'ln(μ)'
      }
    ]
  },
  identity: {
    name: 'Identity (for Normal)',
    initialDomain: '(-∞, ∞)',
    steps: [
      {
        title: 'Step 1: Original Domain',
        description: 'μ ∈ (-∞, ∞) - already unbounded',
        domain: [-5, 5],
        func: (x) => x,
        label: 'μ'
      },
      {
        title: 'Step 2: Identity Function',
        description: 'g(μ) = μ, no transformation needed',
        domain: [-5, 5],
        func: (x) => x,
        label: 'μ'
      }
    ]
  }
};

export const DomainTransformationPlot = React.memo(({ width = 600, height = 250 }: DomainTransformationPlotProps) => {
  const svgRefs = [useRef<SVGSVGElement>(null), useRef<SVGSVGElement>(null), useRef<SVGSVGElement>(null)];
  const [error, setError] = useState<GLMError | null>(null);
  const [selectedExample, setSelectedExample] = useState<TransformationExample>('logit');
  const [muValue, setMuValue] = useState<number>(0.5);

  const example = TRANSFORMATION_EXAMPLES[selectedExample];
  const numSteps = example.steps.length;

  useEffect(() => {
    const firstStep = example.steps[0];
    const midPoint = (firstStep.domain[0] + firstStep.domain[1]) / 2;
    setMuValue(midPoint);
  }, [selectedExample, example.steps]);

  const createPlot = useCallback((stepIndex: number) => {
    const svgRef = svgRefs[stepIndex];
    if (!svgRef.current || stepIndex >= numSteps) return;

    try {
      setError(null);
      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove();

      const step = example.steps[stepIndex];
      const margin = { top: 20, right: 20, bottom: 40, left: 60 };

      const [min, max] = step.domain;
      const plotData: { x: number; y: number }[] = [];
      const numPoints = 200;
      const stepSize = (max - min) / numPoints;
      
      for (let x = min; x <= max; x += stepSize) {
        const y = step.func(x);
        if (!isNaN(y) && isFinite(y)) {
          plotData.push({ x, y });
        }
      }

      if (plotData.length === 0) return;

      const xScale = d3.scaleLinear()
        .domain(step.domain)
        .range([margin.left, width - margin.right]);

      const yValues = plotData.map(d => d.y);
      const yExtent = [Math.min(...yValues), Math.max(...yValues)];
      const yPadding = (yExtent[1] - yExtent[0]) * 0.1 || 1;

      const yScale = d3.scaleLinear()
        .domain([yExtent[0] - yPadding, yExtent[1] + yPadding])
        .range([height - margin.bottom, margin.top]);

      const line = d3.line<{ x: number; y: number }>()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y));

      svg.append('path')
        .datum(plotData)
        .attr('fill', 'none')
        .attr('stroke', '#6366f1')
        .attr('stroke-width', 2.5)
        .attr('d', line);

      const yValue = step.func(muValue);
      if (!isNaN(yValue) && isFinite(yValue) && muValue >= min && muValue <= max) {
        svg.append('line')
          .attr('x1', xScale(muValue))
          .attr('y1', yScale(Math.min(...yValues)))
          .attr('x2', xScale(muValue))
          .attr('y2', yScale(yValue))
          .attr('stroke', '#ef4444')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '3,3')
          .attr('opacity', 0.6);

        svg.append('line')
          .attr('x1', margin.left)
          .attr('y1', yScale(yValue))
          .attr('x2', xScale(muValue))
          .attr('y2', yScale(yValue))
          .attr('stroke', '#10b981')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '3,3')
          .attr('opacity', 0.6);

        svg.append('circle')
          .attr('cx', xScale(muValue))
          .attr('cy', yScale(yValue))
          .attr('r', 4)
          .attr('fill', '#f59e0b')
          .attr('stroke', '#fff')
          .attr('stroke-width', 1.5);
      }

      const xAxis = d3.axisBottom(xScale).ticks(5);
      const yAxis = d3.axisLeft(yScale).ticks(5);

      svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(xAxis)
        .style('font-size', '10px');

      svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(yAxis)
        .style('font-size', '10px');

      svg.append('text')
        .attr('transform', `translate(${width / 2}, ${height - 5})`)
        .style('text-anchor', 'middle')
        .style('font-size', '11px')
        .text('Input');

      svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 15)
        .attr('x', 0 - height / 2)
        .style('text-anchor', 'middle')
        .style('font-size', '11px')
        .text(step.label);

      if (yExtent[0] <= 0 && yExtent[1] >= 0) {
        svg.append('line')
          .attr('x1', xScale(min))
          .attr('y1', yScale(0))
          .attr('x2', xScale(max))
          .attr('y2', yScale(0))
          .attr('stroke', '#9ca3af')
          .attr('stroke-width', 1)
          .attr('opacity', 0.3);
      }

    } catch (err) {
      setError({
        code: 'ESTIMATION_FAILED',
        message: 'Failed to create domain transformation plot',
        details: err
      });
    }
  }, [example.steps, muValue, width, height, numSteps, svgRefs]);

  useEffect(() => {
    for (let i = 0; i < numSteps; i++) {
      createPlot(i);
    }
  }, [createPlot, numSteps]);

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

  const outputValues = useMemo(() => {
    return example.steps.map(step => {
      const val = step.func(muValue);
      return !isNaN(val) && isFinite(val) ? val.toFixed(3) : 'undefined';
    });
  }, [example.steps, muValue]);

  return (
    <div className="w-full border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Transformation Example
        </label>
        <select
          value={selectedExample}
          onChange={(e) => setSelectedExample(e.target.value as TransformationExample)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          {Object.entries(TRANSFORMATION_EXAMPLES).map(([key, info]) => (
            <option key={key} value={key}>
              {info.name} - Initial Domain: {info.initialDomain}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          μ value: {muValue.toFixed(3)}
        </label>
        <input
          type="range"
          min={example.steps[0].domain[0]}
          max={example.steps[0].domain[1]}
          step={(example.steps[0].domain[1] - example.steps[0].domain[0]) / 200}
          value={muValue}
          onChange={(e) => setMuValue(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
        />
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-${numSteps} gap-4`}>
        {example.steps.map((step, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h4 className="text-sm font-semibold text-gray-800 mb-1">{step.title}</h4>
            <p className="text-xs text-gray-600 mb-3">{step.description}</p>
            
            <svg
              ref={svgRefs[idx]}
              width={width / numSteps - 20}
              height={height}
              role="img"
              aria-label={step.title}
            />
            
            <div className="mt-3 p-2 bg-white rounded text-center">
              <p className="text-xs text-gray-600 mb-1">Output:</p>
              <p className="text-sm font-mono font-semibold text-indigo-600">
                {outputValues[idx]}
              </p>
            </div>
          </div>
        ))}
      </div>

      {numSteps > 1 && (
        <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
          <span className="font-mono">{example.initialDomain}</span>
          {example.steps.slice(1).map((_, idx) => (
            <React.Fragment key={idx}>
              <svg className="w-8 h-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <span className="font-mono">
                {idx === example.steps.length - 2 ? '(-∞, ∞)' : '...'}
              </span>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
});

