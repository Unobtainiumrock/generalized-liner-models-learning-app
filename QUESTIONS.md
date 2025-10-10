1. Is there a difference between cannonical and non-cannonical link functions?
    
    Yes, there is a difference. The **cannonical** link funciton is a special choice that offers statistical
    convenience, whereas a **non-cannonical** one is chosen for a better theoretical fit to the data, sometimes at the cost of computational simplicity.

    For each distribution in the exponential family (Normal, Binomial, Poisson, etc), there is one specific link function that maps the mean of the response directly to the distributions __natural__ parameter. This alignment ensures that that the algorithm used to estimate the model parameters like ($\beta_{0}, \beta_{1}$) can find a single, unique solution. The estimation process is generally faster and more stable. We typically start with these and only deviate away from them if we has a theoretically strong reason to do so.

    **Non-Cannonical Link Function**: This is any other valid (monotonic differentiable) link function that is _not_ the cannonical one for the chosen distribution.

    Where it could be useful: Its used when your theoretical understanding of the data suggests a different relationship between the predictors and the response mean. For example, for binary (pass/fail) data, you might choose a probit link over the canonical logit link if you believe the outcome is driven by an underyling, unobserved normal distribution.

    **Disadvantage**: The log-likelihood function is not guaranteed to be concave, which can lead to computational issues. The estimation algorithm might be slower, fail to converge, or even find multiple possible solutions (locla maxima), making the results less reliable.


2. We established that in theory, any function that is **monotonic** and **differentiable** can be used as a link function. The key requirement is that the link function maps the range of possible mean values, $\mu$, to the entire real number line $(- \infty, \infty)$, which is the range of the linear predictor $\eta$

For example, while the logit and probit links are common for binomial data, other functions like the complementary log-log can also be used depending on the underlying assumptions about the data-generating process. 

I like what you shared above,can we please explore this more in-depth, like ho_w to design a function s.t. it maps the range of possible mean values to the entire real number line? I think it would be really great to have a framework/tool/process for how to mathematically go about doing this.

**FRAMEWORK ADDED SEE GLM NOTES**

3. You mentioned that logit and probit links    are common for binomial data. Why is this? Can we look at what makes this mathematically the case? 

4. You mention that for every probability distribution in the exponential family, there is one special link function called the **cannonical link**. So is the cannonical link specific to distributions under the exponential family? What distributuions fall under the exponential family? It is also mentioned that when a cannonical link funciton is used, the math to find the MLE is often more straightforward and well-behaved. What do we mean by this? Can you show some small example of cannonical link function vs non cannonical for distributions? Just to be clear, do we not have any of these for non-exponential family ones? Like the split between cannonical v.s. not.

5. You mentioned that the cannonical link function transforms the expected value $\mu$ s.t. it equals the natural parameter of the distribution.

6. Is this non-guaranteed of a unique solution for non-cannonical link functions somehow tied to the invertibility of a matrix representing the problem worked on? My intuition tells me that its the complement of the direct consequence of log-like functions linearizing exponentials, thus converting to linear combinations that we can do things like find matrix-vector equation determinants on.

7. There is a fundamental property connecting this natural parameter θ to the distribution's mean, μ:
μ=E(Y)=b′(θ)

This means the expected value (μ) is always the first derivative of the b(θ) function. So, there is an intrinsic mathematical relationship between the mean and the natural parameter.

How can we show this fundamental property? Also, what is Y representing here? How can we be certain to not confuse R.V's with matrices or vectors? Also, I want some subscripts to make stuff more clear.

8. $\eta = \mathbf{x}^{T}\mathbf{beta} = \theta$ is this in a matrix form? I saw that we have something like $\eta = \mathbf{x}^{T}\mathbf{beta}$, so is this current form simply a single row in what would be the design matrix $X$ and the beta vector is the same business as usual?