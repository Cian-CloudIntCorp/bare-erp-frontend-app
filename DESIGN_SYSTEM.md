# ERP Design System Documentation

## Overview
This design system is extracted from the original `index.html` and serves as the **single source of truth** for all ERP modules. The aesthetic is **cyberpunk/tech-noir** with neon glows, glass-morphism effects, and a dark theme.

---

## Color Tokens

### Primary Colors
```css
--primary-blue: #3B82F6;      /* Main accent, buttons, links */
--primary-yellow: #eab308;    /* Warnings, highlights, CTAs */
--primary-purple: #a78bfa;    /* Headers, secondary accents */
--accent-violet: #9333ea;     /* Alternative gradients */
```

### Background Colors
```css
--bg-dark: #111827;           /* Main background */
--bg-darker: #0f172a;         /* Sidebar, header backgrounds */
--bg-card: rgba(17, 24, 39, 0.6);  /* Card backgrounds with transparency */
```

### Text Colors
```css
--text-primary: #e5e7eb;      /* Main text, headings */
--text-secondary: #d1d5db;    /* Body text, descriptions */
--text-muted: #9ca3af;        /* Labels, captions, disabled */
```

### Border Colors
```css
--border-primary: rgba(59, 130, 246, 0.2);   /* Default borders */
--border-hover: rgba(59, 130, 246, 0.5);     /* Hover state borders */
```

### Semantic Colors
```css
/* Success / Active */
--success: #4ade80;
--success-bg: rgba(34, 197, 94, 0.1);
--success-border: rgba(34, 197, 94, 0.3);

/* Warning / Pending */
--warning: #eab308;
--warning-bg: rgba(234, 179, 8, 0.1);
--warning-border: rgba(234, 179, 8, 0.3);

/* Error / Inactive */
--error: #ef4444;
--error-text: #fca5a5;
--error-bg: rgba(239, 68, 68, 0.1);
--error-border: rgba(239, 68, 68, 0.3);
```

---

## Typography

### Font Family
```css
font-family: 'Inter', sans-serif;
```

### Font Weights
- **100-300**: Thin/Light (rarely used)
- **400**: Regular (body text)
- **600**: Semibold (labels, subheadings)
- **700**: Bold (headings, emphasis)
- **800**: Extrabold (titles, numbers)

### Type Scale
```css
/* Titles */
.title-xl:   font-size: 2rem;    /* 32px - Page titles */
.title-lg:   font-size: 1.5rem;  /* 24px - Section headers */
.title-md:   font-size: 1.25rem; /* 20px - Card titles */
.title-sm:   font-size: 1.125rem;/* 18px - Small headers */

/* Body */
.body-base:  font-size: 1rem;    /* 16px - Default text */
.body-sm:    font-size: 0.875rem;/* 14px - Secondary text */
.body-xs:    font-size: 0.75rem; /* 12px - Captions, labels */

/* Utility */
.utility-text: font-family: 'Courier New', monospace;
```

### Line Heights
- **Headings**: `line-height: 1` to `1.2`
- **Body Text**: `line-height: 1.5` to `1.6`

---

## Spacing System

### Base Unit: `0.25rem` (4px)

### Spacing Scale
```css
--spacing-xs:      0.5rem;   /* 8px  */
--spacing-sm:      0.75rem;  /* 12px */
--spacing-md:      1rem;     /* 16px */
--spacing-lg:      1.5rem;   /* 24px */
--spacing-xl:      2rem;     /* 32px */
--spacing-2xl:     3rem;     /* 48px */
--spacing-3xl:     4rem;     /* 64px */

/* Component-Specific */
--spacing-card:    2rem;     /* Card padding (CRITICAL: DO NOT CHANGE) */
--spacing-section: 4rem;     /* Section spacing */
```

**RULE**: All card components MUST use `padding: var(--spacing-card)` to maintain consistency.

---

## Effects & Visual Styles

### Glow Effects
```css
/* Text Glows */
.text-glow-blue {
    text-shadow: 0 0 10px rgba(59, 130, 246, 0.6), 
                 0 0 20px rgba(59, 130, 246, 0.4);
}

.text-glow-yellow {
    text-shadow: 0 0 10px rgba(234, 179, 8, 0.6), 
                 0 0 20px rgba(234, 179, 8, 0.4);
}

/* Button Glows */
.button-glow-blue {
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.5), 
                0 0 20px rgba(59, 130, 246, 0.3);
    transition: all 0.3s ease;
}

.button-glow-blue:hover {
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.8), 
                0 0 30px rgba(59, 130, 246, 0.6);
    transform: translateY(-2px);
}
```

### Backdrop Blur (Glass-Morphism)
```css
backdrop-filter: blur(10px);  /* Cards */
backdrop-filter: blur(20px);  /* Sidebar, Header */
```

### Border Radius
```css
--radius-sm:  0.25rem;  /* 4px - Badges */
--radius-md:  0.5rem;   /* 8px - Inputs, buttons */
--radius-lg:  0.75rem;  /* 12px - Cards */
--radius-full: 50%;     /* Circles (avatars) */
```

---

## Components

### 1. Cards (`.erp-card`)
```css
.erp-card {
    background-color: var(--bg-card);
    backdrop-filter: blur(10px);
    border: 1px solid var(--border-primary);
    border-radius: 0.75rem;
    padding: var(--spacing-card);  /* CRITICAL: Always 2rem */
    transition: transform 0.3s ease, border-color 0.3s ease;
}

.erp-card:hover {
    transform: translateY(-5px);
    border-color: var(--border-hover);
}
```

**Usage**: Primary container for all module content.

---

### 2. Badges (`.status-badge`)
```css
.status-badge {
    display: inline-block;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 0.75rem;
    border: 1px solid;
}

/* Variants */
.status-badge.active {
    background-color: rgba(34, 197, 94, 0.1);
    color: #4ade80;
    border-color: rgba(34, 197, 94, 0.3);
}

.status-badge.pending {
    background-color: rgba(234, 179, 8, 0.1);
    color: #eab308;
    border-color: rgba(234, 179, 8, 0.3);
}

.status-badge.inactive {
    background-color: rgba(239, 68, 68, 0.1);
    color: #fca5a5;
    border-color: rgba(239, 68, 68, 0.3);
}
```

**Usage**: Status indicators for records (Active, Pending, Overdue, etc.)

---

### 3. Buttons (`.btn`)

#### Base Button
```css
.btn {
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    border: none;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}
```

#### Variants
```css
/* Primary */
.btn-primary {
    background: var(--primary-blue);
    color: white;
}

.btn-primary:hover {
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.8), 
                0 0 30px rgba(59, 130, 246, 0.6);
    transform: translateY(-2px);
}

/* Secondary */
.btn-secondary {
    background: transparent;
    color: var(--primary-blue);
    border: 1px solid var(--primary-blue);
}

.btn-secondary:hover {
    background: rgba(59, 130, 246, 0.1);
}
```

**Sizes**:
- Default: `padding: 0.75rem 1.5rem`
- Small: `padding: 0.5rem 1rem`
- Compact: `padding: 0.375rem 0.75rem`

---

### 4. Form Inputs

#### Text Input
```css
.input {
    width: 100%;
    background: rgba(31, 41, 55, 0.6);
    border: 1px solid var(--border-primary);
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    color: var(--text-primary);
    font-size: 0.875rem;
    transition: all 0.3s ease;
}

.input:focus {
    outline: none;
    border-color: var(--primary-blue);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background: rgba(31, 41, 55, 0.8);
}
```

#### Select Dropdown
```css
select {
    /* Same as .input above */
}
```

---

### 5. Tables

```css
table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
}

/* Header */
thead tr {
    border-bottom: 2px solid var(--border-primary);
}

th {
    padding: 1rem;
    text-align: left;
    color: var(--text-muted);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
}

/* Body */
tbody tr {
    border-bottom: 1px solid var(--border-primary);
}

tbody tr:hover {
    background: rgba(59, 130, 246, 0.05);
}

td {
    padding: 1rem;
    color: var(--text-secondary);
}
```

---

### 6. Navigation Items (`.nav-item`)

```css
.nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    margin: 0.25rem 0;
    border-radius: 0.5rem;
    color: var(--text-secondary);
    transition: all 0.2s ease;
    position: relative;
}

.nav-item::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: var(--primary-blue);
    transform: scaleY(0);
    transition: transform 0.2s ease;
}

.nav-item:hover {
    background: rgba(59, 130, 246, 0.1);
    color: var(--primary-blue);
}

.nav-item.active {
    background: rgba(59, 130, 246, 0.15);
    color: var(--primary-blue);
    font-weight: 600;
}

.nav-item.active::before {
    transform: scaleY(1);
}
```

---

## Layout Architecture

### Grid System
```css
/* Master Layout */
.erp-layout {
    display: grid;
    grid-template-columns: 280px 1fr;  /* Sidebar | Main */
    grid-template-rows: 80px 1fr;      /* Header | Content */
    grid-template-areas:
        "sidebar header"
        "sidebar main";
    min-height: 100vh;
}
```

### Responsive Breakpoints
```css
/* Desktop: Default (>1024px) */
grid-template-columns: 280px 1fr;

/* Tablet (768px - 1024px) */
@media (max-width: 1024px) {
    grid-template-columns: 240px 1fr;
}

/* Mobile (<768px) */
@media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-areas:
        "header"
        "main";
    .erp-sidebar { display: none; } /* Implement drawer */
}
```

---

## Animation & Transitions

### Standard Timing
```css
transition: all 0.3s ease;  /* Default for most interactions */
transition: all 0.2s ease;  /* Faster for nav items, small elements */
```

### Hover Transforms
```css
/* Cards */
transform: translateY(-5px);

/* Buttons */
transform: translateY(-2px);
```

---

## Metadata-Driven Architecture

### Principle
Each module should be **data-driven**, meaning the structure remains constant while the **labels** and **field values** are swappable without changing HTML.

### Example: Employee vs. Lead Card

**Structure** (stays the same):
```html
<div class="erp-card">
    <div class="card-header">
        <h3>{{ name }}</h3>
        <p>{{ subtitle }}</p>
        <span class="status-badge {{ statusClass }}">{{ status }}</span>
    </div>
    <div class="card-body">
        <div class="field">
            <label>{{ field1Label }}</label>
            <span>{{ field1Value }}</span>
        </div>
        <div class="field">
            <label>{{ field2Label }}</label>
            <span>{{ field2Value }}</span>
        </div>
    </div>
</div>
```

**Data** (what changes):
```javascript
// Employee
{
    name: "Sarah Anderson",
    subtitle: "Senior Engineer",
    status: "Active",
    statusClass: "active",
    field1Label: "Department",
    field1Value: "Engineering",
    field2Label: "Employee ID",
    field2Value: "EMP-2847"
}

// Lead
{
    name: "Jennifer Martinez",
    subtitle: "VP of Engineering @ TechCorp",
    status: "Hot",
    statusClass: "active",
    field1Label: "Deal Value",
    field1Value: "$125,000",
    field2Label: "Pipeline Stage",
    field2Value: "Proposal"
}
```

---

## Best Practices

### DO:
✅ Use CSS variables for ALL colors  
✅ Maintain exact `2rem` padding on cards  
✅ Apply glow effects to primary actions  
✅ Use `backdrop-filter: blur()` for depth  
✅ Follow the 8px spacing grid  
✅ Use monospace font for IDs/codes  
✅ Implement hover states on interactive elements  

### DON'T:
❌ Hardcode color values  
❌ Change card padding arbitrarily  
❌ Mix font families  
❌ Use inconsistent border-radius values  
❌ Skip hover/focus states  
❌ Ignore the spacing scale  
❌ Create new color variations without tokens  

---

## Implementation Checklist

When creating a new module view:

1. ✅ Use `#dynamic-content-slot` as the container
2. ✅ Start with `.content-header` for page title
3. ✅ Wrap all content in `.erp-card` components
4. ✅ Apply appropriate status badges
5. ✅ Use the button classes (`.btn-primary`, `.btn-secondary`)
6. ✅ Maintain spacing consistency (`var(--spacing-card)`)
7. ✅ Add glow effects to CTAs
8. ✅ Include hover states on interactive elements
9. ✅ Test responsive behavior
10. ✅ Verify color contrast (accessibility)

---

## Version History

**v1.0** - Feb 2026  
Initial design system extracted from `index.html`. Supports HR, Finance, and CRM modules.

---

*This design system is a living document. Update it whenever new patterns emerge.*
