@adw-37wzob-brand-rebrand-stylin
Feature: Paysdoc brand typography with Euphemia UCAS font
  As a visitor
  I want to see the Paysdoc website rendered in the Euphemia UCAS typeface
  So that the site conveys the professional Paysdoc brand identity

  @regression
  Scenario: Euphemia UCAS font files are self-hosted and loaded via @font-face
    Given the application CSS is loaded
    Then the CSS should declare @font-face rules for "Euphemia UCAS"
    And the font files should be served from "/fonts/" path
    And the following font variants should be available:
      | variant | weight | style  |
      | Regular | 400    | normal |
      | Bold    | 700    | normal |
      | Italic  | 400    | italic |

  @regression
  Scenario: Body text renders in Euphemia UCAS font family
    Given I am a visitor
    When I navigate to the homepage
    Then the body text should use "Euphemia UCAS" as the primary font family

  Scenario: Custom font loads without visible layout shift
    Given I am a visitor
    When I navigate to the homepage
    Then the page should not exhibit a flash of unstyled text (FOUT)
    And the font-display strategy should prevent layout shift
