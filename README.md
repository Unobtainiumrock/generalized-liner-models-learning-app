# GLM Learning Sandbox

An interactive web application for learning and visualizing Generalized Linear Models (GLMs).

## Overview

This project provides an interactive sandbox for understanding the mathematical foundations and practical applications of Generalized Linear Models. It features real-time visualizations, interactive controls, and comprehensive educational content covering everything from basic linear regression to advanced matrix formulations and iteratively reweighted least squares.

## Features

- **Interactive Visualizations**: Real-time plots showing distributions, link functions, domain transformations, and weight matrices
- **Multiple Distributions**: Support for Normal, Binomial, Bernoulli, Poisson, Gamma, Exponential, and Beta distributions
- **Link Functions**: Visualize canonical and alternative link functions including Identity, Log, Logit, Probit, and Complementary log-log
- **Matrix Formulation**: Interactive design matrix visualization with dynamic row/column adjustments
- **Educational Content**: Comprehensive blog-style explanations embedded directly in the interface
- **AI Chat Assistant**: Context-aware assistance for navigating the application and understanding GLM concepts

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Visualization**: D3.js
- **Math Rendering**: KaTeX
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Testing**: Vitest

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
cd glm-sandbox
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build

```bash
npm run build
```

### Testing

```bash
npm run test
```

Take the testing with a grain of salt, I didn't thoroughly work with that part. TDD would have slowed us down far too much.

## Project Structure

```
glm-sandbox/
├── src/
│   ├── components/
│   │   ├── charts/         # Visualization components
│   │   ├── blogs/          # Educational content components
│   │   ├── ui/             # UI components
│   │   └── layout/         # Layout components
│   ├── lib/                # GLM calculations and utilities
│   ├── hooks/              # Custom React hooks
│   ├── store/              # State management
│   ├── types/              # TypeScript type definitions
│   └── examples/           # Example GLM configurations
└── docs/                   # Documentation

```

## Documentation

- **[GLM Notes](docs/GLM_NOTES.md)**: Comprehensive mathematical documentation covering GLM theory from exponential families to IRLS
- **[Study Guide](docs/STUDY_GUIDE.md)**: Quick navigation to key GLM concepts with recommended reading order
- **[TODO](docs/TODO.md)**: Project roadmap and pending tasks
- **[Contributing](docs/CONTRIBUTING.md)**: Guidelines for contributors
- **[Git Workflow](docs/GIT_WORKFLOW.md)**: Git workflow and branching strategy

## Authors

- Created as a final project for statistical modeling coursework
- Interactive visualizations and web implementation by the development team

## References

### Core GLM Theory
- [Generalized Linear Model](https://en.wikipedia.org/wiki/Generalized_linear_model)
- [Exponential Family](https://en.wikipedia.org/wiki/Exponential_family)
- [Maximum Likelihood Estimation](https://en.wikipedia.org/wiki/Maximum_likelihood_estimation)
- [Iteratively Reweighted Least Squares](https://en.wikipedia.org/wiki/Iteratively_reweighted_least_squares)

### Link Functions
- [Link Function](https://en.wikipedia.org/wiki/Generalized_linear_model#Link_function)
- [Logit](https://en.wikipedia.org/wiki/Logit)
- [Probit Model](https://en.wikipedia.org/wiki/Probit_model)
- [Complementary Log-Log](https://en.wikipedia.org/wiki/Generalized_linear_model#Complementary_log-log_(cloglog))

### Probability Distributions
- [Normal Distribution](https://en.wikipedia.org/wiki/Normal_distribution)
- [Binomial Distribution](https://en.wikipedia.org/wiki/Binomial_distribution)
- [Bernoulli Distribution](https://en.wikipedia.org/wiki/Bernoulli_distribution)
- [Poisson Distribution](https://en.wikipedia.org/wiki/Poisson_distribution)
- [Gamma Distribution](https://en.wikipedia.org/wiki/Gamma_distribution)
- [Exponential Distribution](https://en.wikipedia.org/wiki/Exponential_distribution)
- [Inverse Gaussian Distribution](https://en.wikipedia.org/wiki/Inverse_Gaussian_distribution)
- [Beta Distribution](https://en.wikipedia.org/wiki/Beta_distribution)

### Linear Algebra and Matrix Methods
- [Design Matrix](https://en.wikipedia.org/wiki/Design_matrix)
- [Gram Matrix](https://en.wikipedia.org/wiki/Gram_matrix)
- [Ordinary Least Squares](https://en.wikipedia.org/wiki/Ordinary_least_squares)
- [Linear Predictor Function](https://en.wikipedia.org/wiki/Linear_predictor_function)

### Statistical Concepts
- [Canonical Link Function](https://en.wikipedia.org/wiki/Generalized_linear_model#Link_function)
- [Variance Function](https://en.wikipedia.org/wiki/Generalized_linear_model#Variance_function)
- [Heteroscedasticity](https://en.wikipedia.org/wiki/Heteroscedasticity)
- [Likelihood Function](https://en.wikipedia.org/wiki/Likelihood_function)

