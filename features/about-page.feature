@adw-cl62as-about-page-rewrite
Feature: About page — consultant profile
  As a visitor
  I want to see a professional profile of the consultant behind Paysdoc
  So that I can evaluate their experience, expertise, and track record

  Scenario: About page displays professional profile with experience positioning
    Given the visitor navigates to the "/about" page
    Then the page should display a professional profile of "Martin Koster"
    And the page should mention "nearly 30 years" of experience
    And the profile should position Martin as a full-stack developer

  Scenario: About page lists industries served
    Given the visitor navigates to the "/about" page
    Then the following industries should be listed:
      | industry   |
      | banking    |
      | retail     |
      | energy     |
      | government |
      | airline    |

  Scenario: About page shows key project highlights
    Given the visitor navigates to the "/about" page
    Then the page should mention the following project highlights:
      | client                        | domain                     |
      | BMG/ING                       | payments systems           |
      | Nike EMEA                     | business intelligence      |
      | Alliander                     | infrastructure migration   |
      | Ministry of Infrastructure    | systems modernisation      |

  Scenario: About page does not reveal IP-sensitive project details
    Given the visitor navigates to the "/about" page
    Then the project highlights should be described at a high level only
    And no proprietary system names or internal architecture details should be present
    And no references to "ADW" or "agent" internals should be present

  Scenario: About page displays technology expertise
    Given the visitor navigates to the "/about" page
    Then the page should list the following technologies:
      | technology  |
      | TypeScript  |
      | JavaScript  |
      | Java        |
      | React       |
      | Node.js     |
      | Spring Boot |

  Scenario: About page displays languages spoken
    Given the visitor navigates to the "/about" page
    Then the page should list the following spoken languages:
      | language   |
      | English    |
      | German     |
      | Dutch      |
      | Afrikaans  |

  Scenario: About page content is written for a non-technical audience
    Given the visitor navigates to the "/about" page
    Then the page should not contain jargon-heavy technical explanations
    And the page should not reference "ADW architecture" or "agent internals"
    And all project descriptions should be understandable by a business stakeholder
