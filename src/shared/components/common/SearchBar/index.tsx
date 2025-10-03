import React from 'react';

export type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder: string;
  label?: string;
};

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSearch, placeholder, label }) => {
  return (
    <div className="search-bar">
      {label && <label className="search-bar__label">{label}</label>}
      <input
        className="search-bar__input"
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') onSearch(); }}
      />
      <button className="search-bar__btn" type="button" onClick={onSearch}>
        {label ?? 'Buscar'}
      </button>
    </div>
  );
};

export default SearchBar;

