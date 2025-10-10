# GLM Study Template

This template provides quick navigation to key concepts in the GLM framework. We can use this to reference the primary math-heavy doc (the one that builds from the exponential family to higher dimensions and finally iterative weighted least squares algorithm)

## Core GLM Components

### 1. Understanding the Three Components
- [The Random Component (𝒟)](GLM_NOTES.md#the-random-component-mathcald)
- [Systematic Component (η or S)](GLM_NOTES.md#systematic-component-eta-or-s)
- [Link Function (ℒ)](GLM_NOTES.md#link-function-mathcall)

### 2. Designing Link Functions
- [3-Step Process for Designing Link Functions](GLM_NOTES.md#a-3-step-process-for-designing-a-link-function)
- [Step 1: Identify the Domain](GLM_NOTES.md#a-3-step-process-for-designing-a-link-function)
- [Step 2: Find a Transformation](GLM_NOTES.md#a-3-step-process-for-designing-a-link-function)
- [Step 3: Verify Monotonicity and Differentiability](GLM_NOTES.md#a-3-step-process-for-designing-a-link-function)

## Exponential Family Framework

### Natural Parameters
- [Characteristics of the Exponential Family Form](GLM_NOTES.md#characteristics-of-the-exponential-family-form-and-the-natural-prameter)
- [Example: Deriving the Poisson Link Function](GLM_NOTES.md#example-deriving-the-poisson-link-function)
- [Reconciling the Two Perspectives](GLM_NOTES.md#reconciling-the-two-perspectives)
- [Examples of Convergence](GLM_NOTES.md#examples-of-convergence)

## Reference Tables

### Complete GLM Framework
- [GLM Table (Distribution, Link, Type)](GLM_NOTES.md#glm-table)

## Matrix Formulation

### Transitioning from Scalar to Matrix View
- [Transition to Matrix Formulation](GLM_NOTES.md#transition-to-matrix-formulation)
- [From Single to Multiple Observations](GLM_NOTES.md#from-single-observation-to-multiple-observations)
- [The Scalar Perspective](GLM_NOTES.md#the-scalar-perspective-single-observation)
- [The Matrix Perspective](GLM_NOTES.md#the-matrix-perspective-multiple-observations)
- [Building the Design Matrix](GLM_NOTES.md#building-the-design-matrix)

### Parameter Estimation
- [Why Matrix Form Matters](GLM_NOTES.md#why-does-matrix-form-matter-for-parameter-estimation)
- [Weight Matrices Across Distributions](GLM_NOTES.md#the-hidden-identity-weight-matrices-across-distributions)
- [Weight Matrices for Common GLM Distributions](GLM_NOTES.md#weight-matrices-for-common-glm-distributions)
- [Why Weights Matter: A Conceptual View](GLM_NOTES.md#why-weights-matter-a-conceptual-view)

### Advanced Matrix Topics
- [The Weighted Gram Matrix](GLM_NOTES.md#the-weighted-gram-matrix-mathbfxtmathbfwtmathbfx)
- [Computational Considerations](GLM_NOTES.md#computational-considerations)

## Study Flow

### Recommended Reading Order
1. Start with [The Random Component](GLM_NOTES.md#the-random-component-mathcald)
2. Understand [Link Functions](GLM_NOTES.md#link-function-mathcall)
3. Deep dive into [Exponential Family characteristics](GLM_NOTES.md#characteristics-of-the-exponential-family-form-and-the-natural-prameter)
4. Review the [Complete GLM Table](GLM_NOTES.md#glm-table)
5. Transition to [Matrix Formulation](GLM_NOTES.md#transition-to-matrix-formulation)
6. Study [Weight Matrices](GLM_NOTES.md#weight-matrices-for-common-glm-distributions)

## Quick Reference

### Key Mathematical Relationships
- Natural parameter connection: See [here](GLM_NOTES.md#characteristics-of-the-exponential-family-form-and-the-natural-prameter)
- Design matrix construction: See [here](GLM_NOTES.md#building-the-design-matrix)
- IRLS framework: See [here](GLM_NOTES.md#the-hidden-identity-weight-matrices-across-distributions)

### Practical Considerations
- [Computational drawbacks and solutions](GLM_NOTES.md#computational-considerations)

---

## Notes

This template serves as a navigation hub for [GLM_NOTES.md](GLM_NOTES.md). Click any link to jump directly to that section in the notes document.

