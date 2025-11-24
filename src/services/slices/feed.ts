import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  TFeedsResponse
} from '../../../src/utils/burger-api';
import { TOrder } from '@utils-types';

type TFeedState = {
  isLoading: boolean;
  data: TFeedsResponse | null;
  feedsUser: TOrder[] | null;
  feedModal: null | TOrder;
  error: null | string;
};

export const initialState: TFeedState = {
  isLoading: false,
  data: null,
  error: null,
  feedsUser: null,
  feedModal: null
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

export const getOrdersUser = createAsyncThunk(
  'feeds/getUserFeed',
  async (_, { rejectWithValue }) => {
    try {
      return await getOrdersApi();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unknown error');
    }
  }
);

export const getOrderFeed = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('feeds/getOrderFeed', async (number, { rejectWithValue }) => {
  try {
    const data = await getOrderByNumberApi(number);
    return data.orders[0];
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Неизвестная ошибка'
    );
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
      })
      .addCase(getOrdersUser.pending, (state) => {
        state.isLoading = true;
        state.feedModal = null;
      })
      .addCase(getOrdersUser.fulfilled, (state, action) => {
        state.feedsUser = action.payload;
        state.isLoading = false;
      })
      .addCase(getOrdersUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'error getFeedUser';
      })
      .addCase(getOrderFeed.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderFeed.fulfilled, (state, action) => {
        state.feedModal = action.payload;
      })
      .addCase(getOrderFeed.rejected, (state, action) => {
        state.error = action.error.message || 'error getOrderFeed';
      });
  }
});

export const feedReducer = feedSlice.reducer;
