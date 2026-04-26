# Testing Documentation

This project uses a comprehensive automated testing suite to ensure code quality and prevent regressions.

## Testing Stack

- **Vitest**: Unit and integration test runner.
- **Playwright**: End-to-end and accessibility testing.
- **React Testing Library**: Component testing.
- **MSW (Mock Service Worker)**: API mocking.
- **Lighthouse CI**: Performance and best practices auditing.
- **Axe Core**: Automated accessibility audits.

## Test Directory Structure

```text
tests/
├── unit/            # Unit tests for logic and utilities
├── components/      # React component tests
├── integration/     # API and Server Action integration tests
├── e2e/             # End-to-end browser tests
├── accessibility/   # Accessibility audits
├── mocks/           # MSW handlers and mock data
├── factories/       # Data factories for testing
└── utils/           # Test utilities and custom renders
```

## Running Tests

### Unit, Component, and Integration Tests
```bash
pnpm test          # Run once
pnpm test:watch    # Watch mode
pnpm test:coverage # With coverage report
```

### End-to-End Tests
```bash
pnpm test:e2e      # Run all E2E tests
```

### Accessibility Tests
```bash
pnpm test:a11y     # Run accessibility audits
```

### Performance Tests
```bash
pnpm test:perf     # Run Lighthouse CI (requires local build)
```

## Writing Tests

### Component Tests
Use `render` from `tests/utils/test-utils` to include necessary providers (Theme, Accessibility, etc.).

```typescript
import { render, screen } from "../utils/test-utils";
import { MyComponent } from "@/components/MyComponent";

test("it renders", () => {
  render(<MyComponent />);
  expect(screen.getByText(/hello/i)).toBeInTheDocument();
});
```

### API Mocking
Add global handlers in `tests/mocks/handlers.ts` or use `server.use()` for test-specific overrides.

## CI/CD Pipeline

Tests run automatically on GitHub Actions for every push and pull request to the `main` branch.
- **Lint & Type Check**: Ensures code style and type safety.
- **Unit & Integration**: Runs Vitest suite.
- **E2E & A11y**: Runs Playwright suite.
- **Performance**: Runs Lighthouse CI on push to `main`.
