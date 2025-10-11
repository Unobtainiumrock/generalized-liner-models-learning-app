import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GLMState, GLMParameters, GLMConfig, DataPoint, ChatMessage, GLMError, ValidationResult } from '@/types';

interface AppStore extends GLMState {
  // Error and loading states
  error: GLMError | null;
  isLoading: boolean;
  isAutoFitting: boolean;
  
  // Actions
  setTruthParams: (params: Partial<GLMParameters>) => ValidationResult;
  setTruthConfig: (config: Partial<GLMConfig>) => ValidationResult;
  setEstimatedParams: (params: Partial<GLMParameters>) => ValidationResult;
  setDataPoints: (points: DataPoint[]) => void;
  setSampleSize: (size: number) => ValidationResult;
  setMode: (mode: 'truth' | 'estimation') => void;
  setIsGeneratingData: (isGenerating: boolean) => void;
  setIsAutoFitting: (isAutoFitting: boolean) => void;
  addChatMessage: (message: ChatMessage) => void;
  setChatOpen: (isOpen: boolean) => void;
  setError: (error: GLMError | null) => void;
  setLoading: (loading: boolean) => void;
  resetToDefaults: () => void;
  clearError: () => void;
}

// Validation functions
const validateParameters = (params: Partial<GLMParameters>): ValidationResult => {
  const errors: string[] = [];
  
  if (params.intercept !== undefined && (isNaN(params.intercept) || !isFinite(params.intercept))) {
    errors.push('Intercept must be a valid number');
  }
  
  if (params.slope !== undefined && (isNaN(params.slope) || !isFinite(params.slope))) {
    errors.push('Slope must be a valid number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateSampleSize = (size: number): ValidationResult => {
  const errors: string[] = [];
  
  if (!Number.isInteger(size) || size < 1) {
    errors.push('Sample size must be a positive integer');
  }
  
  if (size > 10000) {
    errors.push('Sample size cannot exceed 10,000');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

const defaultState: GLMState = {
  truthParams: { intercept: 0, slope: 1 },
  truthConfig: { distribution: 'normal', linkFunction: 'identity' },
  estimatedParams: { intercept: 0.5, slope: 0.8 }, // Different from truth to make blue line visible
  dataPoints: [],
  sampleSize: 100,
  mode: 'truth',
  isGeneratingData: false,
  chatHistory: [],
  isChatOpen: false,
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      ...defaultState,
      error: null,
      isLoading: false,
      isAutoFitting: false,
      
      setTruthParams: (params) => {
        const validation = validateParameters(params);
        if (validation.isValid) {
          set((state) => ({
            truthParams: { ...state.truthParams, ...params },
            error: null
          }));
        } else {
          set({
            error: {
              code: 'INVALID_PARAMETERS',
              message: validation.errors.join(', '),
              details: params
            }
          });
        }
        return validation;
      },
      
      setTruthConfig: (config) => {
        const validation: ValidationResult = { isValid: true, errors: [] };
        set((state) => ({
          truthConfig: { ...state.truthConfig, ...config },
          error: null
        }));
        return validation;
      },
      
      setEstimatedParams: (params) => {
        const validation = validateParameters(params);
        if (validation.isValid) {
          set((state) => ({
            estimatedParams: { ...state.estimatedParams, ...params },
            error: null
          }));
        } else {
          set({
            error: {
              code: 'INVALID_PARAMETERS',
              message: validation.errors.join(', '),
              details: params
            }
          });
        }
        return validation;
      },
      
      setDataPoints: (points) => set({ dataPoints: points }),
      
      setSampleSize: (size) => {
        const validation = validateSampleSize(size);
        if (validation.isValid) {
          set({ sampleSize: size, error: null });
        } else {
          set({
            error: {
              code: 'INVALID_PARAMETERS',
              message: validation.errors.join(', '),
              details: { sampleSize: size }
            }
          });
        }
        return validation;
      },
      
      setMode: (mode) => set({ mode }),
      
      setIsGeneratingData: (isGenerating) => set({ isGeneratingData: isGenerating }),
      
      setIsAutoFitting: (isAutoFitting) => set({ isAutoFitting }),
      
      addChatMessage: (message) =>
        set((state) => ({
          chatHistory: [...state.chatHistory, message],
        })),
        
      setChatOpen: (isOpen) => set({ isChatOpen: isOpen }),
      
      setError: (error) => set({ error }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      clearError: () => set({ error: null }),
      
      resetToDefaults: () => set({ ...defaultState, error: null, isLoading: false }),
    }),
    {
      name: 'glm-sandbox-storage',
      partialize: (state) => ({
        truthParams: state.truthParams,
        truthConfig: state.truthConfig,
        sampleSize: state.sampleSize,
        mode: state.mode,
      }),
    }
  )
);
