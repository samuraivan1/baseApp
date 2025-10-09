import React from 'react'; // Importamos React para usar React.FC
import Layout from '@/features/shell/Layout';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // 1. Importa el contenedor
import 'react-toastify/dist/ReactToastify.css'; // 2. Importa los estilos CSS
import SeedResetButton from '@/shared/components/dev/SeedResetButton';

const App: React.FC = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Layout />
      <SeedResetButton />
    </BrowserRouter>
  );
};

export default App;
