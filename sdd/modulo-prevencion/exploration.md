## Exploration: modulo-prevencion

### Current State
Currently, `oic-platform` has an OIC module (`src/app/oic`) that handles public-facing features and a protected module (`src/app/protected`) for admin capabilities. The application uses PrimeNG for UI components, Apollo GraphQL for backend communication, and a shared module to supply common pages like `finder-oic` and `nav-menu`. The menu response is handled by `SharedService.get_menu_portal`, which queries the backend to fetch menu items dynamically.

### Affected Areas
- `src/app/prime-ng/prime-ng.module.ts` — Requires exporting `TabViewModule` and `TableModule` to support the tabs and tables.
- `src/app/shared/services/shared.service.ts` — Requires emulation to inject the "Prevención" menu item.
- `src/app/oic/oic-routing.module.ts` & `src/app/oic/oic.module.ts` — Needs a new route (`prevencion`) and its components.
- `src/app/protected/protected-routing.module.ts` & `src/app/protected/protected.module.ts` — Needs administrative counterparts.

### Approaches
1. **Component-centric Approach (Recommended)**
   - Create a single `PrevencionComponent` in `src/app/oic/pages/` containing `p-tabView` with two tabs (`p-tabPanel`).
   - Use `app-finder-oic` inside each tab for municipality selection.
   - For Tab 1 (Evidence): use `p-table` to list activities, with a router-link on each row to navigate to a child component (e.g., `EvidenciaDetalleComponent`) displaying attached evidence.
   - For Tab 2 (Complaints): use `p-chart` to render a Pie/Doughnut chart with totals (Presented, Proceeded, Did not proceed).
   - In `src/app/protected`, create `AdmPrevencionComponent` using a similar tab structure but with forms (e.g., ReactiveForms) to capture the evidence and complain totals.
   - Menu emulation: Intercept the `get_menu_portal` response or append the `Prevención` item after fetching from the backend if `type == 'oic'`.
   - **Pros**: Groups logically related functionality. Consistent with the existing module structure.
   - **Cons**: `PrevencionComponent` could become large if logic isn't delegated to services.
   - **Effort**: Medium

2. **Feature-module Approach**
   - Create a new `PrevencionModule` nested inside `oic` and `protected` respectively. Each tab becomes a separate page component with its own route instead of `p-tabView`.
   - Menu emulation will add a dropdown for "Prevención" with two sub-items.
   - **Pros**: Smaller, highly decoupled components.
   - **Cons**: Overhead of creating multiple new modules; deviates slightly from the explicit "component with tabs" requirement.
   - **Effort**: High

### Recommendation
Option 1 (Component-centric Approach). It strictly follows the "component with tabs" requirement and integrates smoothly into the existing `oic` and `protected` lazy-loaded modules without over-engineering. We must add `TabViewModule` and `TableModule` to `PrimeNgModule`.

### Risks
- `app-finder-oic` currently fetches from GraphQL and resets form state on selection. We must ensure it correctly binds selected OIC data into the tab components without causing infinite change-detection loops (as changeDetection strategy might be `OnPush`).
- PrimeNG version is 13.1.1; we must ensure the `TabView` API used matches this version.
- Mocking a backend response for the menu requires touching `SharedService`, which might affect other portals (like `plt`). Need to safely scope the "Prevención" mock to `oic` menu only.

### Ready for Proposal
Yes. The orchestrator should proceed to `sdd-propose` using the recommended component-centric approach.
