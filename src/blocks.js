export const BlockType = {
  GRASS: 0,
  STONE: 1,
  WOOD: 2,
  DIRT: 3
};

export const BLOCK_SIZE = 1;

export function getBlockColor(type) {
  switch (type) {
    case BlockType.GRASS:
      return 0x3a8f3a; // Green
    case BlockType.STONE:
      return 0x808080; // Gray
    case BlockType.WOOD:
      return 0x8b4513; // Brown
    case BlockType.DIRT:
      return 0x8b7355; // Light brown
    default:
      return 0xffffff; // White
  }
}

export function getBlockTexture(type, face) {
  // Simple texture coords for each block type
  // In a real game, you'd use actual texture atlases
  switch (type) {
    case BlockType.GRASS:
      return face === "top" ? 0x4CAF50 : 0x3a8f3a;
    case BlockType.STONE:
      return 0x888888;
    case BlockType.WOOD:
      return face === "top" || face === "bottom" ? 0x6B4423 : 0x8b4513;
    case BlockType.DIRT:
      return 0x9b8b7b;
    default:
      return 0xffffff;
  }
}
