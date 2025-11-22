import {
  feedReducer,
  initialState,
  getFeed,
  getOrdersUser,
  getOrderFeed
} from '../../slices/feed';
import { TFeedsResponse, TOrder } from '@utils-types';

// Моковые данные
const mockOrder: TOrder = {
  _id: '1',
  status: 'done',
  name: 'Бургер',
  createdAt: '2024-01-01T12:00:00.000Z',
  updatedAt: '2024-01-01T12:00:00.000Z',
  number: 12345,
  ingredients: ['1', '2', '3']
};

const mockFeedsResponse: TFeedsResponse = {
  success: true,
  orders: [mockOrder],
  total: 100,
  totalToday: 10
};

const mockUserOrders: TOrder[] = [mockOrder];

describe('feed reducer', () => {
  test('должен вернуть начальное состояние', () => {
    expect(feedReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('getFeed', () => {
    test('pending - устанавливает isLoading в true', () => {
      const state = feedReducer(initialState, { type: getFeed.pending.type });
      expect(state.isLoading).toBe(true);
    });

    test('fulfilled - сохраняет данные фида', () => {
      const state = feedReducer(initialState, {
        type: getFeed.fulfilled.type,
        payload: mockFeedsResponse
      });
      expect(state.isLoading).toBe(false);
      expect(state.data).toEqual(mockFeedsResponse);
    });

    test('rejected - устанавливает ошибку', () => {
      const state = feedReducer(initialState, {
        type: getFeed.rejected.type,
        error: { message: 'Error' }
      });
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Error');
    });
  });

  describe('getOrdersUser', () => {
    test('pending - сбрасывает feedModal', () => {
      const stateWithModal = { ...initialState, feedModal: mockOrder };
      const state = feedReducer(stateWithModal, {
        type: getOrdersUser.pending.type
      });
      expect(state.isLoading).toBe(true);
      expect(state.feedModal).toBeNull();
    });

    test('fulfilled - сохраняет заказы пользователя', () => {
      const state = feedReducer(initialState, {
        type: getOrdersUser.fulfilled.type,
        payload: mockUserOrders
      });
      expect(state.isLoading).toBe(false);
      expect(state.feedsUser).toEqual(mockUserOrders);
    });

    test('rejected - устанавливает ошибку', () => {
      const state = feedReducer(initialState, {
        type: getOrdersUser.rejected.type,
        error: { message: 'Auth error' }
      });
      expect(state.error).toBe('Auth error');
    });
  });

  describe('getOrderFeed', () => {
    test('pending - устанавливает isLoading', () => {
      const state = feedReducer(initialState, {
        type: getOrderFeed.pending.type
      });
      expect(state.isLoading).toBe(true);
    });

    test('fulfilled - сохраняет заказ в feedModal', () => {
      const state = feedReducer(initialState, {
        type: getOrderFeed.fulfilled.type,
        payload: mockOrder
      });
      expect(state.feedModal).toEqual(mockOrder);
    });

    test('rejected - устанавливает ошибку', () => {
      const state = feedReducer(initialState, {
        type: getOrderFeed.rejected.type,
        error: { message: 'Not found' }
      });
      expect(state.error).toBe('Not found');
    });
  });
});
