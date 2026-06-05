# Tasks: protected-prevencion-forms

## Review Workload Forecast

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

Not needed, under 400 lines budget.

## Phase 1: Foundation (Models and Service)

- [x] 1.1 Add `Actividad` and `Queja` interfaces to `src/app/shared/models/` (or update existing interfaces file).
- [x] 1.2 Update `src/app/shared/services/shared.service.ts` to add `save_Actividad` and `save_Queja` methods with GraphQL mutations.
- [x] 1.3 Update `src/app/shared/services/shared.service.spec.ts` to verify the new methods.

## Phase 2: Core Implementation - Actividades Form

- [x] 2.1 Generate `adm-actividades` component in `src/app/protected/pages/`.
- [x] 2.2 Declare `AdmActividadesComponent` in `src/app/protected/protected.module.ts`.
- [x] 2.3 Implement the reactive form in `adm-actividades.component.ts` with validations.
- [x] 2.4 Build the template in `adm-actividades.component.html` using PrimeNG components.
- [x] 2.5 Wire submission to `SharedService.save_Actividad()` and show toasts on completion.
- [x] 2.6 Add the `actividades` route to `src/app/protected/protected-routing.module.ts`.

## Phase 3: Core Implementation - Quejas Form

- [x] 3.1 Generate `adm-quejas` component in `src/app/protected/pages/`.
- [x] 3.2 Declare `AdmQuejasComponent` in `src/app/protected/protected.module.ts`.
- [x] 3.3 Implement the reactive form in `adm-quejas.component.ts` with validations.
- [x] 3.4 Build the template in `adm-quejas.component.html` using PrimeNG components.
- [x] 3.5 Wire submission to `SharedService.save_Queja()` and show toasts on completion.
- [x] 3.6 Add the `quejas` route to `src/app/protected/protected-routing.module.ts`.

## Phase 4: Testing & Verification

- [x] 4.1 Write component tests in `adm-actividades.component.spec.ts` for validation and submission.
- [x] 4.2 Write component tests in `adm-quejas.component.spec.ts` for validation and submission.
- [x] 4.3 Run `pnpm run build --configuration development` to verify the 2kb bundle budget constraint.
