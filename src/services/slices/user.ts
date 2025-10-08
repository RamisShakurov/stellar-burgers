import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  TRegisterData,
  updateUserApi
} from '@api';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';

type TUserState = {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  data: null | TUser;
  loginUserError: null | string;
  loginUserRequest: boolean;
};

const initialState: TUserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  data: null,
  loginUserError: null,
  loginUserRequest: false
};

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (
    { email, password }: Omit<TRegisterData, 'name'>,
    { rejectWithValue }
  ) => {
    const data = await loginUserApi({ email, password });
    if (!data?.success) {
      return rejectWithValue(data);
    }
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, { dispatch }) => {
    try {
      await logoutApi();
      localStorage.clear();
      deleteCookie('accessToken');
      dispatch(userLogout());
    } catch (error) {
      console.log('Ошибка выполнения выхода');
    }
  }
);

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUserApi();
      if (!data?.success) throw new Error('User fetch failed');
      return data.user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUser = createAsyncThunk<TUser, Partial<TRegisterData>>(
  'user/updateUser',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await updateUserApi(userData);
      if (!data?.success) {
        throw new Error('Update failed');
      }
      return data.user; // вернём пользователя при успехе
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLogout: (state) => {
      state.data = null;
      state.isAuthenticated = false;
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError = action.error.message ?? 'error';
        state.isAuthChecked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loginUserRequest = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.pending, (state) => {
        state.isAuthChecked = false;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.isAuthChecked = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  }
});

export const { userLogout } = userSlice.actions;
export const userReducer = userSlice.reducer;
