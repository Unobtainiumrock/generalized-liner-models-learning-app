import { LinearSpacePlot } from './LinearSpacePlot';
import { ResponseSpacePlot } from './ResponseSpacePlot';

export const TwoSpacesVisualization = () => {
  return (
    <div className="space-y-6">
      {/* Linear Predictor Space */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Linear Predictor Space (η)</h2>
        <LinearSpacePlot />
      </div>

      {/* Response Space */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Response Space (μ)</h2>
        <ResponseSpacePlot />
      </div>
    </div>
  );
};
