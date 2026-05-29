# Proposal: modulo-prevencion

## Intent
Introduce a Prevention module (Módulo de Prevención) containing a public interface for viewing "Evidencia de Actividades" and "Quejas por Violencia Institucional", and a protected admin interface for capturing this data.

## Scope

### In Scope
- Public page with two tabs: "Evidencia de Actividades" and "Quejas por Violencia Institucional".
- Integration of `app-finder-oic` to filter and search within the tabs.
- Data presentation using tables for activities and charts for complaints.
- Admin dashboard to capture detailed activity records and complaint totals per municipality.
- Emulating the menu using `SharedService`'s `get_menu_portal` for `type == 'oic'`.
- Exporting `TabViewModule` and `TableModule` in `PrimeNgModule`.

### Out of Scope
- Modifications to core auth logic beyond standard route guards for the admin panel.
- Editing or deleting existing records (only capturing for now).
- Expanding the module to other OIC functionalities.

## Capabilities

### New Capabilities
- `prevencion-public-view`: Public interface with tabs, tables, and charts to view prevention activities and institutional violence complaints.
- `prevencion-admin-capture`: Protected admin interface to input activity details and aggregate complaint data.

### Modified Capabilities
- None

## Approach
Create a lazy-loaded `PrevencionModule` containing both public and admin sub-modules. The public view will use PrimeNG's `TabView`, `Table`, and Chart components, heavily relying on the existing `app-finder-oic` for filtering. State management around `app-finder-oic` requires one-way or explicit data binding to prevent change-detection loops when form state resets.
For navigation, `SharedService.get_menu_portal()` will be intercepted to populate the OIC menu dynamically.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/shared/prime-ng/prime-ng.module.ts` | Modified | Add `TabViewModule`, `TableModule`, `ChartModule` exports. |
| `src/app/shared/services/shared.service.ts` | Modified | Adjust `get_menu_portal` to support `oic` type menu items. |
| `src/app/prevencion/` | New | Public and protected feature modules for prevention. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Change-detection loops with `app-finder-oic` | High | Implement careful unidirectional data binding; debounce filter inputs. |
| Menu conflicts for other module types | Low | Scoped condition strictly to `type == 'oic'` in `get_menu_portal`. |

## Rollback Plan
Revert changes to `PrimeNgModule` and `SharedService`. Remove the `PrevencionModule` folder and un-register its lazy-loaded route from the main router configuration.

## Dependencies
- PrimeNG UI library (`TabView`, `Table`, `Chart`).
- Existing `app-finder-oic` component.

## Success Criteria
- [ ] Public users can search and view activities and complaint charts.
- [ ] Admins can log in and successfully save new activity details and municipality complaints.
- [ ] No infinite change-detection loops triggered by `app-finder-oic` interaction.
