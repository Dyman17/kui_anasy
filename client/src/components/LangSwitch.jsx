import React from 'react';
import { LANG_OPTIONS } from './headerLabels';

export function LangSwitch({ lang, onLangChange, label, className = '' }) {
  return (
    <div className={`header-lang-switcher ${className}`} role="group" aria-label={label}>
      {LANG_OPTIONS.map((option) => (
        <button
          key={option.code}
          type="button"
          className={`lang-pill ${lang === option.code ? 'active' : ''}`}
          onClick={() => onLangChange(option.code)}
          aria-pressed={lang === option.code}
          lang={option.code}
          title={option.name}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
