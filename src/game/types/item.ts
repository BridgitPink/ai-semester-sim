export type ItemCategory = "food" | "drink" | "school-supplies" | "tech" | "misc";

export interface ItemEffects {
  energy?: number;
  stress?: number;
  focus?: number;
  confidence?: number;
  charisma?: number;
  curiosity?: number;
  discipline?: number;
}

export interface ItemDefinition {
  id: string;
  name: string;
  category: ItemCategory;
  price: number;
  description: string;
  stackable: boolean;
  isUsable?: boolean;
  effects?: ItemEffects;
}

export interface InventoryItem {
  itemId: string;
  itemName: string;
  category: ItemCategory;
  quantity: number;
  unitPrice: number;
  metadata?: Record<string, unknown>;
}

export interface BasketItem {
  itemId: string;
  quantity: number;
}

export interface EconomyActionResult {
  success: boolean;
  message: string;
}
