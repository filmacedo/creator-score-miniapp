# Creator Score Mini App - Design System

## Core Principles

### 1. Semantic-First Approach
- **Default to semantic classes** (`text-foreground`, `bg-muted`, `border-border`) for theme consistency
- **Reserve brand colors** for intentional moments (rewards, CTAs, brand identity)
- **Avoid hardcoded colors** unless for specific brand moments

### 2. Mobile-First Design
- **Touch interactions only** - no hover states on mobile
- **Bottom sheets** for modals on mobile, centered dialogs on desktop
- **Responsive breakpoint**: `640px` (sm+)

### 3. Minimal & Elegant
- **Smaller, thinner fonts** with more white space
- **Consistent spacing** using established patterns
- **Clean, uncluttered interfaces**

## Color System

### Semantic Colors (Default)
- **Background**: `bg-background` / `bg-muted`
- **Text**: `text-foreground` / `text-muted-foreground`
- **Borders**: `border-border`

### Brand Colors (Reserved for Special Moments)
- **Primary**: Purple `#8E7BE5` - rewards, key features
- **Secondary**: Green `#EBF4B4`, Blue `#82DEED`, Pink `#E879C7` - data visualization

### Usage Rules
1. **Start with semantic classes** for all standard UI
2. **Use brand colors only** for:
   - Rewards and earnings
   - Primary CTAs
   - Data visualization (SegmentedBar, PostsChart)
   - Brand identity moments

## Component Patterns

### Cards
**Base Pattern**: All cards use the foundational `Card` component with semantic styling.

**Variants**:
- **Content Cards**: Standard `bg-card` with border and shadow
- **Muted Cards**: `bg-muted` with `border-0 shadow-none` for subtle sections
- **Interactive Cards**: Add hover states and click handlers

**Common Patterns**:
- **Stat Cards**: Title/value pairs with optional click handlers
- **List Cards**: Avatar lists with rankings or data
- **Progress Cards**: Score displays with progress visualization
- **Accordion Cards**: Expandable content sections

### Buttons
**Base Button**: Standard semantic variants with consistent sizing
**ButtonFullWidth**: Section-level actions with required icons and left alignment

### Interactive States
- **Hover**: `hover:bg-muted/50` for non-card elements
- **Active**: Semantic color variants
- **Disabled**: `opacity-50 cursor-not-allowed`
- **Loading**: Consistent skeleton patterns

## Layout Standards

### Page Structure
Every page follows this pattern:
```tsx
<PageContainer noPadding>
  <Section variant="header">     {/* Title and context */}
  <Section variant="full-width"> {/* Tabs, navigation */}
  <Section variant="content">    {/* Main content */}
</PageContainer>
```

### Spacing Scale
- **Large**: `mb-6 sm:mb-8`
- **Default**: `mb-4 sm:mb-6`
- **Compact**: `mb-3 sm:mb-4`
- **Internal**: `p-4 sm:p-6` (regular), `p-3 sm:p-4` (compact)

### Z-Index Hierarchy
- **Content**: 0-10
- **Header**: 30
- **Navigation**: 40
- **Modals**: 50

## Typography

### Font Scale
- **Body**: `text-sm sm:text-[15px]` (14px mobile, 15px desktop)
- **Secondary**: `text-xs sm:text-sm text-muted-foreground`
- **Headings**: `text-xl sm:text-2xl` (page), `text-lg sm:text-xl` (section)
- **Micro**: `text-xs` (labels, metadata)

### Font Weight
- **Default**: `font-light` for body text
- **Emphasis**: `font-medium` for labels and headings
- **Bold**: `font-bold` for numbers and key data

## Data Visualization

### SegmentedBar
- **Colors**: Brand colors only (`purple`, `green`, `blue`, `pink`)
- **Usage**: `green` for earnings, `pink` for followers, `blue` for posts, `purple` for score

### PostsChart
- **Colors**: Brand colors cycling through years
- **Pattern**: `purple-500` → `green-500` → `blue-500` → `pink-500`

## Icon System

### Sizes
- **Large**: 24px (navigation)
- **Medium**: 18px (engagement)
- **Small**: 14px (indicators)

### States
- **Default**: `text-muted-foreground stroke-[1.5]`
- **Active**: `text-foreground stroke-2`
- **Disabled**: `opacity-20`

### Interactions
- **Click effect**: Scale + stroke weight change
- **No hover states** (mobile-first)

## Loading & Error States

### Loading Patterns
- **Skeleton loaders** with `animate-pulse`
- **Progress indicators** for complex operations
- **Consistent messaging** across all components

### Error Handling
- **Graceful fallbacks** with helpful messaging
- **Retry mechanisms** where appropriate
- **No crashes** - always show something

## Accessibility

### Focus Management
- **Visible focus rings** with `focus-visible:ring-2`
- **Proper tab order** and keyboard navigation
- **Screen reader support** with `aria-*` attributes

### Color Contrast
- **WCAG AA compliance** for all text combinations
- **Semantic color usage** ensures proper contrast

## Animation Guidelines

### Transitions
- **Page transitions**: `animate-in fade-in duration-300`
- **Modal animations**: `slide-in-from-bottom` (mobile), `zoom-in` (desktop)
- **Interactive feedback**: `active:scale-95` for buttons

### Performance
- **Hardware acceleration** for smooth animations
- **Reduced motion** support for accessibility
- **Consistent timing** across all interactions

## Component Decision Tree

### When to Create New Components
1. **Reused 3+ times** across different contexts
2. **Complex interaction patterns** that need abstraction
3. **Consistent visual patterns** that vary only in data

### When to Use Existing Components
1. **Standard patterns** (cards, buttons, lists)
2. **Minor variations** can be handled with props
3. **Consistent behavior** across the app

### When to Use Semantic Classes
1. **Simple styling** that doesn't need abstraction
2. **One-off variations** of existing components
3. **Layout and spacing** patterns 