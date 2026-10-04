You are acting as a **Senior/Staff-level TypeScript Architect**.

I want you to scaffold a **production-ready TypeScript monorepository** for a new application.

## IMPORTANT SCOPE

**This task is ONLY for repository scaffolding and architecture setup.**

Do NOT implement business features, authentication logic, CRUD modules, database entities, AI functionality, domain logic, or real application workflows.

The goal is to create a clean, scalable foundation that another developer can start implementing immediately.

I already have these Claude tools installed:

* **Context7**
* **Superpowers**
* **Ponytail**

Use them where appropriate during the scaffolding process.

Do not install or introduce unnecessary tools.

---

# 1. Overall Architecture

Create a **Monorepo**, fully TypeScript-based.

The initial repository should contain:

### Backend

* NestJS
* PostgreSQL
* TypeScript
* REST API architecture
* Microservice-oriented structure
* API versioning
* Separate Admin API and Client API architecture where appropriate

### Client Frontend

* React
* Vite
* TypeScript
* Tailwind CSS
* Axios

### Admin Frontend

* React
* Vite
* TypeScript
* Tailwind CSS
* Axios

### Future AI Layer

The architecture must allow an AI service/module to be added later.

Do NOT implement AI now.

The architecture should make it possible to add an AI service without restructuring the entire repository.

---

# 2. Monorepo Requirements

Choose a suitable modern monorepo approach.

Evaluate the available options and select the architecture that is most appropriate for:

* TypeScript
* NestJS
* React/Vite
* Shared packages
* Testing
* Build caching
* Developer experience
* CI/CD
* Future scalability 



Prefer a simple and maintainable architecture over unnecessary complexity.

The monorepo should support:

* Shared TypeScript types
* Shared utilities
* Shared API contracts/types where appropriate
* Shared configuration
* Independent application builds
* Independent testing
* Consistent linting
* Consistent formatting
* Type checking

Do not duplicate common configuration unnecessarily.

---

# 3. Recommended Repository Structure

Create a clear structure similar to:

apps/
backend/
client/
admin/

packages/
shared/
types/
config/
...

tests/
e2e/

You may modify this structure if you have a stronger architectural reason.

Explain the final structure briefly after scaffolding.

---

# 4. Backend Architecture

Use NestJS with a structure suitable for a **microservice-oriented backend**.

The backend must be designed so that additional services can be introduced later without major restructuring.

For example, the architecture should make it possible to evolve toward:

services/
api-gateway/
user-service/
...
ai-service/

However, do NOT create unnecessary services now.

Start with the minimum required backend application while keeping future service extraction possible.

---

# 5. Admin API vs Client API

The system will potentially have:

* Client APIs
* Admin APIs

Design the backend so they can be clearly separated.

For example, consider structures such as:

/api/v1/client/...
/api/v1/admin/...

or an equivalent architecture if you determine a better approach.

The important requirements are:

* Clear separation
* Independent authorization boundaries later
* Independent controllers/modules where appropriate
* No mixing Admin and Client responsibilities
* Easy future extraction into separate services if required

Do not implement authentication/authorization now.

Only scaffold the architecture required to support it later.

---

# 6. API Versioning

The backend must support API versioning from day one.

Use a clean versioning strategy such as:

/api/v1/...

The architecture should make it easy to introduce:

/api/v2/...

without breaking v1.

Configure NestJS API versioning appropriately.

Do not create multiple versions now.

Only establish the infrastructure and example placeholder structure.

---

# 7. Database

Use:

* PostgreSQL
* TypeScript
* A production-appropriate ORM/database layer for NestJS

Choose the ORM carefully.

Consider:

* Prisma
* TypeORM
* Drizzle

Use Context7 to verify the current recommended setup/documentation for the selected technology before generating configuration.

Do NOT create business entities.

Only establish:

* Database configuration
* Environment configuration
* Connection setup
* Migration structure
* Seed structure if appropriate
* Local development configuration

Do not add fake business tables.

For the Local development need a Docker setup Which is connected to Doker deployed PG ADmin

---

# 8. Frontend — Client

Create:

React + Vite + TypeScript + Tailwind CSS.

Use Axios for API communication.

Create a clean architecture that can grow beyond a small application.

For example:

src/
app/
components/
features/
pages/
layouts/
hooks/
services/
api/
types/
utils/

Do not over-engineer it.

Create only the minimum scaffolding required.

Include:

* Axios client abstraction
* Environment configuration
* API base URL configuration
* Basic routing structure
* Error handling foundation
* Loading-state foundation

Do not implement real business screens.

Create only a placeholder/home page.

---

# 9. Frontend — Admin

Create a separate Admin frontend application.

Use:

* React
* Vite
* TypeScript
* Tailwind CSS
* Axios

Keep the Admin application independently buildable and deployable.

Use a structure similar to the Client application where appropriate, but avoid unnecessary duplication through shared packages.

Create only placeholder pages.

Do not implement actual administration functionality.

---

# 10. Shared Packages

Create shared packages only where they provide real value.

Possible packages:

packages/
shared/
types/
eslint-config/
tsconfig/
ui/

Do not create packages just for the sake of having packages.

Consider sharing:

* API contracts
* DTO types where appropriate
* Common TypeScript types
* Utility functions
* Shared configuration
* UI primitives only if genuinely useful

Avoid coupling frontend and backend too tightly.

The backend should remain independently evolvable.

---

# 11. TDD Architecture

The project must be designed with **TDD as the development approach**.

This is scaffolding only.

Do not implement actual business tests.

Set up the testing infrastructure for:

### Backend

* Unit tests
* Integration tests
* Controller/service testing structure

### Frontend

* Unit/component tests
* Integration tests

### E2E

Create a dedicated E2E testing setup covering the overall application architecture.

Choose appropriate modern tools.

Evaluate:

* Jest/Vitest
* Supertest
* Playwright

Use Context7 to verify the current setup and configuration for the selected tools.

---

# 12. E2E Testing

Create an E2E test application/setup that can eventually test:

Client → API → Database

and:

Admin → API → Database

Do not implement real business scenarios.

Create only a minimal health-check/example E2E test proving that the infrastructure works.

Keep E2E tests isolated from unit tests.

---

# 13. Code Quality

Set up:

* ESLint
* Prettier
* TypeScript strict mode
* Consistent import rules
* Formatting rules
* Unused variable detection
* Type checking

Use strict TypeScript configuration.

Avoid `any` unless there is a documented unavoidable reason.

Configure shared linting/formatting where practical.

---

# 14. Environment Configuration

Create environment configuration for:

Development
Test
Production

Use `.env.example`.

Never commit secrets.

Provide clear configuration names for:

* PostgreSQL
* Backend API
* Client API URL
* Admin API URL
* E2E environment
* Future AI configuration placeholder

Do not add actual credentials.

---

# 15. Docker / Local Development

Provide a clean local development setup.

At minimum consider:

* PostgreSQL container
* Backend development
* Client development
* Admin development

Use Docker Compose if appropriate.

Do not containerize unnecessarily if it complicates local development.

The goal is:

git clone
→ install dependencies
→ configure `.env`
→ start infrastructure
→ start applications

---

# 16. Scripts

Create useful root-level scripts such as:

dev
build
test
test:unit
test:integration
test:e2e
lint
lint:fix
format
format:check
typecheck
clean

Also allow individual applications/packages to be operated independently.

Use consistent naming.

---

# 17. CI/CD Foundation

Only scaffold CI/CD infrastructure.

Do not create deployment pipelines for a specific cloud provider unless necessary.

Create a basic CI workflow that can eventually run:

1. Install
2. Lint
3. Typecheck
4. Unit tests
5. Integration tests
6. Build
7. E2E tests

Do not implement deployment.

---

# 18. AI Future Architecture

The project will later integrate AI.

Do NOT implement AI now.

However, make the architecture capable of adding:

apps/
ai-service/

or:

services/
ai-service/

later.

The future AI layer may use:

* LLM APIs
* RAG
* Vector databases
* MCP
* Agent workflows

Do not install AI dependencies at this stage.

Only make architectural decisions that prevent future AI integration from becoming difficult.

---

# 19. Documentation

Create a high-quality README containing:

* Project overview
* Architecture
* Repository structure
* Technology stack
* Development setup
* Environment configuration
* Running PostgreSQL
* Running Client
* Running Admin
* Running Backend
* Running tests
* Running E2E tests
* Build commands
* Monorepo conventions
* API versioning strategy
* Future microservice strategy
* Future AI integration strategy

Also document important architectural decisions.

Do not create excessive documentation.

---

# 20. Tool Usage

You have access to:

### Context7

Use Context7 to verify current documentation and recommended configuration for:

* NestJS
* React
* Vite
* Tailwind CSS
* PostgreSQL ORM
* Testing framework
* Playwright
* Monorepo tooling

Do not rely on outdated assumptions when official documentation can be checked.

### Superpowers

Use Superpowers where useful for:

* Planning
* Architectural reasoning
* Breaking the scaffolding task into safe steps
* Reviewing the generated structure
* Verifying that the scaffolding meets the requirements

### Ponytail

Use Ponytail where useful for repository/codebase analysis and maintaining a clean architectural structure.

Do not use these tools to implement unnecessary features.

---

# 21. Critical Constraints

DO NOT:

* Implement authentication
* Implement authorization
* Implement RBAC
* Implement business entities
* Implement CRUD
* Implement business logic
* Implement AI
* Implement RAG
* Implement MCP
* Implement payments
* Implement real admin functionality
* Add unnecessary microservices
* Add unnecessary dependencies
* Generate fake production data
* Create unnecessary abstractions
* Over-engineer the initial project

This is a **foundation/scaffolding task only**.

---

# 22. Execution Process

Before modifying files:

1. Inspect the current repository.
2. Determine whether a project already exists.
3. Inspect existing configuration.
4. Check available package managers and Node.js version.
5. Check the installed tooling.
6. Use Context7 for current framework recommendations.
7. Use Superpowers/Ponytail where appropriate.
8. Produce a short architecture plan.
9. Then implement the scaffolding.

Do not ask unnecessary questions if reasonable defaults can be selected.

If a decision materially affects the architecture, explain the decision before implementing it.

---

# 23. Final Validation

After scaffolding, verify that:

* All applications compile
* TypeScript passes
* ESLint passes
* Formatting passes
* Unit-test infrastructure works
* Integration-test infrastructure works
* E2E infrastructure works
* PostgreSQL development infrastructure works
* Client starts
* Admin starts
* Backend starts
* API versioning works
* Shared packages resolve correctly
* Monorepo builds correctly

Fix scaffolding/configuration problems you discover.

Do not implement business functionality to make tests pass.

---

# 24. Final Output

At the end, provide:

### Architecture Summary

Brief explanation of the chosen architecture.

### Repository Structure

Show the final directory tree.

### Technology Decisions

List the major technology choices and why they were selected.

### Commands

Show the important commands for:

* install
* development
* build
* test
* E2E
* lint
* typecheck

### Validation

Report what was successfully validated.

### Future Extension Points

Briefly explain how the repository can later evolve to:

* More microservices
* Separate Admin API
* Separate Client API
* AI service
* RAG
* MCP/agent architecture

Again:

**DO NOT IMPLEMENT ANY OF THESE FUTURE FEATURES NOW.**

The final repository should be a clean, production-grade **TypeScript monorepo foundation**, not a demo application.
