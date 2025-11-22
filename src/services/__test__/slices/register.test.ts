import { userRegisterReducer, fetchRegisterUser, initialState } from '../../slices/register';
import { AnyAction } from '@reduxjs/toolkit';
import { TAuthResponse } from '../../../utils/burger-api';

// helper to create redux actions
const createAction = (type: string, payload?: any, error?: any): AnyAction => ({
  type,
  payload,
  error,
});

describe('userRegister reducer', () => {
  // -----------------------------
  // pending
  // -----------------------------
  describe('fetchRegisterUser.pending', () => {
    test('должен установить loading=true и сбросить ошибку', () => {
      const action = createAction(fetchRegisterUser.pending.type);

      const state = userRegisterReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.data).toBeNull();
    });

    test('не должен менять предыдущие данные', () => {
      const prevState = {
        ...initialState,
        data: { user: { name: 'Test' }, accessToken: '123', refreshToken: '456' } as TAuthResponse,
      };

      const action = createAction(fetchRegisterUser.pending.type);
      const state = userRegisterReducer(prevState, action);

      expect(state.data).toEqual(prevState.data);
    });
  });

  // -----------------------------
  // fulfilled
  // -----------------------------
  describe('fetchRegisterUser.fulfilled', () => {
    const mockResponse: TAuthResponse = {
      success: true,
      user: { name: 'Ramis', email: 'test@test.com' },
      accessToken: 'token123',
      refreshToken: 'refresh456',
    };

    test('должен сохранить данные и выключить loading', () => {
      const action = createAction(fetchRegisterUser.fulfilled.type, mockResponse);

      const state = userRegisterReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.data).toEqual(mockResponse);
    });

    test('должен перезаписать старые данные новыми', () => {
      const prevState = {
        data: { user: { name: 'Old' } } as TAuthResponse,
        loading: true,
        error: 'old error',
      };

      const action = createAction(fetchRegisterUser.fulfilled.type, mockResponse);

      const state = userRegisterReducer(prevState, action);

      expect(state.data).toEqual(mockResponse);
    });
  });

  // -----------------------------
  // rejected
  // -----------------------------
  describe('fetchRegisterUser.rejected', () => {
    test('должен установить error из action.error.message', () => {
      const errorMessage = 'Network error';

      const action = createAction(fetchRegisterUser.rejected.type, undefined, { message: errorMessage });

      const state = userRegisterReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.data).toBeNull();
    });


    test('не должен менять предыдущие данные при ошибке', () => {
      const prevState = {
        data: { user: { name: 'Saved' } } as TAuthResponse,
        loading: true,
        error: null,
      };

      const action = createAction(fetchRegisterUser.rejected.type, undefined, { message: 'fail' });

      const state = userRegisterReducer(prevState, action);

      expect(state.data).toEqual(prevState.data);
      expect(state.loading).toBe(false);
    });
  });
});
