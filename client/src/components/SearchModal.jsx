import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { RiSearch2Line, RiCloseLine } from 'react-icons/ri';
import { HEADER_LABELS, HINT_SLUGS } from './headerLabels';
import { useFocusTrap } from './useFocusTrap';

/** Site search dialog: portaled, modal, focus trapped, Esc closes (handled in Header). */
export function SearchModal({ lang, query, onQueryChange, results, navLabels, onNavigate, onClose, t }) {
  const labels = HEADER_LABELS[lang] || HEADER_LABELS.kk;
  const cardRef = useRef(null);
  useFocusTrap(cardRef, true, { initialFocus: '.search-modal-input' });

  const go = (slug) => {
    onNavigate(slug);
    onClose();
  };

  return createPortal(
    <div className="search-modal-backdrop" onClick={onClose}>
      <div
        ref={cardRef}
        className="search-modal-card"
        role="dialog"
        aria-modal="true"
        aria-label={labels.searchDialog}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="search-modal-header">
          <RiSearch2Line size={20} className="search-modal-icon" aria-hidden="true" />
          <input
            type="search"
            className="search-modal-input"
            placeholder={t.searchPlaceholder}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            aria-label={labels.searchInput}
          />
          <button type="button" className="search-modal-close" onClick={onClose} aria-label={labels.searchClose}>
            <RiCloseLine size={22} aria-hidden="true" />
          </button>
        </div>

        <div className="search-modal-body">
          {query.trim() ? (
            results.length > 0 ? (
              <ul className="search-results-list" aria-label={labels.searchResults}>
                {results.map((page) => (
                  <li key={page.slug}>
                    <button type="button" className="search-result-item" onClick={() => { go(page.slug); onQueryChange(''); }}>
                      <strong className="result-title">{page.title}</strong>
                      <span className="result-category">{navLabels[page.parent_slug] || navLabels[page.slug] || labels.page}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="search-empty-state">
                <p>{t.notFound}</p>
                <small>{labels.searchRetry}</small>
              </div>
            )
          ) : (
            <div className="search-hints-box">
              <span className="hints-label">{labels.hintsLabel}</span>
              <ul className="hints-list">
                {HINT_SLUGS.map((slug, index) => (
                  <li key={slug}><button type="button" onClick={() => go(slug)}>{labels.hints[index]}</button></li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <p className="visually-hidden" aria-live="polite">
          {query.trim() ? `${results.length}` : ''}
        </p>
      </div>
    </div>,
    document.body,
  );
}
