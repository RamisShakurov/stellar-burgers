import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient, TOrder } from '@utils-types';
import { orderBurgerApi } from '@api';

interface ConstructorItems {
  bun: TIngredient | null;
  ingredients: TIngredient[];
}

interface ConstructorState {
  constructorItems: ConstructorItems;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
}

const initialState: ConstructorState = {
  constructorItems: { bun: null, ingredients: [] },
  orderRequest: false,
  orderModalData: null,
  error: null
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
  } catch (err: any) {
    return rejectWithValue(err.message || 'Ошибка при заказе');
  }
});

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun(state, action: PayloadAction<TIngredient>) {
      state.constructorItems.bun = action.payload;
      console.log('Добавление ингредиента');
    },
    addIngredient(state, action: PayloadAction<TIngredient>) {
      console.log('Добавление ингредиента');
      state.constructorItems.ingredients.push(action.payload);
    },
    removeIngredient(state, action: PayloadAction<string>) {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ing) => ing._id !== action.payload
        );
    },
    clearConstructor(state) {
      state.constructorItems = { bun: null, ingredients: [] };
      state.orderModalData = null;
      state.error = null;
      state.orderRequest = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(postOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(postOrder.fulfilled, (state, action: PayloadAction<TOrder>) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        // после успешного заказа очищаем конструктор
        state.constructorItems = { bun: null, ingredients: [] };
      })
      .addCase(postOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload || 'Неизвестная ошибка';
      });
  }
});

export const { addBun, addIngredient, removeIngredient, clearConstructor } =
  burgerConstructorSlice.actions;

export const constructorBurger = burgerConstructorSlice.reducer;
