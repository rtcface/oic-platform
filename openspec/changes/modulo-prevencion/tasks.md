# Tasks: modulo-prevencion

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 350 - 500 lines |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 (Foundation) → PR 2 (Public) → PR 3 (Admin) |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Foundation & Shared | PR 1 | Base branch: `main`. Update PrimeNG module, SharedService, and create PrevencionModule. |
| 2 | Public View | PR 2 | Base branch: PR 1. Implements Tabs, Finder, Table, Chart. |
| 3 | Admin View | PR 3 | Base branch: PR 2. Implements protected capture forms and routing. |

## Phase 1: Foundation & Shared Setup

- [x] 1.1 Edit `src/app/shared/prime-ng/prime-ng.module.ts` to export `TabViewModule`, `TableModule`, and `ChartModule`.
- [x] 1.2 Edit `src/app/shared/services/shared.service.ts` to add support for `type == 'oic'` in `get_menu_portal()`.
- [x] 1.3 Create `src/app/prevencion/prevencion.module.ts` and `src/app/prevencion/prevencion-routing.module.ts`.
- [x] 1.4 Register `PrevencionModule` as a lazy-loaded route in the main app routing module.

## Phase 2: Core Public Implementation

- [x] 2.1 Create `src/app/prevencion/public/prevencion-public.component.ts` (with HTML/SCSS). Map in routing.
- [x] 2.2 Add `p-tabView` in HTML with tabs for "Evidencia de Actividades" and "Quejas por Violencia Institucional".
- [x] 2.3 Integrate `app-finder-oic` into `prevencion-public.component`. Use unidirectional binding to avoid change-detection loops.
- [x] 2.4 Add `p-table` in the first tab to display activities data.
- [x] 2.5 Add `p-chart` in the second tab to display complaints data.

## Phase 3: Core Admin Implementation

- [x] 3.1 Create `src/app/prevencion/admin/prevencion-admin.component.ts` (with HTML/SCSS).
- [x] 3.2 Map admin route in `prevencion-routing.module.ts` and protect it with standard auth guards.
- [x] 3.3 Add form to capture activity details in the admin component.
- [x] 3.4 Add form to capture complaint totals per municipality in the admin component.

## Phase 4: Testing & Verification

- [ ] 4.1 Write component tests for `PrevencionPublicComponent` verifying tabs and finder integration.
- [x] 4.2 Write component tests for `PrevencionAdminComponent` verifying auth guards and form interactions, including success confirmations.
- [ ] 4.3 Verify routing and module lazy loading end-to-end.
