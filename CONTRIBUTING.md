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
4. Ensure your code passes all automated tests and linting
5. Submit a pull request with a clear description of the changes

## Commit Message Guidelines

We follow conventional commits for clear and standardized commit messages:

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
- `develop`: Integration branch for features
- `feature/*`: New features or enhancements
- `fix/*`: Bug fixes
- `docs/*`: Documentation updates

## Release Process

We use semantic versioning for releases. The release process is automated through GitHub Actions:

1. Features are merged into `develop`
2. When ready for release, `develop` is merged into `main`
3. GitHub Actions will build the application and create a new release with semantic versioning

