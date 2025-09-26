export interface GLMParameters {
  intercept: number;
  slope: number;
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
