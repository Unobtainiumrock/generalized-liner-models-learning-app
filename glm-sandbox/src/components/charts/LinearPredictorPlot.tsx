import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { GLMError } from '@/types';

interface LinearPredictorPlotProps {
  width?: number;
  height?: number;
}

export const LinearPredictorPlot = React.memo(({ width = 600, height = 300 }: LinearPredictorPlotProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [error, setError] = useState<GLMError | null>(null);
  
  const [beta0, setBeta0] = useState<number>(0);
  const [beta1, setBeta1] = useState<number>(1);
  const [beta2, setBeta2] = useState<number>(0);
  
  const [x1Value, setX1Value] = useState<number>(2);
  const [x2Value, setX2Value] = useState<number>(1);

  const plotData = useMemo(() => {
    const data: { x: number; y: number }[] = [];
    for (let x = -5; x <= 5; x += 0.1) {
      const eta = beta0 + beta1 * x + beta2 * x2Value;
      data.push({ x, y: eta });
    }
    return data;
  }, [beta0, beta1, beta2, x2Value]);

  const componentBreakdown = useMemo(() => {
    return {
      intercept: beta0,
      x1Contribution: beta1 * x1Value,
      x2Contribution: beta2 * x2Value,
      total: beta0 + beta1 * x1Value + beta2 * x2Value
    };
  }, [beta0, beta1, beta2, x1Value, x2Value]);

  const createPlot = useCallback(() => {
    if (!svgRef.current) return;

    try {
      setError(null);
      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove();

      const margin = { top: 20, right: 20, bottom: 40, left: 60 };

      const xScale = d3.scaleLinear()
        .domain([-5, 5])
        .range([margin.left, width - margin.right]);

      const allYValues = plotData.map(d => d.y);
      const yMin = Math.min(...allYValues, componentBreakdown.total) - 2;
      const yMax = Math.max(...allYValues, componentBreakdown.total) + 2;

      const yScale = d3.scaleLinear()
        .domain([yMin, yMax])
        .range([height - margin.bottom, margin.top]);

      const line = d3.line<{ x: number; y: number }>()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y));

      svg.append('path')
        .datum(plotData)
        .attr('fill', 'none')
        .attr('stroke', '#3b82f6')
        .attr('stroke-width', 3)
        .attr('d', line);

      svg.append('circle')
        .attr('cx', xScale(x1Value))
        .attr('cy', yScale(componentBreakdown.total))
        .attr('r', 6)
        .attr('fill', '#ef4444')
        .attr('stroke', '#fff')
        .attr('stroke-width', 2);

      svg.append('line')
        .attr('x1', xScale(x1Value))
        .attr('y1', yScale(0))
        .attr('x2', xScale(x1Value))
        .attr('y2', yScale(componentBreakdown.total))
        .attr('stroke', '#ef4444')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4,4')
        .attr('opacity', 0.6);

      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(xAxis);

      svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(yAxis);

      if (yMin <= 0 && yMax >= 0) {
        svg.append('line')
          .attr('x1', xScale(-5))
          .attr('y1', yScale(0))
          .attr('x2', xScale(5))
          .attr('y2', yScale(0))
          .attr('stroke', '#9ca3af')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '2,2')
          .attr('opacity', 0.5);
      }

      svg.append('text')
        .attr('transform', `translate(${width / 2}, ${height - 5})`)
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .text('x₁ (Predictor 1)');

      svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 15)
        .attr('x', 0 - height / 2)
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .text('η (Linear Predictor)');

    } catch (err) {
      setError({
        code: 'ESTIMATION_FAILED',
        message: 'Failed to create linear predictor plot',
        details: err
      });
    }
  }, [plotData, componentBreakdown, x1Value, width, height]);

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-gray-800 mb-3">Coefficients (β)</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              β₀ (Intercept): {beta0.toFixed(2)}
            </label>
            <input
              type="range"
              min={-5}
              max={5}
              step={0.1}
              value={beta0}
              onChange={(e) => setBeta0(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              β₁ (Slope for x₁): {beta1.toFixed(2)}
            </label>
            <input
              type="range"
              min={-3}
              max={3}
              step={0.1}
              value={beta1}
              onChange={(e) => setBeta1(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              β₂ (Slope for x₂): {beta2.toFixed(2)}
            </label>
            <input
              type="range"
              min={-3}
              max={3}
              step={0.1}
              value={beta2}
              onChange={(e) => setBeta2(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <hr className="my-4" />

          <h3 className="text-md font-semibold text-gray-800 mb-3">Predictor Values</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              x₁: {x1Value.toFixed(2)}
            </label>
            <input
              type="range"
              min={-5}
              max={5}
              step={0.1}
              value={x1Value}
              onChange={(e) => setX1Value(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              x₂ (fixed): {x2Value.toFixed(2)}
            </label>
            <input
              type="range"
              min={-5}
              max={5}
              step={0.1}
              value={x2Value}
              onChange={(e) => setX2Value(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">At Current Point:</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">β₀ (Intercept):</span>
                <span className="font-mono">{componentBreakdown.intercept.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">β₁ × x₁:</span>
                <span className="font-mono">{componentBreakdown.x1Contribution.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">β₂ × x₂:</span>
                <span className="font-mono">{componentBreakdown.x2Contribution.toFixed(2)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold">
                <span className="text-gray-800">η (Total):</span>
                <span className="font-mono text-blue-600">{componentBreakdown.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-3">Linear Predictor Function</h3>
          <p className="text-sm text-gray-600 mb-3">
            η = β₀ + β₁x₁ + β₂x₂
          </p>
          <svg
            ref={svgRef}
            width={width}
            height={height}
            role="img"
            aria-label="Linear predictor visualization"
          />
          <p className="text-xs text-gray-500 mt-2 text-center">
            Red dot shows η at current x₁ value (x₂ is fixed)
          </p>
        </div>
      </div>
    </div>
  );
});

