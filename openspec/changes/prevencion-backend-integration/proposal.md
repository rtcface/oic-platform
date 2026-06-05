# Proposal: Integration of Prevention Module with Backend

## Intent
Integrate the frontend Prevention module with the NestJS backend GraphQL queries and mutations, replacing the mock data with actual database-persisted entities.

## Scope
### In Scope
- **Backend**:
  - Create a new `prevencion` module in the NestJS backend.
  - Implement Mongoose schemas for `Actividad` and `Queja`.
  - Create GraphQL queries (`getActividades`, `getQuejas`) and mutations (`saveActividad`, `saveQueja`).
  - Secure mutations using `@UseGuards(GqlAuthGuard)` and `@CurrentUser()` to associate records with the authenticated user's `ente_publico`.
- **Frontend**:
  - Update `PrevencionService` to fetch and submit data via Apollo GraphQL, replacing the current local memory/mock implementation.
  - Map backend models (`Actividad`, `Queja`) to the frontend's expected interfaces (`Activity`, `Complaint`).

### Out of Scope
- Changes to the authentication/login mechanics (leveraging existing JWT guards/decorators).
- Modifying unrelated modules on either the backend or frontend.

## Capabilities
### New Capabilities
- `persist-prevention-activities`: OIC administrators can create and persist prevention activities in the database.
- `persist-prevention-complaints`: OIC administrators can record and persist institutional violence complaints.
- `query-prevention-data`: Public users can retrieve and filter activities and complaints by OIC/dependency.

### Modified Capabilities
- `PrevencionService`: Switched from local mock state to live GraphQL API calls.

## Approach
We will construct the backend schemas for `Actividad` and `Queja` as distinct entities inside a new `prevencion` module. Resolvers will handle queries and mutations, securing state changes by forcing the `ente_publico` relation using the authenticated user's profile.
On the frontend, `PrevencionService` will use Angular Apollo client to query and mutate these endpoints, mapping database records to the existing UI interfaces seamlessly.

## Affected Areas
| Area | Impact | Description |
|---|---|---|
| `backend/src/prevencion/` | High | Creation of new NestJS module, schemas, resolver, service, and DTOs/Inputs. |
| `backend/src/app.module.ts` | Low | Registration of `PrevencionModule`. |
| `frontend/src/app/prevencion/services/prevencion.service.ts` | High | Replaced mock methods with real GraphQL queries/mutations. |

## Risks
| Risk | Likelihood | Mitigation |
|---|---|---|
| Data format mismatch between frontend interfaces and Mongoose models | Low | Map properties within `PrevencionService` (e.g., `titulo`/`name`, `dependency`/`ente_publico`). |
| Unauthorized submission of activities/complaints | Medium | Strict application of `@UseGuards(GqlAuthGuard)` and server-side binding of `ente_publico`. |

## Rollback Plan
Revert changes in `PrevencionService` to restore mock operations, remove the `prevencion` module directory from the backend, and remove its registration from `app.module.ts`.

## Dependencies
- NestJS Mongoose and GraphQL Modules
- `@UseGuards(GqlAuthGuard)` and `@CurrentUser()` (Auth module)
- Apollo Angular in Frontend

## Success Criteria
- Mongoose schemas compile, and NestJS starts successfully.
- `getActividades`, `getQuejas`, `saveActividad`, and `saveQueja` are exposed in `schema.gql`.
- Authenticated mutations retrieve `ente_publico` from `@CurrentUser()` and save successfully.
- Frontend displays live backend data in the prevention views.
