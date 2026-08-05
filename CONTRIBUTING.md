# Contributing to Qwen Code Harness

## Getting Started
1. Fork and clone the repository
2. Create feature branch: `git checkout -b feature/my-improvement`
3. Follow coding standards (English only)
4. Submit pull request with CHANGELOG entry

## Adding Skills
Create dir under `skills/_category/`, add SKILL.md with Purpose, Activation, Protocol, Output Format.

## Adding Agents
Create .md under `agents/_category/`, define Role, Responsibilities, Handoff Protocol.

## Standards
- All content in English
- Skills must have SKILL.md
- Agents must follow chain-of-thought
- Test hooks before submitting
