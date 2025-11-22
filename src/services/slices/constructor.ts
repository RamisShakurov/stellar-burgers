import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { orderBurgerApi } from '../../../src/utils/burger-api';
import { nanoid } from 'nanoid';

export interface ConstructorItems {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
}

interface ConstructorState {
  constructorItems: ConstructorItems;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
  modalOpenState: boolean;
}

export const initialState: ConstructorState = {
  constructorItems: { bun: null, ingredients: [] },
  orderRequest: false,
  orderModalData: null,
  error: null,
  modalOpenState: false
};

// Асинхронный экшн для заказа бургера
export const postOrder = createAsyncThunk<
  TOrder, // возвращаемый тип
  string[], // аргумент: массив id ингредиентов
  { rejectValue: string }
>('burgerConstructor/postOrder', async (ingredients, { rejectWithValue }) => {
  try {
    const data = await orderBurgerApi(ingredients);
    return data.order;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('Unknown error');
  }
});

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun(state, action: PayloadAction<TIngredient>) {
      state.constructorItems.bun = action.payload;
    },
    addIngredient(state, action: PayloadAction<TIngredient>) {
      state.constructorItems.ingredients.push({
        ...action.payload,
        uuid: nanoid() // уникальный идентификатор экземпляра
      });
    },
    removeIngredient(state, action: PayloadAction<string>) {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ing) => ing.uuid !== action.payload
        );
    },
    moveIngredientUp: (state, action: PayloadAction<string>) => {
      const index = state.constructorItems.ingredients.findIndex(
        (item) => item.uuid === action.payload
      );
      if (index > 0) {
        const temp = state.constructorItems.ingredients[index - 1];
        state.constructorItems.ingredients[index - 1] =
          state.constructorItems.ingredients[index];
        state.constructorItems.ingredients[index] = temp;
      }
    },

    moveIngredientDown: (state, action: PayloadAction<string>) => {
      const index = state.constructorItems.ingredients.findIndex(
        (item) => item.uuid === action.payload
      );
      if (
        index !== -1 &&
        index < state.constructorItems.ingredients.length - 1
      ) {
        const temp = state.constructorItems.ingredients[index + 1];
        state.constructorItems.ingredients[index + 1] =
          state.constructorItems.ingredients[index];
        state.constructorItems.ingredients[index] = temp;
      }
    },
    closeModal(state) {
      state.modalOpenState = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(postOrder.pending, (state) => {
        state.orderRequest = true;
        state.modalOpenState = true;
        state.error = null;
        state.orderModalData = null;
      })
      .addCase(postOrder.fulfilled, (state, action: PayloadAction<TOrder>) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        // после успешного заказа очищаем конструктор
        state.constructorItems = { bun: null, ingredients: [] };
        state.modalOpenState = true;
      })
      .addCase(postOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload || 'Неизвестная ошибка';
      });
  }
});

export const {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  closeModal
} = burgerConstructorSlice.actions;

export const constructorBurger = burgerConstructorSlice.reducer;
