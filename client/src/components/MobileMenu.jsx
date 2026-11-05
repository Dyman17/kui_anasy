import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { RiCloseLine } from 'react-icons/ri';
import { BrandMark } from './BrandMark';
import { LangSwitch } from './LangSwitch';
import { PageQrButton } from './PageQrButton';
import { HEADER_LABELS, ACCOUNT_LABELS } from './headerLabels';
import { useFocusTrap } from './useFocusTrap';

/** Full-screen navigation overlay for <=960px. Portaled, modal, focus trapped. */
export function MobileMenu({
  navPages, navLabels, lang, hrefFor, isSectionActive, onNavigate, onClose,
  onLangChange, sessionUser, onSessionUserChange,
}) {
  const labels = HEADER_LABELS[lang] || HEADER_LABELS.kk;
  const account = ACCOUNT_LABELS[lang] || ACCOUNT_LABELS.kk;
  const ref = useRef(null);
  useFocusTrap(ref, true, { initialFocus: '.mobile-overlay-close-btn' });

  const goAdmin = () => {
    onClose();
    window.location.hash = '#admin';
  };

  return createPortal(
    <div ref={ref} className="mobile-nav-overlay" role="dialog" aria-modal="true" aria-label={labels.menu}>
      <div className="mobile-overlay-header">
        <a
          className="brand"
          href={hrefFor('home')}
          onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
          aria-label={`${labels.brand} — ${labels.home}`}
        >
          <BrandMark />
          <span className="brand-copy"><strong>{labels.brand}</strong></span>
        </a>
        <button type="button" className="mobile-overlay-close-btn" onClick={onClose} aria-label={labels.closeMenu}>
          <RiCloseLine size={24} aria-hidden="true" />
        </button>
      </div>

      <nav className="mobile-overlay-nav" aria-label={labels.mainNav}>
        <ul className="mobile-nav-list">
          {navPages.map((page) => {
            const active = isSectionActive(page.slug);
            return (
              <li key={page.slug}>
                <a
                  href={hrefFor(page.slug)}
                  className={`mobile-nav-item ${active ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); onNavigate(page.slug); }}
                  aria-current={active ? 'page' : undefined}
                >
                  {navLabels[page.slug] || page.title}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mobile-overlay-footer">
        <LangSwitch lang={lang} onLangChange={(code) => { onLangChange(code); onClose(); }} label={labels.language} className="mobile-lang" />
        <PageQrButton lang={lang} variant="row" />
        {sessionUser ? (
          <div className="mobile-account-card">
            <div className="mobile-account-info">
              <strong>{sessionUser.fullName || account.superAdmin}</strong>
              <small>{sessionUser.role === 'SUPER_ADMIN' ? account.superAdmin : account.editor}</small>
            </div>
            <div className="mobile-account-actions">
              <button type="button" className="mobile-account-btn" onClick={goAdmin}>{account.admin}</button>
              <button type="button" className="mobile-account-btn" onClick={() => { onClose(); onSessionUserChange(null); }}>{account.logout}</button>
            </div>
          </div>
        ) : (
          <button type="button" className="mobile-account-btn mobile-login-entry-btn" onClick={goAdmin}>
            {account.login}
          </button>
        )}
      </div>
    </div>,
    document.body,
  );
}
