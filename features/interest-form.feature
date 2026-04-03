@adw-ncd0ia-interest-capture-api
Feature: InterestForm Component
  As a visitor
  I want a form to register my interest in the Paysdoc pilot
  So that I can be contacted when the pilot launches

  Scenario: Form displays email input and submit button
    Given the visitor is viewing the InterestForm component
    Then an email input field should be visible
    And a submit button should be visible

  Scenario: Successful email submission shows confirmation
    Given the visitor is viewing the InterestForm component
    When the visitor enters "interested@example.com" in the email field
    And the visitor clicks the submit button
    Then a success confirmation message should be displayed
    And the email input should no longer be visible

  Scenario: Client-side validation rejects invalid email
    Given the visitor is viewing the InterestForm component
    When the visitor enters "bad-email" in the email field
    And the visitor clicks the submit button
    Then a validation error message should be displayed
    And no request should be sent to the server

  Scenario: Client-side validation rejects empty email
    Given the visitor is viewing the InterestForm component
    When the visitor leaves the email field empty
    And the visitor clicks the submit button
    Then a validation error message should be displayed
    And no request should be sent to the server

  Scenario: Server error displays error state
    Given the visitor is viewing the InterestForm component
    And the API endpoint "/api/interest" will return a 500 error
    When the visitor enters "unlucky@example.com" in the email field
    And the visitor clicks the submit button
    Then an error message should be displayed
    And the form should remain interactive for retry

  Scenario: Form posts to the correct API endpoint
    Given the visitor is viewing the InterestForm component
    When the visitor enters "check@example.com" in the email field
    And the visitor clicks the submit button
    Then a POST request should be sent to "/api/interest" with the email "check@example.com"
