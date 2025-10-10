import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { useAppStore } from '../../store/appStore';
import { useGLM } from '../../hooks/useGLM';
import { GLMError } from '../../types';

interface ResponseSpacePlotProps {
  width?: number;
  height?: number;
}

export const ResponseSpacePlot = React.memo(({ width = 600, height = 300 }: ResponseSpacePlotProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [error, setError] = useState<GLMError | null>(null);
  const { truthParams, estimatedParams, dataPoints, mode } = useAppStore();
  const { calculateMeanResponse } = useGLM();

  // Memoize expensive calculations
  const xValues = useMemo(() => d3.range(-5, 5.1, 0.1), []);
  const truthYValues = useMemo(() => 
    xValues.map(x => calculateMeanResponse(x, truthParams)), 
    [xValues, calculateMeanResponse, truthParams]
  );
  const estimatedYValues = useMemo(() => 
    mode === 'estimation' ? xValues.map(x => calculateMeanResponse(x, estimatedParams)) : [],
    [xValues, calculateMeanResponse, estimatedParams, mode]
  );

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

      const yScale = d3.scaleLinear()
        .domain([-5, 15])
        .range([height - margin.bottom, margin.top]);

      // Create line generator
      const line = d3.line<number>()
        .x((_, i) => xScale(-5 + (i * 10 / 100)))
        .y((d) => yScale(d));
      
      // Truth curve (orange)
      svg.append('path')
        .datum(truthYValues)
        .attr('fill', 'none')
        .attr('stroke', '#f97316')
        .attr('stroke-width', 3)
        .attr('d', line)
        .attr('aria-label', 'Truth model curve');

      // Estimated curve (blue) - only show in estimation mode
      if (mode === 'estimation' && estimatedYValues.length > 0) {
        console.log('Drawing estimated curve with', estimatedYValues.length, 'points');
        svg.append('path')
          .datum(estimatedYValues)
          .attr('fill', 'none')
          .attr('stroke', '#3b82f6')
          .attr('stroke-width', 3)
          .attr('stroke-dasharray', '5,5')
          .attr('aria-label', 'Estimated model curve');
      } else {
        console.log('Not drawing estimated curve. Mode:', mode, 'Values length:', estimatedYValues.length);
      }

      // Add data points
      if (dataPoints.length > 0) {
        svg.selectAll('.data-point')
          .data(dataPoints)
          .enter()
          .append('circle')
          .attr('class', 'data-point')
          .attr('cx', d => xScale(d.x))
          .attr('cy', d => yScale(d.y))
          .attr('r', 3)
          .attr('fill', '#6b7280')
          .attr('opacity', 0.6)
          .attr('aria-label', 'Data point');
      }

      // Add axes
      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(xAxis)
        .attr('aria-label', 'X-axis');

      svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(yAxis)
        .attr('aria-label', 'Y-axis');

      // Add axis labels
      svg.append('text')
        .attr('transform', `translate(${width / 2}, ${height - 5})`)
        .style('text-anchor', 'middle')
        .text('X')
        .attr('aria-label', 'X-axis label');

      svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 15)
        .attr('x', 0 - height / 2)
        .style('text-anchor', 'middle')
        .text('Y')
        .attr('aria-label', 'Y-axis label');

    } catch (err) {
      setError({
        code: 'ESTIMATION_FAILED',
        message: 'Failed to create response space plot',
        details: err
      });
    }
  }, [truthYValues, estimatedYValues, dataPoints, mode, width, height]);

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
    <div className="w-full">
      <svg 
        ref={svgRef} 
        width={width} 
        height={height}
        role="img"
        aria-label="Response space plot showing truth and estimated models with data points"
      ></svg>
    </div>
  );
});
