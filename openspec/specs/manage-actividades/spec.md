# manage-actividades Specification

## Purpose
Allow authorized users to submit and manage prevention-related activities (Actividades) data via a protected route.

## Requirements

### Requirement: Form Access
The system MUST allow authenticated users with appropriate permissions to access the Actividades form.
#### Scenario: Authorized access
- GIVEN a user is logged in
- WHEN the user navigates to `/protected/actividades`
- THEN the system renders the `adm-actividades` component form.

### Requirement: Form Submission
The system MUST allow users to fill out and submit the Actividades form.
#### Scenario: Valid submission
- GIVEN the user has filled all required fields in the Actividades form
- WHEN the user clicks the submit button
- THEN the system sends a GraphQL mutation to save the activity
- AND displays a success message to the user upon successful response.

### Requirement: Form Validation
The system MUST validate the Actividades form fields before submission.
#### Scenario: Invalid submission attempts
- GIVEN the user has left required fields empty
- WHEN the user attempts to submit the form
- THEN the system prevents submission
- AND displays validation error messages for the empty required fields.

### Requirement: Bundle Budget Constraint
The system MUST maintain the `adm-actividades` component size under the 2kb budget limit.
#### Scenario: Component compilation
- GIVEN the application is building for production
- WHEN the `adm-actividades` component is compiled
- THEN its bundle size is measured to be under 2kb.
