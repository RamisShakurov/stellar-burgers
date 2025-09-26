import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { fetchIngredients } from './store';
import isEqual from 'react-fast-compare';

interface IngredientsState {
  items: TIngredient[];
  loading: boolean;
  error: string | null;
}

const initialState: IngredientsState = {
  items: [],
  loading: false,
  error: null
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.loading = false;
          if (!isEqual(state.items, action.payload)) {
            state.items = action.payload;
          } // payload – массив ингредиентов
        }
      )
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Ошибка загрузки';
      });
  }
});

export const burgerData = ingredientsSlice.reducer;
