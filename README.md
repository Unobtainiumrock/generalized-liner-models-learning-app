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

- Statistical theory based on standard GLM textbooks and resources
- Implementation follows modern React and TypeScript best practices

