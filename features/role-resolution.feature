@adw-1l6tsn-role-resolution-admi
Feature: Role resolution by email address
  As the application
  I want to determine a user's role based on their email address
  So that admin and client users have appropriate access levels

  @regression
  Scenario: Admin email paysdoc@gmail.com resolves to admin role
    Given a user with email "paysdoc@gmail.com" is authenticated
    When the session is created
    Then the session should contain the role "admin"

  @regression
  Scenario: Admin email martin@paysdoc.nl resolves to admin role
    Given a user with email "martin@paysdoc.nl" is authenticated
    When the session is created
    Then the session should contain the role "admin"

  Scenario: Non-admin email resolves to client role
    Given a user with email "jane@example.com" is authenticated
    When the session is created
    Then the session should contain the role "client"

  Scenario: Role resolution is case-insensitive for uppercase email
    Given a user with email "PAYSDOC@GMAIL.COM" is authenticated
    When the session is created
    Then the session should contain the role "admin"

  Scenario: Role resolution is case-insensitive for mixed-case email
    Given a user with email "Martin@Paysdoc.NL" is authenticated
    When the session is created
    Then the session should contain the role "admin"
