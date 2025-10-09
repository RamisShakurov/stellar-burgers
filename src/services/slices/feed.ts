import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi, TFeedsResponse } from '@api';

type TFeedState = {
  isLoading: boolean;
  data: TFeedsResponse | null;
  error: null | string;
};

export const initialState: TFeedState = {
  isLoading: false,
  data: null,
  error: null
};

export const getFeed = createAsyncThunk<
  TFeedsResponse,
  void,
  { rejectValue: string }
>('feed/getOrders', async (_, { rejectWithValue }) => {
  try {
    const data = await getFeedsApi();
    if (!data.success) {
      return rejectWithValue('Не удалось получить фид');
    }
    return data;
  } catch (error) {
    console.error(error);
    return rejectWithValue('Ошибка сети');
  }
});

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeed.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(getFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'error getFeed';
      });
  }
});

export const feedReducer = feedSlice.reducer;
