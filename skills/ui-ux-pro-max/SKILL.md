# UI/UX Pro Max Skill
Master-level UI/UX design enforcement for pixel-perfect, modern web interfaces.

## When to Activate
- Building any frontend component, page, or layout.
- Writing CSS, Tailwind, or Styled Components.
- Designing dashboards, landing pages, or mobile apps.

## Core Design Principles (STRICT)

### 1. Design Tokens & Spacing
- NEVER use arbitrary pixel values (e.g., p-[14px]).
- ALWAYS use consistent spacing scales (e.g., Tailwind's p-4, p-8, gap-6).
- Use clamp() for fluid typography and spacing across breakpoints.

### 2. Color Theory & Contrast
- NEVER use pure black (#000000) or pure white (#ffffff) for backgrounds.
- Always use subtle off-whites (e.g., bg-gray-50 or hsl(0 0% 98%)) and rich dark grays (e.g., bg-zinc-900).
- Ensure WCAG AA contrast ratios (minimum 4.5:1 for body text).
- Use HSL or OKLCH for color manipulation to ensure perceptual uniformity.

### 3. Typography & Hierarchy
- Limit to 2 font families (1 for headings, 1 for body).
- Establish a strict type scale (e.g., 12px, 14px, 16px, 20px, 24px, 32px, 48px, 64px).
- Use font-feature-settings for premium typography rendering (e.g., 'ss01', 'cv01').

### 4. Depth & Lighting
- Avoid harsh, solid borders. Use subtle ring shadows instead (e.g., ring-1 ring-black/5).
- Layer shadows for depth: shadow-sm shadow-md shadow-lg. 
- Use glassmorphism (backdrop-blur + bg-opacity) sparingly for floating elements.

### 5. Motion & Interaction
- Every state change (hover, active, focus) MUST have a transition.
- Default transition duration: 150ms - 250ms.
- Use cubic-bezier easing (e.g., transition ease-in-out or cubic-bezier(0.4, 0, 0.2, 1)).
