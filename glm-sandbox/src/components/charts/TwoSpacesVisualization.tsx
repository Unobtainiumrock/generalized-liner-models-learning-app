import React from 'react';
import { LinearSpacePlot } from './LinearSpacePlot';
import { ResponseSpacePlot } from './ResponseSpacePlot';

interface TwoSpacesVisualizationProps {
  width?: number;
  height?: number;
}

export const TwoSpacesVisualization = React.memo(({ width = 600, height = 300 }: TwoSpacesVisualizationProps) => {
  return (
    <div className="space-y-6">
      {/* Linear Predictor Space */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Linear Predictor Space (η)</h2>
        <LinearSpacePlot width={width} height={height} />
      </div>

      {/* Response Space */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Response Space (μ)</h2>
        <ResponseSpacePlot width={width} height={height} />
      </div>
    </div>
  );
});
