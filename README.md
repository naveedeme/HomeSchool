# HomeSchool

## Overview

HomeSchool is a browser-based learning app designed for school students, with a strong focus on Grade 5 content and bilingual support for English and Urdu. The project is built so it can run in two ways:

- `homeschool-app.jsx` for the JSX source version
- `HomeSchool.html` for the direct one-click browser version

Both files are intended to stay in sync. The HTML file contains the same app logic in an embedded Babel script so it can be opened directly in a browser without a separate build step.

## What the App Contains

The app currently includes five major subject areas:

- Math
- Science
- English
- Social Studies
- Urdu

It also includes grade selection for multiple grades, though the richest and most detailed lesson coverage is currently centered around Grade 5.

## Core Learning Features

Each subject can include one or more of the following:

- Chapter-based lessons
- Subsection-based lessons
- Day-wise lesson plans
- Worked examples
- Exercises
- Word problems
- Multiple-choice quizzes
- Audio playback for lesson content and many answers
- Visual teaching support through SVG diagrams

The app is designed to behave more like a guided textbook than a plain quiz sheet. A student can move from lesson material to exercises and then to quiz practice within the same flow.

## Subject Experience

### Math

Math includes chapter and subsection-based content with textbook-style SVG teaching cards that explain how to solve problems. These visuals are meant to resemble worked examples from a classroom notebook or printed school text.

Math content supports:

- method explanation visuals
- examples and solved steps
- exercises
- word problems
- quizzes

### Science

Science includes detailed chapters with subsection-based lessons, SVG illustrations, exercises, word problems, and quizzes. Many subsections include concept diagrams for topics such as:

- materials
- forces
- energy
- Earth and space
- human body systems
- living things

The science section also includes extended exercise support such as fill in the blanks, true or false, and match the columns.

### English

English includes structured, day-wise learning flows. Instead of only chapter summaries, many English sections are organized into day plans so students can study a small amount each day.

This includes areas such as:

- Vocabulary
- Parts of Speech
- Tenses

Vocabulary and parts-of-speech areas support:

- lesson content arranged by days
- Urdu support where needed
- grouped exercise ranges such as Days 1 to 5, Days 6 to 10, and so on
- grouped quiz ranges using the same day-wise structure

### Social Studies

Social Studies includes expanded subsection coverage with:

- explanatory lesson content
- matching educational SVGs
- fill in the blanks
- true or false
- match the columns
- word problems
- quizzes

This section is built to be fuller and more guided than a simple fact list, so students can read the lesson first and then answer the follow-up work.

### Urdu

Urdu content is handled with proper right-to-left rendering and Urdu-friendly typography where applicable. Special care has been taken not to break Urdu layout in mixed-content areas.

## Audio and Reading Support

The app includes built-in speech playback for many lesson elements. Depending on the section, students can listen to:

- lesson sentences
- example content
- revealed exercise answers
- word-problem answers
- Urdu and English terms in supported lesson rows

Speech rendering is handled in-browser through the Web Speech API. The app also includes cleanup logic so speech stops correctly when users navigate away.

## Visual Teaching Support

The app uses inline SVG components to explain concepts visually instead of relying only on static text. These visuals are especially important in:

- Math problem-solving methods
- Science concepts
- Social Studies explanation sections

Where needed, SVGs were added to subsections that originally had no visual teaching support so students have a clearer lesson experience.

## Exercise Types

Across supported subjects and subsections, the app can provide:

- Fill in the blanks
- True or False
- Match the columns
- Word problems
- Multiple-choice quizzes

In many places, answer reveal areas are also speakable, and match-the-columns content is shown in a true two-column layout rather than a plain list.

## Progress and Student Experience

The app includes a broader student-facing shell around the lesson content:

- home dashboard
- top header navigation
- bottom navigation
- progress screen
- badge or achievement screen
- AI tutor screen
- settings screen

There is also a dedicated top header home button that returns the user to the home screen from anywhere in the app.

## Storage and Persistence

The app stores progress locally and uses browser-side persistence for learning data and progress data.

Current persistence approach includes:

- local storage for app state such as grade and progress
- local browser database support through `HomeSchoolDB`
- seeded lesson data for English-related day-wise sections

This allows the app to behave like a local-first educational app without requiring a backend for normal lesson usage.

## One-Click HTML Version

`HomeSchool.html` exists so the project can be run directly by opening a single file in the browser. This is useful for:

- quick local testing
- offline or semi-offline use
- non-technical users who want to run the app without a separate toolchain

The JSX file remains the source-oriented version, but both files should always be kept functionally aligned.

## Project Files

Important files in this repository:

- `homeschool-app.jsx` - main JSX source version
- `HomeSchool.html` - direct browser version
- `img/` - image assets used by the app

Other local-only files are intentionally excluded from Git tracking.

## Running the App

### Direct HTML Run

Open `HomeSchool.html` in a browser.

### JSX Source Use

Use `homeschool-app.jsx` as the editable source reference when making structured updates, and then mirror the same logic into `HomeSchool.html`.

## Maintenance Notes

- Keep `homeschool-app.jsx` and `HomeSchool.html` synchronized.
- Be careful when editing Urdu content because right-to-left layout and font styling can break easily.
- When updating lessons, preserve the structure expected by exercises, quizzes, and speech components.
- When adding visuals, prefer clear textbook-style explanatory SVGs over decorative graphics.

## Version Control Notes

This project is tracked in Git and currently pushes to both:

- a local Azure DevOps server remote
- a GitHub remote

The repository is intentionally limited to:

- `homeschool-app.jsx`
- `HomeSchool.html`
- `img/`
- `.gitignore`
- `README.md`

## Purpose

The goal of HomeSchool is to provide a self-contained study app that combines lesson reading, guided exercises, visual explanation, answer support, and quizzes inside a single local learning environment.
