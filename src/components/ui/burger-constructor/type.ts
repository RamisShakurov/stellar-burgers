import { TOrder } from '@utils-types';
import { ConstructorItems } from '../../../services/slices/constructor';

export type BurgerConstructorUIProps = {
  constructorItems: ConstructorItems;
  orderRequest: boolean;
  price: number;
  orderModalData: TOrder | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;
};
