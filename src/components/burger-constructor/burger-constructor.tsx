import { FC, useMemo } from 'react';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { closeModal, postOrder } from '../../services/slices/constructor';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const navigate = useNavigate();
  const constructorItems = useAppSelector(
    (state) => state.burgerConstructor.constructorItems
  );

  const orderRequest = useAppSelector(
    (state) => state.burgerConstructor.orderRequest
  );

  const orderModalData = useAppSelector(
    (state) => state.burgerConstructor.orderModalData
  );
  const ingredientIds = [
    constructorItems.bun?._id,
    ...constructorItems.ingredients.map((item) => item._id),
    constructorItems.bun?._id
  ].filter((id): id is string => Boolean(id));
  const onOrderClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    if (constructorItems.bun || orderRequest) {
      dispatch(postOrder(ingredientIds));
    }
  };
  const closeOrderModal = () => {
    dispatch(closeModal());
  };

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
