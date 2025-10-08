# WhatsApp Analytics Dashboard - Design Guidelines

## Design Approach

**Selected System:** Material Design with modern dashboard aesthetics inspired by Linear's clarity and Vercel's data presentation. This utility-focused analytics platform prioritizes data legibility, scannable metrics, and intuitive navigation over decorative elements.

**Core Principle:** Clean, data-first design that makes complex analytics feel accessible and actionable. Every visual element serves to clarify information hierarchy and guide user understanding.

---

## Color Palette

### Light Mode
- **Primary:** 142 85% 25% (WhatsApp Green)
- **Primary Hover:** 142 85% 20%
- **Background:** 0 0% 98%
- **Surface:** 0 0% 100%
- **Surface Elevated:** 0 0% 100% with subtle shadow
- **Text Primary:** 0 0% 13%
- **Text Secondary:** 0 0% 45%
- **Border:** 0 0% 88%

### Dark Mode
- **Primary:** 142 75% 45% (Brighter green for contrast)
- **Primary Hover:** 142 75% 55%
- **Background:** 0 0% 7%
- **Surface:** 0 0% 11%
- **Surface Elevated:** 0 0% 14%
- **Text Primary:** 0 0% 98%
- **Text Secondary:** 0 0% 65%
- **Border:** 0 0% 20%

### Chart Colors
- **Gradient Base:** 142 70% 45% to 173 70% 45% (Green to Teal)
- **Sentiment Positive:** 142 65% 50%
- **Sentiment Neutral:** 45 100% 65%
- **Sentiment Negative:** 0 70% 60%
- **Accent Blue:** 217 80% 55% (for received messages)
- **Accent Purple:** 262 65% 60% (for media)

---

## Typography

**Primary Font:** Inter (Google Fonts)
**Monospace Font:** JetBrains Mono (for stats/numbers)

### Hierarchy
- **Page Title:** text-3xl font-bold (h1)
- **Section Headers:** text-xl font-semibold (h2)
- **Card Titles:** text-lg font-semibold
- **Stats Large:** text-4xl font-bold font-mono (dashboard metrics)
- **Stats Small:** text-2xl font-semibold font-mono
- **Body Text:** text-base font-normal
- **Labels:** text-sm font-medium
- **Captions:** text-xs text-secondary

---

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- **Card Padding:** p-6
- **Section Spacing:** space-y-8 for vertical stacking
- **Grid Gaps:** gap-6 for card grids
- **Container Max Width:** max-w-7xl mx-auto
- **Page Padding:** px-4 md:px-8

**Grid Patterns:**
- **Quick Stats:** grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- **Main Content:** grid-cols-1 lg:grid-cols-3 (2:1 ratio for chart + sidebar)
- **Contact Tables:** Full width single column with responsive rows

---

## Component Library

### Navigation
- **Sidebar:** Fixed left, dark background (darker than main), width w-64, icons + labels
- **Top Bar:** Sticky, contains profile, date range picker, settings icon, theme toggle
- **Mobile:** Bottom navigation with icon-only tabs

### Cards (Primary Container)
- **Style:** Rounded corners (rounded-xl), subtle border, background matches surface color
- **Shadow:** Light mode: subtle shadow-sm, Dark mode: border-only
- **Hover State:** Slight scale (scale-[1.02]) and shadow increase for interactive cards
- **Padding:** p-6 standard, p-8 for hero cards

### Stats Tiles
- **Layout:** Vertical stack with icon, large number, label, optional change indicator
- **Icon Background:** Circular, w-12 h-12, primary color with 10% opacity
- **Counter Animation:** Count-up effect on mount using smooth transition
- **Trend Indicators:** Small arrow icons (↑↓) with green/red color coding

### Charts
- **Library:** Recharts or Chart.js with custom styling
- **Background:** Transparent with grid lines in border color
- **Line Thickness:** 2-3px for primary data
- **Area Fills:** Gradient with 20% opacity
- **Tooltips:** Dark background with rounded corners, white text, arrow pointer
- **Legend:** Horizontal below chart, text-sm with colored dots

### Tables
- **Header:** Sticky, font-semibold, border-b-2, uppercase text-xs tracking-wide
- **Rows:** border-b, hover:bg with slight background shift
- **Cell Padding:** px-4 py-3
- **Alignment:** Numbers right-aligned, text left-aligned
- **Sentiment Icons:** Inline with emoji at start of row

### Buttons
- **Primary:** WhatsApp green background, white text, rounded-lg, px-6 py-2.5
- **Secondary:** Outline style with border-2, text matches primary
- **Icon Buttons:** Square aspect ratio, p-2, rounded-md
- **Disabled State:** opacity-50, cursor-not-allowed

### Input Fields
- **Style:** Rounded borders (rounded-lg), consistent padding (px-4 py-2.5)
- **Focus State:** Ring-2 in primary color, outline-none
- **Dark Mode:** Dark background with lighter border
- **Date Picker:** Custom styled with WhatsApp green accents for selected dates

### AI Summary Cards
- **Style:** Distinct gradient border (2px) or left accent bar (4px width)
- **Background:** Slightly different from other cards (surface elevated + 3%)
- **Icon:** Robot or sparkle icon in corner, primary color
- **Typography:** Larger text-base for readability

---

## Interactions & Animations

**Principle:** Smooth but minimal - clarity over flash

- **Page Transitions:** None (instant navigation preferred for data app)
- **Counter Animations:** 1.5s duration, ease-out timing for number count-ups
- **Hover States:** 200ms transition on all interactive elements
- **Chart Animations:** 800ms ease-in-out on mount, stagger items by 50ms
- **Loading States:** Skeleton screens with shimmer effect (matching surface colors)
- **Toggle Switches:** Smooth 300ms transition with spring effect

**Forbidden:**
- No scroll-triggered animations
- No parallax effects
- No auto-playing carousels
- No complex page transitions

---

## Dashboard-Specific Patterns

### Heatmap Calendar
- **Cell Size:** w-4 h-4 rounded-sm
- **Intensity Scale:** 5 levels from background to primary color
- **Labels:** Days abbreviated (S M T W T F S), text-xs on side

### Emoji Cloud
- **Layout:** Flexbox with wrap, items scaled by frequency (1x to 3x)
- **Spacing:** gap-2 to gap-8 based on size
- **Hover:** Scale up 1.2x with smooth transition

### Progress Circles (Wellbeing Score)
- **Style:** SVG-based circular progress, 140px diameter
- **Stroke Width:** 12px
- **Colors:** Gradient stroke from primary to teal
- **Center Text:** Large score number with small label below

### Sentiment Indicators
- **Visual:** Small colored dot (w-2 h-2) + emoji + percentage text
- **Colors:** Match sentiment palette (green/yellow/red)
- **Placement:** Inline with contact names

---

## Responsive Behavior

**Breakpoints:** sm:640px, md:768px, lg:1024px, xl:1280px

- **Desktop (lg+):** Multi-column grids, sidebar navigation
- **Tablet (md):** 2-column grids, collapsible sidebar
- **Mobile (base):** Single column, bottom navigation, collapsible sections

**Priority on Mobile:**
- Stats tiles stack vertically with full width
- Charts become scrollable horizontally if needed
- Tables show essential columns only, hide secondary data
- Use accordion pattern for detailed insights

---

## Accessibility

- **Contrast Ratios:** Maintain WCAG AA (4.5:1 for text, 3:1 for UI)
- **Focus Indicators:** Visible ring-2 on all interactive elements
- **Screen Reader:** Proper ARIA labels for charts and dynamic counters
- **Keyboard Navigation:** Tab order follows visual hierarchy
- **Dark Mode:** Consistent implementation across all components

---

## Images

**No hero image required** - this is a utility dashboard prioritizing immediate data access over marketing visuals.

**Icon Usage:** Lucide React or Heroicons via CDN
- Navigation icons (Home, BarChart, MessageSquare, Users, Settings)
- Stat tile icons (Clock, MessageCircle, User, Moon)
- Action icons (Download, Share, Filter, ChevronDown)
