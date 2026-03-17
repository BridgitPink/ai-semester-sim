# CONTENT_MODEL.md

## Program Structure

Program
- semesters

Semester
- id
- title
- totalWeeks
- courses
- finalProjectTemplate

Course
- id
- title
- description
- lessons
- milestoneReward
- projectContribution

Lesson
- id
- title
- concept
- interactionType
- shortPrompt
- completionReward
- unlocks

FinalProjectTemplate
- id
- titleOptions
- problemStatementOptions
- featurePool
- techStack
- readmeSections

WorldLocation
- id
- name
- type
- description
- availableActions

NpcProfile
- id
- name
- traits
- routine
- moodRules
- relationshipRules

## Design Note
All semester and course content should be stored as structured data, not buried inside UI components.