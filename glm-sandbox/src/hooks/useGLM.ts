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
    isAutoFitting,
    setDataPoints,
    setEstimatedParams,
    setIsGeneratingData,
    setIsAutoFitting,
  } = useAppStore();

  const prevTruthParamsRef = useRef<GLMParameters>(truthParams);
  const prevConfigRef = useRef<GLMConfig>(truthConfig);
  const prevEstimatedParamsRef = useRef<GLMParameters>(estimatedParams);

  const generateData = useCallback(async () => {
    setIsGeneratingData(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newData = glmCalculations.generateData(truthParams, truthConfig, sampleSize);
    setDataPoints(newData);
    setIsGeneratingData(false);
    
    prevTruthParamsRef.current = { ...truthParams };
    prevConfigRef.current = { ...truthConfig };
    prevEstimatedParamsRef.current = { ...estimatedParams };
  }, [truthParams, truthConfig, sampleSize, setDataPoints, setIsGeneratingData]);

  useEffect(() => {
    if (dataPoints.length > 0) {
      const prevTruthParams = prevTruthParamsRef.current;
      const prevEstimatedParams = prevEstimatedParamsRef.current;
      const prevConfig = prevConfigRef.current;
      
      const truthParamsChanged = 
        prevTruthParams.intercept !== truthParams.intercept || 
        prevTruthParams.slope !== truthParams.slope;
      
      const estimatedParamsChanged = 
        prevEstimatedParams.intercept !== estimatedParams.intercept || 
        prevEstimatedParams.slope !== estimatedParams.slope;
      
      const configChanged = 
        prevConfig.distribution !== truthConfig.distribution ||
        prevConfig.linkFunction !== truthConfig.linkFunction;
      
      if (truthParamsChanged || configChanged) {
        const transformedData = dataPoints.map(point => {
          const oldMean = glmCalculations.meanResponse(point.x, prevTruthParams, prevConfig);
          const newMean = glmCalculations.meanResponse(point.x, truthParams, truthConfig);
          
          const offset = point.y - oldMean;
          const newY = newMean + offset;
          
          return { x: point.x, y: newY };
        });
        
        setDataPoints(transformedData);
        
        prevTruthParamsRef.current = { ...truthParams };
        prevConfigRef.current = { ...truthConfig };
      }
      
      if (estimatedParamsChanged && !isAutoFitting) {
        const transformedData = dataPoints.map(point => {
          const oldMean = glmCalculations.meanResponse(point.x, prevEstimatedParams, prevConfig);
          const newMean = glmCalculations.meanResponse(point.x, estimatedParams, truthConfig);
          
          const offset = point.y - oldMean;
          const newY = newMean + offset;
          
          return { x: point.x, y: newY };
        });
        
        setDataPoints(transformedData);
      }
      
      if (estimatedParamsChanged) {
        prevEstimatedParamsRef.current = { ...estimatedParams };
      }
    }
  }, [truthParams, estimatedParams, truthConfig, dataPoints, isAutoFitting, setDataPoints]);

  const autoFit = useCallback(() => {
    if (dataPoints.length === 0 || isAutoFitting) return;
    
    setIsAutoFitting(true);
    
    try {
      const estimated = glmCalculations.estimateParameters(dataPoints, truthConfig);
      
      const safeEstimated = {
        intercept: Math.max(-10, Math.min(10, estimated.intercept)),
        slope: Math.max(-5, Math.min(5, estimated.slope))
      };
      
      setEstimatedParams(safeEstimated);
      
      setTimeout(() => {
        setIsAutoFitting(false);
      }, 1000);
    } catch (error) {
      console.error('Auto-fit failed:', error);
      setIsAutoFitting(false);
    }
  }, [dataPoints, truthConfig, isAutoFitting, setEstimatedParams, setIsAutoFitting]);

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
