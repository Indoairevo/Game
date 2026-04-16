import { BlockType } from "./blocks.js";

export const ItemType = {
  DIRT: "dirt",
  COBBLESTONE: "cobblestone",
  SAND: "sand",
  GLASS: "glass",
  OAK_LOG: "oak_log",
  OAK_PLANKS: "oak_planks",
  STICK: "stick",
  COAL: "coal",
  RAW_IRON: "raw_iron",
  RAW_GOLD: "raw_gold",
  DIAMOND: "diamond",
  APPLE: "apple",
  BEEF: "beef",
  SLIME_BALL: "slime_ball",
  LEATHER: "leather",
  WOOL: "wool",
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
  [ItemType.DIRT]: { name: "Dirt", color: 0x8b7355 },
  [ItemType.COBBLESTONE]: { name: "Cobblestone", color: 0x6f6f6f },
  [ItemType.SAND]: { name: "Sand", color: 0xf0e68c },
  [ItemType.GLASS]: { name: "Glass", color: 0xb3d9ff },
  [ItemType.OAK_LOG]: { name: "Oak Log", color: 0x6b4423 },
  [ItemType.OAK_PLANKS]: { name: "Oak Planks", color: 0xa0522d },
  [ItemType.STICK]: { name: "Stick", color: 0x8d6b42 },
  [ItemType.COAL]: { name: "Coal", color: 0x232323 },
  [ItemType.RAW_IRON]: { name: "Raw Iron", color: 0xbf7f4f },
  [ItemType.RAW_GOLD]: { name: "Raw Gold", color: 0xd8af3d },
  [ItemType.DIAMOND]: { name: "Diamond", color: 0x48dbe4 },
  [ItemType.APPLE]: { name: "Apple", color: 0xc43d2d },
  [ItemType.BEEF]: { name: "Beef", color: 0x8e2f2f },
  [ItemType.SLIME_BALL]: { name: "Slime Ball", color: 0x7dd66f },
  [ItemType.LEATHER]: { name: "Leather", color: 0x7e4b2a },
  [ItemType.WOOL]: { name: "Wool", color: 0xe8e8e8 },
  [ItemType.TORCH]: { name: "Torch", color: 0xffb347 },
  [ItemType.WOODEN_PICKAXE]: { name: "Wooden Pickaxe", color: 0x9b7a49 },
  [ItemType.STONE_PICKAXE]: { name: "Stone Pickaxe", color: 0x8c8c8c },
  [ItemType.IRON_PICKAXE]: { name: "Iron Pickaxe", color: 0xb0a090 },
  [ItemType.GOLD_PICKAXE]: { name: "Gold Pickaxe", color: 0xdcb438 },
  [ItemType.DIAMOND_PICKAXE]: { name: "Diamond Pickaxe", color: 0x4cc8da },
  [ItemType.WOODEN_SWORD]: { name: "Wooden Sword", color: 0x9b7a49 },
  [ItemType.STONE_SWORD]: { name: "Stone Sword", color: 0x8c8c8c },
  [ItemType.IRON_SWORD]: { name: "Iron Sword", color: 0xb0a090 },
  [ItemType.DIAMOND_SWORD]: { name: "Diamond Sword", color: 0x4cc8da }
};

export const BLOCK_DROP_ITEMS = {
  [BlockType.GRASS]: [{ item: ItemType.DIRT, count: 1 }],
  [BlockType.DIRT]: [{ item: ItemType.DIRT, count: 1 }],
  [BlockType.STONE]: [{ item: ItemType.COBBLESTONE, count: 1 }],
  [BlockType.COBBLESTONE]: [{ item: ItemType.COBBLESTONE, count: 1 }],
  [BlockType.OAK_LOG]: [{ item: ItemType.OAK_LOG, count: 1 }],
  [BlockType.OAK_LEAVES]: Math.random() > 0.8 ? [{ item: ItemType.APPLE, count: 1 }] : [],
  [BlockType.SAND]: [{ item: ItemType.SAND, count: 1 }],
  [BlockType.GRAVEL]: [{ item: ItemType.COBBLESTONE, count: 1 }],
  [BlockType.COAL_ORE]: [{ item: ItemType.COAL, count: 1 }],
  [BlockType.IRON_ORE]: [{ item: ItemType.RAW_IRON, count: 1 }],
  [BlockType.GOLD_ORE]: [{ item: ItemType.RAW_GOLD, count: 1 }],
  [BlockType.DIAMOND_ORE]: [{ item: ItemType.DIAMOND, count: 1 }],
  [BlockType.OAK_PLANKS]: [{ item: ItemType.OAK_PLANKS, count: 1 }],
  [BlockType.GLASS]: [{ item: ItemType.GLASS, count: 1 }],
  [BlockType.SNOW]: [{ item: ItemType.WOOL, count: 1 }],
  [BlockType.CLAY]: [{ item: ItemType.COBBLESTONE, count: 1 }]
};

export const MOB_DROP_ITEMS = {
  cow: [
    { item: ItemType.BEEF, count: 1 },
    { item: ItemType.LEATHER, count: 1 }
  ],
  slime: [{ item: ItemType.SLIME_BALL, count: 1 }]
};

export const ITEM_RECIPES = [
  {
    id: "logs_to_planks",
    label: "Log -> Planks x4",
    input: { [ItemType.OAK_LOG]: 1 },
    output: { [ItemType.OAK_PLANKS]: 4 }
  },
  {
    id: "planks_to_sticks",
    label: "Planks x2 -> Sticks x4",
    input: { [ItemType.OAK_PLANKS]: 2 },
    output: { [ItemType.STICK]: 4 }
  },
  {
    id: "coal_torch",
    label: "Coal + Stick -> Torches x4",
    input: { [ItemType.COAL]: 1, [ItemType.STICK]: 1 },
    output: { [ItemType.TORCH]: 4 }
  },
  {
    id: "wood_pickaxe",
    label: "Planks x3 + Sticks x2 -> Wooden Pickaxe",
    input: { [ItemType.OAK_PLANKS]: 3, [ItemType.STICK]: 2 },
    output: { [ItemType.WOODEN_PICKAXE]: 1 }
  },
  {
    id: "stone_pickaxe",
    label: "Cobble x3 + Sticks x2 -> Stone Pickaxe",
    input: { [ItemType.COBBLESTONE]: 3, [ItemType.STICK]: 2 },
    output: { [ItemType.STONE_PICKAXE]: 1 }
  },
  {
    id: "iron_pickaxe",
    label: "Raw Iron x3 + Sticks x2 -> Iron Pickaxe",
    input: { [ItemType.RAW_IRON]: 3, [ItemType.STICK]: 2 },
    output: { [ItemType.IRON_PICKAXE]: 1 }
  },
  {
    id: "diamond_pickaxe",
    label: "Diamond x3 + Sticks x2 -> Diamond Pickaxe",
    input: { [ItemType.DIAMOND]: 3, [ItemType.STICK]: 2 },
    output: { [ItemType.DIAMOND_PICKAXE]: 1 }
  },
  {
    id: "wood_sword",
    label: "Planks x2 + Stick -> Wooden Sword",
    input: { [ItemType.OAK_PLANKS]: 2, [ItemType.STICK]: 1 },
    output: { [ItemType.WOODEN_SWORD]: 1 }
  },
  {
    id: "stone_sword",
    label: "Cobble x2 + Stick -> Stone Sword",
    input: { [ItemType.COBBLESTONE]: 2, [ItemType.STICK]: 1 },
    output: { [ItemType.STONE_SWORD]: 1 }
  },
  {
    id: "iron_sword",
    label: "Raw Iron x2 + Stick -> Iron Sword",
    input: { [ItemType.RAW_IRON]: 2, [ItemType.STICK]: 1 },
    output: { [ItemType.IRON_SWORD]: 1 }
  },
  {
    id: "diamond_sword",
    label: "Diamond x2 + Stick -> Diamond Sword",
    input: { [ItemType.DIAMOND]: 2, [ItemType.STICK]: 1 },
    output: { [ItemType.DIAMOND_SWORD]: 1 }
  }
];

export function getItemName(itemId) {
  return ITEM_INFO[itemId]?.name ?? itemId;
}

export function getItemColor(itemId) {
  return ITEM_INFO[itemId]?.color ?? 0xffffff;
}

export function getDropsForBlock(blockType) {
  const drops = BLOCK_DROP_ITEMS[blockType] || [];
  return drops.map((entry) => ({ ...entry }));
}

export function getDropsForMob(mobType) {
  const drops = MOB_DROP_ITEMS[mobType] || [];
  return drops.map((entry) => ({ ...entry }));
}
