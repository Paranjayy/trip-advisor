# Project Context & Roadmap: Travel Advisor

This document captures the underlying user context, mental models, and future development roadmap for the TripAdvisor platform, based on detailed user feedback and AI-driven analysis.

## 🧠 User Context & Mental Model

### Core Conflict: "The Traveler's Mismatch"
The user experiences a profound disconnect between the *idealized* travel narrative (movies/daydreams) and the *reality* of cognitive overload.

- **Status**: High cognitive load, stress-prone under last-minute decisions, currently in a "recovery mode" phase.
- **Triggers**: Multi-stop transitions, crowds, unpredictable itineraries, and social friction.
- **Safeguard Mode**: Prefers a **"Base-Camp Model"**—one location, zero transitions, 2-3 day max duration, and high environmental control.

### Design Philosophy for the "God Build"
The platform should move beyond generic "Top 10" lists and solve for **Decision Paralysis** and **Travel Friction**.
> **Equation**: Trip Quality = (Calm + Control) / (Movement + Uncertainty)

---

## 🚀 Roadmap & Future Features ("Later Things")

### 1. AI Advisor Evolution
- **[ ] Friction Score**: Implement a "Cognitive Load" or "Friction" score for each itinerary (number of transitions, crowd density, language barrier).
- **[ ] Zero-Decision Mode**: A feature that generates a day-by-day plan with *zero* choices required (fixed times, pre-booked meals, predictable routines).
- **[ ] Family Negotiator**: A tool that takes a "wild" family itinerary and converts it into a "Base-Camp" version (recommending one hotel and optional radius-based day trips).

### 2. Specialized Filters & Visualization
- **[ ] Base-Camp Visualization**: Show itineraries centered around a single stay-point with a 50-100km activity radius.
- **[ ] "Japan-Likeness" v2**: Expand the metric to include "System Predictability" and "Infrastructure Ease".
- **[ ] Mental Load Markers**: Tag destinations as "High Recovery" (Bhutan, Pokhara, South Goa) vs. "High Stimulation" (Hanoi, Delhi, Seminyak).

### 3. Destination-Specific Refinements
- **Kashmir**: Refactor into a "Pahalgam Retreat" focused stay.
- **Nepal**: Focus on "Pokhara Lakeside Calm".
- **Bhutan**: Position as the ultimate "Controlled Environment" destination.
- **Bali**: Filter specifically for isolated Ubud villas.

### 4. Technical Stabilization
- **[ ] Automated Buffer Tracking**: Integrate with calendars to ensure trips have a "Mental Cooldown" buffer (especially around exams/deadlines).
- **[ ] Live FX & Budget Guardrails**: Ensure budget estimates are rock-solid to prevent financial stress triggers.

---

## 📅 Upcoming Tasks
- **Refactor Itinerary Hub**: Support "Single Base" vs "Road Trip" categorizations.
- **Chatbot Expansion**: Allow the AI Advisor to "negotiate" constraints (e.g., "Make this 7-day trip into a 3-day quiet version").
- **Visual Delight**: Add "YJHD-style" curated moments (cinematic gifs/animations) to bridge the gap between idealized dreams and reality without the logistical stress.
