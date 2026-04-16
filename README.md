# Blockscape - A Minecraft-like Voxel Game

A 3D voxel-based sandbox game built with Three.js, featuring block-based world generation, player destruction and creation, and an intuitive first-person experience.

## Features

- **First-Person Gameplay**: Navigate a 3D voxel world from a first-person perspective
- **Block Types**: Multiple block types (Grass, Stone, Wood, Dirt) with different colors
- **Terrain Generation**: Procedurally generated terrain using noise-based algorithms
- **Block Interaction**: Break blocks (left-click) and place blocks (right-click)
- **Block Selection**: Switch between 4 different block types using number keys 1-4
- **Creative Mode**: Use Q/E keys for free vertical movement
- **Physics**: Gravity and collisions with terrain
- **Smooth Controls**: WASD movement with mouse look and pointer lock

## Controls

| Key | Action |
|-----|--------|
| **Click** | Lock pointer for mouse look |
| **W/A/S/D** | Move forward/left/backward/right |
| **Q/E** | Descend/ascend (Creative mode) |
| **Mouse** | Look around |
| **Left Click** | Remove block |
| **Right Click** | Place block |
| **1-4** | Select block type (Grass, Stone, Wood, Dirt) |
| **Shift** | Sprint |
| **R** | Reset to spawn point |

## How to Run

### Local Server (Recommended)

```bash
cd /workspaces/Game
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.

### Using Node.js

If you have Node.js installed with `http-serve`:

```bash
npx http-server . -p 8000
```

## Game Mechanics

### Block Types

1. **Grass** - Green blocks that appear on terrain surface
2. **Stone** - Gray blocks found deeper underground
3. **Wood** - Brown blocks for building structures
4. **Dirt** - Light brown blocks for terrain

### Terrain Generation

The terrain is procedurally generated using a layered noise algorithm that creates natural-looking hills and valleys. The height of terrain varies based on position, creating an interesting landscape to explore.

### Block Placement & Destruction

- **Destroy**: Left-click any visible block to remove it
- **Place**: Right-click on any block to place a new block of the selected type next to it
- Switch between block types using keys 1-4

## Technical Stack

- **Three.js**: 3D graphics library for WebGL rendering
- **Voxel Engine**: Custom implementation handling block management and mesh generation
- **Noise Generation**: Procedural terrain generation using sine-based algorithms

## File Structure

```
src/
├── main.js       - Entry point
├── game.js       - Main game class and orchestration
├── player.js     - First-person player controller
├── world.js      - Voxel world management and rendering
└── blocks.js     - Block type definitions and properties
```

## Browser Requirements

- Modern browser with WebGL support (Chrome, Firefox, Edge, Safari)
- JavaScript ES6+ support

## Performance

The game uses a single mesh for all blocks with vertex coloring for different block types. This approach provides good performance while maintaining visual quality. Further optimizations could include:

- Chunk-based loading/unloading
- Frustum culling
- Level-of-detail rendering
- Texture atlasing

## Future Enhancements

- Water and lava blocks
- More block types and textures
- Inventory system
- Crafting mechanics
- Multiplayer support
- Better terrain generation (Perlin noise)
- Lighting system improvements
- Animation and particle effects
