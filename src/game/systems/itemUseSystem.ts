import {
  getItemDefinition,
  getItemEffects,
  hasItemEffects,
  isItemUsable,
} from "../data/items/catalog";
import type {
  EconomyActionResult,
  InventoryItem,
  ItemDefinition,
  ItemEffects,
} from "../types/item";
import type { PlayerStatDelta } from "../types/player";

const EFFECT_KEYS: Array<keyof ItemEffects> = [
  "energy",
  "stress",
  "focus",
  "confidence",
  "charisma",
  "curiosity",
  "discipline",
];

function getInventoryQuantity(inventory: InventoryItem[], itemId: string): number {
  return inventory
    .filter((entry) => entry.itemId === itemId)
    .reduce((total, entry) => total + entry.quantity, 0);
}

function getInventoryItemName(inventory: InventoryItem[], itemId: string): string {
  const catalogItem = getItemDefinition(itemId);
  if (catalogItem) return catalogItem.name;

  const inventoryItem = inventory.find((entry) => entry.itemId === itemId);
  return inventoryItem?.itemName ?? "Item";
}

export function applyItemEffects(effects: ItemEffects): PlayerStatDelta {
  const delta: PlayerStatDelta = {};

  for (const key of EFFECT_KEYS) {
    const value = effects[key];
    if (typeof value === "number" && value !== 0) {
      delta[key] = value;
    }
  }

  return delta;
}

export function hasStatDelta(delta: PlayerStatDelta): boolean {
  return EFFECT_KEYS.some((key) => {
    const value = delta[key];
    return typeof value === "number" && value !== 0;
  });
}

export function canUseInventoryItemById(
  inventory: InventoryItem[],
  itemId: string
): { canUse: boolean; item?: ItemDefinition; reason?: string } {
  const quantity = getInventoryQuantity(inventory, itemId);
  if (quantity <= 0) {
    return { canUse: false, reason: "Item is not in inventory." };
  }

  const item = getItemDefinition(itemId);
  if (!item) {
    return { canUse: false, reason: "Item not found." };
  }

  if (!isItemUsable(item)) {
    return { canUse: false, item, reason: `${item.name} cannot be used right now.` };
  }

  if (!hasItemEffects(item)) {
    return { canUse: false, item, reason: `${item.name} has no effect to apply.` };
  }

  return { canUse: true, item };
}

export function getUsableInventoryEntries(inventory: InventoryItem[]): InventoryItem[] {
  return inventory.filter((entry) => canUseInventoryItemById(inventory, entry.itemId).canUse);
}

export function consumeInventoryItemUnit(
  inventory: InventoryItem[],
  itemId: string
): { inventory: InventoryItem[]; result: EconomyActionResult } {
  const remainingToRemove = 1;
  let removed = 0;

  const nextInventory = inventory
    .map((entry) => {
      if (entry.itemId !== itemId || removed >= remainingToRemove) {
        return entry;
      }

      const available = entry.quantity;
      const removeCount = Math.min(remainingToRemove - removed, available);
      removed += removeCount;
      return {
        ...entry,
        quantity: entry.quantity - removeCount,
      };
    })
    .filter((entry) => entry.quantity > 0);

  if (removed < remainingToRemove) {
    return {
      inventory,
      result: { success: false, message: "Item is not in inventory." },
    };
  }

  return {
    inventory: nextInventory,
    result: { success: true, message: `Used ${getInventoryItemName(inventory, itemId)}.` },
  };
}

export function getItemUsePreview(itemId: string): string | null {
  const item = getItemDefinition(itemId);
  if (!item || !isItemUsable(item)) return null;

  const effects = getItemEffects(item);
  const parts = EFFECT_KEYS.flatMap((key) => {
    const value = effects[key];
    if (typeof value !== "number" || value === 0) return [];

    const sign = value > 0 ? "+" : "";
    const label = key.charAt(0).toUpperCase() + key.slice(1);
    return `${sign}${value} ${label}`;
  });

  return parts.length > 0 ? parts.join("  ") : null;
}
