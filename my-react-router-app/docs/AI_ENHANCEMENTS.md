# AI Enhancements Documentation

## Overview

This document describes the comprehensive AI enhancement features implemented in the MyCampus student portal. These features aim to provide intelligent, personalized experiences through smart search, learning recommendations, study pattern analysis, and contextual assistance.

## Architecture

```
app/
├── services/
│   └── ai/
│       └── aiServices.ts          # Core AI service functions
│
└── components/
    └── ai/
        ├── index.ts               # Barrel export
        ├── SmartSearchBar.tsx     # AI-powered search
        ├── LearningRecommendations.tsx  # Personalized recommendations
        ├── StudyInsightsWidget.tsx      # Study pattern analytics
        └── SmartContextAssistant.tsx    # Floating context-aware assistant
```

## Features

### 1. Smart Search (`SmartSearchBar.tsx`)

**Purpose:** Provides an intelligent search experience with fuzzy matching, semantic understanding, and AI-powered suggestions.

**Key Features:**
- **Fuzzy Matching**: Uses Levenshtein distance algorithm to find similar terms even with typos
- **Semantic Search**: Understands synonyms and related terms (e.g., "grades" ↔ "Noten" ↔ "transcript")
- **Auto-Suggestions**: Generates relevant search suggestions based on partial input
- **Search History**: Remembers recent searches with localStorage persistence
- **Match Type Badges**: Shows how each result was matched (Exact/Semantic/Fuzzy)
- **Relevance Scoring**: Displays percentage match for transparency
- **Keyboard Navigation**: Full arrow key and Enter support

**Usage:**
```tsx
import { SmartSearchBar } from '~/components/ai';

<SmartSearchBar
  searchableItems={[
    { id: '1', title: 'Mathematics', category: 'Course', link: '/courses/math' },
    // ...
  ]}
  placeholder="Search with AI..."
  onSelect={(result) => navigate(result.link)}
/>
```

### 2. Learning Recommendations (`LearningRecommendations.tsx`)

**Purpose:** Generates personalized learning suggestions based on user progress, study patterns, and performance data.

**Key Features:**
- **Progress-Based Recommendations**: Suggests courses with low completion
- **Study Time Optimization**: Identifies best learning times
- **Streak Motivation**: Encourages daily learning habits
- **Improvement Focus**: Highlights subjects needing attention
- **AI Insights**: Provides actionable tips and achievements
- **Dismissible Cards**: Users can hide irrelevant suggestions

**Recommendation Types:**
| Type | Description |
|------|-------------|
| `course` | Course to focus on based on progress |
| `resource` | Helpful learning materials |
| `action` | Suggested activities (e.g., streak maintenance) |
| `study-tip` | Learning strategy suggestions |

**Usage:**
```tsx
import { LearningRecommendations } from '~/components/ai';

<LearningRecommendations
  maxItems={4}
  showInsights={true}
  className="mb-8"
/>
```

### 3. Study Insights Widget (`StudyInsightsWidget.tsx`)

**Purpose:** Displays AI-analyzed study patterns with visual analytics.

**Key Features:**
- **Best Study Time Detection**: Identifies when user is most productive
- **Consistency Score Ring**: Visual progress indicator for learning regularity
- **Session Analytics**: Average study session length tracking
- **Weekly Activity**: Shows accumulated study minutes
- **Streak Counter**: Gamification through consecutive day tracking
- **Strength/Weakness Identification**: Based on grade data

**Analytics Provided:**
- Preferred study time (morning/afternoon/evening/night)
- Consistency percentage (0-100%)
- Average session length in minutes
- Weekly active minutes
- Current streak in days
- Strong subjects list
- Improvement areas list

**Usage:**
```tsx
import { StudyInsightsWidget } from '~/components/ai';

<StudyInsightsWidget
  compact={false}
  className="col-span-1"
/>
```

### 4. Smart Context Assistant (`SmartContextAssistant.tsx`)

**Purpose:** Floating AI assistant that provides context-aware help based on current page.

**Key Features:**
- **Page-Aware Hints**: Different tips for each route (Dashboard, Courses, Schedule, etc.)
- **Keyword-Based Responses**: Understands common questions and provides relevant answers
- **Floating Chat Interface**: Non-intrusive, minimizable design
- **Hint Count Badge**: Shows available tips for current page
- **Typing Animation**: Natural conversation feel
- **Bilingual Support**: Full German and English translations

**Supported Routes:**
- `/dashboard` - Welcome tips, navigation help
- `/courses` - Course browsing assistance
- `/schedule` - Calendar tips, reminder setup
- `/certificates/transcript` - Grade explanation
- `/lernassistent` - AI assistant introduction
- `/library` - Research guidance
- `/room-booking` - Booking tips
- `/praxisbericht` - Report documentation help

**Usage:**
```tsx
import { SmartContextAssistant } from '~/components/ai';

// Add to main layout (appears as floating button)
<SmartContextAssistant />
```

## Core AI Services (`aiServices.ts`)

### Functions

#### `performSmartSearch(query, items, language)`
Executes intelligent search with fuzzy and semantic matching.

```typescript
const results = performSmartSearch(
  'mathmatik', // typo included
  searchableItems,
  'de'
);
// Returns: [{ title: 'Mathematik I', relevanceScore: 0.85, matchType: 'fuzzy', ... }]
```

#### `getSearchSuggestions(query, language)`
Generates contextual search suggestions.

```typescript
const suggestions = getSearchSuggestions('note', 'de');
// Returns: ['Notenspiegel anzeigen', 'Klausur anmelden', ...]
```

#### `analyzeStudyPatterns(activityLog, userData)`
Analyzes user activity to identify study patterns.

```typescript
const patterns = analyzeStudyPatterns(activityLog, {
  grades: { 'Math': 1.7, 'BWL': 2.3 },
  streak: 5,
  studyMinutes: 180,
});
// Returns: StudyPattern object
```

#### `generateRecommendations(userData, patterns, language)`
Creates personalized learning recommendations.

```typescript
const recommendations = generateRecommendations(userData, patterns, 'en');
// Returns: AIRecommendation[] sorted by priority
```

#### `generateInsights(userData, patterns, language)`
Generates actionable insights based on study data.

```typescript
const insights = generateInsights(userData, patterns, 'de');
// Returns: AIInsight[] (tips, achievements, suggestions)
```

#### `suggestQuickActions(currentTime, userData, language)`
Suggests relevant quick actions based on time and context.

```typescript
const actions = suggestQuickActions(new Date(), userData, 'de');
// Returns: contextual action buttons for current time
```

## Semantic Mappings

The AI uses a knowledge base of educational synonyms:

| German | English | Related Terms |
|--------|---------|---------------|
| noten | grades | bewertung, leistung, transcript |
| kurs | course | modul, vorlesung, subject |
| prüfung | exam | klausur, test, assessment |
| bibliothek | library | bücher, literatur, books |
| stundenplan | schedule | kalender, timetable |

## Data Storage

| Data | Storage | Purpose |
|------|---------|---------|
| Search history | localStorage (`smartSearch:history`) | Recent searches |
| Study streak | localStorage (`mycampus:streak`) | Gamification |
| Study minutes | localStorage (`mycampus:todayMinutes`) | Analytics |
| Dismissed insights | Component state | UX preference |

## Future Enhancements

1. **Machine Learning Integration**: Real API backend for smarter recommendations
2. **Predictive Analytics**: Grade prediction based on study patterns
3. **Natural Language Processing**: Full conversational AI chat
4. **Collaborative Filtering**: "Students like you also studied..."
5. **Spaced Repetition**: Smart review scheduling
6. **Voice Input**: Speech-to-text for accessibility

## Integration Guide

### Adding to Dashboard

```tsx
import { LearningRecommendations, StudyInsightsWidget } from '~/components/ai';

function Dashboard() {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2">
        <LearningRecommendations />
      </div>
      <div className="col-span-1">
        <StudyInsightsWidget />
      </div>
    </div>
  );
}
```

### Adding to App Shell

```tsx
import { SmartSearchBar, SmartContextAssistant } from '~/components/ai';

function AppShell() {
  return (
    <>
      <Header>
        <SmartSearchBar searchableItems={navigationItems} />
      </Header>
      <main>{children}</main>
      <SmartContextAssistant />
    </>
  );
}
```

## Accessibility

All AI components follow WCAG 2.1 AA standards:
- Keyboard navigation support
- ARIA labels for interactive elements
- Color contrast compliance
- Focus management
- Screen reader announcements
