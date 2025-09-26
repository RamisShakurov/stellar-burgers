import React from 'react';

type ProtectedRouteProps = {
  children: React.ReactElement;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  return <>{children}</>;
}
