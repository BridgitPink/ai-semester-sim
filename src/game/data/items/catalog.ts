import type { ItemDefinition, ItemEffects } from "../../types/item";

const ITEM_EFFECT_KEYS: Array<keyof ItemEffects> = [
  "energy",
  "stress",
  "focus",
  "confidence",
  "charisma",
  "curiosity",
  "discipline",
];

export const ITEM_CATALOG: ItemDefinition[] = [
  {
    id: "sandwich",
    name: "Sandwich",
    category: "food",
    price: 8,
    description: "Fresh sandwich made for a quick campus meal.",
    stackable: true,
    isUsable: true,
    effects: {
      energy: 12,
      stress: -3,
    },
  },
  {
    id: "coffee",
    name: "Coffee",
    category: "drink",
    price: 5,
    description: "Hot coffee to help you stay alert.",
    stackable: true,
    isUsable: true,
    effects: {
      energy: 10,
      focus: 5,
      stress: 2,
    },
  },
  {
    id: "energy-drink",
    name: "Energy Drink",
    category: "drink",
    price: 7,
    description: "Caffeinated boost for intense study sessions.",
    stackable: true,
    isUsable: true,
    effects: {
      energy: 15,
      focus: 8,
      stress: 5,
    },
  },
  {
    id: "snack-pack",
    name: "Snack Pack",
    category: "food",
    price: 6,
    description: "Portable snacks for between-class breaks.",
    stackable: true,
    isUsable: true,
    effects: {
      energy: 6,
      stress: -2,
    },
  },
  {
    id: "notebook",
    name: "Notebook",
    category: "school-supplies",
    price: 12,
    description: "Reliable notebook for notes and planning.",
    stackable: true,
    isUsable: false,
  },
  {
    id: "pens",
    name: "Pens",
    category: "school-supplies",
    price: 4,
    description: "Pack of everyday writing pens.",
    stackable: true,
    isUsable: false,
  },
  {
    id: "planner",
    name: "Planner",
    category: "school-supplies",
    price: 18,
    description: "Weekly planner for classes and deadlines.",
    stackable: false,
    isUsable: false,
  },
  {
    id: "usb-drive",
    name: "USB Drive",
    category: "tech",
    price: 16,
    description: "Portable storage for class and project files.",
    stackable: true,
    isUsable: false,
  },
  {
    id: "charger",
    name: "Charger",
    category: "tech",
    price: 22,
    description: "Universal charger for laptops and devices.",
    stackable: false,
    isUsable: false,
  },
  {
    id: "campus-hoodie",
    name: "Campus Hoodie",
    category: "misc",
    price: 45,
    description: "Official campus hoodie for cooler nights.",
    stackable: false,
    isUsable: false,
  },
];

export const ITEM_CATALOG_BY_ID: Record<string, ItemDefinition> = ITEM_CATALOG.reduce(
  (acc, item) => {
    acc[item.id] = item;
    return acc;
  },
  {} as Record<string, ItemDefinition>
);

export function getItemDefinition(itemId: string): ItemDefinition | undefined {
  return ITEM_CATALOG_BY_ID[itemId];
}

export function getItemEffects(item: ItemDefinition): ItemEffects {
  return item.effects ?? {};
}

export function hasItemEffects(item: ItemDefinition): boolean {
  const effects = getItemEffects(item);
  return ITEM_EFFECT_KEYS.some((key) => {
    const value = effects[key];
    return typeof value === "number" && value !== 0;
  });
}

export function isItemUsable(item: ItemDefinition): boolean {
  return item.isUsable === true && hasItemEffects(item);
}
