@adw-ncd0ia-interest-capture-api
Feature: Interest Capture API
  As the site owner
  I want an API endpoint that stores visitor emails in Workers KV
  So that I can follow up with people interested in the pilot

  Background:
    Given the KV namespace "INTEREST_KV" is bound in the Cloudflare environment

  @regression
  Scenario: Valid email is stored and returns 201
    When a POST request is sent to "/api/interest" with body:
      | email              |
      | visitor@example.com |
    Then the response status should be 201
    And the response body should contain a success message
    And the email "visitor@example.com" should be stored in KV with a timestamp

  @regression
  Scenario: Invalid email returns 400
    When a POST request is sent to "/api/interest" with body:
      | email       |
      | not-an-email |
    Then the response status should be 400
    And the response body should contain an error message about invalid email format

  Scenario: Empty email returns 400
    When a POST request is sent to "/api/interest" with body:
      | email |
      |       |
    Then the response status should be 400
    And the response body should contain an error message about invalid email format

  Scenario: Missing email field returns 400
    When a POST request is sent to "/api/interest" with body:
      """
      {}
      """
    Then the response status should be 400

  @regression
  Scenario: Duplicate email submission is idempotent
    Given the email "returning@example.com" is already stored in KV
    When a POST request is sent to "/api/interest" with body:
      | email                |
      | returning@example.com |
    Then the response status should be 201
    And the email "returning@example.com" should be stored in KV with an updated timestamp
    And no error should be returned

  Scenario: Email is stored with ISO 8601 timestamp
    When a POST request is sent to "/api/interest" with body:
      | email              |
      | timed@example.com  |
    Then the response status should be 201
    And the KV value for "timed@example.com" should contain a valid ISO 8601 timestamp

  Scenario: KV namespace is bound in wrangler.jsonc
    Then the file "wrangler.jsonc" should contain a KV namespace binding named "INTEREST_KV"

  Scenario: KV namespace is typed in cloudflare-env.d.ts
    Then the file "cloudflare-env.d.ts" should declare "INTEREST_KV" as a KVNamespace on CloudflareEnv
