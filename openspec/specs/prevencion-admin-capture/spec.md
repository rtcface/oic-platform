# prevencion-admin-capture Specification

## Purpose

The protected admin interface to capture activity details and aggregate complaint data per municipality.

## Requirements

### Requirement: Protected Access

The system MUST restrict access to the admin capture interface using standard route guards.

#### Scenario: Unauthenticated user access attempt
- GIVEN an unauthenticated user
- WHEN they attempt to access the prevention admin capture route
- THEN the system MUST redirect them to the login page or deny access

#### Scenario: Authenticated admin access
- GIVEN an authenticated admin user
- WHEN they access the prevention admin capture route
- THEN the system MUST grant access and display the capture dashboard

### Requirement: Capture Activity Records

The system MUST allow admins to input and save detailed activity records.

#### Scenario: Admin saves a new activity record
- GIVEN an admin is on the capture dashboard
- WHEN they fill out the activity record form and submit
- THEN the system MUST save the activity details
- AND the system MUST display a success confirmation

### Requirement: Capture Complaint Totals

The system MUST allow admins to input and save complaint totals grouped by municipality.

#### Scenario: Admin saves complaint totals
- GIVEN an admin is on the capture dashboard
- WHEN they fill out the complaint totals for a municipality and submit
- THEN the system MUST save the complaint data
- AND the system MUST display a success confirmation
