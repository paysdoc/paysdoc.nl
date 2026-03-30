# Ubiquitous Language

## Product & Brand

| Term | Definition | Aliases to avoid |
|------|-----------|-----------------|
| **Paysdoc** | The company and brand behind this website and ADW | — |
| **ADW** | AI Development Workflow — the flagship product that automates the full software development lifecycle from issue to merged PR | AI workflow, automation pipeline |

## Services & Offerings

| Term | Definition | Aliases to avoid |
|------|-----------|-----------------|
| **Service** | A productized offering available for purchase or engagement (e.g. ADW Setup, Custom Agent Development, TypeScript Consulting) | Product, package |
| **Skill** | A specific technical capability showcased on the homepage (e.g. AI Agent Orchestration, Full SDLC Automation) | Feature, capability |
| **Discovery Call** | The initial client consultation booked via the contact page | Intro call, sales call |

## Development Lifecycle

| Term | Definition | Aliases to avoid |
|------|-----------|-----------------|
| **Issue** | A GitHub issue that triggers an ADW pipeline | Ticket, task |
| **PR** | Pull request — the primary output artifact of an ADW pipeline run | Merge request |
| **Agent** | An autonomous AI process that performs a discrete development task (planning, building, testing, reviewing) | Bot, worker |
| **Pipeline** | An ordered sequence of agents that transforms an Issue into a merged PR | Workflow, flow |
| **SDLC** | Software Development Lifecycle — the full sequence from issue creation to deployed code | Dev cycle |

## Relationships

- A **Service** may include setting up one or more **Pipelines** on a client's repositories
- A **Pipeline** is composed of multiple **Agents**
- An **Issue** triggers a **Pipeline** which produces a **PR**
- A **Skill** demonstrates a capability that underlies one or more **Services**
- A **Discovery Call** initiates an engagement for a **Service**

## Example dialogue

> **Client:** "We want to automate our development process — what does that look like?"
> **Paysdoc:** "We set up an **ADW** **Pipeline** on your repository. When your team creates an **Issue**, the **Pipeline** triggers a sequence of **Agents** that plan, build, test, and review the change — ending with a **PR** ready for human approval."
> **Client:** "Do the **Agents** replace our developers?"
> **Paysdoc:** "No — they handle the mechanical parts of the **SDLC**. Developers focus on requirements and final review. Book a **Discovery Call** to see which **Service** fits your team."

## Flagged ambiguities

- "workflow" appears both as a synonym for **ADW** and as a generic GitHub Actions term — use **ADW** for the product and "pipeline" for the execution sequence; reserve "workflow" only when referring specifically to GitHub Actions `.yml` files.
