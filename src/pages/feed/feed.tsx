import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { getFeed } from '../../services/slices/feed';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const orders = useAppSelector((state) => state.feed.data?.orders) || [];
  const isLoading = useAppSelector((state) => state.feed.isLoading);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getFeed());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(getFeed());
      }}
    />
  );
};
