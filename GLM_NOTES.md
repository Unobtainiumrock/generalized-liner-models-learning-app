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


The job of the link function, $g(\mu)$, is to connect the mean to the linear predictor $g(\mu) = \eta$.


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


**When you apply the domain transformation method to a distribution and happen to arrive at the same function that the natural parameter method gives you, you've found the canonical link.**


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



## Transition to Matrix Formulation


### From Single Observation to Multiple Observations

Up to this point, we've been thinking about GLMs primarily in terms of a **single observation**. The linear predictor $\eta = \mathbf{x}^T\boldsymbol{\beta}$ represents one value for one observation. However, in practice, we work with datasets containing many observations, and we need to estimate parameters using all available data simultaneously.

This motivates our transition from the **scalar view** to the **matrix view** of GLMs.


### The Scalar Perspective: Single Observation

For a single observation with $p$ predictors, we write:

$$\eta = \beta_0 + \beta_1 x_1 + \beta_2 x_2 + \cdots + \beta_p x_p = \mathbf{x}^T\boldsymbol{\beta}$$

Where:
- $\mathbf{x} = [1, x_1, x_2, \ldots, x_p]^T$ is the **augmented predictor vector** (including the intercept term)
- $\boldsymbol{\beta} = [\beta_0, \beta_1, \beta_2, \ldots, \beta_p]^T$ is the **parameter vector**
- $\eta$ is a **scalar** representing the linear predictor for this one observation

The relationship to the natural parameter is:

$$\eta = \mathbf{x}^T\boldsymbol{\beta} = \theta$$

When using the canonical link, $g(\mu) = \theta$, so the link function directly maps the mean to this linear predictor.


### The Matrix Perspective: Multiple Observations

When we have $n$ observations, we can organize all the data and calculations into matrices:

$$\boldsymbol{\eta} = \mathbf{X}\boldsymbol{\beta}$$

Where:
- $\boldsymbol{\eta} \in \mathbb{R}^{n \times 1}$ is a **vector of linear predictors**, one for each observation
- $\mathbf{X} \in \mathbb{R}^{n \times (p+1)}$ is the **design matrix**, with each row representing one observation
- $\boldsymbol{\beta} \in \mathbb{R}^{(p+1) \times 1}$ is the **parameter vector** (same as before)


### Building the Design Matrix

The design matrix $\mathbf{X}$ is constructed by stacking the augmented predictor vectors for all $n$ observations:

$$\mathbf{X} = \begin{bmatrix}
1 & x_{11} & x_{12} & \cdots & x_{1p} \\
1 & x_{21} & x_{22} & \cdots & x_{2p} \\
1 & x_{31} & x_{32} & \cdots & x_{3p} \\
\vdots & \vdots & \vdots & \ddots & \vdots \\
1 & x_{n1} & x_{n2} & \cdots & x_{np}
\end{bmatrix}$$

**Where:**
- The **first column** is all 1s, corresponding to the intercept term $\beta_0$
- Each **row** represents one observation: $[\mathbf{x}_i]^T = [1, x_{i1}, x_{i2}, \ldots, x_{ip}]$
- Each **column** (after the first) represents one predictor variable across all observations
- The matrix has dimensions $n \times (p+1)$


### Understanding the Matrix-Vector Product

When we compute $\boldsymbol{\eta} = \mathbf{X}\boldsymbol{\beta}$, we're performing:

$$\begin{bmatrix}
\eta_1 \\
\eta_2 \\
\eta_3 \\
\vdots \\
\eta_n
\end{bmatrix} = \begin{bmatrix}
1 & x_{11} & x_{12} & \cdots & x_{1p} \\
1 & x_{21} & x_{22} & \cdots & x_{2p} \\
1 & x_{31} & x_{32} & \cdots & x_{3p} \\
\vdots & \vdots & \vdots & \ddots & \vdots \\
1 & x_{n1} & x_{n2} & \cdots & x_{np}
\end{bmatrix} \begin{bmatrix}
\beta_0 \\
\beta_1 \\
\beta_2 \\
\vdots \\
\beta_p
\end{bmatrix}$$

Each element of $\boldsymbol{\eta}$ is computed as:

$$\eta_i = \beta_0 \cdot 1 + \beta_1 \cdot x_{i1} + \beta_2 \cdot x_{i2} + \cdots + \beta_p \cdot x_{ip} = \sum_{j=0}^{p} \beta_j x_{ij}$$

Where we define $x_{i0} = 1$ for notational convenience.


### Connecting Back to the Natural Parameter

Now we can connect this back to our perspective with the natural parameter.

For each observation $i$, we still have the fundamental relationship:

$$\eta_i = \mathbf{x}_i^T\boldsymbol{\beta} = \theta_i$$

The matrix formulation simply allows us to compute all $n$ linear predictors simultaneously:

$$\boldsymbol{\eta} = \mathbf{X}\boldsymbol{\beta} = \boldsymbol{\theta}$$

Where $\boldsymbol{\theta} = [\theta_1, \theta_2, \ldots, \theta_n]^T$ is the vector of natural parameters for all observations.


### Why Does Matrix Form Matter for Parameter Estimation?

The matrix formulation becomes essential when we want to estimate $\boldsymbol{\beta}$ from data. For the **normal distribution with identity link**, the maximum likelihood estimate is:

$$\hat{\boldsymbol{\beta}} = (\mathbf{X}^T\mathbf{X})^{-1}\mathbf{X}^T\mathbf{y}$$

Where $\mathbf{y} = [y_1, y_2, \ldots, y_n]^T$ is the vector of observed response values.

**Breaking down the components:**
- $\mathbf{X}^T\mathbf{X}$ is a $(p+1) \times (p+1)$ matrix (the **Gram matrix**)
- $\mathbf{X}^T\mathbf{y}$ is a $(p+1) \times 1$ vector (the **moment vector**)
- $(\mathbf{X}^T\mathbf{X})^{-1}$ is the inverse of the Gram matrix (if it exists)

**note:** For **non-canonical links** or **non-normal distributions**, we use iterative methods like **Iterative Reweighted Least Squares (IRLS)**, which also rely on matrix operations. This is out of scope for this blog, but is something we may create a follow-up post on.


### From a Practical Standpoint

Additionally, from a practical standpoint, the transition to matrix formulation doesn't actually change the fundamental GLM structure:

| **GLM Component** | **Scalar Notation** | **Matrix Notation** |
|-------------------|---------------------|---------------------|
| Linear Predictor | $\eta = \mathbf{x}^T\boldsymbol{\beta}$ | $\boldsymbol{\eta} = \mathbf{X}\boldsymbol{\beta}$ |
| Natural Parameter | $\theta = \eta$ | $\boldsymbol{\theta} = \boldsymbol{\eta}$ |
| Link Function | $g(\mu) = \eta$ | $g(\boldsymbol{\mu}) = \boldsymbol{\eta}$ (element-wise) |
| Inverse Link | $\mu = g^{-1}(\eta)$ | $\boldsymbol{\mu} = g^{-1}(\boldsymbol{\eta})$ (element-wise) |

The **distribution** and **link function** choices from the GLM table above apply identically whether we're thinking about one observation (scalar) or many observations (matrix).


### Computational Considerations

And the advantages go beyond simply convenience factors. When we work in modern libraries like NumPy, TensorFlow, etc, we gain the gain the performance advantages of **vectorization**. We also gain the benefit of handling all observations simultaneously through **batch processing** and open the opportunity to apply well-established algorithms for matrix operations, such as QR decomp, SVD, etc.


However, this isn't also without its own drawbacks. If the design matrix $X$ has a very large $n$ number of observations, it can be extensive to load the entire thing into memory. Additionally, if we happen to have a very large $p$, then operations like matrix inversion can be expensive, since inversion is an $O(p^{3}$ operation. We also run the risk of numerical stability, if $X^{T}X$ is ill-conditioned.

Fortunately, there are also many method available to address each of these, but its still important to keep in mind where/how these drawbacks might emerge.

They include the following:

- **regularization**: Using techniques like Ridge and Lasso regression can help improve matrix conditioning.
- **dimensionality reduction:** We can use techniques such as Principle Component Analysis (PCA) to reduce the dimensions when $p$ is large.
- **applying iterative solvers:** Explicity matrix inversion can be avoided with these techniques.
- **sparse matrix representations:** This one is out of scope, but also something that can be investigated in a future post.

### The Hidden Identity: Weight Matrices Across Distributions

There's some other interesting things we should bring attention to. When we work with GLMs at the matrix-level, we can see how the link functions crop up in the diagonal weight matrix.

There's actually an implicit identity matrix $\mathbf{I}_n$ between $\mathbf{X}^T$ and $\mathbf{X}$ for other distributions under the GLM framework we have. Let's make this explicit.

For the **normal distribution with identity link**, the estimation equation we saw:

$$\hat{\boldsymbol{\beta}} = (\mathbf{X}^T\mathbf{X})^{-1}\mathbf{X}^T\mathbf{y}$$

can actually be written more explicitly as:

$$\hat{\boldsymbol{\beta}} = (\mathbf{X}^T\mathbf{I}_n\mathbf{X})^{-1}\mathbf{X}^T\mathbf{I}_n\mathbf{y}$$

Where $\mathbf{I}_n$ is the $n \times n$ identity matrix. This identity matrix represents **equal weighting** of all observations—each data point contributes equally to the parameter estimates.

However, for other distributions in the GLM framework, this identity matrix is replaced by a **weight matrix** $\mathbf{W}^{(t)}$, which accounts for the different variance structures inherent to each distribution:

$$\hat{\boldsymbol{\beta}}^{(t+1)} = (\mathbf{X}^T\mathbf{W}^{(t)}\mathbf{X})^{-1}\mathbf{X}^T\mathbf{W}^{(t)}\mathbf{z}^{(t)}$$

Where:
- $\mathbf{W}^{(t)} = \text{diag}(w_1^{(t)}, w_2^{(t)}, \ldots, w_n^{(t)})$ is an $n \times n$ diagonal **weight matrix** at iteration $t$
- $\mathbf{z}^{(t)}$ is the **working response vector** at iteration $t$ (a transformed version of $\mathbf{y}$)
- The weights $w_i^{(t)}$ depend on the distribution and current parameter estimates $\hat{\boldsymbol{\beta}}^{(t)}$

This is the core of **Iteratively Reweighted Least Squares (IRLS)**.


### Weight Matrices for Common GLM Distributions

The table below shows how the weight matrix changes for different distributions when using their **canonical link functions**:

| **Distribution** | **Canonical Link** | **Weight** $w_i^{(t)}$ | **Variance Function** $V(\mu_i)$ | **Full Estimation Form** |
|------------------|-------------------|------------------|----------------------------------|--------------------------|
| **Normal** | Identity: $\eta = \mu$ | $w_i = 1$ | $V(\mu_i) = 1$ | $\hat{\boldsymbol{\beta}} = (\mathbf{X}^T\mathbf{I}_n\mathbf{X})^{-1}\mathbf{X}^T\mathbf{I}_n\mathbf{y}$ |
| **Binomial** | Logit: $\eta = \ln\left(\frac{\mu}{1-\mu}\right)$ | $w_i^{(t)} = \mu_i^{(t)}(1-\mu_i^{(t)})$ | $V(\mu_i) = \mu_i(1-\mu_i)$ | $\hat{\boldsymbol{\beta}}^{(t+1)} = (\mathbf{X}^T\mathbf{W}^{(t)}\mathbf{X})^{-1}\mathbf{X}^T\mathbf{W}^{(t)}\mathbf{z}^{(t)}$ |
| **Poisson** | Log: $\eta = \ln(\mu)$ | $w_i^{(t)} = \mu_i^{(t)}$ | $V(\mu_i) = \mu_i$ | $\hat{\boldsymbol{\beta}}^{(t+1)} = (\mathbf{X}^T\mathbf{W}^{(t)}\mathbf{X})^{-1}\mathbf{X}^T\mathbf{W}^{(t)}\mathbf{z}^{(t)}$ |
| **Gamma** | Inverse: $\eta = \frac{1}{\mu}$ | $w_i^{(t)} = (\mu_i^{(t)})^2$ | $V(\mu_i) = \mu_i^2$ | $\hat{\boldsymbol{\beta}}^{(t+1)} = (\mathbf{X}^T\mathbf{W}^{(t)}\mathbf{X})^{-1}\mathbf{X}^T\mathbf{W}^{(t)}\mathbf{z}^{(t)}$ |
| **Inverse Gaussian** | Inverse-squared: $\eta = \frac{1}{\mu^2}$ | $w_i^{(t)} = (\mu_i^{(t)})^3$ | $V(\mu_i) = \mu_i^3$ | $\hat{\boldsymbol{\beta}}^{(t+1)} = (\mathbf{X}^T\mathbf{W}^{(t)}\mathbf{X})^{-1}\mathbf{X}^T\mathbf{W}^{(t)}\mathbf{z}^{(t)}$ |

**Key Observations:**

1. **Normal distribution is the exception**: It's the only distribution where $w_i = 1$ for all observations, making the weight matrix simply $\mathbf{I}_n$. This is why ordinary least squares (OLS) works directly without iteration.

2. **Variance function determines weights**: For canonical links, the weight $w_i$ is directly related to the variance function $V(\mu_i)$, which describes how the variance of $Y_i$ depends on its mean $\mu_i$.

3. **Weights depend on current estimates**: Since $w_i^{(t)}$ depends on $\mu_i^{(t)}$ (which depends on $\boldsymbol{\beta}^{(t)}$), we need to estimate $\boldsymbol{\beta}$ iteratively. At each iteration $t$:
   - Use current $\hat{\boldsymbol{\beta}}^{(t)}$ to compute $\hat{\mu}_i^{(t)}$
   - Update weights $w_i^{(t)}$ based on $\hat{\mu}_i^{(t)}$
   - Re-estimate $\boldsymbol{\beta}^{(t+1)}$ using the new weights
   - Repeat until convergence

4. **The working response**: The vector $\mathbf{z}^{(t)}$ is computed at each iteration as:
   $$z_i^{(t)} = \eta_i^{(t)} + (y_i - \mu_i^{(t)}) \frac{d\eta}{d\mu}\bigg|_{\mu=\mu_i^{(t)}}$$
   where $\frac{d\eta}{d\mu}$ is the derivative of the link function.

5. You can also see that the terms in the weight column of the table show the weight entries being a direct representation of their corrseponding link functions. 

### Why Weights Matter: A Conceptual View

The weight matrix $\mathbf{W}^{(t)}$ serves a crucial purpose: **it accounts for heteroscedasticity** (non-constant variance) inherent in different distributions.

**Example: Poisson Regression**

In Poisson regression, the variance equals the mean: $\text{Var}(Y_i) = \mu_i$. This means:
- Observations with large $\mu_i$ have higher variance (more uncertainty)
- Observations with small $\mu_i$ have lower variance (more certainty)

The weight $w_i = \mu_i$ gives **more influence to observations with higher means**, which may seem counterintuitive at first. However, this is exactly right because:
- Higher variance observations need to contribute more to estimation to compensate for their uncertainty
- The weights are inversely proportional to the variance of the **transformed** scale (via the link function)

**Example: Binomial/Bernoulli Regression**

In logistic regression, $\text{Var}(Y_i) = \mu_i(1-\mu_i)$. This means:
- Probabilities near 0 or 1 have low variance (we're very certain)
- Probabilities near 0.5 have high variance (we're less certain)

The weight $w_i = \mu_i(1-\mu_i)$ gives **less influence to extreme probabilities** and **more influence to middle-range probabilities**, which appropriately balances the information each observation provides.


### The Weighted Gram Matrix: $\mathbf{X}^T\mathbf{W}^{(t)}\mathbf{X}$

Let's explicitly see what the weighted Gram matrix looks like using inner product notation. We define the **weighted inner product** as:

$$\langle \mathbf{u}, \mathbf{v} \rangle_{\mathbf{W}} = \sum_{i=1}^n w_i u_i v_i = \mathbf{u}^T\mathbf{W}\mathbf{v}$$

For the **normal distribution** (unweighted case), where $\mathbf{W} = \mathbf{I}_n$:

$$\mathbf{X}^T\mathbf{I}_n\mathbf{X} = \mathbf{X}^T\mathbf{X} = \begin{bmatrix}
n & \langle \mathbf{1}, \mathbf{x}_1 \rangle & \langle \mathbf{1}, \mathbf{x}_2 \rangle & \cdots & \langle \mathbf{1}, \mathbf{x}_p \rangle \\
\langle \mathbf{x}_1, \mathbf{1} \rangle & \langle \mathbf{x}_1, \mathbf{x}_1 \rangle & \langle \mathbf{x}_1, \mathbf{x}_2 \rangle & \cdots & \langle \mathbf{x}_1, \mathbf{x}_p \rangle \\
\langle \mathbf{x}_2, \mathbf{1} \rangle & \langle \mathbf{x}_2, \mathbf{x}_1 \rangle & \langle \mathbf{x}_2, \mathbf{x}_2 \rangle & \cdots & \langle \mathbf{x}_2, \mathbf{x}_p \rangle \\
\vdots & \vdots & \vdots & \ddots & \vdots \\
\langle \mathbf{x}_p, \mathbf{1} \rangle & \langle \mathbf{x}_p, \mathbf{x}_1 \rangle & \langle \mathbf{x}_p, \mathbf{x}_2 \rangle & \cdots & \langle \mathbf{x}_p, \mathbf{x}_p \rangle
\end{bmatrix}$$

Where $\mathbf{1} = [1, 1, \ldots, 1]^T$ is the intercept column and $\mathbf{x}_j = [x_{1j}, x_{2j}, \ldots, x_{nj}]^T$ is the $j$-th predictor column.

For **other distributions** (e.g., Poisson, Binomial), the weighted Gram matrix becomes:

$$\mathbf{X}^T\mathbf{W}^{(t)}\mathbf{X} = \begin{bmatrix}
\langle \mathbf{1}, \mathbf{1} \rangle_{\mathbf{W}^{(t)}} & \langle \mathbf{1}, \mathbf{x}_1 \rangle_{\mathbf{W}^{(t)}} & \langle \mathbf{1}, \mathbf{x}_2 \rangle_{\mathbf{W}^{(t)}} & \cdots & \langle \mathbf{1}, \mathbf{x}_p \rangle_{\mathbf{W}^{(t)}} \\
\langle \mathbf{x}_1, \mathbf{1} \rangle_{\mathbf{W}^{(t)}} & \langle \mathbf{x}_1, \mathbf{x}_1 \rangle_{\mathbf{W}^{(t)}} & \langle \mathbf{x}_1, \mathbf{x}_2 \rangle_{\mathbf{W}^{(t)}} & \cdots & \langle \mathbf{x}_1, \mathbf{x}_p \rangle_{\mathbf{W}^{(t)}} \\
\langle \mathbf{x}_2, \mathbf{1} \rangle_{\mathbf{W}^{(t)}} & \langle \mathbf{x}_2, \mathbf{x}_1 \rangle_{\mathbf{W}^{(t)}} & \langle \mathbf{x}_2, \mathbf{x}_2 \rangle_{\mathbf{W}^{(t)}} & \cdots & \langle \mathbf{x}_2, \mathbf{x}_p \rangle_{\mathbf{W}^{(t)}} \\
\vdots & \vdots & \vdots & \ddots & \vdots \\
\langle \mathbf{x}_p, \mathbf{1} \rangle_{\mathbf{W}^{(t)}} & \langle \mathbf{x}_p, \mathbf{x}_1 \rangle_{\mathbf{W}^{(t)}} & \langle \mathbf{x}_p, \mathbf{x}_2 \rangle_{\mathbf{W}^{(t)}} & \cdots & \langle \mathbf{x}_p, \mathbf{x}_p \rangle_{\mathbf{W}^{(t)}}
\end{bmatrix}$$

The weighted inner product $\langle \mathbf{x}_j, \mathbf{x}_k \rangle_{\mathbf{W}^{(t)}} = \sum_{i=1}^n w_i^{(t)} x_{ij} x_{ik}$ replaces the standard inner product $\langle \mathbf{x}_j, \mathbf{x}_k \rangle = \sum_{i=1}^n x_{ij} x_{ik}$. This fundamentally changes which observations have more influence on the parameter estimates—observations with higher weights $w_i^{(t)}$ contribute more to each element of the Gram matrix.

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



