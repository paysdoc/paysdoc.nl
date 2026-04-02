@adw-37wzob-brand-rebrand-stylin
Feature: Paysdoc burgundy/magenta color palette
  As a visitor
  I want to see the Paysdoc website styled in the burgundy/magenta brand palette
  So that the visual identity is consistent with the Paysdoc huisstijl

  @regression
  Scenario: Light mode uses burgundy/magenta accent colors
    Given I am a visitor using light mode
    When I navigate to the homepage
    Then the CSS accent color variable should use a burgundy or magenta hue
    And the accent color should not be blue "#2563eb"

  @regression
  Scenario: Dark mode uses burgundy/magenta accent colors
    Given I am a visitor using dark mode
    When I navigate to the homepage
    Then the CSS accent color variable should use a burgundy or magenta hue
    And the accent color should not be blue "#3b82f6"

  @regression
  Scenario: No remaining references to the old blue color scheme
    Given the application source code is inspected
    Then the CSS should not contain the color "#2563eb"
    And the CSS should not contain the color "#1d4ed8"
    And the CSS should not contain the color "#3b82f6"
    And the CSS should not contain the color "#60a5fa"

  Scenario: Light mode background and foreground have sufficient contrast
    Given I am a visitor using light mode
    When I navigate to the homepage
    Then the foreground text should have sufficient contrast against the background
    And interactive elements should be clearly distinguishable

  Scenario: Dark mode background and foreground have sufficient contrast
    Given I am a visitor using dark mode
    When I navigate to the homepage
    Then the foreground text should have sufficient contrast against the background
    And interactive elements should be clearly distinguishable
