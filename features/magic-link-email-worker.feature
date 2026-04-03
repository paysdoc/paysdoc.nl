@adw-gt6dc8-magic-link-login-ema
Feature: Magic link email worker
  As the application
  I want a Cloudflare Worker to send magic link emails
  So that users receive a verification link to authenticate

  Scenario: Worker receives verification request and sends an email
    Given the magic link email worker is running
    When Auth.js sends a verification request for "user@example.com" with a verification URL
    Then the worker should send an email to "user@example.com"
    And the email should contain the verification URL as a clickable magic link

  Scenario: Email contains a correctly formatted magic link
    Given the magic link email worker is running
    When a magic link email is sent to "user@example.com"
    Then the email subject should indicate a sign-in request
    And the email body should contain a clickable link with the verification URL
    And the email should be sent from the configured sending address

  Scenario: Worker rejects requests with missing email address
    Given the magic link email worker is running
    When a verification request is received without an email address
    Then the worker should return an error response
    And no email should be sent

  Scenario: Worker rejects requests with missing verification URL
    Given the magic link email worker is running
    When a verification request is received without a verification URL
    Then the worker should return an error response
    And no email should be sent

  Scenario: Worker is deployable from this repo
    Given the Cloudflare Worker source code exists in this repository
    When I run the worker build command
    Then the build should succeed without errors

  Scenario: DNS setup requirements are documented
    Given the project documentation exists
    Then there should be documentation for SPF record configuration
    And there should be documentation for DKIM record configuration
    And the documentation should specify the sending domain requirements

  Scenario: Email is delivered within a reasonable time
    Given the magic link email worker is running
    When Auth.js sends a verification request for "user@example.com" with a verification URL
    Then the email should be queued for delivery within 5 seconds
