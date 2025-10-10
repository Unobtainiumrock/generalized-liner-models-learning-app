import { 
  GLMParameters, 
  GLMConfig, 
  DataPoint, 
  GLMCalculations,
  MatrixGLMParameters,
  MatrixGLMConfig,
  MatrixDataPoint,
  MatrixGLMCalculations
} from '../types';

/**
 * Inverse link functions for GLM transformations
 * These functions transform the linear predictor η to the mean response μ
 */
const inverseLinkFunctions = {
  /** Identity link: μ = η (used for normal distribution) */
  identity: (x: number) => x,
  /** Log link: μ = exp(η) (used for Poisson distribution) */
  log: (x: number) => Math.exp(x),
  /** Logit link: μ = 1/(1 + exp(-η)) (used for Bernoulli distribution) */
  logit: (x: number) => 1 / (1 + Math.exp(-x)),
  /** Inverse link: μ = 1/η (used for gamma distribution) */
  inverse: (x: number) => 1 / x,
  /** Probit link: μ = Φ(η) where Φ is the standard normal CDF */
  probit: (x: number) => {
    // Approximation of standard normal CDF
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;
    
    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x) / Math.sqrt(2.0);
    
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    
    return 0.5 * (1.0 + sign * y);
  },
  /** Complementary log-log link: μ = 1 - exp(-exp(η)) */
  cloglog: (x: number) => 1 - Math.exp(-Math.exp(x)),
};

/**
 * Random number generators for different probability distributions
 * Used to generate synthetic data from GLM models
 */
const randomGenerators = {
  /**
   * Generate random number from normal distribution using Box-Muller transform
   * @param mean - Mean of the distribution
   * @param variance - Variance of the distribution (default: 1)
   * @returns Random number from N(mean, variance)
   */
  normal: (mean: number, variance: number = 1) => {
    // Box-Muller transform for normal distribution
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + Math.sqrt(variance) * z0;
  },
  
  /**
   * Generate random number from Poisson distribution using Knuth's algorithm
   * @param lambda - Rate parameter (mean and variance)
   * @returns Random number from Poisson(λ)
   */
  poisson: (lambda: number) => {
    // Knuth's algorithm for Poisson distribution
    const L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    
    do {
      k++;
      p *= Math.random();
    } while (p > L);
    
    return k - 1;
  },
  
  /**
   * Generate random number from Bernoulli distribution
   * @param p - Probability of success
   * @returns 1 with probability p, 0 with probability (1-p)
   */
  bernoulli: (p: number) => Math.random() < p ? 1 : 0,
  
  /**
   * Generate random number from Gamma distribution using shape-scale parameterization
   * @param shape - Shape parameter (α)
   * @param scale - Scale parameter (θ)
   * @returns Random number from Gamma(α, θ)
   */
  gamma: (shape: number, scale: number = 1): number => {
    // Marsaglia and Tsang's method
    if (shape < 1) {
      // Use transformation for shape < 1
      return randomGenerators.gamma(shape + 1, scale) * Math.pow(Math.random(), 1 / shape);
    }
    
    const d = shape - 1 / 3;
    const c = 1 / Math.sqrt(9 * d);
    
    let x: number, v: number, u: number;
    do {
      do {
        x = randomGenerators.normal(0, 1);
        v = 1 + c * x;
      } while (v <= 0);
      
      v = v * v * v;
      u = Math.random();
      
      if (u < 1 - 0.0331 * (x * x) * (x * x)) {
        return d * v * scale;
      }
    } while (Math.log(u) >= 0.5 * x * x + d * (1 - v + Math.log(v)));
    
    return d * v * scale;
  },
  
  /**
   * Generate random number from Negative Binomial distribution
   * @param r - Number of failures until stopping
   * @param p - Probability of success
   * @returns Random number from NB(r, p)
   */
  negativeBinomial: (r: number, p: number) => {
    // Generate as sum of r geometric random variables
    let sum = 0;
    for (let i = 0; i < r; i++) {
      sum += Math.floor(Math.log(Math.random()) / Math.log(1 - p)) + 1;
    }
    return sum;
  },
  
  /**
   * Generate random number from Binomial distribution
   * @param n - Number of trials
   * @param p - Probability of success
   * @returns Random number from Binomial(n, p)
   */
  binomial: (n: number, p: number) => {
    let successes = 0;
    for (let i = 0; i < n; i++) {
      if (Math.random() < p) {
        successes++;
      }
    }
    return successes;
  },
};

/**
 * GLM calculation functions for single-predictor models
 * Implements the core mathematical operations for Generalized Linear Models
 */
export const glmCalculations: GLMCalculations = {
  /**
   * Calculate the linear predictor η = β₀ + β₁x
   * @param x - Predictor value
   * @param params - GLM parameters (intercept β₀, slope β₁)
   * @returns Linear predictor value η
   */
  linearPredictor: (x: number, params: GLMParameters) => {
    return params.intercept + params.slope * x;
  },
  
  /**
   * Calculate the mean response μ = g⁻¹(η) where g is the link function
   * @param x - Predictor value
   * @param params - GLM parameters
   * @param config - GLM configuration (distribution and link function)
   * @returns Mean response value μ
   */
  meanResponse: (x: number, params: GLMParameters, config: GLMConfig) => {
    const eta = glmCalculations.linearPredictor(x, params);
    const inverseLink = inverseLinkFunctions[config.linkFunction];
    return inverseLink(eta);
  },
  
  /**
   * Generate synthetic data from a GLM model
   * @param params - True GLM parameters
   * @param config - GLM configuration (distribution and link function)
   * @param sampleSize - Number of data points to generate
   * @returns Array of generated data points
   */
  generateData: (params: GLMParameters, config: GLMConfig, sampleSize: number): DataPoint[] => {
    const data: DataPoint[] = [];
    const xMin = -5;
    const xMax = 5;
    
    for (let i = 0; i < sampleSize; i++) {
      const x = xMin + (xMax - xMin) * Math.random();
      const mean = glmCalculations.meanResponse(x, params, config);
      
      let y: number;
      switch (config.distribution) {
        case 'normal':
          y = randomGenerators.normal(mean, 1);
          break;
        case 'poisson':
          y = randomGenerators.poisson(Math.max(mean, 0.1));
          break;
        case 'bernoulli':
          y = randomGenerators.bernoulli(Math.max(0, Math.min(1, mean)));
          break;
        case 'gamma':
          // For gamma, mean = shape * scale, so shape = mean / scale
          const gammaShape = Math.max(mean / 1, 0.1); // scale = 1
          y = randomGenerators.gamma(gammaShape, 1);
          break;
        case 'negativeBinomial':
          // For negative binomial, mean = r * p / (1-p), variance = r * p / (1-p)^2
          // Using r = 5, solve for p: p = mean / (mean + r)
          const nbR = 5;
          const nbP = Math.max(0.01, Math.min(0.99, mean / (mean + nbR)));
          y = randomGenerators.negativeBinomial(nbR, nbP);
          break;
        case 'binomial':
          // For binomial, mean = n * p, so p = mean / n
          const binN = 10; // fixed number of trials
          const binP = Math.max(0, Math.min(1, mean / binN));
          y = randomGenerators.binomial(binN, binP);
          break;
        default:
          y = mean;
      }
      
      data.push({ x, y });
    }
    
    return data;
  },
  
  /**
   * Estimate GLM parameters from data using appropriate method
   * @param data - Array of observed data points
   * @param config - GLM configuration (distribution and link function)
   * @returns Estimated GLM parameters
   * @throws Error if data is empty or has insufficient variation
   */
  estimateParameters: (data: DataPoint[], config: GLMConfig): GLMParameters => {
    if (data.length === 0) {
      throw new Error('Cannot estimate parameters with no data');
    }

    // Simple linear regression for normal distribution with identity link
    if (config.distribution === 'normal' && config.linkFunction === 'identity') {
      const n = data.length;
      const sumX = data.reduce((sum, point) => sum + point.x, 0);
      const sumY = data.reduce((sum, point) => sum + point.y, 0);
      const sumXY = data.reduce((sum, point) => sum + point.x * point.y, 0);
      const sumXX = data.reduce((sum, point) => sum + point.x * point.x, 0);
      
      const denominator = n * sumXX - sumX * sumX;
      if (Math.abs(denominator) < 1e-10) {
        throw new Error('Cannot estimate parameters: insufficient variation in X');
      }
      
      const slope = (n * sumXY - sumX * sumY) / denominator;
      const intercept = (sumY - slope * sumX) / n;
      
      return { intercept, slope };
    }
    
    // For Poisson distribution with log link, use simple approximation
    if (config.distribution === 'poisson' && config.linkFunction === 'log') {
      // Transform y to log scale and fit linear regression
      const logY = data.map(point => Math.log(Math.max(point.y, 0.1)));
      const n = data.length;
      const sumX = data.reduce((sum, point) => sum + point.x, 0);
      const sumLogY = logY.reduce((sum, y) => sum + y, 0);
      const sumXLogY = data.reduce((sum, point, i) => sum + point.x * logY[i], 0);
      const sumXX = data.reduce((sum, point) => sum + point.x * point.x, 0);
      
      const denominator = n * sumXX - sumX * sumX;
      if (Math.abs(denominator) < 1e-10) {
        throw new Error('Cannot estimate parameters: insufficient variation in X');
      }
      
      const slope = (n * sumXLogY - sumX * sumLogY) / denominator;
      const intercept = (sumLogY - slope * sumX) / n;
      
      return { intercept, slope };
    }
    
    // For Bernoulli distribution with logit link, use simple approximation
    if (config.distribution === 'bernoulli' && config.linkFunction === 'logit') {
      // Transform y to logit scale and fit linear regression
      const logitY = data.map(point => {
        const p = Math.max(0.01, Math.min(0.99, point.y));
        return Math.log(p / (1 - p));
      });
      const n = data.length;
      const sumX = data.reduce((sum, point) => sum + point.x, 0);
      const sumLogitY = logitY.reduce((sum, y) => sum + y, 0);
      const sumXLogitY = data.reduce((sum, point, i) => sum + point.x * logitY[i], 0);
      const sumXX = data.reduce((sum, point) => sum + point.x * point.x, 0);
      
      const denominator = n * sumXX - sumX * sumX;
      if (Math.abs(denominator) < 1e-10) {
        throw new Error('Cannot estimate parameters: insufficient variation in X');
      }
      
      const slope = (n * sumXLogitY - sumX * sumLogitY) / denominator;
      const intercept = (sumLogitY - slope * sumX) / n;
      
      return { intercept, slope };
    }
    
    // Fallback: use simple linear approximation
    const xValues = data.map(point => point.x);
    const yValues = data.map(point => point.y);
    
    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);
    
    if (xMax === xMin) {
      throw new Error('Cannot estimate parameters: no variation in X values');
    }
    
    const slope = (yMax - yMin) / (xMax - xMin);
    const intercept = yMin - slope * xMin;
    
    return { intercept, slope };
  },
};

// Matrix-based GLM implementation
export const matrixGLMCalculations: MatrixGLMCalculations = {
  // Linear predictor: η = x^T * β = β₀ + β₁x₁ + β₂x₂ + ... + βₚxₚ
  linearPredictor: (x: number[], params: MatrixGLMParameters): number => {
    if (x.length !== params.beta.length - 1) {
      throw new Error(`Dimension mismatch: x has ${x.length} predictors but β has ${params.beta.length - 1} coefficients`);
    }
    
    // x_augmented = [1, x₁, x₂, ..., xₚ] (add intercept term)
    const xAugmented = [1, ...x];
    
    // η = x_augmented^T * β
    let eta = 0;
    for (let i = 0; i < xAugmented.length; i++) {
      eta += xAugmented[i] * params.beta[i];
    }
    
    return eta;
  },
  
  // Mean response: μ = g⁻¹(η) where g is the link function
  meanResponse: (x: number[], params: MatrixGLMParameters, config: MatrixGLMConfig): number => {
    const eta = matrixGLMCalculations.linearPredictor(x, params);
    const inverseLink = inverseLinkFunctions[config.linkFunction];
    return inverseLink(eta);
  },
  
  // Generate data using matrix formulation
  generateData: (params: MatrixGLMParameters, config: MatrixGLMConfig, sampleSize: number): MatrixDataPoint[] => {
    const data: MatrixDataPoint[] = [];
    const numPredictors = config.numPredictors;
    
    for (let i = 0; i < sampleSize; i++) {
      // Generate random predictor values
      const x: number[] = [];
      for (let j = 0; j < numPredictors; j++) {
        x.push(-5 + 10 * Math.random()); // Random values between -5 and 5
      }
      
      const mean = matrixGLMCalculations.meanResponse(x, params, config);
      
      let y: number;
      switch (config.distribution) {
        case 'normal':
          y = randomGenerators.normal(mean, 1);
          break;
        case 'poisson':
          y = randomGenerators.poisson(Math.max(mean, 0.1));
          break;
        case 'bernoulli':
          y = randomGenerators.bernoulli(Math.max(0, Math.min(1, mean)));
          break;
        default:
          y = mean;
      }
      
      data.push({ x, y });
    }
    
    return data;
  },
  
  // Create design matrix X from data
  createDesignMatrix: (data: MatrixDataPoint[]): number[][] => {
    return data.map(point => [1, ...point.x]); // Add intercept column
  },
  
  // Matrix-vector multiplication: A * b
  matrixMultiply: (A: number[][], b: number[]): number[] => {
    if (A[0].length !== b.length) {
      throw new Error(`Dimension mismatch: A has ${A[0].length} columns but b has ${b.length} elements`);
    }
    
    return A.map(row => {
      let sum = 0;
      for (let i = 0; i < row.length; i++) {
        sum += row[i] * b[i];
      }
      return sum;
    });
  },
  
  // Matrix transpose
  matrixTranspose: (A: number[][]): number[][] => {
    if (A.length === 0) return [];
    
    const rows = A.length;
    const cols = A[0].length;
    const result: number[][] = [];
    
    for (let j = 0; j < cols; j++) {
      result[j] = [];
      for (let i = 0; i < rows; i++) {
        result[j][i] = A[i][j];
      }
    }
    
    return result;
  },
  
  // Estimate parameters using matrix formulation
  estimateParameters: (data: MatrixDataPoint[], config: MatrixGLMConfig): MatrixGLMParameters => {
    const n = data.length;
    const p = config.numPredictors;
    
    // Create design matrix X (n × (p+1))
    const X = matrixGLMCalculations.createDesignMatrix(data);
    
    // Extract response vector y (n × 1)
    const y = data.map(point => point.y);
    
    // For normal distribution with identity link, use OLS: β = (X^T X)^(-1) X^T y
    if (config.distribution === 'normal' && config.linkFunction === 'identity') {
      // X^T X
      const XtX: number[][] = [];
      for (let i = 0; i <= p; i++) {
        XtX[i] = [];
        for (let j = 0; j <= p; j++) {
          let sum = 0;
          for (let k = 0; k < n; k++) {
            sum += X[k][i] * X[k][j];
          }
          XtX[i][j] = sum;
        }
      }
      
      // X^T y
      const Xty: number[] = [];
      for (let i = 0; i <= p; i++) {
        let sum = 0;
        for (let k = 0; k < n; k++) {
          sum += X[k][i] * y[k];
        }
        Xty[i] = sum;
      }
      
      // Simple 2x2 case for demonstration (intercept + 1 predictor)
      if (p === 1) {
        const det = XtX[0][0] * XtX[1][1] - XtX[0][1] * XtX[1][0];
        if (Math.abs(det) < 1e-10) {
          throw new Error('Matrix is singular, cannot compute inverse');
        }
        
        const beta0 = (XtX[1][1] * Xty[0] - XtX[0][1] * Xty[1]) / det;
        const beta1 = (XtX[0][0] * Xty[1] - XtX[1][0] * Xty[0]) / det;
        
        return { beta: [beta0, beta1] };
      }
      
      // For higher dimensions, use a simple approximation
      // In practice, you'd implement proper matrix inversion
      const beta: number[] = [];
      for (let i = 0; i <= p; i++) {
        beta[i] = Xty[i] / XtX[i][i]; // Diagonal approximation
      }
      
      return { beta };
    }
    
    // For other distributions, use a simple approximation
    // In practice, you'd use iterative reweighted least squares (IRLS)
    const beta: number[] = [];
    for (let i = 0; i <= p; i++) {
      beta[i] = Math.random() * 2 - 1; // Random initialization
    }
    
    return { beta };
  },
};
