import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface ExponentialFamilyPlotProps {
  width?: number;
  height?: number;
}

type DistributionExample = 'normal' | 'poisson' | 'binomial' | 'gamma';

interface ExponentialFamilyInfo {
  name: string;
  originalForm: string;
  exponentialForm: string;
  naturalParam: string;
  naturalParamDescription: string;
  bFunction: string;
  aFunction: string;
  cFunction: string;
  meanRelation: string;
  linkFunction: string;
  derivation: string[];
}

const EXPONENTIAL_FAMILY_EXAMPLES: Record<DistributionExample, ExponentialFamilyInfo> = {
  poisson: {
    name: 'Poisson',
    originalForm: String.raw`f(y | \lambda) = \frac{\lambda^y e^{-\lambda}}{y!}`,
    exponentialForm: String.raw`f(y | \lambda) = \exp\left(y\ln(\lambda) - \lambda - \ln(y!)\right)`,
    naturalParam: String.raw`\theta = \ln(\lambda)`,
    naturalParamDescription: 'The coefficient of y in the exponent',
    bFunction: String.raw`b(\theta) = e^\theta = \lambda`,
    aFunction: String.raw`a(\phi) = 1`,
    cFunction: String.raw`c(y, \phi) = -\ln(y!)`,
    meanRelation: String.raw`\mu = E[Y] = b'(\theta) = e^\theta = \lambda`,
    linkFunction: String.raw`g(\mu) = \ln(\mu)`,
    derivation: [
      String.raw`\text{1. Start with PMF: } f(y | \lambda) = \frac{\lambda^y e^{-\lambda}}{y!}`,
      String.raw`\text{2. Take logarithm: } \ln f(y | \lambda) = y\ln(\lambda) - \lambda - \ln(y!)`,
      String.raw`\text{3. Identify natural parameter: } \theta = \ln(\lambda) \text{ (coefficient of } y\text{)}`,
      String.raw`\text{4. Express in exponential form: } f(y | \lambda) = \exp(y\theta - e^\theta - \ln(y!))`,
      String.raw`\text{5. Canonical link: } g(\mu) = \theta = \ln(\mu)`
    ]
  },
  normal: {
    name: 'Normal',
    originalForm: String.raw`f(y | \mu, \sigma^2) = \frac{1}{\sqrt{2\pi\sigma^2}} \exp\left(-\frac{(y-\mu)^2}{2\sigma^2}\right)`,
    exponentialForm: String.raw`f(y | \mu, \sigma^2) = \exp\left(\frac{y\mu - \frac{\mu^2}{2}}{\sigma^2} - \frac{y^2}{2\sigma^2} - \frac{1}{2}\ln(2\pi\sigma^2)\right)`,
    naturalParam: String.raw`\theta = \mu`,
    naturalParamDescription: 'The mean is the natural parameter',
    bFunction: String.raw`b(\theta) = \frac{\theta^2}{2}`,
    aFunction: String.raw`a(\phi) = \sigma^2`,
    cFunction: String.raw`c(y, \phi) = -\frac{y^2}{2\sigma^2} - \frac{1}{2}\ln(2\pi\sigma^2)`,
    meanRelation: String.raw`\mu = E[Y] = b'(\theta) = \theta`,
    linkFunction: String.raw`g(\mu) = \mu`,
    derivation: [
      String.raw`\text{1. Start with PDF: } f(y | \mu, \sigma^2) = \frac{1}{\sqrt{2\pi\sigma^2}} \exp\left(-\frac{(y-\mu)^2}{2\sigma^2}\right)`,
      String.raw`\text{2. Expand: } -\frac{(y-\mu)^2}{2\sigma^2} = -\frac{y^2 - 2y\mu + \mu^2}{2\sigma^2} = \frac{y\mu - \frac{\mu^2}{2}}{\sigma^2} - \frac{y^2}{2\sigma^2}`,
      String.raw`\text{3. Identify natural parameter: } \theta = \mu \text{ (coefficient of } y\text{)}`,
      String.raw`\text{4. Note: } b(\theta) = \frac{\theta^2}{2}, \quad a(\phi) = \sigma^2`,
      String.raw`\text{5. Canonical link: } g(\mu) = \theta = \mu`
    ]
  },
  binomial: {
    name: 'Binomial',
    originalForm: String.raw`f(y | n, p) = \binom{n}{y} p^y (1-p)^{n-y}`,
    exponentialForm: String.raw`f(y | n, p) = \exp\left(y\ln\left(\frac{p}{1-p}\right) + n\ln(1-p) + \ln\binom{n}{y}\right)`,
    naturalParam: String.raw`\theta = \ln\left(\frac{p}{1-p}\right)`,
    naturalParamDescription: 'The log-odds (logit) of success probability',
    bFunction: String.raw`b(\theta) = n\ln(1 + e^\theta)`,
    aFunction: String.raw`a(\phi) = 1`,
    cFunction: String.raw`c(y, \phi) = \ln\binom{n}{y}`,
    meanRelation: String.raw`\mu = E[Y] = b'(\theta) = \frac{ne^\theta}{1+e^\theta} = np`,
    linkFunction: String.raw`g(\mu) = \ln\left(\frac{\mu/n}{1-\mu/n}\right)`,
    derivation: [
      String.raw`\text{1. Start with PMF: } f(y | n, p) = \binom{n}{y} p^y (1-p)^{n-y}`,
      String.raw`\text{2. Take logarithm: } \ln f = y\ln(p) + (n-y)\ln(1-p) + \ln\binom{n}{y}`,
      String.raw`\text{3. Rearrange: } = y\ln\left(\frac{p}{1-p}\right) + n\ln(1-p) + \ln\binom{n}{y}`,
      String.raw`\text{4. Identify natural parameter: } \theta = \ln\left(\frac{p}{1-p}\right) \text{ (log-odds)}`,
      String.raw`\text{5. Canonical link (for proportion): } g(\mu) = \ln\left(\frac{\mu}{1-\mu}\right)`
    ]
  },
  gamma: {
    name: 'Gamma',
    originalForm: String.raw`f(y | \alpha, \beta) = \frac{\beta^\alpha}{\Gamma(\alpha)} y^{\alpha-1} e^{-\beta y}`,
    exponentialForm: String.raw`f(y | \alpha, \beta) = \exp\left(\frac{-y/\mu - \ln(\mu)}{\phi} + \frac{\ln(y)}{\phi} - \frac{1}{\phi}\ln(\phi) - \ln\Gamma(1/\phi)\right)`,
    naturalParam: String.raw`\theta = -\frac{1}{\mu}`,
    naturalParamDescription: 'Negative reciprocal of the mean',
    bFunction: String.raw`b(\theta) = -\ln(-\theta)`,
    aFunction: String.raw`a(\phi) = \phi`,
    cFunction: String.raw`c(y, \phi) = \frac{\ln(y)}{\phi} - \frac{1}{\phi}\ln(\phi) - \ln\Gamma(1/\phi)`,
    meanRelation: String.raw`\mu = E[Y] = b'(\theta) = -\frac{1}{\theta}`,
    linkFunction: String.raw`g(\mu) = \frac{1}{\mu}`,
    derivation: [
      String.raw`\text{1. Start with PDF: } f(y | \alpha, \beta) = \frac{\beta^\alpha}{\Gamma(\alpha)} y^{\alpha-1} e^{-\beta y}`,
      String.raw`\text{2. Reparametrize with } \mu = \alpha/\beta \text{ and } \phi = 1/\alpha`,
      String.raw`\text{3. Take logarithm and identify: } \theta = -1/\mu`,
      String.raw`\text{4. Note: } b(\theta) = -\ln(-\theta)`,
      String.raw`\text{5. Canonical link: } g(\mu) = -1/\mu`
    ]
  }
};

export const ExponentialFamilyPlot = React.memo((_props: ExponentialFamilyPlotProps) => {
  const [selectedDist, setSelectedDist] = useState<DistributionExample>('poisson');
  const [showDerivation, setShowDerivation] = useState<boolean>(false);

  const info = EXPONENTIAL_FAMILY_EXAMPLES[selectedDist];

  return (
    <div className="w-full border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Distribution
        </label>
        <select
          value={selectedDist}
          onChange={(e) => setSelectedDist(e.target.value as DistributionExample)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
        >
          {Object.entries(EXPONENTIAL_FAMILY_EXAMPLES).map(([key, value]) => (
            <option key={key} value={key}>
              {value.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="text-sm font-semibold text-gray-800 mb-2">Original Form</h4>
        <div className="text-center">
          <BlockMath math={info.originalForm} />
        </div>
      </div>

      <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <h4 className="text-sm font-semibold text-gray-800 mb-2">Exponential Family Form</h4>
        <div className="text-center mb-3">
          <BlockMath math={info.exponentialForm} />
        </div>
        <div className="text-center text-sm text-gray-600">
          <BlockMath math={String.raw`f(y | \theta, \phi) = \exp\left(\frac{y\theta - b(\theta)}{a(\phi)} + c(y, \phi)\right)`} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
            <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            Natural Parameter (θ)
          </h4>
          <div className="text-center mb-2">
            <BlockMath math={info.naturalParam} />
          </div>
          <p className="text-xs text-gray-600 text-center">{info.naturalParamDescription}</p>
        </div>

        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">b(θ) Function</h4>
          <div className="text-center">
            <BlockMath math={info.bFunction} />
          </div>
        </div>

        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">a(φ) Dispersion</h4>
          <div className="text-center">
            <BlockMath math={info.aFunction} />
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">c(y,φ) Normalization</h4>
          <div className="text-center">
            <BlockMath math={info.cFunction} />
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
        <h4 className="text-sm font-semibold text-gray-800 mb-2">Mean-Parameter Relationship</h4>
        <div className="text-center">
          <BlockMath math={info.meanRelation} />
        </div>
        <p className="text-xs text-gray-600 text-center mt-2">
          The mean is the derivative of b(θ) with respect to θ
        </p>
      </div>

      <div className="mb-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
        <h4 className="text-sm font-semibold text-gray-800 mb-2">Canonical Link Function</h4>
        <div className="text-center">
          <BlockMath math={info.linkFunction} />
        </div>
        <p className="text-xs text-gray-600 text-center mt-2">
          This link function sets η = θ (linear predictor equals natural parameter)
        </p>
      </div>

      <div className="mb-4">
        <button
          onClick={() => setShowDerivation(!showDerivation)}
          className="flex items-center justify-between w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <span className="text-sm font-medium text-gray-800">
            {showDerivation ? 'Hide' : 'Show'} Step-by-Step Derivation
          </span>
          <svg 
            className={`w-5 h-5 transform transition-transform ${showDerivation ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {showDerivation && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
          <h4 className="text-sm font-semibold text-gray-800 mb-3">Derivation Steps</h4>
          <div className="space-y-3">
            {info.derivation.map((step, idx) => (
              <div key={idx} className="p-3 bg-white rounded border border-gray-200">
                <BlockMath math={step} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-100 rounded-lg border-l-4 border-blue-500">
        <p className="text-sm text-gray-800">
          <strong>Key Insight:</strong> The canonical link function <InlineMath math="g(\mu)" /> directly maps 
          the mean <InlineMath math="\mu" /> to the natural parameter <InlineMath math="\theta" />. This creates 
          mathematical elegance in GLM estimation and connects the systematic component to the distribution's 
          intrinsic structure.
        </p>
      </div>
    </div>
  );
});

