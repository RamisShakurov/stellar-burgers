import React from 'react';
import { useAppSelector } from '../../services/store';
import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';

type ProtectedRouteProps = {
  children: React.ReactElement;
  onlyUnAuth?: boolean;
};

export function ProtectedRoute({ children, onlyUnAuth }: ProtectedRouteProps) {
  const isAuthChecked = useAppSelector((state) => state.user.isAuthChecked);
  const user = useAppSelector((state) => state.user.data);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/profile' };
    return <Navigate replace to={from} />;
  }

  return <>{children}</>;
}
