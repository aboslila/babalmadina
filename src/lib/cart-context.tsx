"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";

export type CartItem = {
  productId: number;
  artNo: string;
  cartonPrice: number;
  quantity: number;
};

type CartState = { items: CartItem[] };

type CartAction =
  | { type: "ADD_ITEM"; item: CartItem }
  | { type: "REMOVE_ITEM"; productId: number }
  | { type: "DECREASE_ITEM"; productId: number }
  | { type: "CLEAR_CART" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        (i) => i.productId === action.item.productId
      );

      if (existing) {
        const updateItems = state.items.map((i) =>
          i.productId === action.item.productId
            ? { ...i, quantity: i.quantity + action.item.quantity }
            : i
        );
        return { ...state, items: updateItems };
      }

      return { ...state, items: [...state.items, action.item] };
    }

    case "REMOVE_ITEM": {
      const updateItems = state.items.filter(
        (i) => i.productId !== action.productId
      );
      return { ...state, items: updateItems };
    }

    case "DECREASE_ITEM": {
      const existing = state.items.find(
        (i) => i.productId === action.productId
      );
      if (!existing) return state;

      if (existing.quantity > 1) {
        const updateItems = state.items.map((i) =>
          i.productId === action.productId
            ? { ...i, quantity: i.quantity - 1 }
            : i
        );
        return { ...state, items: updateItems };
      }

      const updateItems = state.items.filter(
        (i) => i.productId !== action.productId
      );
      return { ...state, items: updateItems };
    }
    case "CLEAR_CART":
      return { ...state, items: [] };

    default:
      return state;
  }
}

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}