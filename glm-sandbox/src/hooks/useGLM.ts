import { useCallback } from 'react';
import { useAppStore } from '../store/appStore';
import { glmCalculations } from '../lib/glm';

export const useGLM = () => {
  const {
    truthParams,
    truthConfig,
    estimatedParams,
    dataPoints,
    sampleSize,
    setDataPoints,
    setEstimatedParams,
    setIsGeneratingData,
  } = useAppStore();

  const generateData = useCallback(async () => {
    setIsGeneratingData(true);
    
    // Simulate some processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newData = glmCalculations.generateData(truthParams, truthConfig, sampleSize);
    setDataPoints(newData);
    setIsGeneratingData(false);
  }, [truthParams, truthConfig, sampleSize, setDataPoints, setIsGeneratingData]);

  const autoFit = useCallback(() => {
    if (dataPoints.length === 0) return;
    
    const estimated = glmCalculations.estimateParameters(dataPoints, truthConfig);
    setEstimatedParams(estimated);
  }, [dataPoints, truthConfig, setEstimatedParams]);

  const calculateLinearPredictor = useCallback((x: number, params = truthParams) => {
    return glmCalculations.linearPredictor(x, params);
  }, [truthParams]);

  const calculateMeanResponse = useCallback((x: number, params = truthParams) => {
    return glmCalculations.meanResponse(x, params, truthConfig);
  }, [truthParams, truthConfig]);

  return {
    generateData,
    autoFit,
    calculateLinearPredictor,
    calculateMeanResponse,
    dataPoints,
    truthParams,
    estimatedParams,
    truthConfig,
  };
};
