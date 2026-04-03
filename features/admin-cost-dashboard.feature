@adw-gn1ivk-admin-cost-per-proje
Feature: Admin cost-per-project dashboard
  As an admin user
  I want to see a cost-per-project overview on the /admin page
  So that I can monitor spending across projects, models, and issues

  Background:
    Given I am an authenticated user with email "paysdoc@gmail.com"
    And my role is "admin"

  # --- Access control (relies on middleware from #5) ---

  Scenario: Admin user can view the cost dashboard at /admin
    When I navigate to "/admin"
    Then I should see the admin page
    And I should see the "Cost per Project" overview

  Scenario: Client user cannot access the cost dashboard
    Given I am an authenticated user with email "jane@example.com"
    And my role is "client"
    When I navigate to "/admin"
    Then I should be redirected to "/dashboard"

  # --- Cost-per-project overview ---

  Scenario: All projects are listed with their total computed cost
    Given the following projects exist in the database:
      | id | name        |
      | 1  | Project Alpha |
      | 2  | Project Beta  |
    And the following cost records exist:
      | project_id | amount_usd |
      | 1          | 12.50      |
      | 1          | 7.25       |
      | 2          | 3.00       |
    When I navigate to "/admin"
    Then I should see project "Project Alpha" with total cost "$19.75"
    And I should see project "Project Beta" with total cost "$3.00"

  Scenario: Projects with no cost records display zero cost
    Given the following projects exist in the database:
      | id | name          |
      | 1  | Project Alpha |
      | 2  | Project Empty |
    And the following cost records exist:
      | project_id | amount_usd |
      | 1          | 10.00      |
    When I navigate to "/admin"
    Then I should see project "Project Alpha" with total cost "$10.00"
    And I should see project "Project Empty" with total cost "$0.00"

  # --- Breakdown by model and provider ---

  Scenario: Cost breakdown by model and provider is visible per project
    Given the following projects exist in the database:
      | id | name        |
      | 1  | Project Alpha |
    And the following cost records exist:
      | project_id | model            | provider  | amount_usd |
      | 1          | claude-opus-4-6  | anthropic | 8.00       |
      | 1          | gpt-4o           | openai    | 4.50       |
      | 1          | claude-opus-4-6  | anthropic | 2.00       |
    When I navigate to "/admin"
    And I view the cost breakdown for project "Project Alpha"
    Then I should see the following model breakdown:
      | model            | provider  | total_cost |
      | claude-opus-4-6  | anthropic | $10.00     |
      | gpt-4o           | openai    | $4.50      |

  # --- Issue-level cost detail ---

  Scenario: Issue-level cost details are accessible within a project
    Given the following projects exist in the database:
      | id | name        |
      | 1  | Project Alpha |
    And the following cost records exist:
      | project_id | issue_number | amount_usd |
      | 1          | 42           | 5.00       |
      | 1          | 42           | 3.00       |
      | 1          | 99           | 7.50       |
    When I navigate to "/admin"
    And I expand the issue-level details for project "Project Alpha"
    Then I should see issue "#42" with cost "$8.00"
    And I should see issue "#99" with cost "$7.50"

  # --- Token usage ---

  Scenario: Token usage is shown alongside cost records
    Given the following projects exist in the database:
      | id | name        |
      | 1  | Project Alpha |
    And the following cost records exist:
      | project_id | issue_number | amount_usd |
      | 1          | 42           | 5.00       |
    And the following token usage records exist:
      | cost_record_id | token_type    | count  |
      | 1              | input_tokens  | 15000  |
      | 1              | output_tokens | 3000   |
      | 1              | cache_read    | 5000   |
    When I navigate to "/admin"
    And I expand the issue-level details for project "Project Alpha"
    Then I should see token usage for issue "#42":
      | token_type    | count  |
      | input_tokens  | 15000  |
      | output_tokens | 3000   |
      | cache_read    | 5000   |

  # --- Data transformation and aggregation ---

  Scenario: Data transformation from D1 queries produces correct structured view
    Given the following projects exist in the database:
      | id | name          |
      | 1  | Project Alpha |
      | 2  | Project Beta  |
      | 3  | Project Empty |
    And the following cost records exist:
      | project_id | issue_number | model           | provider  | amount_usd |
      | 1          | 10           | claude-opus-4-6 | anthropic | 6.00       |
      | 1          | 10           | gpt-4o          | openai    | 2.00       |
      | 1          | 11           | claude-opus-4-6 | anthropic | 1.50       |
      | 2          | 20           | gpt-4o          | openai    | 4.00       |
    When I navigate to "/admin"
    Then I should see project "Project Alpha" with total cost "$9.50"
    And I should see project "Project Beta" with total cost "$4.00"
    And I should see project "Project Empty" with total cost "$0.00"

  Scenario: Aggregation query correctly sums costs across multiple records
    Given the following projects exist in the database:
      | id | name        |
      | 1  | Project Alpha |
    And the following cost records exist:
      | project_id | issue_number | model           | provider  | amount_usd |
      | 1          | 10           | claude-opus-4-6 | anthropic | 1.11       |
      | 1          | 10           | claude-opus-4-6 | anthropic | 2.22       |
      | 1          | 10           | claude-opus-4-6 | anthropic | 3.33       |
    When I navigate to "/admin"
    And I view the cost breakdown for project "Project Alpha"
    Then I should see project "Project Alpha" with total cost "$6.66"
    And I should see the following model breakdown:
      | model           | provider  | total_cost |
      | claude-opus-4-6 | anthropic | $6.66      |
