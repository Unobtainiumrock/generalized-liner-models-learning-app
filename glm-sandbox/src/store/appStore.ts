import { create } from 'zustand';
import { GLMState, GLMParameters, GLMConfig, DataPoint, ChatMessage } from '../types';

interface AppStore extends GLMState {
  // Actions
  setTruthParams: (params: Partial<GLMParameters>) => void;
  setTruthConfig: (config: Partial<GLMConfig>) => void;
  setEstimatedParams: (params: Partial<GLMParameters>) => void;
  setDataPoints: (points: DataPoint[]) => void;
  setSampleSize: (size: number) => void;
  setMode: (mode: 'truth' | 'estimation') => void;
  setIsGeneratingData: (isGenerating: boolean) => void;
  addChatMessage: (message: ChatMessage) => void;
  setChatOpen: (isOpen: boolean) => void;
  resetToDefaults: () => void;
}

const defaultState: GLMState = {
  truthParams: { intercept: 0, slope: 1 },
  truthConfig: { distribution: 'normal', linkFunction: 'identity' },
  estimatedParams: { intercept: 0, slope: 1 },
  dataPoints: [],
  sampleSize: 100,
  mode: 'truth',
  isGeneratingData: false,
  chatHistory: [],
  isChatOpen: false,
};

export const useAppStore = create<AppStore>((set) => ({
  ...defaultState,
  
  setTruthParams: (params) =>
    set((state) => ({
      truthParams: { ...state.truthParams, ...params },
    })),
    
  setTruthConfig: (config) =>
    set((state) => ({
      truthConfig: { ...state.truthConfig, ...config },
    })),
    
  setEstimatedParams: (params) =>
    set((state) => ({
      estimatedParams: { ...state.estimatedParams, ...params },
    })),
    
  setDataPoints: (points) => set({ dataPoints: points }),
  
  setSampleSize: (size) => set({ sampleSize: size }),
  
  setMode: (mode) => set({ mode }),
  
  setIsGeneratingData: (isGenerating) => set({ isGeneratingData: isGenerating }),
  
  addChatMessage: (message) =>
    set((state) => ({
      chatHistory: [...state.chatHistory, message],
    })),
    
  setChatOpen: (isOpen) => set({ isChatOpen: isOpen }),
  
  resetToDefaults: () => set(defaultState),
}));
