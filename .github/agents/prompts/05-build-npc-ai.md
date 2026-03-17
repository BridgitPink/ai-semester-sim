Read:

.github\agents
- prompts/00-project-context.md
- AGENTS.md
- docs/ARCHITECTURE.md

Task:
Build lightweight NPC AI for the MVP.

Requirements:
- add 4 to 6 NPCs total
- each NPC should have a profile, traits, mood, and preferred routine
- NPCs should move or update behavior in a lightweight believable way
- implement a simple AI pipeline using:
  1. routine preference
  2. utility-style scoring override
  3. mood/relationship-aware interaction text
- NPC AI should not require backend services
- keep it deterministic and maintainable
- interacting with NPCs should feel meaningful to the player

Do not:
- build full chatbot NPCs
- use LLM APIs
- overcomplicate pathfinding

Return:
- complete updated files
- explanation of the NPC AI approach
- recommended commit message