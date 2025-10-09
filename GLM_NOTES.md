# GLM Components


## The Random Component ($\mathcal{D}$)


The random component is the choice of probability distribution for the response variable, drawn from the **exponential family** of distributions.


The set of common distributions


$$\mathcal{D} = \{ Normal, Binomial, Poisson, Gamma, Negative, Inverse Gaussian \}$$



## Systematic Component ($\eta$ or $S$)


The systematic component, or **linear predictor** $(\eta)$, doesn't represent a set of different choices in the same way that the other components do. Instead, it defined a specific strucute. For any GLM, the systematic component is a linear combination of explanatory variables and parameters.


For $p$ explanatory variables ($x_{1}, \ldots, x_{p}$), the linear predictor for $\eta$ is defined as:


$\eta = \beta_{0} + \sum_{i = 1}^{p}\beta_{1}x_{i} = \mathbf{x}^{T}\mathbf{\beta}$



## Link Function ($\mathcal{L}$)


The link function, $g(\mu)$, connects the expected value of the response variable, $\mu = E(Y)$, to the linear predictor $\eta$. The set of common link functions, $\mathcal{L}$, can be notated as follows:


$$

\mathcal{L} = \begin{cases}

\text{Identity} & : & g(\mu) = \mu \\

\text{Log} & : & g(\mu) = \ln(\mu) \\

\text{Logit} & : & g(\mu) = \ln\left(\frac{\mu}{1-\mu}\right) \\

\text{Probit} & : & g(\mu) = \Phi^{-1}(\mu) & \text{(where } \Phi \text{ is the Normal CDF)} \\

\text{Complementary log-log} & : & g(\mu) = \ln(-\ln(1-\mu)) \\

\text{Inverse} & : & g(\mu) = \mu^{-1} \\

\text{Inverse-squared} & : & g(\mu) = \mu^{-2}

\end{cases}

$$


## A 3-step process for Designing a Link Function


The goal is to constructe a function $g(\eta)$ that takes the natural domain of $\mu$ and maps it to $(-\infty, \infty)$, while also being monotonic an differentiable.*


1. **Identify the Domain of the Mean ($\mu$)**


First, we must determine the possible range of values for the expectd value of the response variable. This is dictated by its probability distribution.


For example:


- **Probabilities/Proportions (Binomial):** The mean $\mu$ is a probability, so its domain is bounded on both sides $\mu \in (0, 1)$


- **Counts (Poisson, Negative Binomial):** The mean $\mu$ is a rate or count, so its domain is bounded only on the lower side $\mu \in (0, \infty)$


- **Unconstrained Data (Normal):** The mean $\mu$ can be any real number $\mu \in (-\infty, \infty)$



2. **Find a Tranformation to Unbind the Domain**


The is the most creative step. Here, we need to find a function that stretches the domain from step 1 to cover the entire real number line **TODO:** Add a nice giphy animation showing this effect.


**Case 1: Domain is $(0, 1)$. Bounded on Both sides**


For this, we need a function that "explodes" to $+ \infty$ as $\mu$ approaches $1$ and to $- \infty$ as $\mu$ approaches 0.


Typically, ratios and logarithms are the best tools for accomplishing this.


**Create a Ratio:** To ahndle the upper bound, crate a ratio that goes to infinity. The **odds**, $\frac{\mu}{1 - \mu}$ is a perfect candidate.


- As $\mu \to 1$, the denominator $(1 - \mu) \to 0$, so the ratio $\to + \infty$

- As $\mu \to 0$, the ratio $\to 0$


At this points, the transformation successfully maps the domain $(0, 1)$ to $(0, \infty)$. However, we still need to account for the $- \infty$ part.


**Apply a Logarithm:** Now, we just need to map $(0, \infty)$ to $(-\infty, \infty)$. The natural log does exaclty this. **TODO:** Add a nice desmos plot showcasing this.


The Result of this is the cannonical **Logit Function**


$$g(\mu) = ln(\frac{\mu}{1 - \mu})$$


**Case 2: Domain is $(0, \infty)$. Bounded on One Side**


For this, we need a function that goes to $-\infty$ as $\mu$ approaches $0$, but is unbounded as $\mu$ grows. This case is much simpler and the natural log already has this exact property.


The result of this is the log function:


$$g(\mu) = \mu$$


**Case 3: Domain is $(-\infty, \infty)$. Already Unbounded:**


The domain of $\mu$ is already the same as the required range for $\eta$. Thus, no transformtations are needed. The simplest possible function that preserves the values is the identity function.


$$g(\mu) = \mu$$


3. Verify Monotonicity and Differentiability. 


Why is this this step important? Its needed because..


**Differentiable?:** Standard functions like logarithms and ratios are differentiable within their domains. For the logic function, $g'(\mu) = \frac{1}{\mu(1 - \mu)}$, which is defined for all $\mu \in (0, 1)$


**Monotonic?:** We simply check if the first derivative is always positive or always negative. Since $\mu$ and $(1 - \mu)$ are both positive for $\mu \in (0, 1)$, the derivative $g'(\mu) = \frac{1}{\mu (1 - \mu)}$ is always positive and the logit function is strictly increasing.


It meets all the criteria, therefore this is the cannonical link function for the Binomial.



## Characteristics of the Exponential Family Form and the "Natural Prameter"


Any distribution in the exponential family can be written in a standard form:


$$f(y | \theta, \phi) = exp \left(\frac{y \theta - b(\theta)}{a(\theta)} + c(y, \phi) \right)$$


The most important piece of this is $\theta$, which is called the **natural parameter**. It's the parameter that is directly multiplied by the data, $y$. Every distribution in the family has one.


There is a fundemental property connecting this natural parameter $\theta$ to the distribution's mean, $\mu$:


$$\mu = E[Y] = b'(\theta)$$


This means the expected value ($\mu$) is always the first derivative of the $b(\theta)$ function. So, there is an intrinsic mathematical relationship between the mean and the natural parameter.


In a GLM, the linear predictor ($\eta$) is set equal to the natural parameter ($\theta$).


$$\eta = \mathbf{x}^{T}\mathbf{\beta} = \theta$$


The job of the link function, $g(\mu)$, is to connect the mean to the lienar predictor $g(\mu) = \eta$.


When we use the **cannonical link**, we are choosing __one specific function__ $g(\mu)$ that makes the mean map directly onto the natural parameter $\theta$.


$$g(\mu) = \theta$$


### Example: Deriving the Poisson Link Function


The pmf for a Poisson distribution with mean $\lambda$ is:


$$f = (y \lambda) = \frac{\lambda^{y}e^{-\lambda}}{y!}$$


Converting this to the exponential family form, we have:


$$f(y | \lambda) = exp\left( yln(\lambda) - \lambda - ln(y!) \right)$$


We can identify that the natural parameter is the one we multiply $y$ by. Therefore, the natural parameter is $\theta = ln(\lambda)$


We now need to find the canonical link function. It must satisfy $g(\mu) = \theta$.


For the Poisson distribution, the mean is $\mu = \lambda$, therefore 


$$\theta = ln(\mu)$$


This tells us that the function that transforms the mean $\mu$ into the natural parameter is $\theta$



## Reconciling the Two Perspectives


At this point, we've seen two completely different ways of arriving at link functions:


1. **The Domain Transformation Approach:** Start with the domain of $\mu$, then apply transformations (ratios, logs, etc.) to stretch that domain onto $(-\infty, \infty)$. This method can generate MANY valid link functions for any given distribution. As long as the function is monotonic and differentiable, it works.


2. **The Natural Parameter Approach:** Start with the exponential family form, identify the natural parameter $\theta$, and set $g(\mu) = \theta$. This method identifies exactly ONE special link function, the canonical link.


So, how do these two perspectives relate?


The domain transformation approach is more general. It tells us what makes *any* link function valid. You could, in principle, create infinitely many valid link functions for a Binomial distribution as long as they map $(0, 1) \to (-\infty, \infty)$ monotonically. **Probit** and **Complementary log-log** are examples of this. They are valid, but not canonical.


The natural parameter approach is more restrictive. It singles out *one specific* link function that has special mathematical properties tied to the exponential family structure. This is the canonical link.


Here's the key insight: **When you apply the domain transformation method to a distribution and happen to arrive at the same function that the natural parameter method gives you, you've found the canonical link.**


### Examples of Convergence


**Poisson:** 

- Domain transformation says: "The mean is on $(0, \infty)$, so use $g(\mu) = \ln(\mu)$ to unbind it."

- Natural parameter says: "$\theta = \ln(\lambda) = \ln(\mu)$, so $g(\mu) = \ln(\mu)$."

- They agree! The log link is canonical.


**Binomial:**

- Domain transformation says: "The mean is on $(0, 1)$, so use odds then log: $g(\mu) = \ln\left(\frac{\mu}{1-\mu}\right)$."

- Natural parameter says: "$\theta = \ln\left(\frac{p}{1-p}\right) = \ln\left(\frac{\mu}{1-\mu}\right)$, so $g(\mu) = \ln\left(\frac{\mu}{1-\mu}\right)$."

- They agree! The logit link is canonical.


**Binomial with Probit:**

- Domain transformation says: "The mean is on $(0, 1)$. I could also use $g(\mu) = \Phi^{-1}(\mu)$ since the Normal CDF maps $(0,1) \to (-\infty, \infty)$."

- Natural parameter says: "That's not $\theta$. Probit is valid, but it's not canonical."


The natural parameter approach doesn't just give us *a* link function, it gives us the link function that aligns the GLM's linear predictor directly with the distribution's inherent mathematical structure.



## GLM Table


This table shows the complete GLM framework for common exponential family distributions:


| Distribution ($\mathcal{D}$) | Systematic Component ($\eta$ or $S$) | Link Function ($g(\mu)$) | Type |
|------------------------------|--------------------------------------|--------------------------|------|
| **Normal** | $\eta = \mathbf{x}^T\boldsymbol{\beta}$ | Identity: $g(\mu) = \mu$ | Canonical |
| **Binomial** | $\eta = \mathbf{x}^T\boldsymbol{\beta}$ | Logit: $g(\mu) = \ln\left(\frac{\mu}{1-\mu}\right)$ | Canonical |
| **Binomial** | $\eta = \mathbf{x}^T\boldsymbol{\beta}$ | Probit: $g(\mu) = \Phi^{-1}(\mu)$ | Alternative |
| **Binomial** | $\eta = \mathbf{x}^T\boldsymbol{\beta}$ | Complementary log-log: $g(\mu) = \ln(-\ln(1-\mu))$ | Alternative |
| **Bernoulli** | $\eta = \mathbf{x}^T\boldsymbol{\beta}$ | Logit: $g(\mu) = \ln\left(\frac{\mu}{1-\mu}\right)$ | Canonical |
| **Bernoulli** | $\eta = \mathbf{x}^T\boldsymbol{\beta}$ | Probit: $g(\mu) = \Phi^{-1}(\mu)$ | Alternative |
| **Bernoulli** | $\eta = \mathbf{x}^T\boldsymbol{\beta}$ | Complementary log-log: $g(\mu) = \ln(-\ln(1-\mu))$ | Alternative |
| **Poisson** | $\eta = \mathbf{x}^T\boldsymbol{\beta}$ | Log: $g(\mu) = \ln(\mu)$ | Canonical |
| **Gamma** | $\eta = \mathbf{x}^T\boldsymbol{\beta}$ | Inverse: $g(\mu) = \frac{1}{\mu}$ | Canonical |
| **Exponential** | $\eta = \mathbf{x}^T\boldsymbol{\beta}$ | Inverse: $g(\mu) = \frac{1}{\mu}$ | Canonical |
| **Inverse Gaussian** | $\eta = \mathbf{x}^T\boldsymbol{\beta}$ | Inverse-squared: $g(\mu) = \frac{1}{\mu^2}$ | Canonical |
| **Beta** | $\eta = \mathbf{x}^T\boldsymbol{\beta}$ | Logit: $g(\mu) = \ln\left(\frac{\mu}{1-\mu}\right)$ | Canonical |


**Note:** The systematic component $\eta = \beta_0 + \sum_{i=1}^{p}\beta_i x_i = \mathbf{x}^T\boldsymbol{\beta}$ is the same across all GLMs. It's always a linear combination of predictors. What distinguishes different GLMs is the choice of distribution ($\mathcal{D}$) and link function ($\mathcal{L}$). **Canonical** link functions are derived from the natural parameter of the exponential family, while **alternative** link functions are valid but non-canonical choices.



## Paper Flow


0. Talk about the random component.

1. Should establish characteristics of the exponential family of distributions and what it is that's important about them for the GLM framework. 

2. Then establish the stuff from HW4 that forms the core foundation of GLMs.

3. Now, lay out all the GLM pieces:

    - The random component

    - The systematic component ($\eta$ or $S$)

    - The link function

    Talk about them in terms of being a set, a realization of a funcitonal form, and aother set respectively.


n. Give the floor for future investigation into non-cannonical link functions.



