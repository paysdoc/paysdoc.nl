@adw-rvwtyw-client-repo-manageme
Feature: Client repository CRUD operations
  As a client user
  I want to add and remove repositories from my dashboard
  So that I can manage which repos are tracked by Paysdoc

  @regression
  Scenario: Client adds a GitHub repository
    Given I am an authenticated user with email "jane@example.com"
    And my role is "client"
    And I am on the dashboard page
    When I enter "https://github.com/jane/my-project" in the "Add Repository" form
    And I submit the "Add Repository" form
    Then I should see "jane/my-project" in the repository list
    And the repo provider should be "github"

  @regression
  Scenario: Client adds a GitLab repository
    Given I am an authenticated user with email "jane@example.com"
    And my role is "client"
    And I am on the dashboard page
    When I enter "https://gitlab.com/jane/my-project" in the "Add Repository" form
    And I submit the "Add Repository" form
    Then I should see "jane/my-project" in the repository list
    And the repo provider should be "gitlab"

  @regression
  Scenario: Client removes a repository from their list
    Given I am an authenticated user with email "jane@example.com"
    And my role is "client"
    And I have a registered repository "https://github.com/jane/my-project"
    And I am on the dashboard page
    When I click the remove button for "jane/my-project"
    Then "jane/my-project" should no longer appear in the repository list

  Scenario: Client lists multiple registered repositories
    Given I am an authenticated user with email "jane@example.com"
    And my role is "client"
    And I have the following registered repositories:
      | url                                      |
      | https://github.com/jane/project-one      |
      | https://gitlab.com/jane/project-two      |
      | https://github.com/jane/project-three    |
    When I navigate to "/dashboard"
    Then I should see 3 repositories in the list
    And I should see "jane/project-one" in the repository list
    And I should see "jane/project-two" in the repository list
    And I should see "jane/project-three" in the repository list
