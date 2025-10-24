import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { fetchRegisterUser } from '../../services/slices/register';
import { useNavigate } from 'react-router-dom';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isSuccess = useAppSelector((state) => state.register.data?.success);
  const errorMassage = useAppSelector((state) => state.register.error) ?? '';

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      fetchRegisterUser({
        name: userName,
        email: email,
        password: password
      })
    );
  };
  useEffect(() => {
    if (isSuccess) {
      navigate('/login');
    }
  }, [isSuccess]);

  return (
    <RegisterUI
      errorText={errorMassage}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
