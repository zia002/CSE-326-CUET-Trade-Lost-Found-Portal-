import { createSlice } from "@reduxjs/toolkit";
import { getBaseURL } from "../../../utils/baseURL"; // ✅ Adjust path if needed

// Utility functions
const setSelectedItems = (state) =>
  state.products.reduce((total, product) => total + product.quantity, 0);

const setProductsTotal = (state) =>
  state.products.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

// Initial state
const initialState = {
  products: [],
  selectedItems: 0,
  totalPrice: 0,
};

// Slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existing = state.products.find(
        (product) => product.id === action.payload.id
      );

      if (!existing) {
        state.products.push({
          ...action.payload,
          quantity: action.payload.quantity || 1, // ✅ use backend quantity
        });
      } else {
        console.log("Product already exists in the cart");
      }

      state.selectedItems = setSelectedItems(state);
      state.totalPrice = setProductsTotal(state);
    },

    updateQuantity: (state, action) => {
      state.products.forEach((product) => {
        if (product.id === action.payload.id) {
          if (action.payload.type === "increment") {
            product.quantity += 1;
          } else if (
            action.payload.type === "decrement" &&
            product.quantity > 1
          ) {
            product.quantity -= 1;
          }

          // After changing product.quantity:
          fetch(`${getBaseURL()}/api/cart/update`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              productId: product.id,
              quantity: product.quantity,
            }),
          }).catch((err) => console.error("Failed to sync quantity:", err));
        }
      });

      state.selectedItems = setSelectedItems(state);
      state.totalPrice = setProductsTotal(state);
    },

    removeFromCart: (state, action) => {
      const id = action.payload;
      state.products = state.products.filter((product) => product.id !== id);

      // 🔁 Sync with backend
      fetch(`${getBaseURL()}/api/cart/remove/${id}`, {
        method: "DELETE",
        credentials: "include",
      }).catch((err) =>
        console.error("Failed to remove item from backend:", err)
      );

      state.selectedItems = setSelectedItems(state);
      state.totalPrice = setProductsTotal(state);
    },

    clearCart: (state) => {
      state.products = [];
      state.selectedItems = 0;
      state.totalPrice = 0;

      fetch(`${getBaseURL()}/api/cart/clear`, {
        method: "DELETE",
        credentials: "include",
      }).catch((err) => console.error("Failed to clear cart in backend:", err));
    },

  },
});

// Export actions and reducer
export const {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
