import { getItemDefinition } from "./catalog";
import type { ItemDefinition } from "../../types/item";

const COUNTER_MENUS: Record<string, string[]> = {
  "campus-food-main": ["sandwich", "coffee", "energy-drink", "snack-pack"],
  "cafe-main": ["coffee", "sandwich", "snack-pack", "energy-drink"],
};

const STORE_SHELF_ITEMS: Record<string, string[]> = {
  "campus-store-shelf-notes": ["notebook", "pens", "planner"],
  "campus-store-shelf-tech": ["usb-drive", "charger"],
  "campus-store-shelf-merch": ["campus-hoodie", "snack-pack"],
};

function mapIdsToItems(itemIds: string[]): ItemDefinition[] {
  return itemIds
    .map((itemId) => getItemDefinition(itemId))
    .filter((item): item is ItemDefinition => item !== undefined);
}

export function getCounterMenuItems(menuId: string): ItemDefinition[] {
  const itemIds = COUNTER_MENUS[menuId] ?? [];
  return mapIdsToItems(itemIds);
}

export function getStoreShelfItems(shelfId: string): ItemDefinition[] {
  const itemIds = STORE_SHELF_ITEMS[shelfId] ?? [];
  return mapIdsToItems(itemIds);
}
