@adw-rvwtyw-client-repo-manageme
Feature: Auto-match repository to project
  As the application
  I want to automatically link a client repo to a project when the URLs match
  So that clients can see which of their repos are associated with Paysdoc projects

  @regression
  Scenario: Adding a repo that matches an existing project sets project_id
    Given I am an authenticated user with email "jane@example.com"
    And my role is "client"
    And a project exists with repo_url "https://github.com/jane/my-project"
    And I am on the dashboard page
    When I enter "https://github.com/jane/my-project" in the "Add Repository" form
    And I submit the "Add Repository" form
    Then the repo should be linked to the project with repo_url "https://github.com/jane/my-project"
    And I should see the linked project name for "jane/my-project"

  @regression
  Scenario: Adding a repo with no matching project leaves project_id null
    Given I am an authenticated user with email "jane@example.com"
    And my role is "client"
    And no project exists with repo_url "https://github.com/jane/unmatched-repo"
    And I am on the dashboard page
    When I enter "https://github.com/jane/unmatched-repo" in the "Add Repository" form
    And I submit the "Add Repository" form
    Then the repo should not be linked to any project
    And I should not see a linked project name for "jane/unmatched-repo"

  Scenario: Auto-match works for GitLab repos
    Given I am an authenticated user with email "jane@example.com"
    And my role is "client"
    And a project exists with repo_url "https://gitlab.com/jane/gitlab-project"
    And I am on the dashboard page
    When I enter "https://gitlab.com/jane/gitlab-project" in the "Add Repository" form
    And I submit the "Add Repository" form
    Then the repo should be linked to the project with repo_url "https://gitlab.com/jane/gitlab-project"

  Scenario: Auto-match does not link when URLs differ only in path
    Given I am an authenticated user with email "jane@example.com"
    And my role is "client"
    And a project exists with repo_url "https://github.com/jane/project-a"
    And I am on the dashboard page
    When I enter "https://github.com/jane/project-b" in the "Add Repository" form
    And I submit the "Add Repository" form
    Then the repo should not be linked to any project
