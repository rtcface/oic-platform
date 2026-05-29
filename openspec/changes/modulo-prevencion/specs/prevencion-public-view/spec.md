# prevencion-public-view Specification

## Purpose

The public interface for viewing "Evidencia de Actividades" and "Quejas por Violencia Institucional".

## Requirements

### Requirement: Public Tabs View

The system MUST display a public interface containing two main sections or tabs: "Evidencia de Actividades" and "Quejas por Violencia Institucional".

#### Scenario: User navigates to public view
- GIVEN a public user accesses the prevention module
- WHEN the view loads
- THEN the system MUST display the two tabs "Evidencia de Actividades" and "Quejas por Violencia Institucional"

### Requirement: Activity Filtering and Search

The system MUST integrate `app-finder-oic` to allow filtering and searching of activities and complaints without causing change-detection loops.

#### Scenario: User filters activities
- GIVEN the user is viewing the "Evidencia de Actividades" tab
- WHEN the user inputs search criteria in the `app-finder-oic` component
- THEN the system MUST update the displayed data to match the filter
- AND the system MUST NOT enter a change-detection loop

### Requirement: Data Presentation

The system MUST present "Evidencia de Actividades" using a data table and "Quejas por Violencia Institucional" using charts.

#### Scenario: User views activity evidence
- GIVEN the user is on the "Evidencia de Actividades" tab
- WHEN the data is loaded
- THEN the system MUST display the records in a table format

#### Scenario: User views institutional violence complaints
- GIVEN the user is on the "Quejas por Violencia Institucional" tab
- WHEN the data is loaded
- THEN the system MUST display the complaint data using charts
