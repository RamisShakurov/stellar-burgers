import { FC, useMemo } from 'react';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useAppSelector } from '../../services/store';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems = useAppSelector(
    (state) => state.burgerConstructor.constructorItems
  );

  const orderRequest = useAppSelector(
    (state) => state.burgerConstructor.orderRequest
  );

  const orderModalData = useAppSelector(
    (state) => state.burgerConstructor.orderModalData
  );

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
  };
  const closeOrderModal = () => {};

  const price = useMemo(() => {
    const bunPrice = constructorItems.bun?.price ?? 0;
    const ingredientsPrice = constructorItems.ingredients.reduce(
      (sum: number, item: TIngredient) => sum + (item.price ?? 0),
      0
    );
    return bunPrice * 2 + ingredientsPrice;
  }, [constructorItems.bun, constructorItems.ingredients]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
