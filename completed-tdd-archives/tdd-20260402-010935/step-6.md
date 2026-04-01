# Step 6 - Regression Test

## Regression Test Results

- Scoped regression suite executed: `node .yarn/releases/yarn-4.9.2.cjs nx run twenty-server:jest -- --runInBand --runTestsByPath src/engine/core-modules/company-public-pool/utils/__tests__/build-company-public-pool-patch.util.spec.ts src/engine/core-modules/company-public-pool/services/__tests__/company-public-pool.service.spec.ts src/engine/core-modules/person-protection/services/__tests__/person-protection.service.spec.ts`
- Scoped CRM server adapter suites pass: Yes
- Lint verification executed: `node .yarn/releases/yarn-4.9.2.cjs eslint packages/twenty-server/src/engine/core-modules/person-protection/person-protection.module.ts packages/twenty-server/src/engine/core-modules/person-protection/services/person-protection.service.ts packages/twenty-server/src/engine/core-modules/person-protection/services/__tests__/person-protection.service.spec.ts packages/twenty-server/src/engine/core-modules/core-engine.module.ts`
- Full `twenty-server` Jest suite was not executed in this cycle
