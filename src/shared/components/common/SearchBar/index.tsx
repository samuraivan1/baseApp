import React from 'react';
import './SearchBar.scss';
import { searchBarMessages } from './SearchBar.messages';

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
        {label ?? searchBarMessages.search}
      </button>
    </div>
  );
};

export default SearchBar;
