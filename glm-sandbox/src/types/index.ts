export interface GLMParameters {
  intercept: number;
  slope: number;
}

// Matrix-based GLM interfaces for higher dimensional cases
export interface MatrixGLMParameters {
  beta: number[]; // [β₀, β₁, β₂, ..., βₚ] - includes intercept as first element
}

export interface MatrixDataPoint {
  x: number[]; // [x₁, x₂, ..., xₚ] - predictor values
  y: number;   // response value
}

export interface MatrixGLMConfig {
  distribution: 'normal' | 'poisson' | 'bernoulli';
  linkFunction: 'identity' | 'log' | 'logit';
  numPredictors: number; // number of predictors (excluding intercept)
}

export interface GLMConfig {
  distribution: 'normal' | 'poisson' | 'bernoulli';
  linkFunction: 'identity' | 'log' | 'logit';
}

export interface DataPoint {
  x: number;
  y: number;
}

export interface GLMState {
  // Truth mode parameters
  truthParams: GLMParameters;
  truthConfig: GLMConfig;
  
  // Estimation mode parameters
  estimatedParams: GLMParameters;
  
  // Generated data
  dataPoints: DataPoint[];
  sampleSize: number;
  
  // UI state
  mode: 'truth' | 'estimation';
  isGeneratingData: boolean;
  
  // Chat state
  chatHistory: ChatMessage[];
  isChatOpen: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface GLMCalculations {
  linearPredictor: (x: number, params: GLMParameters) => number;
  meanResponse: (x: number, params: GLMParameters, config: GLMConfig) => number;
  generateData: (params: GLMParameters, config: GLMConfig, sampleSize: number) => DataPoint[];
  estimateParameters: (data: DataPoint[], config: GLMConfig) => GLMParameters;
}

// Matrix-based GLM calculations
export interface MatrixGLMCalculations {
  linearPredictor: (x: number[], params: MatrixGLMParameters) => number;
  meanResponse: (x: number[], params: MatrixGLMParameters, config: MatrixGLMConfig) => number;
  generateData: (params: MatrixGLMParameters, config: MatrixGLMConfig, sampleSize: number) => MatrixDataPoint[];
  estimateParameters: (data: MatrixDataPoint[], config: MatrixGLMConfig) => MatrixGLMParameters;
  // Matrix operations
  createDesignMatrix: (data: MatrixDataPoint[]) => number[][];
  matrixMultiply: (A: number[][], B: number[]) => number[];
  matrixTranspose: (A: number[][]) => number[][];
}
