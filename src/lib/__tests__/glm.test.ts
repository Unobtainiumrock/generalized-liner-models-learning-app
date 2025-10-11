import { describe, it, expect } from 'vitest'
import { glmCalculations } from '@/lib/glm'
import { GLMParameters, GLMConfig } from '@/types'

describe('GLM Calculations', () => {
  describe('linearPredictor', () => {
    it('should calculate linear predictor correctly', () => {
      const params: GLMParameters = { intercept: 2, slope: 1.5 }
      const result = glmCalculations.linearPredictor(3, params)
      expect(result).toBe(2 + 1.5 * 3)
    })

    it('should handle negative values', () => {
      const params: GLMParameters = { intercept: -1, slope: 0.5 }
      const result = glmCalculations.linearPredictor(-2, params)
      expect(result).toBe(-1 + 0.5 * -2)
    })
  })

  describe('meanResponse', () => {
    it('should calculate identity link correctly', () => {
      const params: GLMParameters = { intercept: 1, slope: 2 }
      const config: GLMConfig = { distribution: 'normal', linkFunction: 'identity' }
      const result = glmCalculations.meanResponse(3, params, config)
      expect(result).toBe(1 + 2 * 3)
    })

    it('should calculate log link correctly', () => {
      const params: GLMParameters = { intercept: 0, slope: 1 }
      const config: GLMConfig = { distribution: 'poisson', linkFunction: 'log' }
      const result = glmCalculations.meanResponse(2, params, config)
      expect(result).toBe(Math.exp(0 + 1 * 2))
    })

    it('should calculate logit link correctly', () => {
      const params: GLMParameters = { intercept: 0, slope: 1 }
      const config: GLMConfig = { distribution: 'bernoulli', linkFunction: 'logit' }
      const result = glmCalculations.meanResponse(0, params, config)
      expect(result).toBe(1 / (1 + Math.exp(-0)))
    })
  })

  describe('generateData', () => {
    it('should generate correct number of data points', () => {
      const params: GLMParameters = { intercept: 0, slope: 1 }
      const config: GLMConfig = { distribution: 'normal', linkFunction: 'identity' }
      const data = glmCalculations.generateData(params, config, 100)
      expect(data).toHaveLength(100)
    })

    it('should generate data within expected range', () => {
      const params: GLMParameters = { intercept: 0, slope: 1 }
      const config: GLMConfig = { distribution: 'normal', linkFunction: 'identity' }
      const data = glmCalculations.generateData(params, config, 1000)
      
      data.forEach(point => {
        expect(point.x).toBeGreaterThanOrEqual(-5)
        expect(point.x).toBeLessThanOrEqual(5)
      })
    })
  })

  describe('estimateParameters', () => {
    it('should estimate parameters for normal distribution with identity link', () => {
      const data = [
        { x: 0, y: 1 },
        { x: 1, y: 3 },
        { x: 2, y: 5 },
        { x: 3, y: 7 }
      ]
      const config: GLMConfig = { distribution: 'normal', linkFunction: 'identity' }
      const result = glmCalculations.estimateParameters(data, config)
      
      expect(result.intercept).toBeCloseTo(1, 1)
      expect(result.slope).toBeCloseTo(2, 1)
    })

    it('should throw error for empty data', () => {
      const config: GLMConfig = { distribution: 'normal', linkFunction: 'identity' }
      expect(() => glmCalculations.estimateParameters([], config)).toThrow('Cannot estimate parameters with no data')
    })

    it('should throw error for insufficient variation in X', () => {
      const data = [
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 1, y: 3 }
      ]
      const config: GLMConfig = { distribution: 'normal', linkFunction: 'identity' }
      expect(() => glmCalculations.estimateParameters(data, config)).toThrow('insufficient variation in X')
    })
  })

  describe('input validation', () => {
    it('should validate sample size in generateData', () => {
      const params: GLMParameters = { intercept: 0, slope: 1 }
      const config: GLMConfig = { distribution: 'normal', linkFunction: 'identity' }
      
      expect(() => glmCalculations.generateData(params, config, 0)).toThrow('Sample size must be a positive integer')
      expect(() => glmCalculations.generateData(params, config, -1)).toThrow('Sample size must be a positive integer')
      expect(() => glmCalculations.generateData(params, config, 1.5)).toThrow('Sample size must be a positive integer')
      expect(() => glmCalculations.generateData(params, config, 10001)).toThrow('Sample size cannot exceed 10,000')
    })

    it('should validate distribution parameters', () => {
      expect(() => glmCalculations.generateData({ intercept: 0, slope: 1 }, { distribution: 'poisson', linkFunction: 'log' }, 10)).not.toThrow()
      expect(() => glmCalculations.generateData({ intercept: 0, slope: 1 }, { distribution: 'bernoulli', linkFunction: 'logit' }, 10)).not.toThrow()
    })
  })

  describe('edge cases', () => {
    it('should handle extreme parameter values', () => {
      const params: GLMParameters = { intercept: 1000, slope: -1000 }
      const config: GLMConfig = { distribution: 'normal', linkFunction: 'identity' }
      const data = glmCalculations.generateData(params, config, 10)
      
      expect(data).toHaveLength(10)
      data.forEach(point => {
        expect(isFinite(point.x)).toBe(true)
        expect(isFinite(point.y)).toBe(true)
      })
    })

    it('should handle zero mean for Poisson', () => {
      const params: GLMParameters = { intercept: -100, slope: 0 }
      const config: GLMConfig = { distribution: 'poisson', linkFunction: 'log' }
      const data = glmCalculations.generateData(params, config, 10)
      
      expect(data).toHaveLength(10)
      data.forEach(point => {
        expect(point.y).toBeGreaterThanOrEqual(0)
        expect(Number.isInteger(point.y)).toBe(true)
      })
    })
  })
})
