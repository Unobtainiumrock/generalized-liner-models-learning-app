import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useAppStore } from '../../store/appStore';
import { useGLM } from '../../hooks/useGLM';

export const LinearSpacePlot = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { truthParams, estimatedParams, mode } = useAppStore();
  const { calculateLinearPredictor } = useGLM();

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };

    const xScale = d3.scaleLinear()
      .domain([-5, 5])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([-10, 10])
      .range([height - margin.bottom, margin.top]);

    // Create line generator
    const line = d3.line<number>()
      .x((_, i) => xScale(-5 + (i * 10 / 100)))
      .y((d) => yScale(d));

    // Generate data points for the lines
    const xValues = d3.range(-5, 5.1, 0.1);
    
    // Truth line (orange)
    const truthYValues = xValues.map(x => calculateLinearPredictor(x, truthParams));
    svg.append('path')
      .datum(truthYValues)
      .attr('fill', 'none')
      .attr('stroke', '#f97316')
      .attr('stroke-width', 3)
      .attr('d', line);

    // Estimated line (blue) - only show in estimation mode
    if (mode === 'estimation') {
      const estimatedYValues = xValues.map(x => calculateLinearPredictor(x, estimatedParams));
      svg.append('path')
        .datum(estimatedYValues)
        .attr('fill', 'none')
        .attr('stroke', '#3b82f6')
        .attr('stroke-width', 3)
        .attr('stroke-dasharray', '5,5');
    }

    // Add axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

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
      .text('X');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 15)
      .attr('x', 0 - height / 2)
      .style('text-anchor', 'middle')
      .text('η = β₀ + β₁X');

  }, [truthParams, estimatedParams, mode, calculateLinearPredictor]);

  return (
    <div className="w-full">
      <svg ref={svgRef} width={600} height={300}></svg>
    </div>
  );
};
