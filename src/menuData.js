// ============================================================
// Tri Arrow Cafe — Menu & Business Data
// This file is safe to be public (no secrets). Real promo
// validation against fraud/abuse still happens server-side
// in /api/validate-promo.js — never trust client-side checks
// for anything that affects money.
// ============================================================

export const MENU = {
  "Classic Crust Pizza": {
    sub: "R ₹140 / M ₹270 / L ₹400",
    type: "pizza",
    items: [
      { id: "ccp-1", name: "Spicy Paneer", desc: "Paneer, capsicum, red paprika", price: 140, tags: ["bestseller"] },
      { id: "ccp-2", name: "Spicy Hunt", desc: "Corn, jalapeno, red paprika", price: 140 },
      { id: "ccp-3", name: "Veggie Pizza", desc: "Corn, onion, capsicum, tomato", price: 140 },
      { id: "ccp-4", name: "Farm Fresh Pizza", desc: "Corn, onion, capsicum, mushroom", price: 140 },
      { id: "ccp-5", name: "Margherita", desc: "Loaded with cheese burst", price: 140, tags: ["bestseller"] },
    ],
  },
  "Signature Slices": {
    sub: "R ₹180 / M ₹350 / L ₹520",
    type: "pizza",
    items: [
      { id: "ss-1", name: "Paneer Tikka", desc: "Crisp capsicum & onion, loaded with cheese", price: 180 },
      { id: "ss-2", name: "Veggie Delight", desc: "Corn, capsicum, black olives, red paprika", price: 180 },
      { id: "ss-3", name: "Farm Delight", desc: "Garden pizza with paneer, corn & farm veggies", price: 180, tags: ["bestseller"] },
      { id: "ss-4", name: "Tandoori Paneer", desc: "Smokey tandoori-marinated paneer, fiery red paprika", price: 180 },
    ],
  },
  "Premium Pies": {
    sub: "R ₹240 / M ₹380 / L ₹550",
    type: "pizza",
    items: [
      { id: "pp-1", name: "Makhani Paneer", desc: "Marinated paneer in creamy makhani sauce", price: 240, tags: ["bestseller"] },
      { id: "pp-2", name: "Deluxe Veggie", desc: "Corn, paneer, capsicum, red paprika, black olives", price: 240 },
      { id: "pp-3", name: "Italian Cheese", desc: "Corn, capsicum, bell pepper, onion, mushroom", price: 240 },
      { id: "pp-4", name: "Mexican Delight", desc: "Paneer, bell pepper, jalapeno, black olives", price: 240 },
      { id: "pp-5", name: "Tac' Special", desc: "Paneer, corn, onion, mushroom, jalapeno & more", price: 240 },
    ],
  },
  "Build Your Own Pizza": {
    sub: "Single topping ₹79 · Double topping ₹109",
    type: "pizza",
    items: [
      { id: "byo-1", name: "Single Topping Pizza", desc: "Choose: onion, corn, capsicum or tomato", price: 79 },
      { id: "byo-2", name: "Double Topping Pizza", desc: "Onion+capsicum, paneer+corn, onion+paneer, tomato+corn", price: 109 },
    ],
  },
  "Burgers": {
    type: "burger",
    items: [
      { id: "b-1", name: "Aloo Tikki Burger", price: 50 },
      { id: "b-2", name: "Veggie Burger", price: 60 },
      { id: "b-3", name: "Veg Cheesy Burger", price: 70 },
      { id: "b-4", name: "Peri-Peri Burger", price: 80 },
      { id: "b-5", name: "Paneer Korma Burger", price: 90 },
      { id: "b-6", name: "Tandoori Paneer Burger", price: 90 },
      { id: "b-7", name: "Tac' Special Burger", price: 110, tags: ["bestseller"] },
    ],
  },
  "Pasta": {
    type: "pasta",
    items: [
      { id: "p-1", name: "White Sauce Pasta", price: 129 },
      { id: "p-2", name: "Red Sauce Pasta", price: 129 },
      { id: "p-3", name: "Spicy Peri-Peri Pasta", price: 129 },
      { id: "p-4", name: "Mix Sauce Pasta", price: 129 },
      { id: "p-5", name: "Tandoori Pasta", price: 129 },
    ],
  },
  "Fries": {
    type: "side",
    items: [
      { id: "f-1", name: "Classic Fries", price: 50 },
      { id: "f-2", name: "Peri-Peri Fries", price: 60 },
      { id: "f-3", name: "Mexican Fries", price: 80 },
      { id: "f-4", name: "Spicy Fries", price: 90 },
      { id: "f-5", name: "Spl. Cheesy Fries", price: 100 },
      { id: "f-6", name: "Cheesy Loaded Fries", price: 129, tags: ["bestseller"] },
    ],
  },
  "Sandwiches": {
    type: "sandwich",
    items: [
      { id: "sw-1", name: "Veg Grill", price: 60 },
      { id: "sw-2", name: "Cheesy Corn", price: 70 },
      { id: "sw-3", name: "Cheese Grill", price: 90 },
      { id: "sw-4", name: "Paneer Cheese Grill", price: 100 },
      { id: "sw-5", name: "Paneer Peri-Peri", price: 109 },
    ],
  },
  "Garlic Bread": {
    type: "side",
    items: [
      { id: "gb-1", name: "Cheesy Corn Garlic Bread", price: 89 },
      { id: "gb-2", name: "Spicy Garlic Bread", price: 100 },
      { id: "gb-3", name: "Paneer Tikka Garlic Bread", price: 110 },
      { id: "gb-4", name: "Tac' Special Garlic Bread", price: 129 },
    ],
  },
  "Sides": {
    type: "side",
    items: [
      { id: "sd-1", name: "Zingy Parcel", price: 40 },
      { id: "sd-2", name: "Cheese Delight Wrap", price: 50 },
      { id: "sd-3", name: "Cheesy Zingy Parcel", price: 60 },
      { id: "sd-4", name: "Aloo Tikki Wrap", price: 70 },
      { id: "sd-5", name: "Veggie Maggi", price: 70 },
      { id: "sd-6", name: "Tandoori Paneer Wrap", price: 80 },
      { id: "sd-7", name: "Cheese Maggi", price: 100 },
      { id: "sd-8", name: "Tandoori Maggi", price: 120 },
    ],
  },
  "Coffee": {
    sub: "R / L",
    type: "drink",
    items: [
      { id: "c-1", name: "Classic Coffee", price: 60, priceL: 90 },
      { id: "c-2", name: "Chocochip Coffee", price: 75, priceL: 120 },
      { id: "c-3", name: "Hazelnut Coffee", price: 80, priceL: 140 },
      { id: "c-4", name: "Spl. Caramel Coffee", price: 85, priceL: 150 },
      { id: "c-5", name: "Spl. Dark Chocochip", price: 95, priceL: 160 },
      { id: "c-6", name: "Tac' Special Coffee", price: 110, priceL: 180 },
    ],
  },
  "Shakes": {
    sub: "all ₹109",
    type: "drink",
    items: [
      { id: "sh-1", name: "Chocolate Shake", price: 109 },
      { id: "sh-2", name: "KitKat Shake", price: 109, tags: ["bestseller"] },
      { id: "sh-3", name: "Oreo Shake", price: 109 },
      { id: "sh-4", name: "Chocolate Chocochip Shake", price: 109 },
    ],
  },
  "The Tac' Meals": {
    sub: "combo deals",
    type: "combo",
    items: [
      { id: "m-1", name: "The Solo Snack", desc: "Aloo Tikki burger + classic fries + coke", price: 109 },
      { id: "m-2", name: "The Light Lunch", desc: "Aloo Tikki Wrap + cheesy garlic bread + classic coffee (R)", price: 189 },
      { id: "m-3", name: "The Pizza For One", desc: "Any single topping pizza (R) + classic fries + classic coffee (L)", price: 199 },
      { id: "m-4", name: "The Sandwich Treat", desc: "Paneer Peri-Peri sandwich + Peri-Peri fries + classic coffee (R)", price: 219 },
      { id: "m-5", name: "Tac's Signature Meal", desc: "Tac' special burger + Peri-Peri fries + any thick shake", price: 269, tags: ["bestseller"] },
      { id: "m-6", name: "Buddy' Combo", desc: "Any Premium Pie (R) + White Sauce pasta + 2 Coke", price: 359 },
      { id: "m-7", name: "Single Topping Combo", desc: "5 Single Topping Pizzas", price: 379 },
      { id: "m-8", name: "Double Topping Combo", desc: "5 Double Topping Pizzas", price: 539 },
      { id: "m-9", name: "Family' Treat", desc: "1 Signature Slice (L) + 1 Premium Pie (M) + 1 Peri-Peri fries + 1 cheesy Garlic Bread + 2L coke", price: 999 },
    ],
  },
};

export const CATEGORY_ORDER = Object.keys(MENU);

// Flat lookup used by the meal-builder and suggestions engine
export const ALL_ITEMS = CATEGORY_ORDER.flatMap((cat) =>
  MENU[cat].items.map((item) => ({ ...item, category: cat, type: MENU[cat].type }))
);

export function findItem(id) {
  return ALL_ITEMS.find((i) => i.id === id);
}

// ------------------------------------------------------------
// "Make it a meal" — when a customer adds a standalone item
// (burger, sandwich, pizza) that isn't already part of a combo,
// suggest pairing it with fries/a drink at a small bundled
// discount. This mirrors Zomato/Swiggy's combo upsell pattern.
// ------------------------------------------------------------
export const MEAL_UPSELL = {
  burger: {
    sideCategory: "Fries",
    drinkCategory: "Shakes",
    discount: 20, // ₹ off when both added together
    label: "Make it a meal",
  },
  sandwich: {
    sideCategory: "Fries",
    drinkCategory: "Coffee",
    discount: 15,
    label: "Make it a meal",
  },
  pizza: {
    sideCategory: "Garlic Bread",
    drinkCategory: "Coffee",
    discount: 25,
    label: "Add garlic bread & a drink",
  },
};

// ------------------------------------------------------------
// Smart suggestions shown at checkout — picks from a curated
// "frequently paired" list, weighted toward bestsellers and
// items not already in the cart. Real personalization (based
// on order history) would need backend order-history data;
// this is the honest client-side version.
// ------------------------------------------------------------
export function getSuggestions(cartItemIds, count = 4) {
  const inCart = new Set(cartItemIds);
  const pool = ALL_ITEMS.filter(
    (item) => !inCart.has(item.id) && (item.tags?.includes("bestseller") || item.type === "drink" || item.type === "side")
  );
  // Bestsellers first, then sides/drinks, lightly shuffled for variety
  const sorted = [...pool].sort((a, b) => {
    const aScore = (a.tags?.includes("bestseller") ? 2 : 0) + Math.random();
    const bScore = (b.tags?.includes("bestseller") ? 2 : 0) + Math.random();
    return bScore - aScore;
  });
  return sorted.slice(0, count);
}

// ------------------------------------------------------------
// PROMO CODES — client-side copy is for DISPLAY ONLY (so the
// UI can show "10% off applied" instantly). The real discount
// is always recalculated and verified server-side in
// /api/validate-promo.js before an order is accepted. Never
// trust a discount number that only existed in the browser.
// ------------------------------------------------------------
export const PROMO_DISPLAY = {
  WELCOME50: { label: "₹50 off your first order", minOrder: 200 },
  TAC10: { label: "10% off (up to ₹100)", minOrder: 300 },
  FREESHIP: { label: "Free delivery, any order value", minOrder: 0 },
};
