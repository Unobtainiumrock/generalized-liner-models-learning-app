import { GLMParameters, GLMConfig, DataPoint, GLMCalculations } from '../types';

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
