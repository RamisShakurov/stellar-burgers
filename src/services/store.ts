import { configureStore, createAsyncThunk } from '@reduxjs/toolkit';
import logger from 'redux-logger';

import {
  TypedUseSelectorHook,
  useDispatch,
  useDispatch as dispatchHook,
  useSelector,
  useSelector as selectorHook
} from 'react-redux';
import { getIngredientsApi } from '@api';
import { burgerData } from './slices/ingredientsSlice';
import { constructorBurger } from './slices/constructorSlice';

// Заменить на импорт настоящего редьюсера

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchData',
  async () => await getIngredientsApi()
);
const store = configureStore({
  reducer: {
    ingredients: burgerData,
    burgerConstructor: constructorBurger
  },
  devTools: process.env.NODE_ENV !== 'production'
  // middleware: (getDefault) => getDefault().concat(logger)
});
export default store;
