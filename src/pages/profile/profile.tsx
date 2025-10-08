import { ProfileUI } from '@ui-pages';
import React, { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { updateUser } from '../../services/slices/user';

type TProfileForm = {
  name: string;
  email: string;
  password: string;
};

export const Profile: FC = () => {
  const user = useAppSelector((state) => state.user.data);
  const dispatch = useAppDispatch();

  const [formValue, setFormValue] = useState<TProfileForm>({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name || '',
        email: user.email || '',
        password: ''
      });
    }
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(updateUser(formValue));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
