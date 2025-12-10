# Fahimify E2E Test Suite

Comprehensive end-to-end testing suite for Fahimify meal planning application using Cypress.

## Test Coverage

This test suite covers the following critical user journeys:

### 1. Complete User Journey (01-complete-journey.cy.ts)

- User signup and authentication
- Onboarding process completion
- Dashboard budget verification
- Meal plan generation
- Meal tracking and logging
- Navigation between tabs
- Meal swapping functionality

### 2. Preference Filtering (02-preference-filtering.cy.ts)

- Cuisine preference filtering
- Allergy-based meal filtering
- Nutrient boost focus
- Budget constraint validation

### 3. Multi-Meal Tracking (03-meal-tracking.cy.ts)

- Single meal consumption tracking
- Cumulative cost calculation
- All daily meals tracking
- Weekly plan reflection
- Macro balance updates
- Cross-navigation persistence
- Page refresh persistence

### 4. Swap Strategies (04-swap-strategies.cy.ts)

- Cheaper meal strategy
- Faster cooking time strategy
- Nutrient optimization strategy
- Single meal swap verification
- Total cost update after swap

### 5. Navigation & Persistence (05-navigation-persistence.cy.ts)

- Tab navigation state persistence
- Session persistence after refresh
- Browser back/forward handling
- Multiple session data preservation
- Direct URL navigation
- Authentication redirects
- Meal log history maintenance

### 6. Edge Cases (06-edge-cases.cy.ts)

- Duplicate meal logging prevention
- Budget exceeded handling
- Recipe detail navigation
- Empty state displays
- Week completion tracking
- Form validation
- API error handling

### 7. Weekly Plan Day Filtering (07-weekly-plan-filtering.cy.ts)

- Current and future day display
- Current day auto-expansion
- Future day expansion/collapse
- Eaten status display
- Meal swapping on future days
- Day filtering persistence
- All meals visibility

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- npm or yarn package manager

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Test Database

Create a separate test database:

```bash
npm run test:db:setup
```

This will:

- Drop existing `fahimify_test` database if exists
- Create new `fahimify_test` database
- Set up required tables

### 3. Configure Environment

Copy `.env.test.example` to `.env.test` and update if needed:

```bash
cp .env.test.example .env.test
```

Default configuration:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fahimify_test"
JWT_SECRET="test-secret-key-for-testing-only"
NODE_ENV="test"
```

### 4. Start Development Server

The tests require the application to be running:

```bash
npm run dev
```

Keep this running in a separate terminal.

## Running Tests

### Run All Tests (Headless)

```bash
npm run test:e2e
```

### Open Cypress Test Runner (Interactive)

```bash
npm run test:e2e:open
```

### Run Specific Test File

```bash
npx cypress run --spec "cypress/e2e/01-complete-journey.cy.ts"
```

### Reset Test Database

If you need to reset the test database:

```bash
npm run test:db:reset
```

## Test Structure

```
cypress/
├── e2e/                          # Test files
│   ├── 01-complete-journey.cy.ts
│   ├── 02-preference-filtering.cy.ts
│   ├── 03-meal-tracking.cy.ts
│   ├── 04-swap-strategies.cy.ts
│   ├── 05-navigation-persistence.cy.ts
│   ├── 06-edge-cases.cy.ts
│   └── 07-weekly-plan-filtering.cy.ts
├── fixtures/                     # Test data
│   ├── test-users.json
│   └── preferences.json
├── support/                      # Helper functions
│   ├── commands.ts               # Custom Cypress commands
│   └── e2e.ts                    # Global hooks
└── tsconfig.json                 # TypeScript config
```

## Custom Commands

The test suite includes custom Cypress commands for common operations:

```typescript
cy.signup(username, email, password);
cy.login(email, password);
cy.completeOnboarding(preferences);
cy.generatePlan();
cy.markMealEaten(mealSelector);
cy.swapMeal(strategy);
cy.getBudgetRemaining();
cy.getSpent();
cy.getMacroPercent(macro);
```

## Test Data

Test fixtures are stored in `cypress/fixtures/`:

- **test-users.json**: Predefined test user credentials
- **preferences.json**: Various onboarding preference configurations

## Database Isolation

Each test automatically:

1. Resets the test database before running (via `beforeEach` hook in `e2e.ts`)
2. Uses a separate `fahimify_test` database
3. Cleans up after completion

This ensures tests are isolated and can run in any order.

## Debugging Tests

### Enable Cypress Debug Mode

```bash
DEBUG=cypress:* npm run test:e2e:open
```

### View Test Logs

Cypress automatically logs all operations. Check the browser console and Cypress command log.

### Screenshots and Videos

- Screenshots are taken on test failure (saved to `cypress/screenshots/`)
- Videos are disabled by default (can be enabled in `cypress.config.ts`)

## Best Practices

1. **Database State**: Each test starts with a clean database
2. **Test Independence**: Tests should not depend on each other
3. **Unique Users**: Use timestamps to generate unique test users
4. **Wait for API**: Always wait for API responses using `cy.wait('@interceptAlias')`
5. **Assertions**: Make explicit assertions about expected outcomes
6. **Error Handling**: Tests include error scenarios and edge cases

## Troubleshooting

### Tests Fail Due to Database Connection

- Ensure PostgreSQL is running
- Verify `.env.test` has correct database URL
- Run `npm run test:db:setup` to recreate database

### Tests Timeout

- Increase timeout in `cypress.config.ts`:
  ```typescript
  defaultCommandTimeout: 10000;
  ```
- Ensure development server is running on port 3000

### Authentication Issues

- Clear cookies and localStorage between tests
- Verify JWT_SECRET matches between app and test config

### Database Not Resetting

- Manually run: `npm run test:db:reset`
- Check database permissions
- Verify `beforeEach` hook is executing

## Coverage Summary

Total Test Scenarios: **7**
Total Test Cases: **40+**

Critical Flows Covered:

- ✅ User registration and authentication
- ✅ Complete onboarding flow
- ✅ Meal plan generation
- ✅ Meal consumption tracking
- ✅ Budget and spending calculation
- ✅ Macro nutrient tracking
- ✅ Preference-based filtering
- ✅ Allergy management
- ✅ Meal swapping (all strategies)
- ✅ Navigation and persistence
- ✅ Edge cases and error handling
- ✅ Day-based plan filtering

## Continuous Integration

To run tests in CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Setup Test Database
  run: npm run test:db:setup

- name: Run E2E Tests
  run: npm run test:e2e
```

## Contributing

When adding new tests:

1. Follow existing naming conventions (##-description.cy.ts)
2. Add custom commands to `support/commands.ts` if reusable
3. Use fixtures for test data
4. Update this README with new test coverage
5. Ensure tests are independent and idempotent

## License

Same as Fahimify project license.
