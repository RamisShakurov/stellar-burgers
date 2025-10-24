import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useAppSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import { TIngredient } from '@utils-types';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const ingredientData = useAppSelector((state) => state.ingredients.items);
  const { id } = useParams<{ id: string }>();
  const ingredientDetail = ingredientData.find(
    (item: TIngredient) => item._id === id
  );
  if (!ingredientDetail) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientDetail} />;
};
