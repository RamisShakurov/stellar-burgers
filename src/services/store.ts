import { configureStore, createAsyncThunk } from '@reduxjs/toolkit';
export { fetchIngredients } from './slices/ingredients';
export { ingredients } from './slices/ingredients';
import logger from 'redux-logger';

import {
  TypedUseSelectorHook,
  useDispatch,
  useDispatch as dispatchHook,
  useSelector,
  useSelector as selectorHook
} from 'react-redux';
import { getIngredientsApi } from '../utils/burger-api';
import { burgerData } from './slices/ingredients';
import { constructorBurger } from './slices/constructor';
import { userRegisterReducer } from './slices/register';
import { userReducer } from './slices/user';
import { feedReducer } from './slices/feed';

// Заменить на импорт настоящего редьюсера

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

const store = configureStore({
  reducer: {
    feed: feedReducer,
    ingredients: burgerData,
    burgerConstructor: constructorBurger,
    register: userRegisterReducer,
    user: userReducer
  },
  devTools: process.env.NODE_ENV !== 'production'
  // middleware: (getDefault) => getDefault().concat(logger)
});
export default store;
