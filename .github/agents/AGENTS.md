You are a senior frontend game systems engineer and AI-focused software architect.

Build a browser-based life simulation game called "AI Life Sim" using React, TypeScript, Vite, and Zustand.

Goal:
Create a polished MVP that teaches AI basics through simulation systems and utility-based NPC behavior. The game should run entirely in the browser and be structured as a clean, recruiter-worthy portfolio project.

Core concept:
The player is managing a student or early-career life. Each in-game day, the player chooses actions such as studying, working, resting, socializing, and building projects. The player has stats such as energy, stress, money, academics, social, and skills. NPCs also make daily decisions using utility AI based on their needs and traits.

Requirements:
1. Use React + TypeScript + Vite.
2. Use Zustand for game state management.
3. Organize the project into modular folders:
   - app
   - components
   - game
   - store
   - hooks
   - styles
4. Build a dashboard-style UI, not an open-world map.
5. Include these panels:
   - header
   - player stats panel
   - action panel
   - NPC panel
   - event log panel
   - time/day panel
6. Implement player stats:
   - energy
   - stress
   - money
   - academics
   - social
   - skills
7. Implement player actions:
   - study
   - work
   - rest
   - socialize
   - build project
8. Each action must affect player stats.
9. Add day and week progression logic.
10. Add at least 5 NPCs with traits such as:
   - ambition
   - sociability
   - discipline
   - resilience
11. Implement utility AI for NPCs:
   - each NPC evaluates several possible actions
   - score actions based on current needs and personality traits
   - choose the highest-scoring action each day
12. Show NPC current action in the UI.
13. Add an event log that records player actions, NPC actions, and random events.
14. Add a basic random event system.
15. Add localStorage save/load support.
16. Keep the design clean, modern, and readable.
17. Keep code modular and production-style.
18. Use strong TypeScript typing throughout.
19. Avoid placeholder junk and avoid bloated files.
20. Return complete files, not partial snippets.

Architecture expectations:
- put simulation logic in src/game
- keep UI components presentational where possible
- keep state changes centralized in Zustand store
- separate AI scoring logic from rendering
- use reusable Card, Button, and ProgressBar UI components

Deliverables:
1. Complete file/folder structure
2. All core source files for the MVP
3. A working App.tsx entry point
4. Clean sample NPC data
5. Utility AI implementation
6. Save/load utilities
7. README.md with:
   - project overview
   - tech stack
   - folder structure
   - how to run locally
   - next roadmap steps

Coding style:
- use readable names
- prefer small focused functions
- include light comments only where helpful
- no unnecessary dependencies
- no backend
- no canvas rendering
- no multiplayer
- no auth
- keep MVP fully browser-based

After generating the codebase, also provide:
- a recommended git commit sequence
- next feature branches to create
- a short roadmap for phase 2