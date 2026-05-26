# Proposal: Security Hardening

## Intent

Secure the project from automatic dependency script execution and migrate from NPM to PNPM for symbolic link safety.

## Scope

### In Scope
- Local `.npmrc` configuration (`ignore-scripts=true`, `shamefully-hoist=true`)
- Migration from NPM to PNPM
- Whitelisting `esbuild` in `package.json` under `pnpm.onlyBuiltDependencies`
- Verifying local dev server and build execution

### Out of Scope
- CI/CD pipeline security configuration hardening
- NPM registry publication hardening (private package deployed to Firebase)

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- None

## Approach

1. Create root `.npmrc` with security restrictions.
2. Run `pnpm import` to convert `package-lock.json` to `pnpm-lock.yaml`.
3. Add `onlyBuiltDependencies` whitelist for `esbuild` in `package.json`.
4. Delete `package-lock.json` and existing `node_modules`.
5. Run `pnpm install` securely.
6. Verify local dev environment and production builds.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `.npmrc` | New | Local security and resolution rules |
| `package.json` | Modified | Add `onlyBuiltDependencies` config |
| `package-lock.json` | Removed | Replaced by `pnpm-lock.yaml` |
| `pnpm-lock.yaml` | New | Main lockfile for dependencies |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Angular 13 resolution issues | Medium | Mitigated by using `shamefully-hoist=true` |
| Missing `esbuild` compiler binary | High | Mitigated by whitelisting `esbuild` |
| Firebase deployment issues | Low | Mitigated by local build verification |

## Rollback Plan

To revert to NPM environment:
1. Re-checkout `package-lock.json` and `package.json` from git.
2. Delete `.npmrc`, `pnpm-lock.yaml`, and `node_modules/`.
3. Run `npm install` to restore packages.

## Dependencies

- Local installation of `pnpm` CLI.

## Success Criteria

- [ ] `pnpm-lock.yaml` is successfully generated.
- [ ] `pnpm install` runs and installs dependencies with script blocking active.
- [ ] `ng build --configuration production` runs and succeeds (no budget impact).
- [ ] `ng serve` starts the local dev server successfully.
