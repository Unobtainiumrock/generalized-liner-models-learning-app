# Contributing to GLM Learning Sandbox

Thank you for your interest in contributing to the GLM Learning Sandbox! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)

## Code of Conduct

This project follows a code of conduct that we expect all contributors to follow. Please be respectful, inclusive, and constructive in all interactions.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/glm-sandbox.git
   cd glm-sandbox
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set up Git hooks**:
   ```bash
   npm run prepare
   ```
5. **Start development server**:
   ```bash
   npm run dev
   ```

## Development Workflow

We follow a strict Git workflow to maintain clean history and ensure code quality. See [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) for detailed instructions.

### Quick Summary

1. **Create a feature branch** from `main`
2. **Make your changes** with clear, conventional commits
3. **Test your changes** thoroughly
4. **Submit a pull request** with a clear description
5. **Address feedback** and iterate

## Coding Standards

### TypeScript/React

- Use **TypeScript** for all new code
- Follow **React functional components** with hooks
- Use **proper TypeScript types** - avoid `any`
- Follow **ESLint rules** (run `npm run lint` to check)
- Use **Tailwind CSS** for styling

### Code Style

- **Prettier** formatting is enforced via pre-commit hooks
- **Conventional Commits** are required for all commits
- **Meaningful variable names** and clear function names
- **Comments** for complex logic and algorithms
- **Consistent indentation** (2 spaces)

### GLM-Specific Guidelines

- **Mathematical accuracy** is critical for GLM calculations
- **Performance considerations** for large datasets
- **Accessibility** for educational use
- **Mobile responsiveness** for broader reach

## Testing Guidelines

### Current Testing Status

- **Manual testing** is currently the primary method
- **Unit tests** should be added for new GLM algorithms
- **Integration tests** for complex user workflows
- **Visual regression tests** for chart components

### Testing Checklist

- [ ] Test with different distributions (Normal, Poisson, Bernoulli)
- [ ] Test with different link functions (identity, log, logit)
- [ ] Test edge cases (extreme parameter values)
- [ ] Test mobile responsiveness
- [ ] Test accessibility with screen readers
- [ ] Test chat assistant functionality

## Documentation

### Code Documentation

- **JSDoc comments** for complex functions
- **README updates** for new features
- **Inline comments** for mathematical formulas
- **Type definitions** should be self-documenting

### User Documentation

- **Clear explanations** of GLM concepts
- **Tutorial content** for new users
- **API documentation** for developers
- **Accessibility guidelines** for educators

## Pull Request Process

### Before Submitting

1. **Follow the Git workflow** (see [GIT_WORKFLOW.md](./GIT_WORKFLOW.md))
2. **Run all checks**:
   ```bash
   npm run lint
   npm run type-check
   npm run build
   ```
3. **Test thoroughly** with different scenarios
4. **Update documentation** if needed

### PR Requirements

- **Clear title** following conventional commit format
- **Detailed description** of changes
- **Screenshots/videos** for UI changes
- **Testing instructions** for reviewers
- **Breaking changes** clearly marked

### Review Process

- **Automated checks** must pass
- **Code review** by maintainers
- **Testing** by reviewers
- **Documentation** review
- **Accessibility** review for UI changes

## Issue Reporting

### Bug Reports

Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md) and include:

- **Clear reproduction steps**
- **Expected vs actual behavior**
- **Environment details**
- **Screenshots/videos** if applicable
- **Console errors** if any

### Feature Requests

Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md) and include:

- **Clear problem statement**
- **Proposed solution**
- **Use cases and benefits**
- **Implementation considerations**

## Development Areas

### High Priority

- **Enhanced parameter estimation** algorithms
- **Real AI integration** for chat assistant
- **Mobile responsiveness** improvements
- **Accessibility** enhancements

### Medium Priority

- **Interactive chart features** (zoom, pan, tooltips)
- **Additional diagnostic plots**
- **Tutorial mode** implementation
- **Performance optimizations**

### Low Priority

- **Advanced GLM features** (multiple predictors)
- **User data upload** functionality
- **Export capabilities**
- **Advanced visualizations**

## Getting Help

- **Check existing issues** and discussions
- **Ask questions** in pull request comments
- **Review documentation** in the repository
- **Join discussions** in GitHub Discussions

## Recognition

Contributors will be recognized in:
- **README contributors section**
- **Release notes** for significant contributions
- **Project documentation** for major features

Thank you for contributing to the GLM Learning Sandbox! Your efforts help make statistical education more accessible and interactive.
