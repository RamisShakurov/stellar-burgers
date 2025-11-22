import {
  constructorBurger,
  initialState,
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown
} from '../slices/constructor';
import { TIngredient, TOrder } from '@utils-types';

// Моковые данные
const mockIngredient: TIngredient = {
  _id: '1',
  name: 'Ingredient',
  type: 'main',
  price: 100,
  image: '',
  image_mobile: '',
  image_large: '',
  calories: 0,
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  uuid: '123'
};

const mockBun: TIngredient = {
  ...mockIngredient,
  _id: '2',
  type: 'bun',
  name: 'Bun'
};

// Мокаем nanoid
jest.mock('nanoid', () => ({
  nanoid: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9)
}));

const mockSauce: TIngredient = {
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
};

const mockOrder: TOrder = {
  _id: 'order123',
  status: 'done',
  name: 'Тестовый бургер',
  createdAt: '2024-01-01T12:00:00.000Z',
  updatedAt: '2024-01-01T12:00:00.000Z',
  number: 12345,
  ingredients: ['1', '2', '3']
};

describe('burgerConstructor reducer', () => {
  // Тесты для синхронных экшенов
  describe('synchronous actions', () => {
    test('должен вернуть начальное состояние', () => {
      expect(constructorBurger(undefined, { type: 'unknown' })).toEqual(
        initialState
      );
    });

    test('addBun должен добавить булку', () => {
      const state = constructorBurger(initialState, addBun(mockBun));
      expect(state.constructorItems.bun).toEqual(mockBun);
    });

    test('addBun должен заменить существующую булку', () => {
      const stateWithBun = {
        ...initialState,
        constructorItems: { bun: mockBun, ingredients: [] }
      };
      const newBun: TIngredient = {
        ...mockBun,
        _id: '10',
        name: 'Новая булка'
      };
      const state = constructorBurger(stateWithBun, addBun(newBun));
      expect(state.constructorItems.bun).toEqual(newBun);
    });

    test('addIngredient должен добавить ингредиент с uuid', () => {
      const state = constructorBurger(
        initialState,
        addIngredient(mockIngredient)
      );
      expect(state.constructorItems.ingredients).toHaveLength(1);
      // Проверяем все поля кроме uuid
      expect(state.constructorItems.ingredients[0]._id).toBe(
        mockIngredient._id
      );
      expect(state.constructorItems.ingredients[0].name).toBe(
        mockIngredient.name
      );
      expect(state.constructorItems.ingredients[0].type).toBe(
        mockIngredient.type
      );
      expect(state.constructorItems.ingredients[0].price).toBe(
        mockIngredient.price
      );
      // Проверяем что uuid был добавлен и не пустой
      expect(state.constructorItems.ingredients[0].uuid).toBeDefined();
      expect(state.constructorItems.ingredients[0].uuid).toBeTruthy();
    });

    test('addIngredient должен добавить несколько ингредиентов', () => {
      let state = constructorBurger(
        initialState,
        addIngredient(mockIngredient)
      );
      state = constructorBurger(state, addIngredient(mockSauce));
      expect(state.constructorItems.ingredients).toHaveLength(2);
      expect(state.constructorItems.ingredients[0].uuid).not.toEqual(
        state.constructorItems.ingredients[1].uuid
      );
    });

    test('removeIngredient должен удалить ингредиент по uuid', () => {
      const stateWithIngredients = {
        ...initialState,
        constructorItems: {
          bun: null,
          ingredients: [
            { ...mockIngredient, uuid: 'uuid-1' },
            { ...mockSauce, uuid: 'uuid-2' }
          ]
        }
      };
      const state = constructorBurger(
        stateWithIngredients,
        removeIngredient('uuid-1')
      );
      expect(state.constructorItems.ingredients).toHaveLength(1);
      expect(state.constructorItems.ingredients[0].uuid).toBe('uuid-2');
    });

    test('removeIngredient не должен изменить состояние при несуществующем uuid', () => {
      const stateWithIngredients = {
        ...initialState,
        constructorItems: {
          bun: null,
          ingredients: [{ ...mockIngredient, uuid: 'uuid-1' }]
        }
      };
      const state = constructorBurger(
        stateWithIngredients,
        removeIngredient('nonexistent')
      );
      expect(state.constructorItems.ingredients).toHaveLength(1);
    });

    test('moveIngredientUp должен переместить ингредиент вверх', () => {
      const stateWithIngredients = {
        ...initialState,
        constructorItems: {
          bun: null,
          ingredients: [
            { ...mockIngredient, uuid: 'uuid-1' },
            { ...mockSauce, uuid: 'uuid-2' }
          ]
        }
      };
      const state = constructorBurger(
        stateWithIngredients,
        moveIngredientUp('uuid-2')
      );
      expect(state.constructorItems.ingredients[0].uuid).toBe('uuid-2');
      expect(state.constructorItems.ingredients[1].uuid).toBe('uuid-1');
    });

    test('moveIngredientUp не должен изменить первый элемент', () => {
      const stateWithIngredients = {
        ...initialState,
        constructorItems: {
          bun: null,
          ingredients: [
            { ...mockIngredient, uuid: 'uuid-1' },
            { ...mockSauce, uuid: 'uuid-2' }
          ]
        }
      };
      const state = constructorBurger(
        stateWithIngredients,
        moveIngredientUp('uuid-1')
      );
      expect(state.constructorItems.ingredients[0].uuid).toBe('uuid-1');
      expect(state.constructorItems.ingredients[1].uuid).toBe('uuid-2');
    });

    test('moveIngredientDown должен переместить ингредиент вниз', () => {
      const stateWithIngredients = {
        ...initialState,
        constructorItems: {
          bun: null,
          ingredients: [
            { ...mockIngredient, uuid: 'uuid-1' },
            { ...mockSauce, uuid: 'uuid-2' }
          ]
        }
      };
      const state = constructorBurger(
        stateWithIngredients,
        moveIngredientDown('uuid-1')
      );
      expect(state.constructorItems.ingredients[0].uuid).toBe('uuid-2');
      expect(state.constructorItems.ingredients[1].uuid).toBe('uuid-1');
    });

    // Тесты сценариев использования

    test('редактирование состава бургера', () => {
      let state = constructorBurger(
        initialState,
        addIngredient(mockIngredient)
      );
      const uuid1 = state.constructorItems.ingredients[0].uuid;

      state = constructorBurger(state, addIngredient(mockSauce));
      const uuid2 = state.constructorItems.ingredients[1].uuid;

      state = constructorBurger(state, addIngredient(mockIngredient));
      const uuid3 = state.constructorItems.ingredients[2].uuid;

      // Удаляем средний ингредиент
      state = constructorBurger(state, removeIngredient(uuid2));
      expect(state.constructorItems.ingredients).toHaveLength(2);
      expect(state.constructorItems.ingredients[0].uuid).toBe(uuid1);
      expect(state.constructorItems.ingredients[1].uuid).toBe(uuid3);

      // Перемещаем последний вверх
      state = constructorBurger(state, moveIngredientUp(uuid3));
      expect(state.constructorItems.ingredients[0].uuid).toBe(uuid3);
      expect(state.constructorItems.ingredients[1].uuid).toBe(uuid1);
    });
  });
});
