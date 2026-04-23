import { BlockType } from "./blocks.js";

export const ItemType = {
  GRASS_BLOCK: "grass_block",
  DIRT: "dirt",
  STONE: "stone",
  COBBLESTONE: "cobblestone",
  SAND: "sand",
  GLASS: "glass",
  OAK_LOG: "oak_log",
  OAK_PLANKS: "oak_planks",
  OAK_LEAVES: "oak_leaves",
  STICK: "stick",
  COAL: "coal",
  RAW_IRON: "raw_iron",
  RAW_GOLD: "raw_gold",
  IRON_INGOT: "iron_ingot",
  GOLD_INGOT: "gold_ingot",
  DIAMOND: "diamond",
  CLAY_BALL: "clay_ball",
  BRICK: "brick",
  APPLE: "apple",
  RAW_BEEF: "raw_beef",
  COOKED_BEEF: "cooked_beef",
  RAW_PORK: "raw_pork",
  COOKED_PORK: "cooked_pork",
  RAW_CHICKEN: "raw_chicken",
  COOKED_CHICKEN: "cooked_chicken",
  WOOL: "wool",
  LEATHER: "leather",
  SLIME_BALL: "slime_ball",
  ROTTEN_FLESH: "rotten_flesh",
  BONE: "bone",
  STRING: "string",
  ARROW: "arrow",
  BOW: "bow",
  WHEAT: "wheat",
  BREAD: "bread",
  CARROT: "carrot",
  POTATO: "potato",
  BAKED_POTATO: "baked_potato",
  EMERALD: "emerald",
  TORCH: "torch",
  WOODEN_PICKAXE: "wooden_pickaxe",
  STONE_PICKAXE: "stone_pickaxe",
  IRON_PICKAXE: "iron_pickaxe",
  GOLD_PICKAXE: "gold_pickaxe",
  DIAMOND_PICKAXE: "diamond_pickaxe",
  WOODEN_SWORD: "wooden_sword",
  STONE_SWORD: "stone_sword",
  IRON_SWORD: "iron_sword",
  DIAMOND_SWORD: "diamond_sword"
};

export const ITEM_INFO = {
  [ItemType.GRASS_BLOCK]: { name: "Grass Block", color: 0x4a9d46, placeBlock: BlockType.GRASS },
  [ItemType.DIRT]: { name: "Dirt", color: 0x8b7355, placeBlock: BlockType.DIRT },
  [ItemType.STONE]: { name: "Stone", color: 0x808080, placeBlock: BlockType.STONE },
  [ItemType.COBBLESTONE]: { name: "Cobblestone", color: 0x6f6f6f, placeBlock: BlockType.COBBLESTONE },
  [ItemType.SAND]: { name: "Sand", color: 0xf0e68c, placeBlock: BlockType.SAND },
  [ItemType.GLASS]: { name: "Glass", color: 0xb3d9ff, placeBlock: BlockType.GLASS },
  [ItemType.OAK_LOG]: { name: "Oak Log", color: 0x6b4423, placeBlock: BlockType.OAK_LOG },
  [ItemType.OAK_PLANKS]: { name: "Oak Planks", color: 0xa0522d, placeBlock: BlockType.OAK_PLANKS },
  [ItemType.OAK_LEAVES]: { name: "Oak Leaves", color: 0x2d7a1f, placeBlock: BlockType.OAK_LEAVES },
  [ItemType.STICK]: { name: "Stick", color: 0x8d6b42 },
  [ItemType.COAL]: { name: "Coal", color: 0x2a2a2a },
  [ItemType.RAW_IRON]: { name: "Raw Iron", color: 0xbf7f4f },
  [ItemType.RAW_GOLD]: { name: "Raw Gold", color: 0xd8af3d },
  [ItemType.IRON_INGOT]: { name: "Iron Ingot", color: 0xbbb4a9 },
  [ItemType.GOLD_INGOT]: { name: "Gold Ingot", color: 0xdcb438 },
  [ItemType.DIAMOND]: { name: "Diamond", color: 0x48dbe4 },
  [ItemType.CLAY_BALL]: { name: "Clay Ball", color: 0xb59671 },
  [ItemType.BRICK]: { name: "Brick", color: 0xb84f3a },
  [ItemType.APPLE]: { name: "Apple", color: 0xc43d2d, food: 4 },
  [ItemType.RAW_BEEF]: { name: "Raw Beef", color: 0x8e2f2f, food: 2 },
  [ItemType.COOKED_BEEF]: { name: "Steak", color: 0x9e5533, food: 8 },
  [ItemType.RAW_PORK]: { name: "Raw Pork", color: 0xb04f5f, food: 2 },
  [ItemType.COOKED_PORK]: { name: "Cooked Pork", color: 0xcd7e4a, food: 8 },
  [ItemType.RAW_CHICKEN]: { name: "Raw Chicken", color: 0xe1b8a9, food: 2 },
  [ItemType.COOKED_CHICKEN]: { name: "Cooked Chicken", color: 0xd69b63, food: 6 },
  [ItemType.WOOL]: { name: "Wool", color: 0xe8e8e8 },
  [ItemType.LEATHER]: { name: "Leather", color: 0x7e4b2a },
  [ItemType.SLIME_BALL]: { name: "Slime Ball", color: 0x7dd66f },
  [ItemType.ROTTEN_FLESH]: { name: "Rotten Flesh", color: 0x6b5a43, food: 2 },
  [ItemType.BONE]: { name: "Bone", color: 0xe8e0cf },
  [ItemType.STRING]: { name: "String", color: 0xc9c3b6 },
  [ItemType.ARROW]: { name: "Arrow", color: 0xa8a1a0 },
  [ItemType.BOW]: { name: "Bow", color: 0x8d6b42, tool: { kind: "bow", tier: 1, damage: 2.8 } },
  [ItemType.WHEAT]: { name: "Wheat", color: 0xd6c36f },
  [ItemType.BREAD]: { name: "Bread", color: 0xb6823f, food: 5 },
  [ItemType.CARROT]: { name: "Carrot", color: 0xdf8c2f, food: 4 },
  [ItemType.POTATO]: { name: "Potato", color: 0xb48b5f, food: 2 },
  [ItemType.BAKED_POTATO]: { name: "Baked Potato", color: 0xcb9559, food: 5 },
  [ItemType.EMERALD]: { name: "Emerald", color: 0x55d37a },
  [ItemType.TORCH]: { name: "Torch", color: 0xffb347 },
  [ItemType.WOODEN_PICKAXE]: { name: "Wooden Pickaxe", color: 0x9b7a49, tool: { kind: "pickaxe", tier: 1, damage: 1, speed: 1.2 } },
  [ItemType.STONE_PICKAXE]: { name: "Stone Pickaxe", color: 0x8c8c8c, tool: { kind: "pickaxe", tier: 2, damage: 1.2, speed: 1.5 } },
  [ItemType.IRON_PICKAXE]: { name: "Iron Pickaxe", color: 0xb0a090, tool: { kind: "pickaxe", tier: 3, damage: 1.4, speed: 1.8 } },
  [ItemType.GOLD_PICKAXE]: { name: "Gold Pickaxe", color: 0xdcb438, tool: { kind: "pickaxe", tier: 2, damage: 1.1, speed: 2.2 } },
  [ItemType.DIAMOND_PICKAXE]: { name: "Diamond Pickaxe", color: 0x4cc8da, tool: { kind: "pickaxe", tier: 4, damage: 1.6, speed: 2.0 } },
  [ItemType.WOODEN_SWORD]: { name: "Wooden Sword", color: 0x9b7a49, tool: { kind: "sword", tier: 1, damage: 2.3 } },
  [ItemType.STONE_SWORD]: { name: "Stone Sword", color: 0x8c8c8c, tool: { kind: "sword", tier: 2, damage: 3.0 } },
  [ItemType.IRON_SWORD]: { name: "Iron Sword", color: 0xb0a090, tool: { kind: "sword", tier: 3, damage: 4.0 } },
  [ItemType.DIAMOND_SWORD]: { name: "Diamond Sword", color: 0x4cc8da, tool: { kind: "sword", tier: 4, damage: 5.0 } }
};

export const STARTER_ITEMS = {
  [ItemType.GRASS_BLOCK]: 32,
  [ItemType.DIRT]: 32,
  [ItemType.COBBLESTONE]: 24,
  [ItemType.OAK_LOG]: 10,
  [ItemType.OAK_PLANKS]: 16,
  [ItemType.SAND]: 12,
  [ItemType.APPLE]: 4
};

export const HOTBAR_ITEMS = [
  ItemType.GRASS_BLOCK,
  ItemType.DIRT,
  ItemType.COBBLESTONE,
  ItemType.OAK_LOG,
  ItemType.OAK_PLANKS,
  ItemType.SAND,
  ItemType.GLASS,
  ItemType.TORCH,
  ItemType.STONE_SWORD,
  ItemType.WOODEN_PICKAXE,
  ItemType.BOW,
  ItemType.APPLE
];

export const BLOCK_DROP_ITEMS = {
  [BlockType.GRASS]: [{ item: ItemType.DIRT, count: 1 }],
  [BlockType.DIRT]: [{ item: ItemType.DIRT, count: 1 }],
  [BlockType.STONE]: [{ item: ItemType.COBBLESTONE, count: 1 }],
  [BlockType.COBBLESTONE]: [{ item: ItemType.COBBLESTONE, count: 1 }],
  [BlockType.OAK_LOG]: [{ item: ItemType.OAK_LOG, count: 1 }],
  [BlockType.SAND]: [{ item: ItemType.SAND, count: 1 }],
  [BlockType.GRAVEL]: [{ item: ItemType.COBBLESTONE, count: 1 }],
  [BlockType.COAL_ORE]: [{ item: ItemType.COAL, count: 1 }],
  [BlockType.IRON_ORE]: [{ item: ItemType.RAW_IRON, count: 1 }],
  [BlockType.GOLD_ORE]: [{ item: ItemType.RAW_GOLD, count: 1 }],
  [BlockType.DIAMOND_ORE]: [{ item: ItemType.DIAMOND, count: 1 }],
  [BlockType.OAK_PLANKS]: [{ item: ItemType.OAK_PLANKS, count: 1 }],
  [BlockType.GLASS]: [{ item: ItemType.GLASS, count: 1 }],
  [BlockType.SNOW]: [{ item: ItemType.WOOL, count: 1 }],
  [BlockType.CLAY]: [{ item: ItemType.CLAY_BALL, count: 2 }],
  [BlockType.OAK_LEAVES]: []
};

export const MOB_DROP_ITEMS = {
  cow: [
    { item: ItemType.RAW_BEEF, count: 2 },
    { item: ItemType.LEATHER, count: 1 }
  ],
  slime: [{ item: ItemType.SLIME_BALL, count: 1 }],
  pig: [{ item: ItemType.RAW_PORK, count: 2 }],
  sheep: [{ item: ItemType.WOOL, count: 1 }],
  zombie: [
    { item: ItemType.ROTTEN_FLESH, count: 1 },
    { item: ItemType.BONE, count: 1 }
  ],
  skeleton: [
    { item: ItemType.BONE, count: 2 },
    { item: ItemType.STRING, count: 1 }
  ],
  spider: [{ item: ItemType.STRING, count: 2 }],
  chicken: [
    { item: ItemType.RAW_CHICKEN, count: 1 },
    { item: ItemType.FEATHER, count: 1 }
  ]
};

export const CRAFTING_RECIPES = [
  {
    id: "logs_to_planks",
    label: "1 Oak Log -> 4 Oak Planks",
    input: { [ItemType.OAK_LOG]: 1 },
    output: { [ItemType.OAK_PLANKS]: 4 }
  },
  {
    id: "planks_to_sticks",
    label: "2 Oak Planks -> 4 Sticks",
    input: { [ItemType.OAK_PLANKS]: 2 },
    output: { [ItemType.STICK]: 4 }
  },
  {
    id: "coal_torch",
    label: "1 Coal + 1 Stick -> 4 Torches",
    input: { [ItemType.COAL]: 1, [ItemType.STICK]: 1 },
    output: { [ItemType.TORCH]: 4 }
  },
  {
    id: "glass_from_sand",
    label: "2 Sand -> 1 Glass (alt craft)",
    input: { [ItemType.SAND]: 2 },
    output: { [ItemType.GLASS]: 1 }
  },
  {
    id: "wood_pickaxe",
    label: "3 Planks + 2 Sticks -> Wooden Pickaxe",
    input: { [ItemType.OAK_PLANKS]: 3, [ItemType.STICK]: 2 },
    output: { [ItemType.WOODEN_PICKAXE]: 1 }
  },
  {
    id: "stone_pickaxe",
    label: "3 Cobble + 2 Sticks -> Stone Pickaxe",
    input: { [ItemType.COBBLESTONE]: 3, [ItemType.STICK]: 2 },
    output: { [ItemType.STONE_PICKAXE]: 1 }
  },
  {
    id: "iron_pickaxe",
    label: "3 Iron Ingot + 2 Sticks -> Iron Pickaxe",
    input: { [ItemType.IRON_INGOT]: 3, [ItemType.STICK]: 2 },
    output: { [ItemType.IRON_PICKAXE]: 1 }
  },
  {
    id: "diamond_pickaxe",
    label: "3 Diamond + 2 Sticks -> Diamond Pickaxe",
    input: { [ItemType.DIAMOND]: 3, [ItemType.STICK]: 2 },
    output: { [ItemType.DIAMOND_PICKAXE]: 1 }
  },
  {
    id: "wood_sword",
    label: "2 Planks + 1 Stick -> Wooden Sword",
    input: { [ItemType.OAK_PLANKS]: 2, [ItemType.STICK]: 1 },
    output: { [ItemType.WOODEN_SWORD]: 1 }
  },
  {
    id: "stone_sword",
    label: "2 Cobble + 1 Stick -> Stone Sword",
    input: { [ItemType.COBBLESTONE]: 2, [ItemType.STICK]: 1 },
    output: { [ItemType.STONE_SWORD]: 1 }
  },
  {
    id: "bow",
    label: "3 String + 3 Sticks -> Bow",
    input: { [ItemType.STRING]: 3, [ItemType.STICK]: 3 },
    output: { [ItemType.BOW]: 1 }
  },
  {
    id: "bread",
    label: "3 Wheat -> Bread",
    input: { [ItemType.WHEAT]: 3 },
    output: { [ItemType.BREAD]: 1 }
  },
  {
    id: "iron_sword",
    label: "2 Iron Ingot + 1 Stick -> Iron Sword",
    input: { [ItemType.IRON_INGOT]: 2, [ItemType.STICK]: 1 },
    output: { [ItemType.IRON_SWORD]: 1 }
  },
  {
    id: "diamond_sword",
    label: "2 Diamond + 1 Stick -> Diamond Sword",
    input: { [ItemType.DIAMOND]: 2, [ItemType.STICK]: 1 },
    output: { [ItemType.DIAMOND_SWORD]: 1 }
  }
];

export const SMELTING_RECIPES = [
  {
    id: "raw_iron_smelting",
    label: "1 Raw Iron + 1 Coal -> 1 Iron Ingot",
    input: { [ItemType.RAW_IRON]: 1, [ItemType.COAL]: 1 },
    output: { [ItemType.IRON_INGOT]: 1 }
  },
  {
    id: "raw_gold_smelting",
    label: "1 Raw Gold + 1 Coal -> 1 Gold Ingot",
    input: { [ItemType.RAW_GOLD]: 1, [ItemType.COAL]: 1 },
    output: { [ItemType.GOLD_INGOT]: 1 }
  },
  {
    id: "sand_smelting",
    label: "1 Sand + 1 Coal -> 1 Glass",
    input: { [ItemType.SAND]: 1, [ItemType.COAL]: 1 },
    output: { [ItemType.GLASS]: 1 }
  },
  {
    id: "beef_smelting",
    label: "1 Raw Beef + 1 Coal -> 1 Steak",
    input: { [ItemType.RAW_BEEF]: 1, [ItemType.COAL]: 1 },
    output: { [ItemType.COOKED_BEEF]: 1 }
  },
  {
    id: "pork_smelting",
    label: "1 Raw Pork + 1 Coal -> 1 Cooked Pork",
    input: { [ItemType.RAW_PORK]: 1, [ItemType.COAL]: 1 },
    output: { [ItemType.COOKED_PORK]: 1 }
  },
  {
    id: "brick_smelting",
    label: "1 Clay Ball + 1 Coal -> 1 Brick",
    input: { [ItemType.CLAY_BALL]: 1, [ItemType.COAL]: 1 },
    output: { [ItemType.BRICK]: 1 }
  },
  {
    id: "chicken_smelting",
    label: "1 Raw Chicken + 1 Coal -> 1 Cooked Chicken",
    input: { [ItemType.RAW_CHICKEN]: 1, [ItemType.COAL]: 1 },
    output: { [ItemType.COOKED_CHICKEN]: 1 }
  },
  {
    id: "potato_smelting",
    label: "1 Potato + 1 Coal -> 1 Baked Potato",
    input: { [ItemType.POTATO]: 1, [ItemType.COAL]: 1 },
    output: { [ItemType.BAKED_POTATO]: 1 }
  }
];

export function createInventory(seed = {}) {
  const map = new Map();
  for (const [id, count] of Object.entries(seed)) {
    if (count > 0) {
      map.set(id, Math.floor(count));
    }
  }
  return map;
}

export function getItemName(itemId) {
  return ITEM_INFO[itemId]?.name ?? itemId;
}

export function getItemColor(itemId) {
  return ITEM_INFO[itemId]?.color ?? 0xffffff;
}

export function getPlaceableBlock(itemId) {
  return ITEM_INFO[itemId]?.placeBlock ?? null;
}

export function getItemTool(itemId) {
  return ITEM_INFO[itemId]?.tool ?? null;
}

export function getFoodValue(itemId) {
  return ITEM_INFO[itemId]?.food ?? 0;
}

export function getCount(inventory, itemId) {
  return inventory.get(itemId) ?? 0;
}

export function addItem(inventory, itemId, count = 1) {
  if (!itemId || count <= 0) return 0;
  const current = getCount(inventory, itemId);
  const next = current + Math.floor(count);
  inventory.set(itemId, next);
  return next;
}

export function removeItem(inventory, itemId, count = 1) {
  if (!itemId || count <= 0) return false;
  const current = getCount(inventory, itemId);
  if (current < count) return false;
  const next = current - Math.floor(count);
  if (next <= 0) {
    inventory.delete(itemId);
  } else {
    inventory.set(itemId, next);
  }
  return true;
}

export function hasItems(inventory, requirement) {
  for (const [itemId, count] of Object.entries(requirement)) {
    if (getCount(inventory, itemId) < count) {
      return false;
    }
  }
  return true;
}

export function consumeItems(inventory, requirement) {
  if (!hasItems(inventory, requirement)) {
    return false;
  }
  for (const [itemId, count] of Object.entries(requirement)) {
    removeItem(inventory, itemId, count);
  }
  return true;
}

export function applyOutput(inventory, output) {
  for (const [itemId, count] of Object.entries(output)) {
    addItem(inventory, itemId, count);
  }
}

export function craftRecipe(inventory, recipe) {
  if (!consumeItems(inventory, recipe.input)) {
    return false;
  }
  applyOutput(inventory, recipe.output);
  return true;
}

export function getDropsForBlock(blockType) {
  if (blockType === BlockType.OAK_LEAVES) {
    if (Math.random() > 0.84) {
      return [{ item: ItemType.APPLE, count: 1 }];
    }
    return [];
  }
  const drops = BLOCK_DROP_ITEMS[blockType] ?? [];
  return drops.map((entry) => ({ ...entry }));
}

export function getDropsForMob(mobType) {
  const base = MOB_DROP_ITEMS[mobType] ?? [];
  return base.map((entry) => {
    const variance = Math.random() > 0.6 ? 1 : 0;
    return { ...entry, count: entry.count + variance };
  });
}

export function findFirstCraftable(inventory, recipes) {
  for (const recipe of recipes) {
    if (hasItems(inventory, recipe.input)) {
      return recipe;
    }
  }
  return null;
}

export function summarizeInventory(inventory, max = 8) {
  const entries = Array.from(inventory.entries())
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  return entries.slice(0, max).map(([id, count]) => `${getItemName(id)} x${count}`);
}
