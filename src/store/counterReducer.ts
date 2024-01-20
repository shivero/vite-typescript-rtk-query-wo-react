import { createAction, createAsyncThunk, createReducer, nanoid } from "@reduxjs/toolkit";
type initialState = {
  UserFavorites: Array<List>;
  isLoading: boolean;
};

type List = {
  name: string;
  items: Array<Item>;
  id: string;
};

type Item = {
  name: string;
  description: string;
  price: number;
  image: string;
};

const initialState: initialState = {
  UserFavorites: [],
  isLoading: true,
};

type DummyProduct = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
};

export async function GetItemData() {
  var range = Math.floor(Math.random() * 100) + 1;
  let items: Product = await fetch(`https://dummyjson.com/products/${range}`)
    .then((resolve) => resolve.json())
    .then((data) => data);
  return items;
}

// First, create the thunk
const fetchLists = createAsyncThunk("users/fetchByIdStatus", async (_, { rejectWithValue }) => {
  try {
    const response: DummyProduct = await fetch(`https://dummyjson.com/products?limit=10`)
      .then((res) => res.json())
      .then((data) => data);

    const lists: List[] = response.products.map((product) => {
      return {
        name: product.title,
        items: [
          {
            name: product.title,
            description: product.description,
            price: product.price,
            image: product.thumbnail,
          },
        ],
        id: nanoid(),
      };
    });
    return lists;
  } catch (error: any) {
    rejectWithValue(error.response.data);
    return new Array<List>();
  }
});

export const actions = {
  fetchLists,
  addNewList: createAction("addNewList", (list: List) => {
    return {
      payload: {
        name: list.name,
        items: list.items,
        id: nanoid(),
      },
    };
  }),
  removeList: createAction<string>("removeList"),
  addNewItem: createAction<Item>("addNewItem"),
  removeItem: createAction<Item>("removeItem"),
};

const favListReducer = createReducer(initialState, (builder) => {
  builder.addCase(fetchLists.pending, (state, _action) => {
    state.isLoading = true;
  });
  builder.addCase(fetchLists.fulfilled, (state, action) => {
    state.UserFavorites.push(...action.payload);
    state.isLoading = false;
  });
  builder.addCase(actions.addNewList, (state, action) => {
    state.UserFavorites.push(action.payload);
  });
  builder.addCase(actions.removeList, (state, action) => {
    state.UserFavorites = state.UserFavorites.filter((list) => list.id !== action.payload);
  });
  builder.addMatcher(fetchLists.settled, (_state, _action) => {
    _state.isLoading = false;
  });
  builder.addDefaultCase((_state, _action) => {
    console.log(_state, _action);
    console.log("default case");
  });
});

export { favListReducer };
