import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { DistributionVisualizer } from '../charts/DistributionVisualizer';
import { LinearPredictorPlot } from '../charts/LinearPredictorPlot';
import { LinkFunctionPlot } from '../charts/LinkFunctionPlot';
import { DomainTransformationPlot } from '../charts/DomainTransformationPlot';
import { ExponentialFamilyPlot } from '../charts/ExponentialFamilyPlot';
import { GLMTableInteractive } from '../charts/GLMTableInteractive';
import { MatrixVisualization } from '../charts/MatrixVisualization';
import { WeightMatrixPlot } from '../charts/WeightMatrixPlot';
import { ChatAssistant } from '../ui/ChatAssistant';
import { Blog } from '../blogs/Blog';
import { Paragraph } from '../blogs/Paragraph';
import { useAppStore } from '../../store/appStore';

export const MainLayout = () => {
  const { error, clearError, isLoading } = useAppStore();

  return (
    <div className="flex h-screen">
      {/* Error Banner */}
      {error && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-50 border-b border-red-200 px-4 py-3">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-800 font-medium">{error.message}</span>
            </div>
            <button
              onClick={clearError}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold text-gray-900">GLM Learning Sandbox</h1>
              <p className="text-m text-gray-600">Interactive Generalized Linear Models</p>
            </div>
            {isLoading && (
              <div className="flex items-center text-gray-500">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            )}
          </div>
        </header>

        {/* Main area: Blog above the visualization, centered with spacing and scroll when needed */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <Blog>
              <Paragraph as="h1" className="font-semibold text-3xl text-gray-900 mb-3">
                1. The Motivation: Why We Need GLMs
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                Regular linear regression works great when your data looks like a straight line and follows a normal distribution. 
                But most real-world data doesn't work that way. If you're trying to predict whether someone will buy something, 
                you can't use regular regression because the answer isn't a number, instead it is a category. 
                
                If you're counting website visits, regular regression might give you negative numbers or decimals, which doesn't make sense for counts.
                
                If you're working with percentages, regular regression might give you predictions above 100% or below 0%, which is impossible.
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                Generalized Linear Models (GLMs) solve this problem. They give you predictions that actually make sense for your 
                specific problem instead of forcing everything into the same straight-line model. 
                
                GLMs handle binary outcomes, count data, percentages, and other types of data that regular regression can't handle properly. We'll soon see some examples of this in action.
                For example, counts correspond to the Poisson distribution and binary outcomes correspond to the Bernoulli distribution etc.
              </Paragraph>

              <Paragraph as="h2" className="font-semibold text-2xl text-gray-900 mb-3 mt-6">
                2. Introduction to the Basics
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                Generalized Linear Model(GLM) is a model that is used for the exponential family of distributions.
                But before we actaully get into a GLM, we should first start with a basic model to gain an understanding
                on Linear Regression.<br />
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                In Linear Regression, we first start off with the foundation of Ordinary Least Squares.
                OLS is the most common way to estimate a model,it find the best fit line by minimizing squared
                errors. We can apply this OLS on a Simple Linear Regression model. A SLR is a model that has a relationship
                with one predictor(independent variable) <InlineMath math={`X_i`} />  and one response(dependent variable)
                <InlineMath math={`Y_i`} />. Petty much <InlineMath math={`Y_i`} /> is the outcome and  <InlineMath math={`X_i`} />  affects that outcome.
                This the formula is below:
              </Paragraph>

              <div className="text-2xl text-black">
                <BlockMath
                  math={`Y_i = \\beta_0 + \\beta_1 X_i + \\varepsilon_i,\\quad i = 1,\\ldots,n`} />
              </div>

              <ul className="list-disc pl-6 text-lg text-black leading-relaxed space-y-2">
                <li>
                  <InlineMath math="\beta_0" />: intercept
                </li>
                <li>
                  <InlineMath math="\beta_1" />: slope (effect of <InlineMath math="X" /> on <InlineMath math="Y" />)
                </li>
                <li>
                  <InlineMath math="\varepsilon_i" />: random error with mean 0 and variance <InlineMath math="\sigma^2" />
                </li>
              </ul>
              <br />
              <Paragraph className="text-lg text-black leading-relaxed">
                This is very good step into learning what a model is. It can predict very simple cases, like getting student grades from study hours.
                While SLR just gets one preditor, we can also extend OLS to handle multiple predictors.
              </Paragraph>
              <br />

              <Paragraph className="text-lg text-black leading-relaxed">
                We just learned about SLR, but we can also apply OLS to Multiple Linear Regression. In MLR, we can allow multiple predictors,
                this can help us out in more complex prombelms and gather more predictors. The outcome of <InlineMath math={`Y_{i}`} /> can be depends on multiple <InlineMath math={`X_{ij}`} />.
                OLS in MLR minimizes as sum of squared residuals.
              </Paragraph>
   

              <div className="text-2xl text-black">
                <BlockMath math={`Y_i = \\beta_0 + \\beta_1 X_{i1} + \\beta_2 X_{i2} + \\cdots + \\beta_p X_{ip} + \\varepsilon_i,\\quad i = 1,\\ldots,n`} />
              </div>

              <ul className="list-disc pl-6 text-lg text-black leading-relaxed space-y-2">
                <li>
                  <InlineMath math="Y_i" />: response variable (outcome)
                </li>
                <li>
                  <InlineMath math="X_{ij}" />: predictor <InlineMath math="j" /> for observation <InlineMath math="i" />
                </li>
                <li>
                  <InlineMath math="\beta_j" />: coefficients to estimate
                </li>
                <li>
                  <InlineMath math="\varepsilon" />: error term
                </li>
              </ul>
              <br />

              <Paragraph className="text-lg text-black leading-relaxed">
                This is the same form as the above but in matrix form. <InlineMath math="y" > 
                </InlineMath> is the column the outcomes. <InlineMath math="X" ></InlineMath> is like a row of a data point
                <InlineMath math="B" ></InlineMath> tell us how important is <InlineMath math="X" ></InlineMath>. Errors{' '}<InlineMath math="\varepsilon " /> {' '}
                are the stuff that can't be explain by the model.

              </Paragraph>

              <div className="text-2xl text-black">
                <BlockMath math={`y = X\\beta + \\varepsilon`} />
              </div>

              <ul className="list-disc pl-6 text-lg text-black leading-relaxed space-y-2">
                  <li>
                    <InlineMath math="y" />:  <InlineMath math="n \times 1" /> vector of responses
                  </li>
                  <li>
                    <InlineMath math="X" />: <InlineMath math="n \times (p+1)" /> design matrix (first column = 1's for intercept)
                  </li>
                  <li>
                    <InlineMath math="\beta" />: <InlineMath math="(p+1) \times 1" /> vector of coefficients design matrix (first column = 1's for intercept)
                  </li>
                  <li>
                    <InlineMath math="\varepsilon" />: error vector
                  </li>
                </ul>

              <Paragraph as="h2" className="font-semibold text-2xl text-gray-900 mb-3 mt-8">
                3. The Random Component (<InlineMath math="\mathcal{D}" />)
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                The random component is the choice of probability distribution for the response variable, 
                drawn from the <strong>exponential family</strong> of distributions.
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                The set of common distributions:
              </Paragraph>

              <div className="text-2xl text-black">
                <BlockMath math="\mathcal{D} = \{ \text{Normal}, \text{Binomial}, \text{Bernoulli}, \text{Poisson}, \text{Gamma}, \text{Exponential}, \text{Inverse Gaussian}, \text{Beta} \}" />
              </div>

              <div className="mt-6">
                <DistributionVisualizer />
              </div>

              {/* Section 4: The Systematic Component */}
              <Paragraph as="h2" className="font-semibold text-2xl text-gray-900 mb-3 mt-8">
                4. The Systematic Component (<InlineMath math="\eta" /> or <InlineMath math="S" />)
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                The systematic component, or <strong>linear predictor</strong> <InlineMath math="(\eta)" />, 
                doesn't represent a set of different choices in the same way that the other components do. 
                Instead, it defines a specific structure. For any GLM, the systematic component is a linear 
                combination of explanatory variables and parameters.
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                For <InlineMath math="p" /> explanatory variables <InlineMath math="(x_1, \ldots, x_p)" />, 
                the linear predictor <InlineMath math="\eta" /> is defined as:
              </Paragraph>

              <div className="text-2xl text-black">
                <BlockMath math="\eta = \beta_0 + \sum_{i=1}^{p}\beta_i x_i = \mathbf{x}^T\boldsymbol{\beta}" />
              </div>

              <div className="mt-6">
                <LinearPredictorPlot />
              </div>

              {/* Section 5: The Link Function */}
              <Paragraph as="h2" className="font-semibold text-2xl text-gray-900 mb-3 mt-8">
                5. The Link Function (<InlineMath math="\mathcal{L}" />)
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                The link function, <InlineMath math="g(\mu)" />, connects the expected value of the response 
                variable, <InlineMath math="\mu = E(Y)" />, to the linear predictor <InlineMath math="\eta" />. 
                The set of common link functions, <InlineMath math="\mathcal{L}" />, can be notated as follows:
              </Paragraph>

              <div className="text-xl text-black">
                <BlockMath math={`\\mathcal{L} = \\begin{cases}
\\text{Identity} & : & g(\\mu) = \\mu \\\\
\\text{Log} & : & g(\\mu) = \\ln(\\mu) \\\\
\\text{Logit} & : & g(\\mu) = \\ln\\left(\\frac{\\mu}{1-\\mu}\\right) \\\\
\\text{Probit} & : & g(\\mu) = \\Phi^{-1}(\\mu) & \\text{(where } \\Phi \\text{ is the Normal CDF)} \\\\
\\text{Complementary log-log} & : & g(\\mu) = \\ln(-\\ln(1-\\mu)) \\\\
\\text{Inverse} & : & g(\\mu) = \\mu^{-1} \\\\
\\text{Inverse-squared} & : & g(\\mu) = \\mu^{-2}
\\end{cases}`} />
              </div>

              <div className="mt-6">
                <LinkFunctionPlot />
              </div>

              {/* Section 6: Designing Link Functions */}
              <Paragraph as="h2" className="font-semibold text-2xl text-gray-900 mb-3 mt-8">
                6. A 3-Step Process for Designing a Link Function
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                The goal is to construct a function <InlineMath math="g(\mu)" /> that takes the natural domain 
                of <InlineMath math="\mu" /> and maps it to <InlineMath math="(-\infty, \infty)" />, while 
                also being monotonic and differentiable.
              </Paragraph>

              <Paragraph as="h3" className="font-semibold text-xl text-gray-800 mb-2 mt-6">
                Step 1: Identify the Domain of the Mean (<InlineMath math="\mu" />)
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                First, we must determine the possible range of values for the expected value of the response 
                variable. This is dictated by its probability distribution. For example:
              </Paragraph>

              <ul className="list-disc pl-6 text-lg text-black leading-relaxed space-y-2">
                <li>
                  <strong>Probabilities/Proportions (Binomial):</strong> The mean <InlineMath math="\mu" /> is 
                  a probability, so its domain is bounded on both sides: <InlineMath math="\mu \in (0, 1)" />
                </li>
                <li>
                  <strong>Counts (Poisson, Negative Binomial):</strong> The mean <InlineMath math="\mu" /> is 
                  a rate or count, so its domain is bounded only on the lower side: <InlineMath math="\mu \in (0, \infty)" />
                </li>
                <li>
                  <strong>Unconstrained Data (Normal):</strong> The mean <InlineMath math="\mu" /> can be any 
                  real number: <InlineMath math="\mu \in (-\infty, \infty)" />
                </li>
              </ul>

              <Paragraph as="h3" className="font-semibold text-xl text-gray-800 mb-2 mt-6">
                Step 2: Find a Transformation to Unbind the Domain
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                This is the most creative step. Here, we need to find a function that stretches the domain 
                from step 1 to cover the entire real number line.
              </Paragraph>

              <Paragraph as="h4" className="font-semibold text-lg text-gray-700 mb-2 mt-4">
                Case 1: Domain is (0, 1) - Bounded on Both Sides
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                For this, we need a function that "explodes" to <InlineMath math="+\infty" /> as <InlineMath math="\mu" /> 
                approaches 1 and to <InlineMath math="-\infty" /> as <InlineMath math="\mu" /> approaches 0.
                Typically, ratios and logarithms are the best tools for accomplishing this.
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                <strong>Create a Ratio:</strong> To handle the upper bound, create a ratio that goes to infinity. 
                The <strong>odds</strong>, <InlineMath math="\frac{\mu}{1-\mu}" />, is a perfect candidate.
              </Paragraph>

              <ul className="list-disc pl-6 text-lg text-black leading-relaxed space-y-2">
                <li>
                  As <InlineMath math="\mu \to 1" />, the denominator <InlineMath math="(1-\mu) \to 0" />, 
                  so the ratio <InlineMath math="\to +\infty" />
                </li>
                <li>
                  As <InlineMath math="\mu \to 0" />, the ratio <InlineMath math="\to 0" />
                </li>
              </ul>

              <Paragraph className="text-lg text-black leading-relaxed">
                At this point, the transformation successfully maps the domain <InlineMath math="(0, 1)" /> to{' '}
                <InlineMath math="(0, \infty)" />. However, we still need to account for the <InlineMath math="-\infty" /> part.
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                <strong>Apply a Logarithm:</strong> Now, we just need to map <InlineMath math="(0, \infty)" /> to{' '}
                <InlineMath math="(-\infty, \infty)" />. The natural log does exactly this.
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                The result is the canonical <strong>Logit Function</strong>:
              </Paragraph>

              <div className="text-2xl text-black">
                <BlockMath math="g(\mu) = \ln\left(\frac{\mu}{1-\mu}\right)" />
              </div>

              <Paragraph as="h4" className="font-semibold text-lg text-gray-700 mb-2 mt-4">
                Case 2: Domain is (0, ∞) - Bounded on One Side
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                For this, we need a function that goes to <InlineMath math="-\infty" /> as <InlineMath math="\mu" /> 
                approaches 0, but is unbounded as <InlineMath math="\mu" /> grows. This case is much simpler and 
                the natural log already has this exact property.
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                The result is the <strong>log function</strong>:
              </Paragraph>

              <div className="text-2xl text-black">
                <BlockMath math="g(\mu) = \ln(\mu)" />
              </div>

              <Paragraph as="h4" className="font-semibold text-lg text-gray-700 mb-2 mt-4">
                Case 3: Domain is (-∞, ∞) - Already Unbounded
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                The domain of <InlineMath math="\mu" /> is already the same as the required range for{' '}
                <InlineMath math="\eta" />. Thus, no transformations are needed. The simplest possible function 
                that preserves the values is the <strong>identity function</strong>:
              </Paragraph>

              <div className="text-2xl text-black">
                <BlockMath math="g(\mu) = \mu" />
              </div>

              <Paragraph as="h3" className="font-semibold text-xl text-gray-800 mb-2 mt-6">
                Step 3: Verify Monotonicity and Differentiability
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                <strong>Differentiable?</strong> Standard functions like logarithms and ratios are differentiable 
                within their domains. For the logit function, <InlineMath math="g'(\mu) = \frac{1}{\mu(1-\mu)}" />, 
                which is defined for all <InlineMath math="\mu \in (0, 1)" />.
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                <strong>Monotonic?</strong> We simply check if the first derivative is always positive or always 
                negative. Since <InlineMath math="\mu" /> and <InlineMath math="(1-\mu)" /> are both positive for{' '}
                <InlineMath math="\mu \in (0, 1)" />, the derivative <InlineMath math="g'(\mu) = \frac{1}{\mu(1-\mu)}" />{' '}
                is always positive and the logit function is strictly increasing.
              </Paragraph>

              <div className="mt-6">
                <DomainTransformationPlot />
              </div>

              {/* Section 7: Exponential Family & Natural Parameter */}
              <Paragraph as="h2" className="font-semibold text-2xl text-gray-900 mb-3 mt-8">
                7. Exponential Family Form and the Natural Parameter
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                Any distribution in the exponential family can be written in a standard form:
              </Paragraph>

              <div className="text-2xl text-black">
                <BlockMath math="f(y | \theta, \phi) = \exp\left(\frac{y\theta - b(\theta)}{a(\phi)} + c(y, \phi)\right)" />
              </div>

              <Paragraph className="text-lg text-black leading-relaxed">
                The most important piece of this is <InlineMath math="\theta" />, which is called the{' '}
                <strong>natural parameter</strong>. It's the parameter that is directly multiplied by the data,{' '}
                <InlineMath math="y" />. Every distribution in the family has one.
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                There is a fundamental property connecting this natural parameter <InlineMath math="\theta" /> to 
                the distribution's mean, <InlineMath math="\mu" />:
              </Paragraph>

              <div className="text-2xl text-black">
                <BlockMath math="\mu = E[Y] = b'(\theta)" />
              </div>

              <Paragraph className="text-lg text-black leading-relaxed">
                This means the expected value <InlineMath math="(\mu)" /> is always the first derivative of the{' '}
                <InlineMath math="b(\theta)" /> function. So, there is an intrinsic mathematical relationship 
                between the mean and the natural parameter.
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                In a GLM, the linear predictor <InlineMath math="(\eta)" /> is set equal to the natural parameter{' '}
                <InlineMath math="(\theta)" />:
              </Paragraph>

              <div className="text-2xl text-black">
                <BlockMath math="\eta = \mathbf{x}^T\boldsymbol{\beta} = \theta" />
              </div>

              <Paragraph className="text-lg text-black leading-relaxed">
                The job of the link function, <InlineMath math="g(\mu)" />, is to connect the mean to the linear 
                predictor: <InlineMath math="g(\mu) = \eta" />. When we use the <strong>canonical link</strong>, 
                we are choosing one specific function <InlineMath math="g(\mu)" /> that makes the mean map directly 
                onto the natural parameter <InlineMath math="\theta" />:
              </Paragraph>

              <div className="text-2xl text-black">
                <BlockMath math="g(\mu) = \theta" />
              </div>

              <Paragraph as="h3" className="font-semibold text-xl text-gray-800 mb-2 mt-6">
                Example: Deriving the Poisson Link Function
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                The PMF for a Poisson distribution with mean <InlineMath math="\lambda" /> is:
              </Paragraph>

              <div className="text-2xl text-black">
                <BlockMath math="f(y | \lambda) = \frac{\lambda^y e^{-\lambda}}{y!}" />
              </div>

              <Paragraph className="text-lg text-black leading-relaxed">
                Converting this to the exponential family form, we have:
              </Paragraph>

              <div className="text-2xl text-black">
                <BlockMath math="f(y | \lambda) = \exp\left(y\ln(\lambda) - \lambda - \ln(y!)\right)" />
              </div>

              <Paragraph className="text-lg text-black leading-relaxed">
                We can identify that the natural parameter is the one we multiply <InlineMath math="y" /> by. 
                Therefore, the natural parameter is <InlineMath math="\theta = \ln(\lambda)" />.
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                For the Poisson distribution, the mean is <InlineMath math="\mu = \lambda" />, therefore:
              </Paragraph>

              <div className="text-2xl text-black">
                <BlockMath math="\theta = \ln(\mu)" />
              </div>

              <Paragraph className="text-lg text-black leading-relaxed">
                This tells us that the function that transforms the mean <InlineMath math="\mu" /> into the 
                natural parameter is the logarithm. This is the canonical link function for Poisson regression.
              </Paragraph>

              <div className="mt-6">
                <ExponentialFamilyPlot />
              </div>

              {/* Section 8: Reconciling Perspectives */}
              <Paragraph as="h2" className="font-semibold text-2xl text-gray-900 mb-3 mt-8">
                8. Reconciling the Two Perspectives
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                At this point, we've seen two completely different ways of arriving at link functions:
              </Paragraph>

              <ol className="list-decimal pl-6 text-lg text-black leading-relaxed space-y-2">
                <li>
                  <strong>The Domain Transformation Approach:</strong> Start with the domain of <InlineMath math="\mu" />, 
                  then apply transformations (ratios, logs, etc.) to stretch that domain onto{' '}
                  <InlineMath math="(-\infty, \infty)" />. This method can generate MANY valid link functions for 
                  any given distribution. As long as the function is monotonic and differentiable, it works.
                </li>
                <li>
                  <strong>The Natural Parameter Approach:</strong> Start with the exponential family form, identify 
                  the natural parameter <InlineMath math="\theta" />, and set <InlineMath math="g(\mu) = \theta" />. 
                  This method identifies exactly ONE special link function, the canonical link.
                </li>
              </ol>

              <Paragraph className="text-lg text-black leading-relaxed">
                The domain transformation approach is more general. It tells us what makes <em>any</em> link function 
                valid. You could, in principle, create infinitely many valid link functions for a Binomial distribution 
                as long as they map <InlineMath math="(0, 1) \to (-\infty, \infty)" /> monotonically.{' '}
                <strong>Probit</strong> and <strong>Complementary log-log</strong> are examples of this. They are 
                valid, but not canonical.
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                The natural parameter approach is more restrictive. It singles out <em>one specific</em> link function 
                that has special mathematical properties tied to the exponential family structure. This is the canonical link.
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                <strong>When you apply the domain transformation method to a distribution and happen to arrive at the 
                same function that the natural parameter method gives you, you've found the canonical link.</strong>
              </Paragraph>

              <Paragraph as="h3" className="font-semibold text-xl text-gray-800 mb-2 mt-6">
                Examples of Convergence
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                <strong>Poisson:</strong>
              </Paragraph>
              <ul className="list-disc pl-6 text-lg text-black leading-relaxed space-y-2">
                <li>Domain transformation says: "The mean is on <InlineMath math="(0, \infty)" />, so use{' '}
                  <InlineMath math="g(\mu) = \ln(\mu)" /> to unbind it."</li>
                <li>Natural parameter says: "<InlineMath math="\theta = \ln(\lambda) = \ln(\mu)" />, so{' '}
                  <InlineMath math="g(\mu) = \ln(\mu)" />."</li>
                <li>They agree! The log link is canonical.</li>
              </ul>

              <Paragraph className="text-lg text-black leading-relaxed mt-4">
                <strong>Binomial:</strong>
              </Paragraph>
              <ul className="list-disc pl-6 text-lg text-black leading-relaxed space-y-2">
                <li>Domain transformation says: "The mean is on <InlineMath math="(0, 1)" />, so use odds then log:{' '}
                  <InlineMath math="g(\mu) = \ln\left(\frac{\mu}{1-\mu}\right)" />."</li>
                <li>Natural parameter says: "<InlineMath math="\theta = \ln\left(\frac{p}{1-p}\right) = \ln\left(\frac{\mu}{1-\mu}\right)" />, 
                  so <InlineMath math="g(\mu) = \ln\left(\frac{\mu}{1-\mu}\right)" />."</li>
                <li>They agree! The logit link is canonical.</li>
              </ul>

              <Paragraph className="text-lg text-black leading-relaxed mt-4">
                <strong>Binomial with Probit:</strong>
              </Paragraph>
              <ul className="list-disc pl-6 text-lg text-black leading-relaxed space-y-2">
                <li>Domain transformation says: "The mean is on <InlineMath math="(0, 1)" />. I could also use{' '}
                  <InlineMath math="g(\mu) = \Phi^{-1}(\mu)" /> since the Normal CDF maps{' '}
                  <InlineMath math="(0, 1) \to (-\infty, \infty)" />."</li>
                <li>Natural parameter says: "That's not <InlineMath math="\theta" />. Probit is valid, but it's not canonical."</li>
              </ul>

              <div className="mt-6">
                <GLMTableInteractive />
              </div>

              {/* Section 9: Matrix Formulation */}
              <Paragraph as="h2" className="font-semibold text-2xl text-gray-900 mb-3 mt-8">
                9. Transition to Matrix Formulation
              </Paragraph>

              <Paragraph as="h3" className="font-semibold text-xl text-gray-800 mb-2 mt-6">
                From Single Observation to Multiple Observations
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                Up to this point, we've been thinking about GLMs primarily in terms of a <strong>single observation</strong>. 
                The linear predictor <InlineMath math="\eta = \mathbf{x}^T\boldsymbol{\beta}" /> represents one value 
                for one observation. However, in practice, we work with datasets containing many observations, and we 
                need to estimate parameters using all available data simultaneously.
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                This motivates our transition from the <strong>scalar view</strong> to the <strong>matrix view</strong> of GLMs.
              </Paragraph>

              <Paragraph as="h3" className="font-semibold text-xl text-gray-800 mb-2 mt-6">
                The Scalar Perspective: Single Observation
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                For a single observation with <InlineMath math="p" /> predictors, we write:
              </Paragraph>

              <div className="text-2xl text-black">
                <BlockMath math="\eta = \beta_0 + \beta_1 x_1 + \beta_2 x_2 + \cdots + \beta_p x_p = \mathbf{x}^T\boldsymbol{\beta}" />
              </div>

              <Paragraph className="text-lg text-black leading-relaxed">
                Where:
              </Paragraph>
              <ul className="list-disc pl-6 text-lg text-black leading-relaxed space-y-2">
                <li><InlineMath math="\mathbf{x} = [1, x_1, x_2, \ldots, x_p]^T" /> is the <strong>augmented predictor vector</strong> (including the intercept term)</li>
                <li><InlineMath math="\boldsymbol{\beta} = [\beta_0, \beta_1, \beta_2, \ldots, \beta_p]^T" /> is the <strong>parameter vector</strong></li>
                <li><InlineMath math="\eta" /> is a <strong>scalar</strong> representing the linear predictor for this one observation</li>
              </ul>

              <Paragraph as="h3" className="font-semibold text-xl text-gray-800 mb-2 mt-6">
                The Matrix Perspective: Multiple Observations
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                When we have <InlineMath math="n" /> observations, we can organize all the data and calculations into matrices:
              </Paragraph>

              <div className="text-2xl text-black">
                <BlockMath math="\boldsymbol{\eta} = \mathbf{X}\boldsymbol{\beta}" />
              </div>

              <Paragraph className="text-lg text-black leading-relaxed">
                Where:
              </Paragraph>
              <ul className="list-disc pl-6 text-lg text-black leading-relaxed space-y-2">
                <li><InlineMath math="\boldsymbol{\eta} \in \mathbb{R}^{n \times 1}" /> is a <strong>vector of linear predictors</strong>, one for each observation</li>
                <li><InlineMath math="\mathbf{X} \in \mathbb{R}^{n \times (p+1)}" /> is the <strong>design matrix</strong>, with each row representing one observation</li>
                <li><InlineMath math="\boldsymbol{\beta} \in \mathbb{R}^{(p+1) \times 1}" /> is the <strong>parameter vector</strong> (same as before)</li>
              </ul>

              <Paragraph as="h3" className="font-semibold text-xl text-gray-800 mb-2 mt-6">
                Building the Design Matrix
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                The design matrix <InlineMath math="\mathbf{X}" /> is constructed by stacking the augmented predictor 
                vectors for all <InlineMath math="n" /> observations:
              </Paragraph>

              <div className="text-xl text-black">
                <BlockMath math="\mathbf{X} = \begin{bmatrix} 1 & x_{11} & x_{12} & \cdots & x_{1p} \\ 1 & x_{21} & x_{22} & \cdots & x_{2p} \\ 1 & x_{31} & x_{32} & \cdots & x_{3p} \\ \vdots & \vdots & \vdots & \ddots & \vdots \\ 1 & x_{n1} & x_{n2} & \cdots & x_{np} \end{bmatrix}" />
              </div>

              <Paragraph className="text-lg text-black leading-relaxed">
                <strong>Where:</strong>
              </Paragraph>
              <ul className="list-disc pl-6 text-lg text-black leading-relaxed space-y-2">
                <li>The <strong>first column</strong> is all 1s, corresponding to the intercept term <InlineMath math="\beta_0" /></li>
                <li>Each <strong>row</strong> represents one observation: <InlineMath math="[\mathbf{x}_i]^T = [1, x_{i1}, x_{i2}, \ldots, x_{ip}]" /></li>
                <li>Each <strong>column</strong> (after the first) represents one predictor variable across all observations</li>
                <li>The matrix has dimensions <InlineMath math="n \times (p+1)" /></li>
              </ul>

              <Paragraph as="h3" className="font-semibold text-xl text-gray-800 mb-2 mt-6">
                Why Does Matrix Form Matter for Parameter Estimation?
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                The matrix formulation becomes essential when we want to estimate <InlineMath math="\boldsymbol{\beta}" /> from data. 
                For the <strong>normal distribution with identity link</strong>, the maximum likelihood estimate is:
              </Paragraph>

              <div className="text-2xl text-black">
                <BlockMath math="\hat{\boldsymbol{\beta}} = (\mathbf{X}^T\mathbf{X})^{-1}\mathbf{X}^T\mathbf{y}" />
              </div>

              <Paragraph className="text-lg text-black leading-relaxed">
                <strong>Breaking down the components:</strong>
              </Paragraph>
              <ul className="list-disc pl-6 text-lg text-black leading-relaxed space-y-2">
                <li><InlineMath math="\mathbf{X}^T\mathbf{X}" /> is a <InlineMath math="(p+1) \times (p+1)" /> matrix (the <strong>Gram matrix</strong>)</li>
                <li><InlineMath math="\mathbf{X}^T\mathbf{y}" /> is a <InlineMath math="(p+1) \times 1" /> vector (the <strong>moment vector</strong>)</li>
                <li><InlineMath math="(\mathbf{X}^T\mathbf{X})^{-1}" /> is the inverse of the Gram matrix (if it exists)</li>
              </ul>

              <div className="mt-6">
                <MatrixVisualization />
              </div>

              {/* Section 10: Weight Matrices */}
              <Paragraph as="h2" className="font-semibold text-2xl text-gray-900 mb-3 mt-8">
                10. The Hidden Identity: Weight Matrices Across Distributions
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                When we work with GLMs at the matrix-level, we can see how the link functions crop up in the 
                diagonal weight matrix. There's actually an implicit identity matrix <InlineMath math="\mathbf{I}_n" /> 
                between <InlineMath math="\mathbf{X}^T" /> and <InlineMath math="\mathbf{X}" /> for the normal 
                distribution under the GLM framework.
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                For the <strong>normal distribution with identity link</strong>, the estimation equation can be 
                written more explicitly as:
              </Paragraph>

              <div className="text-2xl text-black">
                <BlockMath math="\hat{\boldsymbol{\beta}} = (\mathbf{X}^T\mathbf{I}_n\mathbf{X})^{-1}\mathbf{X}^T\mathbf{I}_n\mathbf{y}" />
              </div>

              <Paragraph className="text-lg text-black leading-relaxed">
                Where <InlineMath math="\mathbf{I}_n" /> is the <InlineMath math="n \times n" /> identity matrix. 
                This identity matrix represents <strong>equal weighting</strong> of all observations—each data point 
                contributes equally to the parameter estimates.
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                However, for other distributions in the GLM framework, this identity matrix is replaced by a{' '}
                <strong>weight matrix</strong> <InlineMath math="\mathbf{W}^{(t)}" />, which accounts for the 
                different variance structures inherent to each distribution:
              </Paragraph>

              <div className="text-2xl text-black">
                <BlockMath math="\hat{\boldsymbol{\beta}}^{(t+1)} = (\mathbf{X}^T\mathbf{W}^{(t)}\mathbf{X})^{-1}\mathbf{X}^T\mathbf{W}^{(t)}\mathbf{z}^{(t)}" />
              </div>

              <Paragraph className="text-lg text-black leading-relaxed">
                Where:
              </Paragraph>
              <ul className="list-disc pl-6 text-lg text-black leading-relaxed space-y-2">
                <li><InlineMath math="\mathbf{W}^{(t)} = \text{diag}(w_1^{(t)}, w_2^{(t)}, \ldots, w_n^{(t)})" /> is an{' '}
                  <InlineMath math="n \times n" /> diagonal <strong>weight matrix</strong> at iteration <InlineMath math="t" /></li>
                <li><InlineMath math="\mathbf{z}^{(t)}" /> is the <strong>working response vector</strong> at iteration{' '}
                  <InlineMath math="t" /> (a transformed version of <InlineMath math="\mathbf{y}" />)</li>
                <li>The weights <InlineMath math="w_i^{(t)}" /> depend on the distribution and current parameter estimates{' '}
                  <InlineMath math="\hat{\boldsymbol{\beta}}^{(t)}" /></li>
              </ul>

              <Paragraph className="text-lg text-black leading-relaxed">
                This is the core of <strong>Iteratively Reweighted Least Squares (IRLS)</strong>.
              </Paragraph>

              <Paragraph as="h3" className="font-semibold text-xl text-gray-800 mb-2 mt-6">
                Why Weights Matter: A Conceptual View
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                The weight matrix <InlineMath math="\mathbf{W}^{(t)}" /> serves a crucial purpose: <strong>it accounts 
                for heteroscedasticity</strong> (non-constant variance) inherent in different distributions.
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                <strong>Example: Poisson Regression</strong>
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                In Poisson regression, the variance equals the mean: <InlineMath math="\text{Var}(Y_i) = \mu_i" />. This means:
              </Paragraph>
              <ul className="list-disc pl-6 text-lg text-black leading-relaxed space-y-2">
                <li>Observations with large <InlineMath math="\mu_i" /> have higher variance (more uncertainty)</li>
                <li>Observations with small <InlineMath math="\mu_i" /> have lower variance (more certainty)</li>
              </ul>

              <Paragraph className="text-lg text-black leading-relaxed">
                The weight <InlineMath math="w_i = \mu_i" /> gives <strong>more influence to observations with higher means</strong>, 
                which appropriately balances the information each observation provides.
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed mt-4">
                <strong>Example: Binomial/Bernoulli Regression</strong>
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                In logistic regression, <InlineMath math="\text{Var}(Y_i) = \mu_i(1-\mu_i)" />. This means:
              </Paragraph>
              <ul className="list-disc pl-6 text-lg text-black leading-relaxed space-y-2">
                <li>Probabilities near 0 or 1 have low variance (we're very certain)</li>
                <li>Probabilities near 0.5 have high variance (we're less certain)</li>
              </ul>

              <Paragraph className="text-lg text-black leading-relaxed">
                The weight <InlineMath math="w_i = \mu_i(1-\mu_i)" /> gives <strong>less influence to extreme probabilities</strong> and{' '}
                <strong>more influence to middle-range probabilities</strong>, which appropriately balances the information 
                each observation provides.
              </Paragraph>

              <div className="mt-6">
                <WeightMatrixPlot />
              </div>

            </Blog>
          </div>
        </main>
      </div>

      {/* Chat Assistant */}
      <ChatAssistant />
    </div>
  );
};
