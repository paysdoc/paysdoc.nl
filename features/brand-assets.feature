@adw-37wzob-brand-rebrand-stylin
Feature: Paysdoc brand assets (favicon, logo, headshot)
  As a visitor
  I want the website to use Paysdoc brand assets
  So that the browser tab and page visuals reflect the Paysdoc identity

  @regression
  Scenario: Favicon is the Paysdoc brand favicon
    Given the application is deployed
    When I request the favicon
    Then the favicon should be the Paysdoc brand favicon
    And it should not be the default Next.js favicon

  @regression
  Scenario: Logo image file exists at the expected path
    Given the application static assets are inspected
    Then the file "public/logo-simpel.png" should exist
    And it should be a valid image file

  Scenario: Headshot photo is available in public directory
    Given the application static assets are inspected
    Then a headshot photo file should exist in "public/"
    And it should be a valid image file

  Scenario: Font files exist in the public/fonts directory
    Given the application static assets are inspected
    Then the directory "public/fonts/" should contain Euphemia UCAS font files
    And the following font files should be present:
      | filename pattern       |
      | Euphemia UCAS Regular  |
      | Euphemia UCAS Bold     |
      | Euphemia UCAS Italic   |
