# AGENTS.md

This document defines architecture, constraints, and implementation rules for AI agents working on the project.

---

# 🧠 Project Overview

This is a **browser-based AI life simulation game** built with:

- Phaser (game engine)
- React + Next.js (UI layer)
- Zustand (state management)

Core concept:
- Player navigates a campus
- Enters buildings
- Performs short actions (lessons, studying, etc.)
- Progresses through a semester
- Builds a portfolio project

---

# 🏗 Architecture Overview

## Scenes

### 1. GameScene (Overworld)
- Open world navigation
- Player movement (WASD + Arrow keys)
- NPC placement
- Building interaction (`E` key)
- Transitions into building interior scenes

### 2. Interior Scenes (MVP Pattern)

Each enterable building uses an interior scene:

Examples:
- ClassroomScene
- LabScene
- DormScene
- CafeScene
- LibraryScene
- AdvisorScene

---

# 🎯 Interior Scene Design (CRITICAL)

Interior scenes MUST follow this layout:

## Single Canvas Rule
- NEVER create a second Phaser canvas
- All rendering happens in the same scene

## Inner Play Area (Required)
- Create a centered gameplay area
- Size: ~60% of screen width and height
- This is the **active interaction zone**

## Layout Structure


Full Scene (background)

Inner Play Area (centered)
- player
- building UI

## Visual Rules
- outer area = background (darker / less important)
- inner area = active gameplay zone
- inner area should be visually distinct (border, contrast, etc.)

## Player Rules
- player MUST be visible in interior scenes
- player spawns inside inner play area
- player movement is constrained to inner bounds

---

# 🎮 Interaction Model

## Overworld
- player moves freely
- press `E` near building → enter interior scene

## Interior
- player remains visible
- UI presents actions
- player selects action (lesson, rest, etc.)

---

# 🧩 Building Interaction Pattern

Each building MUST:

1. Transition from GameScene → Interior Scene
2. Render:
   - player
   - room title
   - action UI
3. Provide:
   - building-specific actions
   - exit option (return to GameScene)

---

# 🧱 UI Architecture

UI is **contextual**, not global.

## In Overworld
- minimal UI
- no large panels

## In Interior Scenes
- display building-specific UI panel
- include:
  - action buttons
  - short descriptions
  - exit button

---

# 🧠 Course / Lesson System (Phase 4)

Classroom must connect to:

- semester system
- course data
- lesson progression
- stat updates
- project progress

Agents MUST ensure:
- lessons are data-driven
- not hardcoded in components

---

# 📦 State Management (Zustand)

State includes:
- player stats
- current day/week
- course progress
- project progress
- active UI panel

Rules:
- state must be centralized
- UI must reflect state changes immediately
- avoid duplicating state in components

---

# 🚨 Critical Constraints

## 1. NO Fullscreen API
- do NOT implement browser fullscreen
- use full-height layout instead

## 2. NO Multiple Canvases
- Phaser runs in a single canvas only

## 3. NO Hardcoded Layouts
- positions must be responsive
- use screen-relative positioning

## 4. NO Over-Engineering Interiors
- do NOT build tilemaps yet
- keep interiors simple (MVP)

## 5. DO NOT BREAK MOVEMENT
- player movement must always work
- WASD + Arrow keys required

---

# 🧪 Development Phases

## Phase 2
- player movement
- world layout
- building interaction

## Phase 3
- UI overlay
- layout stabilization

## Phase 4
- semester system
- course system
- lesson system

## Phase 5 (next)
- NPC movement + AI behavior

---

# 🎯 Agent Expectations

Agents should:

- prioritize stability over new features
- implement small, testable changes
- avoid rewriting working systems
- keep MVP scope in mind
- return complete code + explanation

---

# 🚀 Design Philosophy

- short interactions > long sessions
- clarity > complexity
- systems > hardcoding
- immersion through structure, not graphics

---

# ✅ Definition of Done

A feature is complete when:

- it works consistently
- it integrates with existing systems
- it does not break previous functionality
- it can be tested repeatedly without failure

---

# 🧾 Commit Guidelines

Agents should suggest clear commit messages:

Examples:
- "Fix player movement and input handling"
- "Add distance-based building interaction"
- "Implement interior scene layout with inner play area"
- "Wire classroom scene into lesson system"

---

# END