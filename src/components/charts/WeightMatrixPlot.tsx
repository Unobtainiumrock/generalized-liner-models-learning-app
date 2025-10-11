import React, { useState, useMemo } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface WeightMatrixPlotProps {
  width?: number;
  height?: number;
}

type DistributionType = 'normal' | 'poisson' | 'binomial' | 'gamma';

interface WeightInfo {
  name: string;
  weightFormula: string;
  varianceFunction: string;
  description: string;
  example: string;
}

const WEIGHT_FORMULAS: Record<DistributionType, WeightInfo> = {
  normal: {
    name: 'Normal',
    weightFormula: 'w_i = 1',
    varianceFunction: 'V(\\mu_i) = 1',
    description: 'Identity matrix - equal weighting for all observations',
    example: 'All observations contribute equally to parameter estimates'
  },
  poisson: {
    name: 'Poisson',
    weightFormula: 'w_i^{(t)} = \\mu_i^{(t)}',
    varianceFunction: 'V(\\mu_i) = \\mu_i',
    description: 'Weights depend on the mean - higher means get more weight',
    example: 'Observations with larger μ have higher variance and get more weight'
  },
  binomial: {
    name: 'Binomial',
    weightFormula: 'w_i^{(t)} = \\mu_i^{(t)}(1-\\mu_i^{(t)})',
    varianceFunction: 'V(\\mu_i) = \\mu_i(1-\\mu_i)',
    description: 'Weights are highest near p=0.5, lower at extremes',
    example: 'Middle-range probabilities contribute more than extreme probabilities'
  },
  gamma: {
    name: 'Gamma',
    weightFormula: 'w_i^{(t)} = (\\mu_i^{(t)})^2',
    varianceFunction: 'V(\\mu_i) = \\mu_i^2',
    description: 'Weights grow quadratically with the mean',
    example: 'Larger observations have much higher variance and get more weight'
  }
};

export const WeightMatrixPlot = React.memo((_props: WeightMatrixPlotProps) => {
  const [selectedDist, setSelectedDist] = useState<DistributionType>('binomial');
  const [n] = useState<number>(5);
  const [showComparison, setShowComparison] = useState<boolean>(false);

  const muValues = useMemo(() => {
    switch (selectedDist) {
      case 'normal':
        return [0.5, 1.2, -0.3, 0.8, 1.5];
      case 'poisson':
        return [2.5, 5.0, 1.2, 8.3, 3.7];
      case 'binomial':
        return [0.2, 0.5, 0.8, 0.3, 0.7];
      case 'gamma':
        return [1.5, 3.2, 2.1, 4.5, 2.8];
    }
  }, [selectedDist]);

  const weights = useMemo(() => {
    switch (selectedDist) {
      case 'normal':
        return muValues.map(() => 1);
      case 'poisson':
        return muValues.map(mu => mu);
      case 'binomial':
        return muValues.map(mu => mu * (1 - mu));
      case 'gamma':
        return muValues.map(mu => mu * mu);
    }
  }, [selectedDist, muValues]);

  const info = WEIGHT_FORMULAS[selectedDist];

  return (
    <div className="w-full border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Weight Matrices & IRLS</h3>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Distribution
        </label>
        <select
          value={selectedDist}
          onChange={(e) => setSelectedDist(e.target.value as DistributionType)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          {Object.entries(WEIGHT_FORMULAS).map(([key, value]) => (
            <option key={key} value={key}>
              {value.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <h4 className="text-sm font-semibold text-gray-800 mb-2">IRLS Update Equation</h4>
        <div className="text-center">
          <BlockMath math="\hat{\boldsymbol{\beta}}^{(t+1)} = (\mathbf{X}^T\mathbf{W}^{(t)}\mathbf{X})^{-1}\mathbf{X}^T\mathbf{W}^{(t)}\mathbf{z}^{(t)}" />
        </div>
        <p className="text-xs text-gray-600 text-center mt-2">
          Iteratively update β using weighted least squares until convergence
        </p>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-2">Weight Formula</h4>
            <div className="text-center">
              <BlockMath math={info.weightFormula} />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-2">Variance Function</h4>
            <div className="text-center">
              <BlockMath math={info.varianceFunction} />
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-blue-200">
          <p className="text-sm text-gray-700 mb-1">
            <strong>Description:</strong> {info.description}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Example:</strong> {info.example}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-800">
            Weight Matrix <InlineMath math="\mathbf{W}^{(t)}" /> (Diagonal)
          </h4>
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium hover:bg-indigo-200 transition-colors"
          >
            {showComparison ? 'Hide' : 'Show'} Normal Comparison
          </button>
        </div>

        <div className="overflow-x-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-600 mb-2 text-center">{info.name} Distribution</p>
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-3 py-2 border border-gray-300 text-xs">i</th>
                    <th className="px-3 py-2 border border-gray-300 text-xs">μᵢ</th>
                    <th className="px-3 py-2 border border-gray-300 text-xs bg-orange-100">wᵢ</th>
                  </tr>
                </thead>
                <tbody>
                  {muValues.slice(0, n).map((mu, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-3 py-2 border border-gray-300 text-xs text-center font-semibold">
                        {i + 1}
                      </td>
                      <td className="px-3 py-2 border border-gray-300 text-xs text-center font-mono">
                        {mu.toFixed(2)}
                      </td>
                      <td className="px-3 py-2 border border-gray-300 text-xs text-center font-mono font-semibold bg-orange-50">
                        {weights[i].toFixed(3)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-2 text-center">Diagonal Matrix Form:</p>
                <div className="flex justify-center">
                  <div className="inline-block">
                    {weights.slice(0, n).map((w, i) => (
                      <div key={i} className="flex items-center gap-1 text-xs font-mono">
                        {[...Array(n)].map((_, j) => (
                          <span
                            key={j}
                            className={`inline-block w-12 text-center py-1 ${
                              i === j ? 'bg-orange-200 font-semibold' : 'text-gray-400'
                            }`}
                          >
                            {i === j ? w.toFixed(2) : '0'}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {showComparison && (
              <div>
                <p className="text-xs text-gray-600 mb-2 text-center">Normal (Reference)</p>
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-3 py-2 border border-gray-300 text-xs">i</th>
                      <th className="px-3 py-2 border border-gray-300 text-xs">μᵢ</th>
                      <th className="px-3 py-2 border border-gray-300 text-xs bg-green-100">wᵢ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {muValues.slice(0, n).map((mu, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-3 py-2 border border-gray-300 text-xs text-center font-semibold">
                          {i + 1}
                        </td>
                        <td className="px-3 py-2 border border-gray-300 text-xs text-center font-mono">
                          {mu.toFixed(2)}
                        </td>
                        <td className="px-3 py-2 border border-gray-300 text-xs text-center font-mono font-semibold bg-green-50">
                          1.000
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-2 text-center">Identity Matrix (<InlineMath math="\mathbf{I}_n" />):</p>
                  <div className="flex justify-center">
                    <div className="inline-block">
                      {[...Array(n)].map((_, i) => (
                        <div key={i} className="flex items-center gap-1 text-xs font-mono">
                          {[...Array(n)].map((_, j) => (
                            <span
                              key={j}
                              className={`inline-block w-12 text-center py-1 ${
                                i === j ? 'bg-green-200 font-semibold' : 'text-gray-400'
                              }`}
                            >
                              {i === j ? '1' : '0'}
                            </span>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-800 mb-3">Weight Statistics</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-gray-900">
              {Math.min(...weights).toFixed(3)}
            </p>
            <p className="text-xs text-gray-600">Min Weight</p>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">
              {(weights.reduce((a, b) => a + b, 0) / weights.length).toFixed(3)}
            </p>
            <p className="text-xs text-gray-600">Mean Weight</p>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">
              {Math.max(...weights).toFixed(3)}
            </p>
            <p className="text-xs text-gray-600">Max Weight</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {selectedDist === 'normal' && (
          <div className="p-4 bg-green-100 rounded-lg border-l-4 border-green-500">
            <p className="text-sm text-gray-800">
              <strong>Normal Distribution:</strong> The weight matrix is simply the identity matrix <InlineMath math="\mathbf{I}_n" />. 
              This is why ordinary least squares (OLS) works directly without iteration - all observations contribute equally!
            </p>
          </div>
        )}

        {selectedDist === 'poisson' && (
          <div className="p-4 bg-orange-100 rounded-lg border-l-4 border-orange-500">
            <p className="text-sm text-gray-800">
              <strong>Poisson Distribution:</strong> Weights equal the mean: <InlineMath math="w_i = \mu_i" />. 
              Observations with larger counts have higher variance and receive more weight in the estimation, 
              compensating for their uncertainty on the transformed scale.
            </p>
          </div>
        )}

        {selectedDist === 'binomial' && (
          <div className="p-4 bg-blue-100 rounded-lg border-l-4 border-blue-500">
            <p className="text-sm text-gray-800">
              <strong>Binomial Distribution:</strong> Weights are <InlineMath math="w_i = \mu_i(1-\mu_i)" />, 
              maximized at p=0.5. Extreme probabilities (near 0 or 1) get less weight because they're more 
              certain, while middle-range probabilities contribute more to parameter estimates.
            </p>
          </div>
        )}

        {selectedDist === 'gamma' && (
          <div className="p-4 bg-purple-100 rounded-lg border-l-4 border-purple-500">
            <p className="text-sm text-gray-800">
              <strong>Gamma Distribution:</strong> Weights grow quadratically: <InlineMath math="w_i = \mu_i^2" />. 
              Larger observations have much higher variance (proportional to μ²) and receive substantially 
              more weight in the iterative estimation process.
            </p>
          </div>
        )}

        <div className="p-4 bg-indigo-100 rounded-lg border-l-4 border-indigo-500">
          <p className="text-sm text-gray-800">
            <strong>IRLS Algorithm:</strong> For non-normal distributions, we iteratively update β using weighted 
            least squares. At each iteration t, we compute weights based on current estimates μᵢ⁽ᵗ⁾, then 
            re-estimate β⁽ᵗ⁺¹⁾. This process continues until convergence (typically 3-10 iterations).
          </p>
        </div>
      </div>
    </div>
  );
});

