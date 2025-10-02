import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/shell/state/authStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faLock,
  faBasketballBall,
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import './LoginPage.scss';
import logger from '@/shared/api/logger';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from './validationSchema';
// ✅ 1. Importa desde las dos nuevas fuentes
import { authMessages } from '@/constants/commonMessages';
import { loginPageText } from './LoginPage.messages';

interface LoginPageProps {
  backgroundImage: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ backgroundImage }) => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  // ✅ 2. Obtenemos el estado de autenticación del store
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrUsername: 'iamendezm',
      password: '$2b$12$...',
    },
  });

  const [rememberMe, setRememberMe] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.emailOrUsername, data.password);
      toast.success(authMessages.loginSuccess);
      navigate('/home');
    } catch (error) {
      // Asegurarnos de que el error sea del tipo Error
      if (error instanceof Error) {
        logger.error(error, { context: 'Error en el inicio de sesión' });
        toast.error(error.message || authMessages.loginGenericError);
      } else {
        logger.error(new Error('Error desconocido durante el login'), {
          originalError: error,
        });
        toast.error(authMessages.loginGenericError);
      }
    }
  };

  const handleWindowsLogin = () => {
    alert(loginPageText.winSSOSimulated);
  };

  if (isLoggedIn) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div
      className="login" // ✅ Bloque BEM
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="login__container">
        <h1 className="login__title">Iniciar Sesión</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="login__form">
          <div className="login__group">
            <FontAwesomeIcon icon={faEnvelope} className="login__icon" />
            <input
              type="text"
              placeholder={loginPageText.emailPlaceholder}
              className="login__input"
              {...register('emailOrUsername')}
            />
          </div>
          {errors.emailOrUsername && (
            <p className="login__error">{errors.emailOrUsername.message}</p>
          )}

          <div className="login__group">
            <FontAwesomeIcon icon={faLock} className="login__icon" />
            <input
              type="password"
              placeholder={loginPageText.passwordPlaceholder}
              className="login__input"
              {...register('password')}
            />
          </div>
          {errors.password && (
            <p className="login__error">{errors.password.message}</p>
          )}

          <div className="login__options">
            <label className="login__remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              {loginPageText.rememberMe}
            </label>
            <a href="/forgot-password">{loginPageText.forgotPassword}</a>
          </div>

          <button
            type="submit"
            className="login__button login__button--primary"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? loginPageText.loadingButton
              : loginPageText.loginButton}
          </button>
        </form>

        <div className="login__divider">{loginPageText.divider}</div>
        <button
          className="login__button login__button--windows"
          onClick={handleWindowsLogin}
        >
          <FontAwesomeIcon icon={faBasketballBall} className="login__icon" />
          {loginPageText.windowsLogin}
        </button>
        <p className="login__register">
          {loginPageText.registerPrompt}{' '}
          <a href="/register">{loginPageText.registerLink}</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
