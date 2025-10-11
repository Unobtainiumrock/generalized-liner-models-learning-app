import React, { useState, useMemo } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface MatrixVisualizationProps {
  width?: number;
  height?: number;
}

export const MatrixVisualization = React.memo((_props: MatrixVisualizationProps) => {
  const [n, setN] = useState<number>(4);
  const [p, setP] = useState<number>(2);
  const [highlightRow, setHighlightRow] = useState<number | null>(null);
  const [showMultiplication, setShowMultiplication] = useState<boolean>(false);

  const X = useMemo(() => {
    const matrix: number[][] = [];
    for (let i = 0; i < n; i++) {
      const row = [1];
      for (let j = 0; j < p; j++) {
        row.push(Math.round((Math.random() * 4 - 2) * 10) / 10);
      }
      matrix.push(row);
    }
    return matrix;
  }, [n, p]);

  const beta = useMemo(() => {
    return [...Array(p + 1)].map(() => Math.round(Math.random() * 4 - 2));
  }, [p]);

  const multiplyMatrixVector = (matrix: number[][], vector: number[]): number[] => {
    return matrix.map(row =>
      row.reduce((sum, val, idx) => sum + val * vector[idx], 0)
    );
  };

  const eta = multiplyMatrixVector(X, beta);

  return (
    <div className="w-full border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Matrix Formulation of GLMs</h3>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of observations (n): {n}
            </label>
            <input
              type="range"
              min={2}
              max={6}
              value={n}
              onChange={(e) => setN(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of predictors (p): {p}
            </label>
            <input
              type="range"
              min={1}
              max={3}
              value={p}
              onChange={(e) => setP(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        </div>
        
        <button
          onClick={() => setShowMultiplication(!showMultiplication)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          {showMultiplication ? 'Hide' : 'Show'} Multiplication Details
        </button>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="text-sm font-semibold text-gray-800 mb-3">From Scalar to Matrix Form</h4>
        <div className="space-y-2">
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Single Observation (Scalar):</p>
            <BlockMath math="\eta = \beta_0 + \beta_1 x_1 + \cdots + \beta_p x_p = \mathbf{x}^T\boldsymbol{\beta}" />
          </div>
          <div className="text-center text-gray-500">↓</div>
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Multiple Observations (Matrix):</p>
            <BlockMath math="\boldsymbol{\eta} = \mathbf{X}\boldsymbol{\beta}" />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-800 mb-3">
          Design Matrix <InlineMath math="\mathbf{X}" /> (<InlineMath math={`${n} \\times ${p + 1}`} />)
        </h4>
        
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-1 border border-gray-300 text-xs">Row</th>
                <th className="px-2 py-1 border border-gray-300 text-xs bg-yellow-100">β₀ (1)</th>
                {[...Array(p)].map((_, j) => (
                  <th key={j} className="px-2 py-1 border border-gray-300 text-xs bg-blue-100">
                    x_{j + 1}
                  </th>
                ))}
                {showMultiplication && (
                  <>
                    <th className="px-2 py-1 border-l-4 border-indigo-500 text-xs"></th>
                    {[...Array(p + 1)].map((_, j) => (
                      <th key={j} className="px-2 py-1 border border-gray-300 text-xs bg-green-100">
                        β_{j}
                      </th>
                    ))}
                    <th className="px-2 py-1 text-xs">=</th>
                    <th className="px-2 py-1 border border-gray-300 text-xs bg-purple-100">η</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {X.slice(0, n).map((row, i) => (
                <tr
                  key={i}
                  onMouseEnter={() => setHighlightRow(i)}
                  onMouseLeave={() => setHighlightRow(null)}
                  className={`${highlightRow === i ? 'bg-indigo-100' : 'hover:bg-gray-50'} transition-colors cursor-pointer`}
                >
                  <td className={`px-2 py-1 border border-gray-300 text-xs text-center font-semibold ${
                    highlightRow === i ? 'bg-indigo-100' : ''
                  }`}>{i + 1}</td>
                  {row.slice(0, p + 1).map((val, j) => (
                    <td
                      key={j}
                      className={`px-2 py-1 border border-gray-300 text-xs text-center font-mono ${
                        highlightRow === i 
                          ? 'bg-indigo-100' 
                          : j === 0 ? 'bg-yellow-50' : 'bg-blue-50'
                      }`}
                    >
                      {val.toFixed(1)}
                    </td>
                  ))}
                  {showMultiplication && (
                    <>
                      <td className={`px-2 py-1 border-l-4 border-indigo-500 text-xs text-center ${
                        highlightRow === i ? 'bg-indigo-100' : ''
                      }`}>×</td>
                      {i === 0 ? (
                        <>
                          {beta.slice(0, p + 1).map((val, j) => (
                            <td key={j} className={`px-2 py-1 border border-gray-300 text-xs text-center font-mono ${
                              highlightRow === i ? 'bg-indigo-100' : 'bg-green-50'
                            }`}>
                              {val.toFixed(1)}
                            </td>
                          ))}
                        </>
                      ) : (
                        <>
                          {beta.slice(0, p + 1).map((_, j) => (
                            <td key={j} className={`px-2 py-1 border border-gray-300 text-xs text-center text-gray-400 ${
                              highlightRow === i ? 'bg-indigo-100' : ''
                            }`}>
                              ↑
                            </td>
                          ))}
                        </>
                      )}
                      <td className={`px-2 py-1 text-xs text-center ${
                        highlightRow === i ? 'bg-indigo-100' : ''
                      }`}>=</td>
                      <td className={`px-2 py-1 border border-gray-300 text-xs text-center font-mono font-semibold ${
                        highlightRow === i ? 'bg-indigo-100' : 'bg-purple-50'
                      }`}>
                        {eta[i].toFixed(2)}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {highlightRow !== null && (
          <div className="mt-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
            <p className="text-sm text-gray-800">
              <strong>Row {highlightRow + 1}:</strong> η_{highlightRow + 1} ={' '}
              {X[highlightRow].slice(0, p + 1).map((val, idx) => (
                <span key={idx}>
                  {idx > 0 && ' + '}
                  ({val.toFixed(1)})({beta[idx].toFixed(1)})
                </span>
              ))}
              {' = '}
              <strong className="text-purple-600">{eta[highlightRow].toFixed(2)}</strong>
            </p>
          </div>
        )}
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-800 mb-3">Matrix Dimensions</h4>
        <div className="flex items-center justify-center gap-2 text-sm flex-wrap">
          <div className="p-2 bg-white rounded border border-gray-300">
            <InlineMath math="\boldsymbol{\eta}" />
            <span className="text-xs text-gray-600 ml-1">({n} × 1)</span>
          </div>
          <span>=</span>
          <div className="p-2 bg-white rounded border border-gray-300">
            <InlineMath math="\mathbf{X}" />
            <span className="text-xs text-gray-600 ml-1">({n} × {p + 1})</span>
          </div>
          <span>×</span>
          <div className="p-2 bg-white rounded border border-gray-300">
            <InlineMath math="\boldsymbol{\beta}" />
            <span className="text-xs text-gray-600 ml-1">({p + 1} × 1)</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-800 mb-3">Normal Equation (OLS Solution)</h4>
        
        <div className="text-center mb-4">
          <BlockMath math="\hat{\boldsymbol{\beta}} = (\mathbf{X}^T\mathbf{X})^{-1}\mathbf{X}^T\mathbf{y}" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <h5 className="text-xs font-semibold text-gray-800 mb-2 text-center">
              Gram Matrix
            </h5>
            <div className="text-center text-sm">
              <InlineMath math="\mathbf{X}^T\mathbf{X}" />
              <p className="text-xs text-gray-600 mt-1">
                ({p + 1} × {p + 1})
              </p>
            </div>
            <p className="text-xs text-gray-600 mt-2 text-center">
              Contains predictor correlations
            </p>
          </div>

          <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
            <h5 className="text-xs font-semibold text-gray-800 mb-2 text-center">
              Moment Vector
            </h5>
            <div className="text-center text-sm">
              <InlineMath math="\mathbf{X}^T\mathbf{y}" />
              <p className="text-xs text-gray-600 mt-1">
                ({p + 1} × 1)
              </p>
            </div>
            <p className="text-xs text-gray-600 mt-2 text-center">
              Predictor-response products
            </p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h5 className="text-xs font-semibold text-gray-800 mb-2 text-center">
              Solution Vector
            </h5>
            <div className="text-center text-sm">
              <InlineMath math="\hat{\boldsymbol{\beta}}" />
              <p className="text-xs text-gray-600 mt-1">
                ({p + 1} × 1)
              </p>
            </div>
            <p className="text-xs text-gray-600 mt-2 text-center">
              Estimated coefficients
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-blue-100 rounded-lg border-l-4 border-blue-500">
        <p className="text-sm text-gray-800">
          <strong>Key Insight:</strong> The matrix formulation <InlineMath math="\boldsymbol{\eta} = \mathbf{X}\boldsymbol{\beta}" /> 
          allows us to compute linear predictors for all {n} observations simultaneously. The design matrix <InlineMath math="\mathbf{X}" /> 
          organizes predictor values, with the first column of 1s for the intercept <InlineMath math="\beta_0" />.
        </p>
      </div>
    </div>
  );
});

