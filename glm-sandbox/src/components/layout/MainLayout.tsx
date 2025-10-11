import { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { ControlPanel } from '../controls/ControlPanel';
import { TwoSpacesVisualization } from '../charts/TwoSpacesVisualization';
import { ChatAssistant } from '../ui/ChatAssistant';
import { Blog } from '../blogs/Blog';
import { Paragraph } from '../blogs/Paragraph';
import { useAppStore } from '../../store/appStore';

export const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
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

      {/* Control Panel */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-white border-r border-gray-200`}>
        < ControlPanel />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold text-gray-900">GLM Learning Sandbox</h1>
              <p className="text-m text-gray-600">Interactive Generalized Linear Models</p>
            </div>
            <div className="flex items-center space-x-4">
              {isLoading && (
                <div className="flex items-center text-gray-500">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Main area: Blog above the visualization, centered with spacing and scroll when needed */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <Blog>
              <Paragraph as="h1" className="font-semibold text-3xl text-gray-900 mb-3">
                1. Introduction: Basics Linear Regression
              </Paragraph>

              <Paragraph className="text-lg text-black leading-relaxed">
                Generalized Linear Model(GLM) is a model that is use for the exponetial family of distributions.
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
            </Blog>

            <div className="mt-6">
              <TwoSpacesVisualization />
            </div>
          </div>
        </main>
      </div>

      {/* Chat Assistant */}
      <ChatAssistant />
    </div>
  );
};
