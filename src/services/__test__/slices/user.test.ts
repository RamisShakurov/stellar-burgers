import {
  userReducer,
  initialState,
  loginUser,
  fetchUser,
  updateUser,
  userLogout
} from '../../slices/user';
import { AnyAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';

const createAction = (
  type: string,
  payload?: unknown,
  error?: unknown
): AnyAction => ({
  type,
  payload,
  error
});

describe('userSlice reducer', () => {
  // ------------------------------------------------------------
  // loginUser
  // ------------------------------------------------------------
  describe('loginUser', () => {
    test('pending → loginUserRequest=true и loginUserError=null', () => {
      const action = createAction(loginUser.pending.type);
      const state = userReducer(initialState, action);

      expect(state.loginUserRequest).toBe(true);
      expect(state.loginUserError).toBeNull();
    });

    test('fulfilled → успешная авторизация', () => {
      const user: TUser = { name: 'Ramis', email: 'test@test.com' };
      const action = createAction(loginUser.fulfilled.type, user);
      const state = userReducer(initialState, action);

      expect(state.data).toEqual(user);
      expect(state.loginUserRequest).toBe(false);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
    });

    test('rejected → ошибка авторизации + authChecked=true', () => {
      const errorMessage = 'Invalid credentials';
      const action = createAction(
        loginUser.rejected.type,
        undefined,
        { message: errorMessage }
      );

      const state = userReducer(initialState, action);

      expect(state.loginUserRequest).toBe(false);
      expect(state.loginUserError).toBe(errorMessage);
      expect(state.isAuthChecked).toBe(true);
      expect(state.isAuthenticated).toBe(false);
    });

    test('rejected без message → error="error"', () => {
      const action = createAction(loginUser.rejected.type);

      const state = userReducer(initialState, action);

      expect(state.loginUserError).toBe('error');
    });
  });

  // ------------------------------------------------------------
  // fetchUser
  // ------------------------------------------------------------
  describe('fetchUser', () => {
    test('pending → isAuthChecked=false', () => {
      const action = createAction(fetchUser.pending.type);
      const state = userReducer(initialState, action);

      expect(state.isAuthChecked).toBe(false);
    });

    test('fulfilled → загрузка пользователя успешна', () => {
      const user: TUser = { name: 'Bob', email: 'bob@example.com' };
      const action = createAction(fetchUser.fulfilled.type, user);
      const state = userReducer(initialState, action);

      expect(state.data).toEqual(user);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
    });

    test('rejected → isAuthChecked=true', () => {
      const action = createAction(fetchUser.rejected.type);
      const state = userReducer(initialState, action);

      expect(state.isAuthChecked).toBe(true);
      expect(state.isAuthenticated).toBe(false);
    });
  });

  // ------------------------------------------------------------
  // updateUser
  // ------------------------------------------------------------
  describe('updateUser', () => {
    test('fulfilled → обновляет данные пользователя', () => {
      const prevState = {
        ...initialState,
        data: { name: 'Old', email: 'old@mail.com' } as TUser
      };

      const updatedUser: TUser = {
        name: 'New Name',
        email: 'new@mail.com'
      };

      const action = createAction(updateUser.fulfilled.type, updatedUser);
      const state = userReducer(prevState, action);

      expect(state.data).toEqual(updatedUser);
    });
  });

  // ------------------------------------------------------------
  // userLogout reducer
  // ------------------------------------------------------------
  describe('userLogout reducer', () => {
    test('должен очистить данные и снять авторизацию', () => {
      const prevState = {
        ...initialState,
        data: { name: 'User', email: 'mail@mail.com' },
        isAuthenticated: true
      };

      const action = userLogout();
      const state = userReducer(prevState, action);

      expect(state.data).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isAuthChecked).toBe(true);
    });
  });
});
