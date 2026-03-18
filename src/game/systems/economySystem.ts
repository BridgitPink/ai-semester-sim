import { getItemDefinition } from "../data/items/catalog";
import type {
  BasketItem,
  EconomyActionResult,
  InventoryItem,
  ItemDefinition,
} from "../types/item";

export const STARTING_WALLET = 250;
export const WEEKLY_PAY_AMOUNT = 100;

export function canAffordAmount(wallet: number, amount: number): boolean {
  return wallet >= amount;
}

export function shouldGrantWeeklyPay(
  newDay: number,
  newWeek: number,
  lastPaidWeek: number | null
): boolean {
  if (newDay !== 1) return false;
  if (newWeek < 1) return false;
  if (lastPaidWeek === null) return true;
  return newWeek > lastPaidWeek;
}

function createInventoryItem(item: ItemDefinition, quantity: number): InventoryItem {
  return {
    itemId: item.id,
    itemName: item.name,
    category: item.category,
    quantity,
    unitPrice: item.price,
  };
}

export function addToInventory(
  inventory: InventoryItem[],
  itemId: string,
  quantity = 1
): InventoryItem[] {
  const item = getItemDefinition(itemId);
  if (!item || quantity <= 0) return inventory;

  const existingIndex = inventory.findIndex((entry) => entry.itemId === itemId);
  if (existingIndex === -1) {
    return [...inventory, createInventoryItem(item, quantity)];
  }

  const existing = inventory[existingIndex];
  if (!item.stackable) {
    return [
      ...inventory,
      createInventoryItem(item, quantity),
    ];
  }

  const nextInventory = [...inventory];
  nextInventory[existingIndex] = {
    ...existing,
    quantity: existing.quantity + quantity,
  };
  return nextInventory;
}

export function removeFromInventory(
  inventory: InventoryItem[],
  itemId: string,
  quantity = 1
): InventoryItem[] {
  if (quantity <= 0) return inventory;

  return inventory
    .map((entry) => {
      if (entry.itemId !== itemId) return entry;
      return { ...entry, quantity: entry.quantity - quantity };
    })
    .filter((entry) => entry.quantity > 0);
}

export function addToBasket(basket: BasketItem[], itemId: string, quantity = 1): BasketItem[] {
  const item = getItemDefinition(itemId);
  if (!item || quantity <= 0) return basket;

  const existingIndex = basket.findIndex((entry) => entry.itemId === itemId);
  if (existingIndex === -1) {
    return [...basket, { itemId, quantity }];
  }

  const nextBasket = [...basket];
  nextBasket[existingIndex] = {
    ...nextBasket[existingIndex],
    quantity: nextBasket[existingIndex].quantity + quantity,
  };
  return nextBasket;
}

export function removeFromBasket(
  basket: BasketItem[],
  itemId: string,
  quantity = 1
): BasketItem[] {
  if (quantity <= 0) return basket;

  return basket
    .map((entry) => {
      if (entry.itemId !== itemId) return entry;
      return { ...entry, quantity: entry.quantity - quantity };
    })
    .filter((entry) => entry.quantity > 0);
}

export function calculateBasketTotal(basket: BasketItem[]): number {
  return basket.reduce((total, entry) => {
    const item = getItemDefinition(entry.itemId);
    if (!item) return total;
    return total + item.price * entry.quantity;
  }, 0);
}

export function purchaseDirect(
  wallet: number,
  inventory: InventoryItem[],
  itemId: string,
  quantity = 1
): { wallet: number; inventory: InventoryItem[]; result: EconomyActionResult } {
  const item = getItemDefinition(itemId);
  if (!item) {
    return {
      wallet,
      inventory,
      result: { success: false, message: "Item not found." },
    };
  }

  if (quantity <= 0) {
    return {
      wallet,
      inventory,
      result: { success: false, message: "Quantity must be at least 1." },
    };
  }

  const total = item.price * quantity;
  if (!canAffordAmount(wallet, total)) {
    return {
      wallet,
      inventory,
      result: { success: false, message: "Not enough money for this purchase." },
    };
  }

  return {
    wallet: wallet - total,
    inventory: addToInventory(inventory, itemId, quantity),
    result: { success: true, message: `Purchased ${item.name}.` },
  };
}

export function purchaseBasketItems(
  wallet: number,
  inventory: InventoryItem[],
  basket: BasketItem[]
): {
  wallet: number;
  inventory: InventoryItem[];
  basket: BasketItem[];
  result: EconomyActionResult;
} {
  if (basket.length === 0) {
    return {
      wallet,
      inventory,
      basket,
      result: { success: false, message: "Basket is empty." },
    };
  }

  const total = calculateBasketTotal(basket);
  if (!canAffordAmount(wallet, total)) {
    return {
      wallet,
      inventory,
      basket,
      result: { success: false, message: "Not enough money to checkout." },
    };
  }

  let nextInventory = inventory;
  for (const entry of basket) {
    nextInventory = addToInventory(nextInventory, entry.itemId, entry.quantity);
  }

  return {
    wallet: wallet - total,
    inventory: nextInventory,
    basket: [],
    result: { success: true, message: "Checkout complete." },
  };
}
