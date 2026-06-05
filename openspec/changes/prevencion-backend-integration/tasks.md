# Tasks: Prevention Backend Integration

## Review Workload Forecast

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units
Under 400 lines budget.

---

## Phase 1: Backend Foundation (Schemas, DTOs, Inputs)

- [ ] 1.1 Create `prevencion` module directories: `schemas`, `dto`, and `inputs` under `backend/src/prevencion/`.
- [ ] 1.2 Implement Mongoose schemas: `ActividadSchema` and `QuejaSchema` under `backend/src/prevencion/schemas/`.
- [ ] 1.3 Create Inputs: `ActividadRegisterInput`, `EvidenceInput`, and `QuejaRegisterInput` under `backend/src/prevencion/inputs/`.
- [ ] 1.4 Create DTOs: `ActividadQueryDto`, `QuejaQueryDto`, and `EvidenceDto` under `backend/src/prevencion/dto/`.
- [ ] 1.5 Export Schemas, Inputs, and DTOs in their respective `index.ts` barrel files.

---

## Phase 2: Backend Core (Service, Resolver, Module Registration)

- [ ] 2.1 Implement `PrevencionService` to handle database reads/writes for activities and complaints under `backend/src/prevencion/prevencion.service.ts`.
- [ ] 2.2 Implement `PrevencionResolver` to expose GraphQL queries (`getActividades`, `getQuejas`) and mutations (`saveActividad`, `saveQueja`) under `backend/src/prevencion/prevencion.resolver.ts`.
- [ ] 2.3 Secure the mutations in `PrevencionResolver` using `@UseGuards(GqlAuthGuard)` and associate the entries with `@CurrentUser().ente_publico`.
- [ ] 2.4 Create `PrevencionModule` to declare and export schemas, resolvers, and services.
- [ ] 2.5 Register `PrevencionModule` in the main `backend/src/app.module.ts` imports array.

---

## Phase 3: Frontend Integration (PrevencionService updates)

- [ ] 3.1 Update `PrevencionService` (`frontend/src/app/prevencion/services/prevencion.service.ts`) to inject Apollo client.
- [ ] 3.2 Implement Apollo queries for `getActivities` (`getActividades`) and `getComplaints` (`getQuejas`), mapping the response schema fields back to the frontend's component-facing `Activity` and `Complaint` interfaces.
- [ ] 3.3 Implement Apollo mutations for `saveActivity` (`saveActividad`) and `saveComplaint` (`saveQueja`) mapping form values to GQL inputs.
- [ ] 3.4 Verify that compilation is clean and the app runs without any dependency resolver issues.

---

## Phase 4: Testing & Verification

- [ ] 4.1 Write unit tests for `PrevencionService` (`backend/src/prevencion/prevencion.service.spec.ts`) with mock mongoose models.
- [ ] 4.2 Write unit tests for `PrevencionResolver` (`backend/src/prevencion/prevencion.resolver.spec.ts`) with mock service and authenticated context.
- [ ] 4.3 Write unit tests for frontend `PrevencionService` (`frontend/src/app/prevencion/services/prevencion.service.spec.ts`) using `ApolloTestingController`.
- [ ] 4.4 Run backend and frontend test suites to verify that all tests pass (`pnpm run test` or local test commands).
