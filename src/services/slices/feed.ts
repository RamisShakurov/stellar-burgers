import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi, getOrdersApi, TFeedsResponse } from '@api';
import { TOrder } from '@utils-types';

type TFeedState = {
  isLoading: boolean;
  data: TFeedsResponse | null;
  feedsUser: TOrder[] | null;
  error: null | string;
};

export const initialState: TFeedState = {
  isLoading: false,
  data: null,
  error: null,
  feedsUser: null
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
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

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
      })
      .addCase(getOrdersUser.fulfilled, (state, action) => {
        state.feedsUser = action.payload;
        state.isLoading = false;
      })
      .addCase(getOrdersUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'error getFeedUser';
      });
  }
});

export const feedReducer = feedSlice.reducer;
