## Exploration: protected-prevencion-forms

### Current State
The `protected` module serves authenticated users (like 'entes') and currently contains forms for KPIs, Workplans, Code of Ethics, etc. Navigation is provided by `AdmHomeComponent` via the `SharedService`. There is a separate `prevencion` module which handles public views and a separate admin view. To feed data into the public interface, authenticated users need new forms for "Actividades" (evidence) and "Quejas" (complaints). Currently, all user-facing administrative forms reside as flat components inside `src/app/protected/pages/`.

### Affected Areas
- `src/app/protected/pages/` — Destination for the new form components.
- `src/app/protected/protected.module.ts` — Needs declarations and form imports (like `ReactiveFormsModule`) for the new components.
- `src/app/protected/protected-routing.module.ts` — Needs new route definitions (e.g., `/adm-actividades` and `/adm-quejas`).
- `src/app/shared/services/shared.service.ts` — May need updates if these new forms must be hardcoded into the portal menu (though menu items are primarily driven by the `getMenuForRole` GraphQL query).

### Approaches
1. **Separate Components (Recommended)** — Create `adm-actividades` and `adm-quejas` directly in `protected/pages/`.
   - Pros: Matches the existing architectural pattern of the module; ensures we do not hit the strict 2kb per component limit.
   - Cons: Adds slightly more boilerplate to the routing module.
   - Effort: Medium

2. **Unified Prevencion Component** — Create a single `adm-prevencion` component using PrimeNG `TabView` to switch between forms.
   - Pros: Logical grouping of related data under a single route.
   - Cons: High risk of exceeding the 2kb component size limit; mixes two distinct business logic flows (Activities vs. Complaints).
   - Effort: Low

3. **New Protected Submodule** — Encapsulate these forms into a `protected-prevencion` module that is lazy-loaded by the `protected` module.
   - Pros: Cleanest separation of concerns.
   - Cons: Breaks the established flat architecture of the `protected` module.
   - Effort: High

### Recommendation
**Separate Components** (`adm-actividades` and `adm-quejas`). This approach natively fits the existing pattern in `protected/pages`, prevents large bundle sizes by splitting the forms, and keeps GraphQL integration distinct for each data type.

### Risks
- Hitting the strict 2kb component budget if forms contain too much static template code.
- Typings: The GraphQL schema and interfaces for `Actividades` and `Quejas` must be strictly defined to pass the project's strict TypeScript checks without `any` types.

### Ready for Proposal
Yes — the orchestrator should inform the user that we will proceed with creating separate components for Actividades and Quejas inside the `protected` module to adhere to the component size limits.
