# Contributing to Harvest CCS

When making changes in this project, whether new features or bug fixes, the workflow should resemble the steps laid out in this document.

## Development Environment Setup

Please refer to the [`README.md`](https://github.com/matthew-collett/harvest-ccs/blob/main/README.md) for basic setup instructions.

#### Code Style

ESLint is used within the `app/` client application for linting. Prettier is used project-wide for code formatting and styling. Before submitting a PR, ensure the `app/` passes the below checks:

```bash
yarn lint && yarn format
```

## Pull Request Process

1. Create a new branch from `main`
2. Make your changes and test
3. Update documentation as needed
4. Commit your changes to your branch
   > Note: You MUST use the fix|feat|...: prefix in your commit message. Including the colon (:). See all valid prefixes below
5. Submit a pull request

## Commit Message Guidelines

This project uses semantic versioning with the commit message analyzer plugin. This means that in order for semantic versioning to properly package, version, and release changes, you must follow the below guidelines for commit messages:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Formatting changes
- `refactor`: Code changes that neither fix bugs nor add features
- `test`: Adding or updating tests
- `chore`: Changes to build process or auxiliary tools

Example: `feat: add team scoring visualization`

## Branching Strategy

- `main`: Production-ready code
