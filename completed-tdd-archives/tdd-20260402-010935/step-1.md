# Step 1 - Understand Intent

## Functional Requirements

### FR-1: Add a thin server adapter for Person protection evaluation
Implement a `twenty-server` service that evaluates a `Person` record with the shared CRM protection rule and returns a server-friendly result for future ownership guard integration.

### FR-2: Surface incomplete company ownership context explicitly
When a `Person` is linked to a `Company` but the company ownership status is not loaded, the server adapter must still return the shared-rule result while exposing that the ownership context is unresolved.

## Assumptions

- The next safe step is a thin Nest service and module, not a direct hook into mutation, permission, or query pipelines yet.
- For records without any linked company, the service should treat them as unfiled contacts and return an evaluable result instead of `null`.
- When only `companyId` is available, the shared rule keeps the conservative `OWNED_COMPANY` result, and the server adapter adds an explicit unresolved-context signal for later callers.
