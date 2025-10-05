# GLM Learning Sandbox

An interactive web application for learning Generalized Linear Models (GLMs) through hands-on experimentation.

## Features

- **Truth Mode**: Define the ground truth parameters of a GLM
- **Data Generation**: Generate random samples from your model
- **Estimation Mode**: Fit models to the generated data
- **Two Spaces Visualization**: See both linear predictor and response spaces
- **Interactive Chat**: Get help understanding GLM concepts

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
```

## Project Structure

```
glm-sandbox/
├── .github/            # GitHub templates and workflows
│   ├── ISSUE_TEMPLATE/ # Issue templates
│   └── pull_request_template.md
├── .husky/             # Git hooks for code quality
├── api/                # Netlify serverless functions
├── public/             # Static assets and PWA files
├── src/                # Frontend source code
│   ├── components/     # React components
│   │   ├── charts/     # D3.js visualization components
│   │   ├── controls/   # Control panel components
│   │   ├── layout/     # Layout components
│   │   └── ui/         # Generic UI components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Core GLM calculations
│   ├── store/          # Zustand state management
│   ├── styles/         # Global styles
│   └── types/          # TypeScript type definitions
├── .commitlintrc.js    # Commit message linting
├── .lintstagedrc.js    # Pre-commit linting
├── CONTRIBUTING.md     # Contribution guidelines
├── GIT_WORKFLOW.md    # Git workflow documentation
├── PRD.md              # Product requirements
└── README.md           # This file
```

## Technologies Used

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Visualization**: D3.js
- **State Management**: Zustand
- **Deployment**: Netlify
- **PWA**: Vite PWA Plugin

## Learning GLMs

This tool helps you understand:

1. **Random Component**: The distribution of your response variable
2. **Systematic Component**: The linear predictor η = β₀ + β₁X
3. **Link Function**: How the linear predictor relates to the mean

Try different combinations:
- Normal distribution with identity link (linear regression)
- Poisson distribution with log link (Poisson regression)
- Bernoulli distribution with logit link (logistic regression)

## Contributing

We welcome contributions to the GLM Learning Sandbox! Please follow our Git workflow for a smooth collaboration experience.

### Quick Start

1. **Fork the repository** and clone your fork
2. **Follow our Git workflow** - see [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) for detailed instructions
3. **Create a descriptive branch** using the format `your-name/feature-summary`
4. **Follow conventional commits** for clear commit messages
5. **Submit a pull request** with a clear description

### Development Guidelines

- **Code Quality**: All code must pass linting and type checking
- **Testing**: Add tests for new functionality when possible
- **Documentation**: Update documentation for new features
- **Accessibility**: Ensure UI changes maintain accessibility standards
- **Performance**: Consider performance implications of changes

### Common Development Areas

- **GLM Algorithms**: Enhanced parameter estimation, new distributions
- **Visualizations**: Interactive charts, new plot types, accessibility
- **Chat Assistant**: AI integration, context awareness, UX improvements
- **UI/UX**: Mobile responsiveness, accessibility, user experience
- **Documentation**: Tutorials, API docs, concept explanations

### Getting Help

- Check existing issues and discussions
- Ask questions in pull request comments
- Review the [PRD.md](./PRD.md) for project requirements
- See [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) for detailed contribution process
- Read [CONTRIBUTING.md](./CONTRIBUTING.md) for comprehensive guidelines

## License

MIT License
