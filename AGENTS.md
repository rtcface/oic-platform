# OIC Platform - Agent Quick Reference

## Project
- **Framework**: Angular 13.1.4
- **UI**: PrimeNG 13.1.1, PrimeIcons 5.0.0
- **API**: GraphQL via Apollo Angular
- **Auth**: Firebase + custom GraphQL
- **Testing**: Karma + Jasmine

## Commands
```bash
pnpm start              # Dev server
pnpm test                # Run all tests
pnpm exec ng test --include='**/name.spec.ts'  # Single test file
pnpm run build --configuration development  # Dev build
pnpm run build               # Production build
pnpm exec ng deploy              # Firebase (demoangular-5bde2)
```

## Critical Constraints
- **Strict TypeScript**: All strict flags enabled in tsconfig
- **Budget limits**: 500kb initial (1mb error), 2kb per component (4kb error)
- **No ESLint**: Not configured
- **Firebase**: Project is `demoangular-5bde2`

## Conventions (non-obvious)

### Imports order
1. Angular core → 2. RxJS → 3. Third-party (Apollo, PrimeNG) → 4. Interfaces → 5. Services → 6. Components

### Error handling
- Services: try-catch, return `of(false)` or empty Observable on error
- GraphQL: use `errorPolicy: 'all'` to handle errors

### Code patterns
- Component selector: `app-` prefix (e.g., `app-login`)
- Services: `providedIn: 'root'` preferred
- Form validation: use `validateField()` with touched check

## Key Files
- `src/app/graphql/` - GraphQL modules and queries
- `src/app/auth/` - Auth guards, services, login
- `src/app/shared/` - Shared components, services, models
- `src/environments/` - Environment configs (dev/prod)

## Testing
```typescript
// Basic guard/service test pattern
TestBed.configureTestingModule({});
guard = TestBed.inject(GuardName);

// With dependencies
TestBed.configureTestingModule({
  imports: [RouterTestingModule],
  declarations: [ComponentName]
}).compileComponents();
```