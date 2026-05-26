## Exploration: Security Hardening (NPM/PNPM Migration and Script Disabling)

### Current State
The project `oic-platform` currently manages its dependencies using `npm` with a `package-lock.json` file (lockfileVersion 2). There is no local `.npmrc` configuration file in the project root, meaning that `npm` runs with default behaviors (arbitrary package installation scripts are executed automatically).

An analysis of the existing `package-lock.json` reveals several dependencies containing lifecycle/installation scripts:
- `@angular/cli` (telemetry/analytics scripts)
- `core-js` (funding/informational scripts)
- `esbuild` (binary download/linking scripts)
- `nice-napi` (C++ optional optimization compilation)
- `fsevents` (Darwin-specific optional watching dependencies)
- `protobufjs` (postinstall scripts)

The build toolchain is based on Angular 13.1.4, which relies on `esbuild` for CSS minification and webpack for bundling. Firebase deployments target static output in `dist/oic` via the `@angular/fire:deploy` builder.

### Affected Areas
- `.npmrc` — Needs to be created in the root directory to define local hardening configurations (e.g. `ignore-scripts=true`, `audit=true`, and `shamefully-hoist=true` for Angular 13 module resolution compatibility).
- `package-lock.json` — Will be imported via `pnpm import` and then archived/removed.
- `package.json` — Will be updated with `pnpm` configuration block containing `onlyBuiltDependencies` or `allowBuilds` rules if whitelisting is chosen.
- `pnpm-lock.yaml` — Will be generated to replace the old lockfile and maintain the secure, frozen state of dependencies.
- `pnpm-workspace.yaml` — Might be created to configure workspace-level security policies (e.g. `minimumReleaseAge`, `strictDepBuilds`).

### Approaches
1. **Strict ignore-scripts on NPM and PNPM (Zero-Script Execution)**
   - Description: Create a local `.npmrc` with `ignore-scripts=true` and run all `pnpm` installs with `--ignore-scripts`. Any package requiring binary resolution (such as `esbuild`) is handled manually or run explicitly (e.g., using `pnpm rebuild esbuild` only when required).
   - Pros:
     - Guarantees that absolutely no code executes during install commands.
     - Fully conforms to a strict zero-trust model.
   - Cons:
     - May break the Angular dev server and build processes if `esbuild` fails to resolve its platform-specific binary.
     - Increases operational complexity.
   - Effort: Medium

2. **NPM Local Hardening + PNPM Native Allowlist (Recommended)**
   - Description: Create a local `.npmrc` with `ignore-scripts=true` for legacy `npm` commands. For `pnpm`, rely on its default secure-by-default behavior (which blocks lifecycle scripts automatically) and add `esbuild` to the `pnpm.onlyBuiltDependencies` block in `package.json` to allow only trusted build tools to run their scripts.
   - Pros:
     - Maintains strict security for 99%+ of packages while ensuring native build tools like `esbuild` function correctly.
     - Standard and supported configuration in modern `pnpm`.
     - Zero disruption to the Angular dev server, webpack builds, and firebase deployments.
   - Cons:
     - Allows a single known, trusted package (`esbuild`) to run its postinstall hook.
   - Effort: Low

### Recommendation
We recommend **Approach 2 (NPM Local Hardening + PNPM Native Allowlist)**. It strikes the perfect balance between high-security hardening and developer productivity. Setting `ignore-scripts=true` in `.npmrc` will secure legacy `npm` runs, while leveraging `onlyBuiltDependencies` in `package.json` for `pnpm` ensures that the critical `esbuild` binary is correctly linked for the local architecture, preventing compile-time failures. 
Additionally, we must include `shamefully-hoist=true` in the local `.npmrc` to prevent nested dependency resolution errors common in Angular 13 projects.

### Risks
- **Angular 13 module resolution failure:** Angular 13's loaders and compiler-cli can fail to resolve peer dependencies in `node_modules` if they are not flattened.
  - *Mitigation:* Ensure `shamefully-hoist=true` is enabled in `.npmrc`.
- **`esbuild` compilation/binary error:** Running installs without allowing the `esbuild` script can result in a missing compiler binary.
  - *Mitigation:* Whitelist `esbuild` in `pnpm.onlyBuiltDependencies` in `package.json`.
- **Firebase deploy commands failure:** The deployment builder might fail to run if `pnpm` doesn't link binary scripts correctly in `.bin`.
  - *Mitigation:* Verify local builds (`ng build --configuration production`) and test firebase configuration locally using dry runs or emulator suites.

### Ready for Proposal
Yes — The orchestrator should tell the user that the codebase has been analyzed, key packages with scripts identified, and a clear proposal can now be drafted implementing FASE 1 and FASE 2 with minimal regression risk by using local `.npmrc` settings and `pnpm.onlyBuiltDependencies` whitelisting.
