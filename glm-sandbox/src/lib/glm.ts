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

const inverseLinkFunctions = {
  log: (x: number) => Math.exp(x),
  inverse: (x: number) => 1 / x,
  cloglog: (x: number) => 1 - Math.exp(-Math.exp(x)),
};

const randomGenerators = {
  normal: (mean: number, variance: number = 1) => {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + Math.sqrt(variance) * z0;
  },
  
  poisson: (lambda: number) => {
    if (lambda < 0) {
      throw new Error('Poisson distribution requires non-negative lambda parameter');
    }
    if (lambda === 0) return 0;
    
    const L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    
    do {
      k++;
      p *= Math.random();
    } while (p > L);
    
    return k - 1;
  },
  
  bernoulli: (p: number) => {
    if (p < 0 || p > 1) {
      throw new Error('Bernoulli distribution requires probability p in range [0, 1]');
    }
    return Math.random() < p ? 1 : 0;
  },
  
  gamma: (shape: number, scale: number = 1): number => {
    if (shape <= 0 || scale <= 0) {
      throw new Error('Gamma distribution requires positive shape and scale parameters');
    }
    
    if (shape < 1) {
      return randomGenerators.gamma(shape + 1, scale) * Math.pow(Math.random(), 1 / shape);
    }
    
    const d = shape - 1 / 3;
    const c = 1 / Math.sqrt(9 * d);
    
    let x: number, v: number, u: number;
    let attempts = 0;
    const maxAttempts = 1000;
    
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
      
      attempts++;
      if (attempts > maxAttempts) {
        throw new Error('Gamma generation failed: too many attempts');
      }
    } while (Math.log(u) >= 0.5 * x * x + d * (1 - v + Math.log(v)));
    
    return d * v * scale;
  },
  
  negativeBinomial: (r: number, p: number) => {
    let sum = 0;
    for (let i = 0; i < r; i++) {
      sum += Math.floor(Math.log(Math.random()) / Math.log(1 - p)) + 1;
    }
    return sum;
  },
  
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
    if (sampleSize <= 0 || !Number.isInteger(sampleSize)) {
      throw new Error('Sample size must be a positive integer');
    }
    if (sampleSize > 10000) {
      throw new Error('Sample size cannot exceed 10,000 for performance reasons');
    }
    
    const data: DataPoint[] = [];
    const xMin = -5;
    const xMax = 5;
    
    try {
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
            const gammaShape = Math.max(mean / 1, 0.1);
            y = randomGenerators.gamma(gammaShape, 1);
            break;
          case 'negativeBinomial':
            const nbR = 5;
            const nbP = Math.max(0.01, Math.min(0.99, mean / (mean + nbR)));
            y = randomGenerators.negativeBinomial(nbR, nbP);
            break;
          case 'binomial':
            const binN = 10;
            const binP = Math.max(0, Math.min(1, mean / binN));
            y = randomGenerators.binomial(binN, binP);
            break;
          default:
            y = mean;
        }
        
        if (!isFinite(y)) {
          console.warn(`Generated non-finite value: ${y} for x=${x}, mean=${mean}`);
          y = isNaN(y) ? 0 : (y === Infinity ? 1e6 : -1e6);
        }
        
        data.push({ x, y });
      }
    } catch (error) {
      throw new Error(`Data generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    return data;
  },
  
  estimateParameters: (data: DataPoint[], config: GLMConfig): GLMParameters => {
    if (data.length === 0) {
      throw new Error('Cannot estimate parameters with no data');
    }

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
    
    if (config.distribution === 'poisson' && config.linkFunction === 'log') {
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
    
    if (config.distribution === 'bernoulli' && config.linkFunction === 'logit') {
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

export const matrixGLMCalculations: MatrixGLMCalculations = {
  linearPredictor: (x: number[], params: MatrixGLMParameters): number => {
    if (x.length !== params.beta.length - 1) {
      throw new Error(`Dimension mismatch: x has ${x.length} predictors but β has ${params.beta.length - 1} coefficients`);
    }
    
    const xAugmented = [1, ...x];
    
    let eta = 0;
    for (let i = 0; i < xAugmented.length; i++) {
      eta += xAugmented[i] * params.beta[i];
    }
    
    return eta;
  },
  
  meanResponse: (x: number[], params: MatrixGLMParameters, config: MatrixGLMConfig): number => {
    const eta = matrixGLMCalculations.linearPredictor(x, params);
    const inverseLink = inverseLinkFunctions[config.linkFunction];
    return inverseLink(eta);
  },
  
  generateData: (params: MatrixGLMParameters, config: MatrixGLMConfig, sampleSize: number): MatrixDataPoint[] => {
    const data: MatrixDataPoint[] = [];
    const numPredictors = config.numPredictors;
    
    for (let i = 0; i < sampleSize; i++) {
      const x: number[] = [];
      for (let j = 0; j < numPredictors; j++) {
        x.push(-5 + 10 * Math.random());
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
  
  createDesignMatrix: (data: MatrixDataPoint[]): number[][] => {
    return data.map(point => [1, ...point.x]);
  },
  
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
  
  estimateParameters: (data: MatrixDataPoint[], config: MatrixGLMConfig): MatrixGLMParameters => {
    const n = data.length;
    const p = config.numPredictors;
    
    const X = matrixGLMCalculations.createDesignMatrix(data);
    
    const y = data.map(point => point.y);
    
    if (config.distribution === 'normal' && config.linkFunction === 'identity') {
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
      
      const Xty: number[] = [];
      for (let i = 0; i <= p; i++) {
        let sum = 0;
        for (let k = 0; k < n; k++) {
          sum += X[k][i] * y[k];
        }
        Xty[i] = sum;
      }
      
      if (p === 1) {
        const det = XtX[0][0] * XtX[1][1] - XtX[0][1] * XtX[1][0];
        if (Math.abs(det) < 1e-10) {
          throw new Error('Matrix is singular, cannot compute inverse');
        }
        
        const beta0 = (XtX[1][1] * Xty[0] - XtX[0][1] * Xty[1]) / det;
        const beta1 = (XtX[0][0] * Xty[1] - XtX[1][0] * Xty[0]) / det;
        
        return { beta: [beta0, beta1] };
      }
      
      const beta: number[] = [];
      for (let i = 0; i <= p; i++) {
        beta[i] = Xty[i] / XtX[i][i];
      }
      
      return { beta };
    }
    
    const beta: number[] = [];
    for (let i = 0; i <= p; i++) {
      beta[i] = Math.random() * 2 - 1;
    }
    
    return { beta };
  },
};
