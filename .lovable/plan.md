# Plan: Poke Idle Prototype

Build a game prototype inspired by `poke.idleworld` to demonstrate 2D engine capabilities using React, Konva.js, and Tailwind.

## User Interface
- **2D Game Canvas**: Tile-based volcanic map rendering.
- **Sprites**: Interactive creature sprites (placeholders for Golem, Charizard).
- **Capture Sidebar**: UI panel matching the uploaded screenshot style (dark, rounded, gold accents).
- **HUD**: Top info bar for currency and player stats.

## Technical Details
- **Engine**: `react-konva` for high-performance 2D rendering.
- **State**: Reactive game loop for creature movement and UI updates.
- **Assets**: Use CSS patterns and emoji/lucide-icons as placeholders initially, or generic pixel-art URLs if available.
- **Theme**: Deep dark palette matching the screenshot's capture panel.

## Steps
1. Create `src/components/game/GameCanvas.tsx` using Konva.
2. Create `src/components/game/CaptureSidebar.tsx` for the UI.
3. Replace `src/routes/index.tsx` with the game interface.
4. Add basic game loop (random movement for sprites).
