@adw-t7sfbq-about-page-rewrite
Feature: About page — professional consultant profile
  As a visitor
  I want to see a professional profile of the consultant behind Paysdoc
  So that I can assess credibility and experience before engaging

  # --- Professional positioning ---

  @regression @adw-t7sfbq-about-page-rewrite
  Scenario: About page displays professional experience positioning
    Given I am a visitor
    When I navigate to the "/about" page
    Then the page should contain text referencing "nearly 30 years" of experience
    And the page should identify Martin Koster as a full-stack developer

  # --- Industries served ---

  @regression @adw-t7sfbq-about-page-rewrite
  Scenario: About page lists industries served
    Given I am a visitor
    When I navigate to the "/about" page
    Then the page should mention the banking industry
    And the page should mention the retail industry
    And the page should mention the energy industry
    And the page should mention the government industry
    And the page should mention the airline industry

  # --- Key project highlights ---

  @regression @adw-t7sfbq-about-page-rewrite
  Scenario: About page shows key project highlights
    Given I am a visitor
    When I navigate to the "/about" page
    Then the page should mention "BMG" or "ING" in relation to payments systems
    And the page should mention "Nike EMEA" in relation to business intelligence
    And the page should mention "Alliander" in relation to infrastructure migration
    And the page should mention "Ministry of Infrastructure" in relation to systems modernisation

  @adw-t7sfbq-about-page-rewrite
  Scenario: Project highlights do not reveal IP-sensitive details
    Given I am a visitor
    When I navigate to the "/about" page
    Then the page should not contain proprietary system names or internal codenames
    And the project descriptions should remain at a high-level summary

  # --- Technology expertise ---

  @regression @adw-t7sfbq-about-page-rewrite
  Scenario: About page displays technology expertise
    Given I am a visitor
    When I navigate to the "/about" page
    Then the page should mention "TypeScript"
    And the page should mention "JavaScript"
    And the page should mention "Java"
    And the page should mention "React"
    And the page should mention "Node.js"
    And the page should mention "Spring Boot"

  # --- Languages spoken ---

  @regression @adw-t7sfbq-about-page-rewrite
  Scenario: About page lists languages spoken
    Given I am a visitor
    When I navigate to the "/about" page
    Then the page should list "English" as a spoken language
    And the page should list "German" as a spoken language
    And the page should list "Dutch" as a spoken language
    And the page should list "Afrikaans" as a spoken language

  # --- Non-technical audience ---

  @adw-t7sfbq-about-page-rewrite
  Scenario: About page content is written for a non-technical audience
    Given I am a visitor
    When I navigate to the "/about" page
    Then the page should not contain the term "ADW"
    And the page should not contain the term "webhook"
    And the page should not contain the term "CI/CD"
    And the page should not contain the term "issue-to-PR"
    And the page should not reference agent architecture or internals

  @adw-t7sfbq-about-page-rewrite
  Scenario: About page is accessible from the main navigation
    Given I am a visitor
    When I navigate to the homepage
    Then the Navbar should contain an "About" link
    When I click the "About" link
    Then I should be on the "/about" page
