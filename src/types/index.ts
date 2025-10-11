export interface GLMParameters {
  intercept: number;
  slope: number;
}

export interface MatrixGLMParameters {
  beta: number[];
}

export interface MatrixDataPoint {
  x: number[];
  y: number;
}

export interface MatrixGLMConfig {
  distribution: 'normal' | 'poisson' | 'bernoulli' | 'gamma' | 'negativeBinomial' | 'binomial';
  linkFunction: 'identity' | 'log' | 'logit' | 'inverse' | 'probit' | 'cloglog';
  numPredictors: number;
}

export interface GLMConfig {
  distribution: 'normal' | 'poisson' | 'bernoulli' | 'gamma' | 'negativeBinomial' | 'binomial';
  linkFunction: 'identity' | 'log' | 'logit' | 'inverse' | 'probit' | 'cloglog';
}

export interface DataPoint {
  x: number;
  y: number;
}

export interface GLMState {
  truthParams: GLMParameters;
  truthConfig: GLMConfig;
  
  estimatedParams: GLMParameters;
  
  dataPoints: DataPoint[];
  sampleSize: number;
  
  mode: 'truth' | 'estimation';
  isGeneratingData: boolean;
  
  chatHistory: ChatMessage[];
  isChatOpen: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface GLMError {
  code: 'INVALID_PARAMETERS' | 'ESTIMATION_FAILED' | 'DATA_GENERATION_FAILED' | 'API_ERROR';
  message: string;
  details?: unknown;
}

export interface ChatApiResponse {
  reply: string;
  error?: string;
}

export interface ChatApiRequest {
  message: string;
  history: ChatMessage[];
  context?: {
    currentMode: 'truth' | 'estimation';
    distribution: string;
    linkFunction: string;
  };
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export type D3Selection = d3.Selection<SVGSVGElement, unknown, null, undefined>;
export type D3Scale = d3.ScaleLinear<number, number>;

export interface GLMStateWithErrors extends GLMState {
  error: GLMError | null;
  isLoading: boolean;
}

export interface GLMCalculations {
  linearPredictor: (x: number, params: GLMParameters) => number;
  meanResponse: (x: number, params: GLMParameters, config: GLMConfig) => number;
  generateData: (params: GLMParameters, config: GLMConfig, sampleSize: number) => DataPoint[];
  estimateParameters: (data: DataPoint[], config: GLMConfig) => GLMParameters;
}

export interface MatrixGLMCalculations {
  linearPredictor: (x: number[], params: MatrixGLMParameters) => number;
  meanResponse: (x: number[], params: MatrixGLMParameters, config: MatrixGLMConfig) => number;
  generateData: (params: MatrixGLMParameters, config: MatrixGLMConfig, sampleSize: number) => MatrixDataPoint[];
  estimateParameters: (data: MatrixDataPoint[], config: MatrixGLMConfig) => MatrixGLMParameters;
  createDesignMatrix: (data: MatrixDataPoint[]) => number[][];
  matrixMultiply: (A: number[][], B: number[]) => number[];
  matrixTranspose: (A: number[][]) => number[][];
}
