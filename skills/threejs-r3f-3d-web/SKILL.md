---
name: threejs-r3f-3d-web
description: Production-grade 3D web experiences with React Three Fiber, drei, and postprocessing. Performance budgets, scroll-driven camera, asset optimization, and graceful fallbacks.
metadata:
  category: frontend
---

## EXECUTION STANDARD (QWEN STYLE)

Focus: 3D scenes that ship at 60fps and degrade gracefully

- APPLY: R3F + drei, compressed assets, budgeted draw calls, Suspense everywhere
- VERIFY: Dev server run + Playwright screenshot + zero console/WebGL errors + FPS sanity check
- ANTI-PATTERNS: setState in useFrame, unclamped DPR, uncompressed GLTF, blocking first paint

<!-- /QWEN-STYLE -->

# Three.js / React Three Fiber 3D Web Skill

## When to Activate

- Any request mentioning 3D, Three.js, R3F, WebGL, shaders, Spline, or immersive/scrollytelling pages.
- Adding 3D product viewers, hero scenes, or camera-driven narratives to a React/Next.js app.

## Stack Priority (STRICT)

1. **@react-three/fiber + @react-three/drei**: Default for React/Next.js. Never hand-roll vanilla Three.js inside React components.
2. **@react-three/postprocessing**: For bloom, vignette, depth-of-field. Prefer over custom shader passes.
3. **Vanilla three**: Only for non-React embeds; isolate in a class with explicit dispose().

## Performance Budgets (STRICT)

- Draw calls: ≤ 150 desktop, ≤ 80 mobile. Use InstancedMesh for repeated geometry.
- Triangles: ≤ 500k desktop, ≤ 250k mobile.
- Textures: ≤ 2K resolution, KTX2/Basis compressed. Never ship raw 4K PNG/JPEG to the browser.
- Dynamic lights: ≤ 3. Prefer Environment presets, lightmaps, or baked lighting.
- DPR: clamp with `dpr={[1, 1.5]}` on mobile-heavy audiences; never `window.devicePixelRatio` raw.
- Static scenes: use `frameloop="demand"` and `invalidate()` on change instead of rendering 60fps idle.

## Memory & Frame Rules (STRICT)

- NEVER create objects (Vector3, Color, materials, geometries) inside useFrame. Hoist or reuse refs.
- ALWAYS dispose geometries, materials, and textures on unmount (useEffect cleanup or drei useGLTF cache).
- Wrap every model in `<Suspense fallback={...}>`; lazy-load the Canvas with `next/dynamic { ssr: false }`.

## Asset Pipeline

- GLTF/GLB only, compressed with Draco or meshopt (`gltf-transform optimize`).
- Preload critical models: `useGLTF.preload('/model.glb')`.
- Never block first paint on 3D: render 2D hero content first, hydrate Canvas after.

## Scroll & Camera

- Drive camera via GSAP ScrollTrigger or drei ScrollControls; interpolate in useFrame with lerp (damping 0.05–0.1).
- NEVER call setState per scroll/frame tick — write to refs, read in useFrame.
- Respect prefers-reduced-motion: swap camera animation for a static composed shot.

## Fallbacks (STRICT)

- Detect WebGL (`try/catch` on context creation or drei `<Canvas fallback>`) → render static poster image.
- Mobile tier: reduce pixel ratio, disable postprocessing, swap HDRI for gradient env.

## Verification (MANDATORY before reporting done)

1. Run dev server in background.
2. Playwright: load page, capture console — assert zero WebGL errors/warnings.
3. Screenshot desktop + mobile widths; confirm scene renders (no black canvas).
4. Pair with the visual-qa-playwright skill for the full loop.
