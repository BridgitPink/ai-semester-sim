Read:

.github\agents
- prompts/00-project-context.md
- AGENTS.md
- docs/CONTENT_MODEL.md
- docs/PRODUCT_SPEC.md

Task:
Build the semester progression system for the MVP.

Requirements:
- support one semester with 8 weeks
- define 3 courses as structured data
- define lesson data separately from UI
- implement progress tracking for courses and lessons
- create a clean semester/course/lesson model that can support future semesters later
- each lesson should be short and sweet
- completing lessons should affect stats and project progress
- avoid hardcoding content into React components

MVP courses:
1. AI Foundations
2. Data and Prompting Basics
3. Build Your First AI Study Helper

Return:
- updated data models
- updated store/systems
- any UI wiring needed
- recommended commit message