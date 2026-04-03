@adw-rvwtyw-client-repo-manageme
Feature: Repository URL parsing and provider detection
  As the application
  I want to parse repository URLs and detect the provider
  So that repos are correctly categorized as GitHub or GitLab

  Scenario: GitHub URL is detected as github provider
    Given a repository URL "https://github.com/owner/repo-name"
    When the URL is parsed
    Then the provider should be "github"
    And the repo name should be "owner/repo-name"

  Scenario: GitLab URL is detected as gitlab provider
    Given a repository URL "https://gitlab.com/owner/repo-name"
    When the URL is parsed
    Then the provider should be "gitlab"
    And the repo name should be "owner/repo-name"

  Scenario: GitHub URL with trailing slash is parsed correctly
    Given a repository URL "https://github.com/owner/repo-name/"
    When the URL is parsed
    Then the provider should be "github"
    And the repo name should be "owner/repo-name"

  Scenario: GitLab URL with .git suffix is parsed correctly
    Given a repository URL "https://gitlab.com/owner/repo-name.git"
    When the URL is parsed
    Then the provider should be "gitlab"
    And the repo name should be "owner/repo-name"

  Scenario: GitHub URL with .git suffix is parsed correctly
    Given a repository URL "https://github.com/owner/repo-name.git"
    When the URL is parsed
    Then the provider should be "github"
    And the repo name should be "owner/repo-name"

  Scenario: GitHub URL with nested path extracts owner/repo
    Given a repository URL "https://github.com/owner/repo-name/tree/main"
    When the URL is parsed
    Then the provider should be "github"
    And the repo name should be "owner/repo-name"

  Scenario: GitLab URL with subgroups extracts full path
    Given a repository URL "https://gitlab.com/group/subgroup/repo-name"
    When the URL is parsed
    Then the provider should be "gitlab"
    And the repo name should be "group/subgroup/repo-name"
