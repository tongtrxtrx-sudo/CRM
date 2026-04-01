# Scenario: Person protection server adapter
- Given: A `Person` record may be unfiled, linked to a public pool company, or linked to an owned company
- When: The server adapter evaluates the record with the shared CRM protection rule
- Then: The adapter returns the protection state, whether ownership protection can be bypassed, and whether the company ownership context is fully resolved

## Test Steps

- Case 1 (happy path): Person without any company should be evaluated as `UNFILED_CONTACT` and bypass ownership protection
- Case 2 (happy path): Person linked to a public pool company should bypass ownership protection
- Case 3 (happy path): Person linked to an owned company should stay protected
- Case 4 (edge case): Person with only `companyId` should expose unresolved company ownership context

## Status
- [x] Write scenario document
- [x] Write solid test according to document
- [x] Run test and watch it failing
- [x] Implement to make test pass
- [x] Run test and confirm it passed
- [x] Refactor implementation without breaking test
- [x] Run test and confirm still passing after refactor
