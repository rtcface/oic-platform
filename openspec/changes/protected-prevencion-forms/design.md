# Design: protected-prevencion-forms
## Technical Approach
Create two new feature components in the protected module: `adm-actividades` and `adm-quejas` following the existing `adm-users` pattern. They will include PrimeNG reactive forms or template-driven forms matching the current project standards. The `SharedService` will be extended with the necessary Apollo GraphQL queries and mutations to handle data persistence, and the components will be registered in `ProtectedRoutingModule`.

## Architecture Decisions
### Decision: Component Placement
**Choice**: Place inside `src/app/protected/pages/` as `adm-actividades` and `adm-quejas`.
**Alternatives considered**: Place them in `src/app/shared/` or create a separate feature module.
**Rationale**: These are view/page components for the protected area, so they belong in `protected/pages` aligning with the existing `adm-users` and `adm-workplan` structure.

### Decision: GraphQL Service Integration
**Choice**: Extend the existing `SharedService` (`src/app/shared/services/shared.service.ts`) with new methods for the forms.
**Alternatives considered**: Create a new dedicated service (e.g., `ActividadesService`, `QuejasService`).
**Rationale**: Currently, `SharedService` aggregates state and various GraphQL operations (like `save_Colaborador`, `save_President`). Extending it keeps the data access pattern consistent and limits the injection footprint in components.

## Data Flow
1. User navigates to `/adm-actividades` or `/adm-quejas`.
2. Component initializes and fetches any required dropdown or reference data via `SharedService`.
3. User fills out the PrimeNG form and submits.
4. Component calls `save_Actividad()` or `save_Queja()` in `SharedService`.
5. `SharedService` executes the GraphQL mutation via Apollo.
6. On completion, PrimeNG `MessageService` displays a success or error toast.

## File Changes
| File | Action | Description |
|---|---|---|
| `src/app/protected/pages/adm-actividades/` | Create | New folder with component, template, and styles for Actividades. |
| `src/app/protected/pages/adm-quejas/` | Create | New folder with component, template, and styles for Quejas. |
| `src/app/protected/protected-routing.module.ts` | Modify | Add routes for `adm-actividades` and `adm-quejas`. |
| `src/app/shared/services/shared.service.ts` | Modify | Add `save_Actividad`, `save_Queja`, and relevant GraphQL queries/mutations. |
| `src/app/protected/protected.module.ts` | Modify | Declare new components. |

## Interfaces / Contracts
- New input models for GraphQL mutations need to be added to `src/app/shared/models/`:
  - **Actividad**: `titulo` (string), `descripcion` (string), `evidencias` (array of `{ titulo: string, archivo: File/Base64 }`).
  - **Queja**: `procedentes` (number), `improcedentes` (number).
  - *Nota*: En ambos casos, el `ente_publico` se toma automáticamente del usuario logueado, por lo que no es necesario capturarlo en los formularios.

## Testing Strategy
- Unit tests (`.spec.ts`) for both new components using `TestBed` and `RouterTestingModule`.
- Mock `SharedService` and `MessageService` to verify form submission, error handling, and toast notifications.

## Migration / Rollout
- Standard Angular deployment via `ng deploy` to Firebase. No environment variables required as it leverages existing endpoints.
