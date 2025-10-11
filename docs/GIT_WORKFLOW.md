# Git Branching Workflow

This document outlines the Git workflow and contribution process for the GLM Learning Sandbox project.

## Git & Contribution Workflow

This section outlines the process for contributing code to the project.

### Core Principles

- The `main` branch is our source of truth and is always protected.
- All new work is done on a descriptive feature branch.
- All code is merged into `main` through a Pull Request (PR).
- PRs must be reviewed, approved, and pass all automated checks.
- We use a **linear commit history** to keep our project's log clean.

### Step-by-Step Contribution Guide

1. **Start Fresh:** Before creating a new branch, ensure your `main` is up-to-date.

   ```bash
   git checkout main
   git pull origin main
   ```

2. **Create Your Branch:** Use a descriptive naming convention (e.g., `your-name/feature-summary`).

   ```bash
   git checkout -b lena/enhanced-estimation-algorithms
   ```

3. **Make & Commit Changes:** Write your code. Commit early and often with clear messages following the [Conventional Commits](https://www.conventionalcommits.org/) standard.

   ```bash
   git add .
   git commit -m "feat: implement maximum likelihood estimation for Poisson regression"
   ```

4. **Stay Updated:** Regularly update your branch from `main` using `rebase` to maintain a clean history.

   ```bash
   git fetch origin
   git rebase origin/main
   ```

   *(If you run into conflicts, Git will guide you on how to resolve them. After resolving, run `git rebase --continue`.)*

5. **Push to GitHub:** When ready for review, push your branch.

   ```bash
   # If you have rebased your branch, you must use --force-with-lease
   git push --force-with-lease origin lena/enhanced-estimation-algorithms
   ```

6. **Create a Pull Request:** Go to GitHub and open a PR. Write a clear title and description.

7. **Review and Merge:** Address any feedback from teammates. Once your PR is approved and all automated checks pass, **"Squash and merge"** it into `main`.

8. **Clean Up:** After merging, delete your old branches.

   ```bash
   # Switch back to main and pull the latest changes
   git checkout main
   git pull origin main

   # Delete the local branch
   git branch -d lena/enhanced-estimation-algorithms
   ```

## Key Workflow Features

### Branch Naming Convention
- Use descriptive names: `your-name/feature-summary`
- Examples: 
  - `lena/enhanced-estimation-algorithms`
  - `john/fix-chart-rendering-bug`
  - `sarah/add-confidence-intervals`
  - `mike/integrate-gemini-api`

### Commit Message Standards
- Follow [Conventional Commits](https://www.conventionalcommits.org/) standard
- Examples:
  - `feat: implement maximum likelihood estimation for Poisson regression`
  - `fix: resolve chart scaling issues in ResponseSpacePlot`
  - `docs: update README with contribution guidelines`
  - `refactor: simplify GLM calculation logic`
  - `style: improve mobile responsiveness of control panel`
  - `test: add unit tests for GLM parameter estimation`

### Linear History Strategy
- Use `git rebase` instead of `git merge` to maintain clean, linear history
- Regular rebasing from `main` keeps branches up-to-date
- Use `--force-with-lease` when pushing rebased branches for safety

### Pull Request Process
- All code changes must go through Pull Requests
- PRs require review and approval
- Automated checks must pass before merging
- Use "Squash and merge" to maintain clean history

### Branch Protection
- `main` branch is protected and cannot be pushed to directly
- All changes must come through Pull Requests
- Automated checks and reviews are required

## Project-Specific Guidelines

### GLM Sandbox Development Areas

When working on this project, consider these common development areas:

**Core GLM Functionality:**
- `feat: implement [distribution] parameter estimation`
- `fix: resolve [link function] calculation edge cases`
- `refactor: optimize GLM data generation algorithms`

**Visualization Components:**
- `feat: add interactive chart tooltips`
- `fix: resolve chart scaling for extreme values`
- `style: improve chart accessibility`

**Chat Assistant:**
- `feat: integrate Gemini API for chat responses`
- `fix: resolve chat message formatting issues`
- `refactor: improve chat context management`

**UI/UX Improvements:**
- `feat: add mobile-responsive design`
- `fix: resolve control panel layout issues`
- `style: improve color contrast for accessibility`

**Documentation:**
- `docs: update GLM concept explanations`
- `docs: add tutorial walkthrough`
- `docs: improve API documentation`

## Workflow Benefits

This workflow emphasizes:
1. **Clean History**: Linear commit history through rebasing
2. **Code Quality**: Mandatory reviews and automated checks
3. **Safety**: Protected main branch and force-with-lease for rebased branches
4. **Clarity**: Descriptive branch names and conventional commit messages
5. **Collaboration**: Clear PR process with required reviews

The workflow is designed for teams that value clean git history and thorough code review processes, ensuring the GLM Learning Sandbox maintains high code quality and clear development history.
