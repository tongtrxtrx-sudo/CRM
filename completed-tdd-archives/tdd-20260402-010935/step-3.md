# Step 3 - Write Failing Test

## Failing Tests Created

- FR-1: Add a thin server adapter for Person protection evaluation - `docs/scenario/person-protection-service.md` - `packages/twenty-server/src/engine/core-modules/person-protection/services/__tests__/person-protection.service.spec.ts`

## Failure Evidence

- Command: `node .yarn/releases/yarn-4.9.2.cjs nx run twenty-server:jest -- --runInBand --runTestsByPath src/engine/core-modules/person-protection/services/__tests__/person-protection.service.spec.ts`
- Result: failed as expected because `src/engine/core-modules/person-protection/services/person-protection.service` does not exist yet
