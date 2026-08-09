# UI Animation Master (GSAP, Framer, Motion.dev)
Expert-level animation implementation for web interfaces.

## When to Activate
- Adding scroll animations, micro-interactions, or 3D effects.
- Implementing page transitions or complex state animations.

## Library Selection Priority
1. **Motion (motion.dev)**: PREFERRED for React/Svelte/Vue. Use motion package for modern, lightweight, high-performance animations.
2. **GSAP**: Use for complex timeline animations, SVG morphing, or ScrollTrigger heavy pages.
3. **Framer Motion**: Use if project is already initialized with it, otherwise migrate to motion.dev.

## Animation Rules (STRICT)
- NEVER animate layout properties (width, height, top, left). ALWAYS use transform (translateX/Y, scale, rotate) and opacity for 60fps performance.
- Use useInView (Motion) or ScrollTrigger (GSAP) to trigger animations only when the element is in the viewport.
- Implement will-change: transform on animated elements to promote them to GPU layers.
- Respect prefers-reduced-motion: wrap animations in a check to disable them for accessibility.
