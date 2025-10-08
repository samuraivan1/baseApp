import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/features/shell/state/authStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authMessages } from '@/constants/commonMessages';

const DEFAULT_IDLE_MS = Number(import.meta.env.VITE_IDLE_TIMEOUT_MS || 15 * 60 * 1000);

export function useIdleLogout(timeoutMs: number = DEFAULT_IDLE_MS) {
  const { isLoggedIn, logout } = useAuthStore();
  const navigate = useNavigate();
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!isLoggedIn) return;

    const reset = () => {
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        logout();
        toast.info(authMessages.logoutSuccess || 'Sesión finalizada por inactividad');
        navigate('/login');
      }, timeoutMs) as unknown as number;
    };

    const windowEvents: Array<keyof WindowEventMap> = ['mousemove', 'keydown', 'click', 'touchstart', 'scroll'];
    const documentEvents: Array<keyof DocumentEventMap> = ['visibilitychange'];

    windowEvents.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    documentEvents.forEach((e) => document.addEventListener(e, reset, { passive: true }));
    reset();
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
      windowEvents.forEach((e) => window.removeEventListener(e, reset as EventListener));
      documentEvents.forEach((e) => document.removeEventListener(e, reset as EventListener));
    };
  }, [isLoggedIn, logout, navigate, timeoutMs]);
}
