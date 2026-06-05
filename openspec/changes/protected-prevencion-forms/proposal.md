# Proposal: Add Actividades and Quejas Forms

## Intent
Add "Actividades" and "Quejas" forms to the protected module to allow authorized users to submit and manage prevention-related data.

## Scope
### In Scope
- Create `adm-actividades` component inside `src/app/protected/pages/`.
- Create `adm-quejas` component inside `src/app/protected/pages/`.
- Register new routes in `src/app/protected/protected-routing.module.ts`.
- Enforce the 2kb per component budget limit.

### Out of Scope
- Backend GraphQL resolver modifications (assuming endpoints exist or are handled in a separate backend task).
- Global authentication changes.

## Capabilities
### New Capabilities
- `manage-actividades`: Users can fill and submit Actividades forms via a protected route.
- `manage-quejas`: Users can fill and submit Quejas forms via a protected route.

### Modified Capabilities
- None

## Approach
We will create two separate flat components (`adm-actividades` and `adm-quejas`) in the `src/app/protected/pages/` directory. This flat architecture approach minimizes bundle size to ensure we stay under the strict 2kb limit per component. The routing will be updated in `protected-routing.module.ts` to expose these new pages inside the protected layout.

## Affected Areas
| Area | Impact | Description |
|---|---|---|
| `src/app/protected/pages/` | High | Addition of `adm-actividades` and `adm-quejas` components. |
| `src/app/protected/protected-routing.module.ts` | Low | Addition of new component routes. |

## Risks
| Risk | Likelihood | Mitigation |
|---|---|---|
| Exceeding the 2kb bundle budget per component | Medium | Keep components lean and utilize PrimeNG shared components correctly without pulling unnecessary imports. |

## Rollback Plan
Remove the `adm-actividades` and `adm-quejas` directories from `src/app/protected/pages/` and revert their route declarations in `protected-routing.module.ts`.

## Dependencies
- PrimeNG 13.1.1 (UI components)
- Apollo Angular (GraphQL for submission)

## Success Criteria
- `adm-actividades` component renders successfully and passes bundle size budget constraints.
- `adm-quejas` component renders successfully and passes bundle size budget constraints.
- Tests (if applicable) pass and components initialize without errors.
