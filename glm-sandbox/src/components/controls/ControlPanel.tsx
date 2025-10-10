import { useAppStore } from '../../store/appStore';
import { useGLM } from '../../hooks/useGLM';
import { Slider } from './Slider';
import { Dropdown } from './Dropdown';
// import { ValidationMessage } from '../ui/ValidationMessage';

export const ControlPanel = () => {
  const {
    mode,
    truthParams,
    truthConfig,
    estimatedParams,
    dataPoints,
    sampleSize,
    isGeneratingData,
    isAutoFitting,
    setMode,
    setTruthParams,
    setTruthConfig,
    setEstimatedParams,
    setSampleSize,
  } = useAppStore();

  const { generateData, autoFit } = useGLM();

  const handleGenerateData = async () => {
    await generateData();
  };

  const handleAutoFit = () => {
    autoFit();
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Mode Toggle */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Mode</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setMode('truth')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === 'truth'
                ? 'bg-orange-100 text-orange-800 border border-orange-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Truth
          </button>
          <button
            onClick={() => setMode('estimation')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === 'estimation'
                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Estimation
          </button>
        </div>
      </div>

      {/* Truth Mode Controls */}
      {mode === 'truth' && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Truth Parameters</h2>
          
          <div className="space-y-4">
            <Slider
              label="Intercept (β₀)"
              value={truthParams.intercept}
              min={-5}
              max={5}
              step={0.1}
              onChange={(value) => setTruthParams({ intercept: value })}
            />
            
            <Slider
              label="Slope (β₁)"
              value={truthParams.slope}
              min={-3}
              max={3}
              step={0.1}
              onChange={(value) => setTruthParams({ slope: value })}
            />
            
            <Dropdown
              label="Distribution"
              value={truthConfig.distribution}
              options={[
                { value: 'normal', label: 'Normal' },
                { value: 'poisson', label: 'Poisson' },
                { value: 'bernoulli', label: 'Bernoulli' },
                { value: 'gamma', label: 'Gamma' },
                { value: 'negativeBinomial', label: 'Negative Binomial' },
                { value: 'binomial', label: 'Binomial' },
              ]}
              onChange={(value) => setTruthConfig({ distribution: value as any })}
            />
            
            <Dropdown
              label="Link Function"
              value={truthConfig.linkFunction}
              options={[
                { value: 'identity', label: 'Identity' },
                { value: 'log', label: 'Log' },
                { value: 'logit', label: 'Logit' },
                { value: 'inverse', label: 'Inverse' },
                { value: 'probit', label: 'Probit' },
                { value: 'cloglog', label: 'Complementary Log-Log' },
              ]}
              onChange={(value) => setTruthConfig({ linkFunction: value as any })}
            />
          </div>
        </div>
      )}

      {/* Estimation Mode Controls */}
      {mode === 'estimation' && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Estimated Parameters</h2>
          
          <div className="space-y-4">
            <Slider
              label="Intercept (β̂₀)"
              value={estimatedParams.intercept}
              min={-5}
              max={5}
              step={0.1}
              onChange={(value) => setEstimatedParams({ intercept: value })}
            />
            
            <Slider
              label="Slope (β̂₁)"
              value={estimatedParams.slope}
              min={-3}
              max={3}
              step={0.1}
              onChange={(value) => setEstimatedParams({ slope: value })}
            />
            
            <button
              onClick={handleAutoFit}
              disabled={isAutoFitting || dataPoints.length === 0}
              className={`w-full btn-primary ${isAutoFitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isAutoFitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Auto-Fitting...
                </div>
              ) : (
                'Auto-Fit'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Data Generation */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Data Generation</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sample Size
            </label>
            <input
              type="number"
              value={sampleSize}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value)) {
                  setSampleSize(value);
                }
              }}
              min={10}
              max={10000}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {/* Validation will be handled by the store */}
          </div>
          
          <button
            onClick={handleGenerateData}
            disabled={isGeneratingData}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingData ? 'Generating...' : 'Generate Data'}
          </button>
        </div>
      </div>
    </div>
  );
};
