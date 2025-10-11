import React, { useState } from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface GLMTableInteractiveProps {
  width?: number;
  height?: number;
}

interface GLMCombination {
  distribution: string;
  linkFunction: string;
  formula: string;
  type: 'canonical' | 'alternative';
  domainApproach: string;
  naturalParamApproach: string;
}

const GLM_COMBINATIONS: GLMCombination[] = [
  {
    distribution: 'Normal',
    linkFunction: 'Identity',
    formula: 'g(\\mu) = \\mu',
    type: 'canonical',
    domainApproach: 'μ ∈ (-∞,∞) already unbounded, no transformation needed',
    naturalParamApproach: 'θ = μ, so g(μ) = μ'
  },
  {
    distribution: 'Poisson',
    linkFunction: 'Log',
    formula: 'g(\\mu) = \\ln(\\mu)',
    type: 'canonical',
    domainApproach: 'μ ∈ (0,∞), ln(μ) maps to (-∞,∞)',
    naturalParamApproach: 'θ = ln(λ) = ln(μ), so g(μ) = ln(μ)'
  },
  {
    distribution: 'Binomial',
    linkFunction: 'Logit',
    formula: 'g(\\mu) = \\ln\\left(\\frac{\\mu}{1-\\mu}\\right)',
    type: 'canonical',
    domainApproach: 'μ ∈ (0,1), odds ratio then log maps to (-∞,∞)',
    naturalParamApproach: 'θ = ln(p/(1-p)), so g(μ) = ln(μ/(1-μ))'
  },
  {
    distribution: 'Binomial',
    linkFunction: 'Probit',
    formula: 'g(\\mu) = \\Phi^{-1}(\\mu)',
    type: 'alternative',
    domainApproach: 'μ ∈ (0,1), inverse normal CDF maps to (-∞,∞)',
    naturalParamApproach: 'Not θ. Valid but not canonical.'
  },
  {
    distribution: 'Binomial',
    linkFunction: 'Complementary log-log',
    formula: 'g(\\mu) = \\ln(-\\ln(1-\\mu))',
    type: 'alternative',
    domainApproach: 'μ ∈ (0,1), double log transformation to (-∞,∞)',
    naturalParamApproach: 'Not θ. Valid but not canonical.'
  },
  {
    distribution: 'Bernoulli',
    linkFunction: 'Logit',
    formula: 'g(\\mu) = \\ln\\left(\\frac{\\mu}{1-\\mu}\\right)',
    type: 'canonical',
    domainApproach: 'μ ∈ (0,1), same as Binomial',
    naturalParamApproach: 'θ = ln(p/(1-p)), same as Binomial'
  },
  {
    distribution: 'Bernoulli',
    linkFunction: 'Probit',
    formula: 'g(\\mu) = \\Phi^{-1}(\\mu)',
    type: 'alternative',
    domainApproach: 'μ ∈ (0,1), same as Binomial',
    naturalParamApproach: 'Not θ. Valid but not canonical.'
  },
  {
    distribution: 'Gamma',
    linkFunction: 'Inverse',
    formula: 'g(\\mu) = \\frac{1}{\\mu}',
    type: 'canonical',
    domainApproach: 'μ ∈ (0,∞), reciprocal maps to (0,∞) then can extend',
    naturalParamApproach: 'θ = -1/μ, so g(μ) = 1/μ (or -1/μ)'
  },
  {
    distribution: 'Exponential',
    linkFunction: 'Inverse',
    formula: 'g(\\mu) = \\frac{1}{\\mu}',
    type: 'canonical',
    domainApproach: 'μ ∈ (0,∞), same as Gamma (special case)',
    naturalParamApproach: 'θ = -1/μ, same as Gamma'
  },
  {
    distribution: 'Inverse Gaussian',
    linkFunction: 'Inverse-squared',
    formula: 'g(\\mu) = \\frac{1}{\\mu^2}',
    type: 'canonical',
    domainApproach: 'μ ∈ (0,∞), inverse squared maps to (0,∞)',
    naturalParamApproach: 'θ = -1/(2μ²), so g(μ) = 1/μ²'
  },
  {
    distribution: 'Beta',
    linkFunction: 'Logit',
    formula: 'g(\\mu) = \\ln\\left(\\frac{\\mu}{1-\\mu}\\right)',
    type: 'canonical',
    domainApproach: 'μ ∈ (0,1), same as Binomial',
    naturalParamApproach: 'θ = ln(μ/(1-μ))'
  }
];

export const GLMTableInteractive = React.memo((_props: GLMTableInteractiveProps) => {
  const [filterType, setFilterType] = useState<'all' | 'canonical' | 'alternative'>('all');
  const [selectedDist, setSelectedDist] = useState<string | null>(null);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  const filteredCombinations = GLM_COMBINATIONS.filter(combo => {
    const typeMatch = filterType === 'all' || combo.type === filterType;
    const distMatch = !selectedDist || combo.distribution === selectedDist;
    return typeMatch && distMatch;
  });

  const uniqueDistributions = Array.from(new Set(GLM_COMBINATIONS.map(c => c.distribution)));

  return (
    <div className="w-full border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Complete GLM Framework Table</h3>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'canonical' | 'alternative')}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Links</option>
              <option value="canonical">Canonical Only</option>
              <option value="alternative">Alternative Only</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Distribution
            </label>
            <select
              value={selectedDist || 'all'}
              onChange={(e) => setSelectedDist(e.target.value === 'all' ? null : e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Distributions</option>
              {uniqueDistributions.map(dist => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-sm mb-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span className="text-gray-700">Canonical Link</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
            <span className="text-gray-700">Alternative Link</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Distribution (𝒟)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Link Function
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Formula
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCombinations.map((combo, idx) => (
              <tr
                key={idx}
                onClick={() => setSelectedRow(idx)}
                className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                  combo.type === 'canonical' ? 'bg-green-50' : 'bg-blue-50'
                } ${selectedRow === idx ? 'ring-2 ring-indigo-500' : ''}`}
              >
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {combo.distribution}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {combo.linkFunction}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <InlineMath math={combo.formula} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    combo.type === 'canonical'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {combo.type}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Details Panel */}
      {selectedRow !== null && (
        <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
          <h4 className="text-md font-semibold text-gray-900 mb-3">
            {filteredCombinations[selectedRow].distribution} + {filteredCombinations[selectedRow].linkFunction}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-white rounded-lg border border-gray-200">
              <h5 className="text-sm font-semibold text-gray-800 mb-2">
                Domain Transformation Approach
              </h5>
              <p className="text-sm text-gray-700">
                {filteredCombinations[selectedRow].domainApproach}
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg border border-gray-200">
              <h5 className="text-sm font-semibold text-gray-800 mb-2">
                Natural Parameter Approach
              </h5>
              <p className="text-sm text-gray-700">
                {filteredCombinations[selectedRow].naturalParamApproach}
              </p>
            </div>
          </div>

          {filteredCombinations[selectedRow].type === 'canonical' && (
            <div className="mt-3 p-3 bg-green-100 rounded-lg border-l-4 border-green-500">
              <p className="text-sm text-gray-800">
                <strong>✓ Canonical Link:</strong> Both approaches converge! This link function directly maps 
                the mean μ to the natural parameter θ, providing mathematical elegance and computational benefits.
              </p>
            </div>
          )}

          {filteredCombinations[selectedRow].type === 'alternative' && (
            <div className="mt-3 p-3 bg-blue-100 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm text-gray-800">
                <strong>→ Alternative Link:</strong> This link is valid (monotonic and differentiable) but 
                doesn't match the natural parameter. May be useful for specific modeling scenarios.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Summary Statistics */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {filteredCombinations.length}
            </p>
            <p className="text-sm text-gray-600">Total Combinations</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {filteredCombinations.filter(c => c.type === 'canonical').length}
            </p>
            <p className="text-sm text-gray-600">Canonical</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {filteredCombinations.filter(c => c.type === 'alternative').length}
            </p>
            <p className="text-sm text-gray-600">Alternative</p>
          </div>
        </div>
      </div>
    </div>
  );
});

