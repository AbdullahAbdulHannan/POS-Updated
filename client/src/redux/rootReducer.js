const intialState = {
  loading: false,
  cartItems: [],
};

// Helper function to create unique item keys
const getItemKey = (item) => {
  const inputs = item.inputs || {};
  if (item.priceType === "sqft") {
    return `${item._id}_${inputs.width || 0}_${inputs.height || 0}`;
  }
  if (item.priceType === "lf") {
    return `${item._id}_${inputs.length || 0}`;
  }
  return item._id;
};

export const rootReducer = (state = intialState, action) => {
  switch (action.type) {
    case "SHOW_LOADING":
      return {
        ...state,
        loading: true,
      };
    case "HIDE_LOADING":
      return {
        ...state,
        loading: false,
      };
    case "ADD_TO_CART":
      return {
        ...state,
        cartItems: [...state.cartItems, action.payload],
      };
    case "UPDATE_CART":
      return {
        ...state,
        cartItems: state.cartItems.map((item) => {
          const itemKey = getItemKey(item);
          const payloadKey = getItemKey(action.payload);
          return itemKey === payloadKey
            ? { ...item, quantity: action.payload.quantity }
            : item;
        }),
      };
    case "DELETE_FROM_CART":
      return {
        ...state,
        cartItems: state.cartItems.filter((item) => {
          const itemKey = getItemKey(item);
          const payloadKey = getItemKey(action.payload);
          return itemKey !== payloadKey;
        }),
      };
    case "EMPTY_CART":
      return {
        ...state,
        cartItems: [],
      };
    default:
      return state;
  }
};
