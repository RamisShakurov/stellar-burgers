import { burgerData } from '../../slices/ingredients';
import { TIngredient } from '@utils-types';
import { fetchIngredients } from '../../slices/ingredients';

jest.mock('../../store', () => ({
  fetchIngredients: {
    pending: { type: 'ingredients/fetch/pending' },
    fulfilled: { type: 'ingredients/fetch/fulfilled' },
    rejected: { type: 'ingredients/fetch/rejected' }
  }
}));

// Мокаем nanoid
jest.mock('nanoid', () => ({
  nanoid: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9)
}));

// Мокаем react-fast-compare
jest.mock('react-fast-compare', () => ({
  __esModule: true,
  default: jest.fn((a, b) => JSON.stringify(a) === JSON.stringify(b))
}));

// Моковые данные
const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  },
  {
    _id: '2',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  },
  {
    _id: '3',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
  }
];

const initialState = {
  items: [],
  loading: false,
  error: null
};

describe('ingredients reducer', () => {
  describe('initial state', () => {
    test('должен вернуть начальное состояние', () => {
      expect(burgerData(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    test('начальное состояние должно иметь правильную структуру', () => {
      const state = burgerData(undefined, { type: 'unknown' });
      expect(state).toHaveProperty('items');
      expect(state).toHaveProperty('loading');
      expect(state).toHaveProperty('error');
      expect(Array.isArray(state.items)).toBe(true);
      expect(state.items).toHaveLength(0);
    });
  });

  describe('fetchIngredients.pending', () => {
    test('должен установить loading в true при начале загрузки', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = burgerData(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('должен сбросить ошибку при повторной загрузке', () => {
      const stateWithError = {
        ...initialState,
        error: 'Предыдущая ошибка'
      };
      const action = { type: fetchIngredients.pending.type };
      const state = burgerData(stateWithError, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('должен сохранить существующие items при начале загрузки', () => {
      const stateWithItems = {
        ...initialState,
        items: mockIngredients
      };
      const action = { type: fetchIngredients.pending.type };
      const state = burgerData(stateWithItems, action);

      expect(state.items).toEqual(mockIngredients);
      expect(state.loading).toBe(true);
    });
  });

  describe('fetchIngredients.fulfilled', () => {
    test('должен сохранить загруженные ингредиенты', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = burgerData(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.items).toEqual(mockIngredients);
      expect(state.error).toBeNull();
    });

    test('должен обновить items при изменении данных', () => {
      const stateWithOldItems = {
        ...initialState,
        items: [mockIngredients[0]]
      };
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = burgerData(stateWithOldItems, action);

      expect(state.items).toEqual(mockIngredients);
      expect(state.items).toHaveLength(3);
    });

    test('не должен обновить items если данные идентичны', () => {
      const stateWithItems = {
        ...initialState,
        items: mockIngredients
      };
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = burgerData(stateWithItems, action);

      // Проверяем что ссылка на массив не изменилась
      expect(state.items).toBe(stateWithItems.items);
      expect(state.loading).toBe(false);
    });

    test('должен обработать пустой массив ингредиентов', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: []
      };
      const state = burgerData(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.items).toEqual([]);
      expect(state.error).toBeNull();
    });

    test('должен сбросить loading после успешной загрузки', () => {
      const stateLoading = {
        ...initialState,
        loading: true
      };
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = burgerData(stateLoading, action);

      expect(state.loading).toBe(false);
    });
  });

  describe('fetchIngredients.rejected', () => {
    test('должен установить ошибку при неудачной загрузке', () => {
      const errorMessage = 'Ошибка сети';
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: errorMessage }
      };
      const state = burgerData(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    test('должен использовать дефолтное сообщение если error.message отсутствует', () => {
      const action = {
        type: fetchIngredients.rejected.type,
        error: {}
      };
      const state = burgerData(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка загрузки');
    });

    test('должен сбросить loading при ошибке', () => {
      const stateLoading = {
        ...initialState,
        loading: true
      };
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: 'Network error' }
      };
      const state = burgerData(stateLoading, action);

      expect(state.loading).toBe(false);
    });

    test('должен сохранить существующие items при ошибке', () => {
      const stateWithItems = {
        ...initialState,
        items: mockIngredients
      };
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: 'Network error' }
      };
      const state = burgerData(stateWithItems, action);

      expect(state.items).toEqual(mockIngredients);
      expect(state.error).toBe('Network error');
    });
  });
});
