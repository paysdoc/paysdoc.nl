@adw-rvwtyw-client-repo-manageme
Feature: Client dashboard for repository management
  As a client user
  I want to see a dashboard where I can manage my repositories
  So that I can register and track my repos linked to Paysdoc projects

  @regression
  Scenario: Authenticated client sees the dashboard with repo list
    Given I am an authenticated user with email "jane@example.com"
    And my role is "client"
    When I navigate to "/dashboard"
    Then I should see the dashboard page
    And I should see a "My Repositories" section
    And I should see an "Add Repository" form

  @regression
  Scenario: Dashboard displays "more functionality coming soon" message
    Given I am an authenticated user with email "jane@example.com"
    And my role is "client"
    When I navigate to "/dashboard"
    Then I should see a message "More functionality coming soon"

  Scenario: Client with no repos sees an empty repo list
    Given I am an authenticated user with email "jane@example.com"
    And my role is "client"
    And I have no registered repositories
    When I navigate to "/dashboard"
    Then I should see an empty repository list
    And I should see the "Add Repository" form

  Scenario: Client sees only their own repos, not other clients' repos
    Given I am an authenticated user with email "jane@example.com"
    And my role is "client"
    And I have a registered repository "https://github.com/jane/my-project"
    And another client has a registered repository "https://github.com/bob/other-project"
    When I navigate to "/dashboard"
    Then I should see "jane/my-project" in the repository list
    And I should not see "bob/other-project" in the repository list

  Scenario: Repo list shows repo name, URL, and linked project for matched repos
    Given I am an authenticated user with email "jane@example.com"
    And my role is "client"
    And I have a registered repository "https://github.com/jane/my-project" linked to project "My Paysdoc Project"
    When I navigate to "/dashboard"
    Then I should see "jane/my-project" in the repository list
    And I should see the URL "https://github.com/jane/my-project" for that repo
    And I should see the linked project name "My Paysdoc Project"

  Scenario: Repo list shows repo without linked project when no match exists
    Given I am an authenticated user with email "jane@example.com"
    And my role is "client"
    And I have a registered repository "https://github.com/jane/unlinked-repo" with no linked project
    When I navigate to "/dashboard"
    Then I should see "jane/unlinked-repo" in the repository list
    And I should not see a linked project name for that repo
