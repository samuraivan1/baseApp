import { useMemo, useState } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/shell/state/authStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faLock,
  faBasketballBall,
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import './LoginPage.scss';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from './validationSchema';
// ✅ 1. Importa desde las dos nuevas fuentes
import { authMessages } from '@/constants/commonMessages';
import { loginPageText } from './LoginPage.messages';
import { ensureSafeUrl } from '@/shared/security/url';
import { ensureSafeInternalPath } from '@/shared/security/redirect';

type LoginFormProps = {
  backgroundImage: string;
  onSubmit: (data: LoginFormData) => Promise<void> | void;
  isSubmitting?: boolean;
};

const LoginForm: React.FC<LoginFormProps> = ({
  backgroundImage,
  onSubmit,
  isSubmitting = false,
}) => {
  const [rememberMe, setRememberMe] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { emailOrUsername: '', password: '' },
  });
  const handleWindowsLogin = () => {
    toast.info(loginPageText.winSSOSimulated);
  };
  const safeBg = useMemo(
    () =>
      ensureSafeUrl(backgroundImage, {
        allowRelative: true,
        allowHttpSameOrigin: true,
      }),
    [backgroundImage]
  );
  return (
    <div
      className="login"
      style={safeBg ? { backgroundImage: `url(${safeBg})` } : undefined}
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

interface LoginPageProps {
  backgroundImage: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ backgroundImage }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const phase =
    useAuthStore.getState().phase ??
    (useAuthStore.getState().authReady ? 'ready' : 'idle');
  async function postLoginFinalize() {
    try {
      const { finalizeLogin } = await import('@/shared/auth/bootstrapAuth');
      await finalizeLogin();
    } catch {
      // Ignorar errores de depuración; el login ya validó
    }
  }
  // ✅ 2. Obtenemos el estado de autenticación del store
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      // Usar apiCallEx que lanza AppError y simplifica el flujo
      const { apiCallEx } = await import('@/shared/api/apiCallEx');
      await apiCallEx(() => login(data.emailOrUsername, data.password), { retry: false });
      await apiCallEx(() => postLoginFinalize(), { retry: false });
      toast.success(authMessages.loginSuccess);
      const from = (location.state as { from?: { pathname?: string } } | null)
        ?.from?.pathname;
      const safe = ensureSafeInternalPath(from, '/home');
      navigate(safe, { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoggedIn && phase === 'ready') {
    return <Navigate to="/home" replace />;
  }
  return (
    <LoginForm
      backgroundImage={backgroundImage}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    />
  );
};

export default LoginPage;
export { LoginForm };
