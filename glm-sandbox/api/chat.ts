import { Handler } from '@netlify/functions';

interface ChatRequest {
  message: string;
  history: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

interface ChatResponse {
  reply: string;
}

const GLM_CONTEXT = `
You are an AI assistant specialized in Generalized Linear Models (GLMs). You're helping users understand GLM concepts through an interactive learning sandbox.

Key GLM Concepts:
- GLMs have three components: Random Component (distribution), Systematic Component (linear predictor), and Link Function
- Common distributions: Normal, Poisson, Bernoulli
- Common link functions: Identity, Log, Logit
- The linear predictor: η = β₀ + β₁X
- The mean response: μ = g⁻¹(η) where g is the link function

The app allows users to:
1. Set "truth" parameters and see the theoretical model
2. Generate data from that model
3. Fit an estimated model to the data
4. Compare truth vs estimated models

Keep responses concise, educational, and focused on GLM concepts.
`;

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { message, history }: ChatRequest = JSON.parse(event.body || '{}');

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Message is required' }),
      };
    }

    // In a real implementation, you would call the Gemini API here
    // For now, we'll provide a simple response based on keywords
    let reply = '';

    if (message.toLowerCase().includes('logit')) {
      reply = 'The logit link function is g(μ) = log(μ/(1-μ)). It\'s commonly used with Bernoulli distribution for binary outcomes. It maps probabilities (0,1) to the real line (-∞,∞).';
    } else if (message.toLowerCase().includes('log')) {
      reply = 'The log link function is g(μ) = log(μ). It\'s commonly used with Poisson distribution for count data. It ensures the mean is always positive.';
    } else if (message.toLowerCase().includes('identity')) {
      reply = 'The identity link function is g(μ) = μ. It\'s used with Normal distribution for continuous outcomes. The linear predictor directly equals the mean.';
    } else if (message.toLowerCase().includes('poisson')) {
      reply = 'Poisson distribution is used for count data (non-negative integers). It has a single parameter λ (lambda) representing both mean and variance.';
    } else if (message.toLowerCase().includes('bernoulli')) {
      reply = 'Bernoulli distribution is used for binary outcomes (0 or 1). It has parameter p representing the probability of success.';
    } else if (message.toLowerCase().includes('normal')) {
      reply = 'Normal distribution is used for continuous outcomes. It has parameters μ (mean) and σ² (variance).';
    } else {
      reply = 'I can help explain GLM concepts! Try asking about specific distributions (Normal, Poisson, Bernoulli) or link functions (identity, log, logit).';
    }

    const response: ChatResponse = { reply };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Error processing chat request:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
