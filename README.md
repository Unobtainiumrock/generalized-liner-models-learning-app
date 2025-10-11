# GLM Learning Sandbox

An interactive web application for learning and visualizing Generalized Linear Models (GLMs).

🚀 **[Live Demo](https://glm-learning.netlify.app)** 🚀

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
├── api/                    # API endpoints
├── public/                 # Static assets
├── docs/                   # Documentation
└── [config files]          # package.json, vite.config.ts, etc.
```

## Documentation

- **[GLM Notes](docs/GLM_NOTES.md)**: Comprehensive mathematical documentation covering GLM theory from exponential families to IRLS
- **[Study Guide](docs/STUDY_GUIDE.md)**: Quick navigation to key GLM concepts with recommended reading order
- **[Contributing](docs/CONTRIBUTING.md)**: Guidelines for contributors
- **[Git Workflow](docs/GIT_WORKFLOW.md)**: Git workflow and branching strategy

## Implementation Notes

During development, we pivoted from the original implementation approach outlined in early project planning documents. The current architecture focuses on a streamlined, blog-integrated educational experience rather than the initially proposed dual-world perspective with separate control panels. As a result, some code artifacts from earlier iterations may remain in the codebase but are not actively used. Future work should include a comprehensive code audit to identify and remove these unused components, ensuring the codebase remains clean and maintainable.

## Future Directions

### Theoretical Extensions

The project currently focuses on canonical link functions, but the world of non-canonical link functions offers a fascinating playground for exploration. 

While we touched on alternatives like Probit and Complementary log-log, we didn't fully integrate the optimization theory that explains why canonical links guarantee unique solutions. 

The key lies in the Hessian matrix (the matrix of second derivatives of the log-likelihood function): canonical link functions ensure this matrix is negative definite, guaranteeing both invertibility and a unique global maximum. 

Non-canonical link functions lack this guarantee, potentially leading to non-invertible Hessian matrices or multiple local maxima. 

Exploring this connection would provide a complete theoretical foundation linking the exponential family structure to the optimization landscape, revealing the beautiful interplay between probability theory and numerical analysis.

### Practical Development

Several enhancements could improve the application's functionality and educational value. Below are a few key areas we really wish we had more time to get around to implementing.

- **Interactive AI Agent Integration**: Develop context-aware endpoints that provide detailed application documentation through the chat interface, enabling both human users and AI agents to navigate features programmatically. This could leverage protocols like MCP (Model Context Protocol) or A2A (Agent-to-Agent) for agentic browser interactions.

- **Enhanced Visualizations**: Add support for additional distributions (Inverse Gaussian), refine edge cases in existing plots (Bernoulli histogram overflow), and expand matrix equation examples across all GLM configurations.

- **Content Refinement**: Reorganize the matrix formulation narrative to better flow with the IRLS material, add time-step superscripts to the weight matrix tables, and deepen the discussion of variance-link function relationships.

- **Code Quality**: Verify the logical correctness of distribution sampling algorithms (e.g., Knuth's algorithm for Poisson), identify and remove redundant components, and complete API integration with secure environment variable handling.

## Authors

This project was created as a final project for statistical modeling coursework.

### Contributors

- **[Nicholas Fleischhauer](https://www.linkedin.com/in/unobtainiumrock)** - Project Lead & Core Development
- **[Boston Bautista](https://www.linkedin.com/in/boston101)** - Development & Implementation
- **Ernesto Diaz** - Development & Implementation

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

