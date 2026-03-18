export type ItemCategory = "food" | "drink" | "school-supplies" | "tech" | "misc";

export interface ItemDefinition {
  id: string;
  name: string;
  category: ItemCategory;
  price: number;
  description: string;
  stackable: boolean;
  energyEffect?: number;
  stressEffect?: number;
  focusEffect?: number;
  confidenceEffect?: number;
  charismaEffect?: number;
  curiosityEffect?: number;
  disciplineEffect?: number;
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
