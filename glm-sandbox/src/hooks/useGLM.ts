import { useCallback, useEffect, useRef } from 'react';
import { useAppStore } from '../store/appStore';
import { glmCalculations } from '../lib/glm';
import { GLMParameters, GLMConfig } from '../types';

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

  // Track previous parameters to detect changes
  const prevTruthParamsRef = useRef<GLMParameters>(truthParams);
  const prevConfigRef = useRef<GLMConfig>(truthConfig);
  const prevEstimatedParamsRef = useRef<GLMParameters>(estimatedParams);

  const generateData = useCallback(async () => {
    setIsGeneratingData(true);
    
    // Simulate some processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newData = glmCalculations.generateData(truthParams, truthConfig, sampleSize);
    setDataPoints(newData);
    setIsGeneratingData(false);
    
    // Update refs after generating new data
    prevTruthParamsRef.current = { ...truthParams };
    prevConfigRef.current = { ...truthConfig };
    prevEstimatedParamsRef.current = { ...estimatedParams };
  }, [truthParams, truthConfig, sampleSize, setDataPoints, setIsGeneratingData]);

  // Transform existing data points when parameters change
  // This ensures data points move with the appropriate line while maintaining their relative positions
  useEffect(() => {
    if (dataPoints.length > 0) {
      const prevTruthParams = prevTruthParamsRef.current;
      const prevEstimatedParams = prevEstimatedParamsRef.current;
      const prevConfig = prevConfigRef.current;
      
      // Check if truth parameters changed
      const truthParamsChanged = 
        prevTruthParams.intercept !== truthParams.intercept || 
        prevTruthParams.slope !== truthParams.slope;
      
      // Check if estimated parameters changed
      const estimatedParamsChanged = 
        prevEstimatedParams.intercept !== estimatedParams.intercept || 
        prevEstimatedParams.slope !== estimatedParams.slope;
      
      // Check if config changed
      const configChanged = 
        prevConfig.distribution !== truthConfig.distribution ||
        prevConfig.linkFunction !== truthConfig.linkFunction;
      
      if (truthParamsChanged || estimatedParamsChanged || configChanged) {
        // Transform existing data points to follow the new truth line
        const transformedData = dataPoints.map(point => {
          const oldMean = glmCalculations.meanResponse(point.x, prevTruthParams, prevConfig);
          const newMean = glmCalculations.meanResponse(point.x, truthParams, truthConfig);
          
          // Calculate the offset from the old mean and apply it to the new mean
          const offset = point.y - oldMean;
          const newY = newMean + offset;
          
          return { x: point.x, y: newY };
        });
        
        setDataPoints(transformedData);
        
        // Update refs
        prevTruthParamsRef.current = { ...truthParams };
        prevEstimatedParamsRef.current = { ...estimatedParams };
        prevConfigRef.current = { ...truthConfig };
      }
    }
  }, [truthParams, estimatedParams, truthConfig, dataPoints, setDataPoints]);

  const autoFit = useCallback(() => {
    if (dataPoints.length === 0) return;
    
    const estimated = glmCalculations.estimateParameters(dataPoints, truthConfig);
    setEstimatedParams(estimated);
  }, [dataPoints, truthConfig, setEstimatedParams]);

  const calculateLinearPredictor = useCallback((x: number, params: GLMParameters) => {
    return glmCalculations.linearPredictor(x, params);
  }, []);

  const calculateMeanResponse = useCallback((x: number, params: GLMParameters) => {
    return glmCalculations.meanResponse(x, params, truthConfig);
  }, [truthConfig]);

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
