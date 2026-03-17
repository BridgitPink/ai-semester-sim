# ARCHITECTURE.md

## Architecture Overview

### World Layer
Phaser handles:
- map rendering
- player movement
- NPC sprites
- interaction zones
- collision/proximity checks

### UI Layer
React handles:
- HUD
- stat panels
- course panels
- interaction panels
- final project builder/export view

### State Layer
Zustand handles:
- player stats
- week/day progression
- course completion
- current interaction state
- unlocked project parts
- NPC relationship state
- UI panels

### Data Layer
Use data-first definitions for:
- semesters
- courses
- lessons
- locations
- NPCs
- project templates

## Guiding Rule
Gameplay logic should not depend on hardcoded UI text or one-off scene behavior.

## Preferred Separation
- `src/game/phaser` = world logic
- `src/game/systems` = simulation and progression logic
- `src/game/data` = authored content
- `src/components` = presentational UI
- `src/store` = app/game state