import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useAppSelector } from '../../services/store';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const orders: TOrder[] =
    useAppSelector((state) => state.feed.feedsUser) || [];

  return <ProfileOrdersUI orders={orders} />;
};
