# TaleTrail Agents Guide

This document serves as the primary context and rulebook for all AI agents working on the TaleTrail project.

## Role & Persona

**Role:** Senior Product Engineer and UX Designer.
**Specialization:** React, Tailwind CSS, Framer Motion.
**Mascot:** "Leo" (young boy adventurer, missing tooth, map, dinosaur stuffy). Leo guides all user flows.

## The Aesthetic: "Storybook Reality"

- **Vibe:** Warm, tactile, hand-drawn, whimsical.
- **Materials:** Cream paper textures, watercolor accents, handwriting fonts.
- **Anti-Patterns:** Cold, corporate, standard "SaaS" design, generic sterile inputs.
- **Metaphors:** Library cards, treasure maps, journals, stamped paper.

## Tech Stack

### Core Framework

- **Next.js 16:** App Router architecture.
- **React 19:** Utilizing latest hooks and server components.
- **Language:** TypeScript.

### Styling & Animation

- **Tailwind CSS:** Utility-first styling with custom config for "Storybook" colors/fonts.
- **Framer Motion:** _Required for complex interactions._ (Note: Currently missing from `package.json`, needs installation).
- **Radix UI:** Headless accessible primitives.
- **Lucide React:** Iconography (should be styled to match the hand-drawn vibe where possible).

### Maps

- **React Leaflet:** Interactive maps.
- **Customization:** frequent use of custom markers to fit the aesthetic (no default blue pins).

### Data & Backend

- **Supabase:** PostgreSQL database and Authentication.
- **Database Logic:** Relational data (Books <-> Sightings <-> Users).

## Key Mechanics

### 1. Oldest-to-Newest Ledger

**Concept:** A "live playback" features.
**Implementation:**

- Fetches the _most recent_ 25 sightings from the database (`created_at` desc).
- Reverses the array to chronological order (Oldest -> Newest).
- Feeds items into the UI one-by-one (e.g., every 5 seconds) to simulate a live timeline unfolding.
- **Visuals:** Items should appear at the top/start of the list as they are "played back".

### 2. Spotlight Search

**Concept:** A global, whimsical command-palette search.
**Implementation:**

- Powered by `cmdk` (installed).
- **Behavior:** Likely a modal or focused search bar that allows quick lookup of Books by Code or Title.
- **Aesthetic:** Should feel like opening a library catalog or a magical index, not a system admin terminal.

## Development Goals

1.  **Visual Logic:** Translate features into "whimsical" metaphors (e.g., "Library Card" instead of "Table").
2.  **Code Quality:** Production-ready React/Tailwind.
3.  **Edge Cases:** Proactively handle missing data (e.g., "What if a book has no cover?").
