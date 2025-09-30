import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { registerUserApi, TAuthResponse, TRegisterData } from '@api';

interface IUserRegisterState {
  data: TAuthResponse | null;
  loading: boolean;
  error: string | null;
}

export const initialState: IUserRegisterState = {
  data: null,
  loading: false,
  error: null
};

export const fetchRegisterUser = createAsyncThunk(
  'register/fetchRegisterUser',
  async (userData: TRegisterData) => await registerUserApi(userData)
);

export const userRegisterSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegisterUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRegisterUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchRegisterUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Error loading';
      });
  }
});

export default userRegisterSlice.reducer;
