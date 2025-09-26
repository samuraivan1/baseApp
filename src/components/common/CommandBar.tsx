import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSync } from '@fortawesome/free-solid-svg-icons';
import './AdminUI.scss';

interface Props {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onAdd: () => void;
  onRefresh: () => void;
  addLabel: string;
  // --- AÑADIMOS LAS NUEVAS PROPS ---
  searchPlaceholder?: string; // Para el texto dinámico
  searchLarge?: boolean; // Para controlar el tamaño
}

const CommandBar: React.FC<Props> = ({
  searchTerm,
  setSearchTerm,
  onAdd,
  onRefresh,
  addLabel,
  // --- VALORES POR DEFECTO PARA LAS NUEVAS PROPS ---
  searchPlaceholder = 'Buscar...',
  searchLarge = false,
}) => {
  // --- LÓGICA PARA LA CLASE CSS DINÁMICA ---
  const searchWrapperClass = `search-wrapper ${
    searchLarge ? 'search-wrapper--large' : ''
  }`;

  return (
    <div className="command-bar">
      {/* --- APLICAMOS LA CLASE DINÁMICA --- */}
      <div className={searchWrapperClass}>
        <input
          type="text"
          // --- USAMOS EL PLACEHOLDER DINÁMICO ---
          placeholder={searchPlaceholder}
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="command-bar__actions">
        <button className="command-bar__button" onClick={onAdd}>
          <FontAwesomeIcon icon={faPlus} />
          <span>{addLabel}</span>
        </button>
        <button className="command-bar__button" onClick={onRefresh}>
          <FontAwesomeIcon icon={faSync} />
          <span>Actualizar</span>
        </button>
      </div>
    </div>
  );
};

export default CommandBar;