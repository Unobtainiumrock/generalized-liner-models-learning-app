import { Paragraph } from './Paragraph';
import { BlockMath,InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';


export const Blog = () => {
  return (
    <section className="mb-6" aria-labelledby="blog-heading">
      <h2 id="blog-heading" className="sr-only">
        About this visualization
      </h2>

      <Paragraph as="h1" className="font-semibold text-3xl text-gray-900 mb-3">
        1. Introduction
      </Paragraph>
      
      <Paragraph className="text-lg text-black leading-relaxed">
        Generalized Linear Model(GLM) is a model that is use for the exponetial family of distributions.
        But before we actaully get into a GLM, we should first start with a basic model to gain an understanding 
        on Linear Regression.<br />
        
      </Paragraph>

      <Paragraph className="text-lg text-black leading-relaxed">
        In Linear Regression, we first start off with the foundation of Ordinary Least Squares. 
        OLS is the most common way to estimate a model,it find the best fit line by minimizing erros. 
        one predictor X and  The goal for this model
        is to estimate <InlineMath math = {`\\beta_0,\\beta_1`}/> 
      </Paragraph>
     
      <div className = "text-2xl text-black">
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
    
      
      
{/*       
      <Paragraph>
        This visualization shows the linear predictor and response spaces for the current GLM settings,
        illustrating the true and estimated curves, sampled observations, and how link and distribution
        choices change predicted responses—adjust the controls to explore parameter effects and the
        resulting data-generating process.
      </Paragraph>

      <Paragraph className="italic text-sm">
        Tip: use the controls to change sample size, link function, and distribution to observe how
        estimates and variability respond.
      </Paragraph> */}
    </section>
  );
};


export default Blog;
// ...existing code...
