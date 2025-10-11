
import { matrixGLMCalculations } from '../lib/glm';
import { MatrixGLMParameters, MatrixGLMConfig, MatrixDataPoint } from '../types';

export function example1_LinearRegression() {
  console.log("=== Example 1: Linear Regression with 2 Predictors ===");
  
  const trueParams: MatrixGLMParameters = {
    beta: [2, 1.5, -0.8]
  };
  
  const config: MatrixGLMConfig = {
    distribution: 'normal',
    linkFunction: 'identity',
    numPredictors: 2
  };
  
  const data = matrixGLMCalculations.generateData(trueParams, config, 100);
  
  const estimatedParams = matrixGLMCalculations.estimateParameters(data, config);
  
  console.log("True parameters:", trueParams.beta);
  console.log("Estimated parameters:", estimatedParams.beta);
  
  const designMatrix = matrixGLMCalculations.createDesignMatrix(data.slice(0, 3));
  console.log("Design matrix (first 3 rows):", designMatrix);
  
  const linearPredictors = data.slice(0, 3).map(point => 
    matrixGLMCalculations.linearPredictor(point.x, trueParams)
  );
  console.log("Linear predictors (first 3):", linearPredictors);
  
  return { trueParams, estimatedParams, data, designMatrix };
}

export function example2_LogisticRegression() {
  console.log("\n=== Example 2: Logistic Regression with 3 Predictors ===");
  
  const trueParams: MatrixGLMParameters = {
    beta: [-1, 2, -1.5, 0.5]
  };
  
  const config: MatrixGLMConfig = {
    distribution: 'bernoulli',
    linkFunction: 'logit',
    numPredictors: 3
  };
  
  const data = matrixGLMCalculations.generateData(trueParams, config, 200);
  
  const estimatedParams = matrixGLMCalculations.estimateParameters(data, config);
  
  console.log("True parameters:", trueParams.beta);
  console.log("Estimated parameters:", estimatedParams.beta);
  
  const probabilities = data.slice(0, 5).map(point => 
    matrixGLMCalculations.meanResponse(point.x, trueParams, config)
  );
  console.log("Probabilities (first 5):", probabilities);
  
  return { trueParams, estimatedParams, data, probabilities };
}

export function example3_PoissonRegression() {
  console.log("\n=== Example 3: Poisson Regression with 2 Predictors ===");
  
  const trueParams: MatrixGLMParameters = {
    beta: [1, 0.5, -0.3]
  };
  
  const config: MatrixGLMConfig = {
    distribution: 'poisson',
    linkFunction: 'log',
    numPredictors: 2
  };
  
  const data = matrixGLMCalculations.generateData(trueParams, config, 150);
  
  const estimatedParams = matrixGLMCalculations.estimateParameters(data, config);
  
  console.log("True parameters:", trueParams.beta);
  console.log("Estimated parameters:", estimatedParams.beta);
  
  const rates = data.slice(0, 5).map(point => 
    matrixGLMCalculations.meanResponse(point.x, trueParams, config)
  );
  console.log("Rates (first 5):", rates);
  
  return { trueParams, estimatedParams, data, rates };
}

export function example4_MatrixOperations() {
  console.log("\n=== Example 4: Matrix Operations Demonstration ===");
  
  const sampleData: MatrixDataPoint[] = [
    { x: [1, 2], y: 5 },
    { x: [2, 3], y: 7 },
    { x: [3, 1], y: 6 }
  ];
  
  const X = matrixGLMCalculations.createDesignMatrix(sampleData);
  console.log("Design matrix X:");
  console.log(X);
  
  const Xt = matrixGLMCalculations.matrixTranspose(X);
  console.log("\nTransposed matrix X^T:");
  console.log(Xt);
  
  const beta = [2, 1.5, -0.8];
  const eta = matrixGLMCalculations.matrixMultiply(X, beta);
  console.log("\nLinear predictors η = X * β:");
  console.log("β =", beta);
  console.log("η =", eta);
  
  console.log("\nVerification (individual calculations):");
  sampleData.forEach((point, i) => {
    const eta_i = matrixGLMCalculations.linearPredictor(point.x, { beta });
    console.log(`η_${i+1} = ${eta_i} (should equal ${eta[i]})`);
  });
  
  return { X, Xt, eta, beta };
}

export function example5_ScalarVsMatrixComparison() {
  console.log("\n=== Example 5: Scalar vs Matrix Form Comparison ===");
  
  const scalarParams = { beta: [2, 1.5] };
  const x_scalar = 3;
  
  const matrixParams = { beta: [2, 1.5] };
  const x_matrix = [3];
  
  const eta_scalar = matrixGLMCalculations.linearPredictor(x_matrix, matrixParams);
  const eta_matrix = matrixGLMCalculations.linearPredictor(x_matrix, matrixParams);
  
  console.log("Scalar calculation: η = β₀ + β₁x₁");
  console.log(`η = ${scalarParams.beta[0]} + ${scalarParams.beta[1]} × ${x_scalar} = ${eta_scalar}`);
  
  console.log("\nMatrix calculation: η = x^T * β");
  console.log(`x = [1, ${x_matrix[0]}]`);
  console.log(`β = [${matrixParams.beta[0]}, ${matrixParams.beta[1]}]`);
  console.log(`η = 1 × ${matrixParams.beta[0]} + ${x_matrix[0]} × ${matrixParams.beta[1]} = ${eta_matrix}`);
  
  console.log(`\nResults are identical: ${eta_scalar === eta_matrix}`);
  
  return { eta_scalar, eta_matrix };
}

export function runAllMatrixExamples() {
  console.log("Matrix GLM Examples - Generalizing from Scalar to Matrix Form");
  console.log("=".repeat(60));
  
  const results = {
    example1: example1_LinearRegression(),
    example2: example2_LogisticRegression(),
    example3: example3_PoissonRegression(),
    example4: example4_MatrixOperations(),
    example5: example5_ScalarVsMatrixComparison()
  };
  
  console.log("\n" + "=".repeat(60));
  console.log("All examples completed successfully!");
  
  return results;
}

export const mathematicalExplanation = `
MATHEMATICAL RELATIONSHIP: Scalar vs Matrix Form

1. SCALAR FORM (1D case):
   η = β₀ + β₁x₁
   
   Where:
   - x₁ is a single predictor value
   - β₀ is the intercept
   - β₁ is the slope coefficient

2. MATRIX FORM (Multi-dimensional case):
   η = X * β
   
   Where:
   - X is the design matrix (n × (p+1))
   - β is the parameter vector ((p+1) × 1)
   - η is the linear predictor vector (n × 1)

3. DESIGN MATRIX CONSTRUCTION:
   X = [1  x₁₁  x₁₂  ...  x₁ₚ]  ← observation 1
       [1  x₂₁  x₂₂  ...  x₂ₚ]  ← observation 2
       [⋮   ⋮    ⋮   ⋱   ⋮  ]  ← ...
       [1  xₙ₁  xₙ₂  ...  xₙₚ]  ← observation n
   
   The first column is all 1s for the intercept term.

4. PARAMETER VECTOR:
   β = [β₀]  ← intercept
       [β₁]  ← coefficient for predictor 1
       [β₂]  ← coefficient for predictor 2
       [⋮ ]  ← ...
       [βₚ]  ← coefficient for predictor p

5. LINEAR PREDICTOR CALCULATION:
   For each observation i:
   ηᵢ = β₀ + β₁xᵢ₁ + β₂xᵢ₂ + ... + βₚxᵢₚ
   
   This is equivalent to:
   ηᵢ = [1, xᵢ₁, xᵢ₂, ..., xᵢₚ] * [β₀, β₁, β₂, ..., βₚ]ᵀ

6. KEY INSIGHT:
   The scalar form is just a special case of the matrix form where:
   - n = 1 (single observation)
   - p = 1 (single predictor)
   - X = [1, x₁]
   - β = [β₀, β₁]
   - η = [η₁]

7. ESTIMATION:
   For normal distribution with identity link:
   β̂ = (X^T X)^(-1) X^T y
   
   This is the matrix form of the normal equations.
`;
