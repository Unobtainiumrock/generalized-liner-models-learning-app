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

// Link functions
const inverseLinkFunctions = {
  identity: (x: number) => x,
  log: (x: number) => Math.exp(x),
  logit: (x: number) => 1 / (1 + Math.exp(-x)),
};

// Random number generators
const randomGenerators = {
  normal: (mean: number, variance: number = 1) => {
    // Box-Muller transform for normal distribution
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + Math.sqrt(variance) * z0;
  },
  
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
  
  bernoulli: (p: number) => Math.random() < p ? 1 : 0,
};

export const glmCalculations: GLMCalculations = {
  linearPredictor: (x: number, params: GLMParameters) => {
    return params.intercept + params.slope * x;
  },
  
  meanResponse: (x: number, params: GLMParameters, config: GLMConfig) => {
    const eta = glmCalculations.linearPredictor(x, params);
    const inverseLink = inverseLinkFunctions[config.linkFunction];
    return inverseLink(eta);
  },
  
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
        default:
          y = mean;
      }
      
      data.push({ x, y });
    }
    
    return data;
  },
  
  estimateParameters: (data: DataPoint[], config: GLMConfig): GLMParameters => {
    // Simple linear regression for normal distribution with identity link
    if (config.distribution === 'normal' && config.linkFunction === 'identity') {
      const n = data.length;
      const sumX = data.reduce((sum, point) => sum + point.x, 0);
      const sumY = data.reduce((sum, point) => sum + point.y, 0);
      const sumXY = data.reduce((sum, point) => sum + point.x * point.y, 0);
      const sumXX = data.reduce((sum, point) => sum + point.x * point.x, 0);
      
      const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;
      
      return { intercept, slope };
    }
    
    // For other distributions, use a simple approximation
    // In a real implementation, you'd use maximum likelihood estimation
    const xValues = data.map(point => point.x);
    const yValues = data.map(point => point.y);
    
    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);
    
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
