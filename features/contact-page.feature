@adw-ncd0ia-interest-capture-api
Feature: Contact Page
  As a visitor
  I want a contact page with an interest form and direct contact details
  So that I can register my interest or reach out to Paysdoc directly

  Scenario: Contact page displays the InterestForm
    Given the visitor navigates to the "/contact" page
    Then the InterestForm component should be displayed
    And the Cal.com booking embed should not be present

  Scenario: Contact page displays direct contact details
    Given the visitor navigates to the "/contact" page
    Then the email address "info@paysdoc.nl" should be displayed
    And a LinkedIn link should be displayed
    And a GitHub link should be displayed

  Scenario: CalEmbed component is removed from contact page
    Given the visitor navigates to the "/contact" page
    Then there should be no calendar or booking widget on the page

  Scenario: Visitor can submit interest from the contact page
    Given the visitor navigates to the "/contact" page
    When the visitor enters "contact-visitor@example.com" in the email field
    And the visitor clicks the submit button
    Then a success confirmation message should be displayed

  Scenario: Contact details link to correct destinations
    Given the visitor navigates to the "/contact" page
    Then the email link should have href "mailto:info@paysdoc.nl"
    And the LinkedIn link should point to the Paysdoc LinkedIn profile
    And the GitHub link should point to the Paysdoc GitHub profile
