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
src/
├── components/          # React components
│   ├── charts/         # D3.js visualization components
│   ├── controls/       # Control panel components
│   ├── layout/         # Layout components
│   └── ui/             # Generic UI components
├── hooks/              # Custom React hooks
├── lib/                # Core GLM calculations
├── store/              # Zustand state management
├── styles/             # Global styles
└── types/              # TypeScript type definitions
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

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
