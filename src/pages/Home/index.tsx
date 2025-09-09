import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
// ✅ 1. Importa la constante desde su nuevo archivo
import { HOME_BACKGROUND_IMAGE } from '@/constants/uiConstants';
import './Home.scss';

// URL de la imagen de fondo

const Home: React.FC = () => {
  // ✅ 'user' es inferido como 'User | null' gracias a nuestro store tipado.
  const user = useAuthStore((state) => state.user);
  return (
    <div
      className="home-page"
      style={{ backgroundImage: `url(${HOME_BACKGROUND_IMAGE})` }}
    >
      <div className="home-overlay"></div>
      <div className="home-content">
        <h1>Bienvenido, {user?.nombreCompleto || 'Usuario'}</h1>
        <p>Gestiona tus proyectos y tareas de forma eficiente.</p>
        <Link to="/kanban" className="home-button">
          Ir a mi Tablero Kanban
        </Link>
      </div>
    </div>
  );
};

export default Home; // <-- ESTA LÍNEA ES LA CLAVE QUE FALTABA
