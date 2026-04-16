export const BlockType = {
  AIR: 0,
  GRASS: 1,
  DIRT: 2,
  STONE: 3,
  COBBLESTONE: 4,
  OAK_LOG: 5,
  OAK_LEAVES: 6,
  SAND: 7,
  GRAVEL: 8,
  COAL_ORE: 9,
  IRON_ORE: 10,
  GOLD_ORE: 11,
  DIAMOND_ORE: 12,
  WATER: 13,
  LAVA: 14,
  BEDROCK: 15,
  OAK_PLANKS: 16,
  GLASS: 17,
  SNOW: 18,
  CLAY: 19
};

export const BLOCK_SIZE = 1;

export const BLOCK_NAMES = {
  [BlockType.AIR]: "Air",
  [BlockType.GRASS]: "Grass",
  [BlockType.DIRT]: "Dirt",
  [BlockType.STONE]: "Stone",
  [BlockType.COBBLESTONE]: "Cobblestone",
  [BlockType.OAK_LOG]: "Oak Log",
  [BlockType.OAK_LEAVES]: "Oak Leaves",
  [BlockType.SAND]: "Sand",
  [BlockType.GRAVEL]: "Gravel",
  [BlockType.COAL_ORE]: "Coal Ore",
  [BlockType.IRON_ORE]: "Iron Ore",
  [BlockType.GOLD_ORE]: "Gold Ore",
  [BlockType.DIAMOND_ORE]: "Diamond Ore",
  [BlockType.WATER]: "Water",
  [BlockType.LAVA]: "Lava",
  [BlockType.BEDROCK]: "Bedrock",
  [BlockType.OAK_PLANKS]: "Oak Planks",
  [BlockType.GLASS]: "Glass",
  [BlockType.SNOW]: "Snow",
  [BlockType.CLAY]: "Clay"
};

export const HOTBAR_BLOCKS = [
  BlockType.GRASS,
  BlockType.DIRT,
  BlockType.STONE,
  BlockType.COBBLESTONE,
  BlockType.OAK_LOG,
  BlockType.OAK_PLANKS,
  BlockType.SAND,
  BlockType.GLASS
];

export const BLOCK_DROPS = {
  [BlockType.GRASS]: BlockType.DIRT,
  [BlockType.DIRT]: BlockType.DIRT,
  [BlockType.STONE]: BlockType.COBBLESTONE,
  [BlockType.COBBLESTONE]: BlockType.COBBLESTONE,
  [BlockType.OAK_LOG]: BlockType.OAK_LOG,
  [BlockType.OAK_LEAVES]: BlockType.OAK_LEAVES,
  [BlockType.SAND]: BlockType.SAND,
  [BlockType.GRAVEL]: BlockType.GRAVEL,
  [BlockType.COAL_ORE]: BlockType.COAL_ORE,
  [BlockType.IRON_ORE]: BlockType.IRON_ORE,
  [BlockType.GOLD_ORE]: BlockType.GOLD_ORE,
  [BlockType.DIAMOND_ORE]: BlockType.DIAMOND_ORE,
  [BlockType.WATER]: BlockType.AIR,
  [BlockType.LAVA]: BlockType.AIR,
  [BlockType.BEDROCK]: BlockType.AIR,
  [BlockType.OAK_PLANKS]: BlockType.OAK_PLANKS,
  [BlockType.GLASS]: BlockType.GLASS,
  [BlockType.SNOW]: BlockType.SNOW,
  [BlockType.CLAY]: BlockType.CLAY
};

export const CRAFTING_RECIPES = [
  {
    id: "logs_to_planks",
    label: "1 Oak Log -> 4 Oak Planks",
    input: { [BlockType.OAK_LOG]: 1 },
    output: { [BlockType.OAK_PLANKS]: 4 }
  },
  {
    id: "sand_to_glass",
    label: "2 Sand -> 1 Glass",
    input: { [BlockType.SAND]: 2 },
    output: { [BlockType.GLASS]: 1 }
  },
  {
    id: "stone_to_cobble",
    label: "2 Stone -> 2 Cobblestone",
    input: { [BlockType.STONE]: 2 },
    output: { [BlockType.COBBLESTONE]: 2 }
  }
];

// Make certain blocks transparent or semi-transparent
export const TRANSPARENT_BLOCKS = new Set([BlockType.WATER, BlockType.LAVA, BlockType.OAK_LEAVES, BlockType.GLASS]);
export const LIQUID_BLOCKS = new Set([BlockType.WATER, BlockType.LAVA]);

export function getBlockColor(type) {
  switch (type) {
    case BlockType.GRASS:
      return 0x3a8f3a; // Green
    case BlockType.DIRT:
      return 0x8b7355; // Brown
    case BlockType.STONE:
      return 0x808080; // Gray
    case BlockType.COBBLESTONE:
      return 0x707070; // Dark gray
    case BlockType.OAK_LOG:
      return 0x6b4423; // Brown
    case BlockType.OAK_LEAVES:
      return 0x2d7a1f; // Dark green
    case BlockType.SAND:
      return 0xf0e68c; // Khaki
    case BlockType.GRAVEL:
      return 0xa9a9a9; // Dark gray
    case BlockType.COAL_ORE:
      return 0x2a2a2a; // Black
    case BlockType.IRON_ORE:
      return 0xc1440f; // Rust
    case BlockType.GOLD_ORE:
      return 0xdaa520; // Goldenrod
    case BlockType.DIAMOND_ORE:
      return 0x4dd0e1; // Cyan
    case BlockType.WATER:
      return 0x4da6ff; // Light blue
    case BlockType.LAVA:
      return 0xff6b1a; // Orange
    case BlockType.BEDROCK:
      return 0x1a1a1a; // Very dark gray
    case BlockType.OAK_PLANKS:
      return 0xa0522d; // Sienna
    case BlockType.GLASS:
      return 0xb3d9ff; // Light blue
    case BlockType.SNOW:
      return 0xf0f8ff; // Alice blue
    case BlockType.CLAY:
      return 0xb8860b; // Dark goldenrod
    default:
      return 0xffffff; // White
  }
}

export function getBlockBrightness(type, face) {
  // Add face-based lighting for depth
  const faceLight = {
    top: 1.3,
    bottom: 0.7,
    north: 1.0,
    south: 1.0,
    east: 1.1,
    west: 0.9
  };
  return faceLight[face] || 1.0;
}

export function isBlockSolid(type) {
  return type !== BlockType.AIR && !TRANSPARENT_BLOCKS.has(type);
}

export function canMineBlock(type) {
  return type !== BlockType.AIR && type !== BlockType.BEDROCK && type !== BlockType.WATER && type !== BlockType.LAVA;
}

export function getDropForBlock(type) {
  return BLOCK_DROPS[type] ?? BlockType.AIR;
}

export function shouldRenderFace(blockType, neighborType) {
  if (!isBlockSolid(blockType)) return false;
  if (neighborType === BlockType.AIR) return true;
  if (TRANSPARENT_BLOCKS.has(neighborType)) return true;
  return false;
}

export function getBlockTexture(type, face) {
  // Different shading for different block faces
  const color = getBlockColor(type);
  const brightness = getBlockBrightness(type, face);
  
  // Apply brightness to color - simplified approach
  const c = new (typeof THREE !== 'undefined' ? THREE.Color : function() {
    this.getHex = () => color;
  })(color);
  
  return color;
}
