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
  const prevParamsRef = useRef<GLMParameters>(truthParams);
  const prevConfigRef = useRef<GLMConfig>(truthConfig);

  const generateData = useCallback(async () => {
    setIsGeneratingData(true);
    
    // Simulate some processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newData = glmCalculations.generateData(truthParams, truthConfig, sampleSize);
    setDataPoints(newData);
    setIsGeneratingData(false);
    
    // Update refs after generating new data
    prevParamsRef.current = { ...truthParams };
    prevConfigRef.current = { ...truthConfig };
  }, [truthParams, truthConfig, sampleSize, setDataPoints, setIsGeneratingData]);

  // Transform existing data points when truth parameters change
  // This ensures data points move with the truth line while maintaining their relative positions
  useEffect(() => {
    if (dataPoints.length > 0) {
      const prevParams = prevParamsRef.current;
      const prevConfig = prevConfigRef.current;
      
      // Check if parameters actually changed
      const paramsChanged = 
        prevParams.intercept !== truthParams.intercept || 
        prevParams.slope !== truthParams.slope ||
        prevConfig.distribution !== truthConfig.distribution ||
        prevConfig.linkFunction !== truthConfig.linkFunction;
      
      if (paramsChanged) {
        // Transform existing data points to follow the new truth line
        const transformedData = dataPoints.map(point => {
          const oldMean = glmCalculations.meanResponse(point.x, prevParams, prevConfig);
          const newMean = glmCalculations.meanResponse(point.x, truthParams, truthConfig);
          
          // Calculate the offset from the old mean and apply it to the new mean
          const offset = point.y - oldMean;
          const newY = newMean + offset;
          
          return { x: point.x, y: newY };
        });
        
        setDataPoints(transformedData);
        
        // Update refs
        prevParamsRef.current = { ...truthParams };
        prevConfigRef.current = { ...truthConfig };
      }
    }
  }, [truthParams, truthConfig, dataPoints, setDataPoints]);

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
