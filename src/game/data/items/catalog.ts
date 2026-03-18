import type { ItemDefinition } from "../../types/item";

export const ITEM_CATALOG: ItemDefinition[] = [
  {
    id: "sandwich",
    name: "Sandwich",
    category: "food",
    price: 8,
    description: "Fresh sandwich made for a quick campus meal.",
    stackable: true,
    energyEffect: 8,
  },
  {
    id: "coffee",
    name: "Coffee",
    category: "drink",
    price: 5,
    description: "Hot coffee to help you stay alert.",
    stackable: true,
    focusEffect: 6,
  },
  {
    id: "energy-drink",
    name: "Energy Drink",
    category: "drink",
    price: 7,
    description: "Caffeinated boost for intense study sessions.",
    stackable: true,
    focusEffect: 8,
    stressEffect: 2,
  },
  {
    id: "snack-pack",
    name: "Snack Pack",
    category: "food",
    price: 6,
    description: "Portable snacks for between-class breaks.",
    stackable: true,
    energyEffect: 4,
  },
  {
    id: "notebook",
    name: "Notebook",
    category: "school-supplies",
    price: 12,
    description: "Reliable notebook for notes and planning.",
    stackable: true,
  },
  {
    id: "pens",
    name: "Pens",
    category: "school-supplies",
    price: 4,
    description: "Pack of everyday writing pens.",
    stackable: true,
  },
  {
    id: "planner",
    name: "Planner",
    category: "school-supplies",
    price: 18,
    description: "Weekly planner for classes and deadlines.",
    stackable: false,
    disciplineEffect: 3,
  },
  {
    id: "usb-drive",
    name: "USB Drive",
    category: "tech",
    price: 16,
    description: "Portable storage for class and project files.",
    stackable: true,
  },
  {
    id: "charger",
    name: "Charger",
    category: "tech",
    price: 22,
    description: "Universal charger for laptops and devices.",
    stackable: false,
  },
  {
    id: "campus-hoodie",
    name: "Campus Hoodie",
    category: "misc",
    price: 45,
    description: "Official campus hoodie for cooler nights.",
    stackable: false,
    confidenceEffect: 2,
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
