import React, { useState, useEffect } from 'react';
import { BrandMark } from './BrandMark';
import { RiSearch2Line, RiMenu4Line } from 'react-icons/ri';
import { PageQrButton } from './PageQrButton';
import { LangSwitch } from './LangSwitch';
import { AccountButton } from './AccountButton';
import { SearchModal } from './SearchModal';
import { MobileMenu } from './MobileMenu';
import { HEADER_LABELS, SHORT_NAV_LABELS } from './headerLabels';
import './Header.css';
import './HeaderOverlays.css';

/*
 * Site header. DOM order: brand, nav, actions (so keyboard order equals visual order).
 * Layout tiers are pure CSS (Header.css): one row >=1360, brand+actions over a nav row 961-1359,
 * hamburger <=960 with the full-screen MobileMenu.
 */
export default function Header({
  navPages,
  activeSlug,
  activePage,
  navLabels,
  lang,
  onLangChange,
  hrefFor = (slug) => (slug === 'home' ? '#' : `#${slug}`),
  sessionUser,
  onSessionUserChange,
  onNavigate,
  searchOpen,
  onToggleSearch,
  query,
  onQueryChange,
  searchResults,
  t,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const labels = HEADER_LABELS[lang] || HEADER_LABELS.kk;
  const shortNavLabels = SHORT_NAV_LABELS[lang] || SHORT_NAV_LABELS.kk;

  // Escape closes overlays; "/" and Ctrl/Cmd+K open search.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (searchOpen) onToggleSearch(false);
        if (mobileOpen) setMobileOpen(false);
      }
      if (
        (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) &&
        !searchOpen &&
        !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)
      ) {
        e.preventDefault();
        onToggleSearch(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, mobileOpen, onToggleSearch]);

  // Lock body scroll while a modal layer is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen || searchOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen, searchOpen]);

  // The mobile menu is meaningless above 960px: close it if the window grows.
  useEffect(() => {
    if (!mobileOpen || !window.matchMedia) return undefined;
    const query960 = window.matchMedia('(min-width: 961px)');
    const onChange = () => { if (query960.matches) setMobileOpen(false); };
    query960.addEventListener?.('change', onChange);
    return () => query960.removeEventListener?.('change', onChange);
  }, [mobileOpen]);

  const isSectionActive = (slug) => {
    if (activeSlug === slug) return true;
    if (activePage?.parent_slug === slug) return true;
    if (slug === 'people' && activeSlug.startsWith('people-')) return true;
    if (slug === 'library' && activeSlug.startsWith('library-vol-')) return true;
    if (slug === 'about' && activeSlug.startsWith('about-')) return true;
    if (slug === 'projects' && activeSlug.startsWith('projects-')) return true;
    return false;
  };

  const handleNavClick = (slug) => {
    onNavigate(slug);
    setMobileOpen(false);
  };

  return (
    <>
      <header className="site-header" role="banner">
        <div className="site-header-inner">
          <a
            className="brand"
            href={hrefFor('home')}
            onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
            aria-label={`${labels.brand} — ${labels.home}`}
          >
            <BrandMark />
            <span className="brand-copy">
              <strong>{labels.brand}</strong>
              <small>{labels.tagline}</small>
            </span>
          </a>

          <nav className="desktop-main-nav" aria-label={labels.mainNav}>
            {navPages.filter((page) => page.slug !== 'home').map((page) => {
              const active = isSectionActive(page.slug);
              return (
                <a
                  key={page.slug}
                  href={hrefFor(page.slug)}
                  className={`nav-link ${active ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); handleNavClick(page.slug); }}
                  aria-current={active ? 'page' : undefined}
                >
                  {shortNavLabels[page.slug] || navLabels[page.slug] || page.title}
                </a>
              );
            })}
          </nav>

          <div className="header-actions">
            <button
              type="button"
              className="header-icon-btn"
              onClick={() => onToggleSearch(!searchOpen)}
              aria-label={labels.search}
              title={`${labels.search} (/)`}
            >
              <RiSearch2Line size={20} aria-hidden="true" />
            </button>
            <span className="header-desktop-only"><PageQrButton lang={lang} /></span>
            <span className="header-desktop-only"><LangSwitch lang={lang} onLangChange={onLangChange} label={labels.language} /></span>
            <span className="header-desktop-only">
              <AccountButton lang={lang} sessionUser={sessionUser} onSessionUserChange={onSessionUserChange} />
            </span>
            <button
              type="button"
              className="mobile-menu-toggle"
              onClick={() => setMobileOpen(true)}
              aria-expanded={mobileOpen}
              aria-haspopup="dialog"
              aria-label={labels.openMenu}
            >
              <RiMenu4Line size={24} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {searchOpen && (
        <SearchModal
          lang={lang}
          query={query}
          onQueryChange={onQueryChange}
          results={searchResults}
          navLabels={navLabels}
          onNavigate={onNavigate}
          onClose={() => onToggleSearch(false)}
          t={t}
        />
      )}

      {mobileOpen && (
        <MobileMenu
          navPages={navPages}
          navLabels={navLabels}
          lang={lang}
          hrefFor={hrefFor}
          isSectionActive={isSectionActive}
          onNavigate={handleNavClick}
          onClose={() => setMobileOpen(false)}
          onLangChange={onLangChange}
          sessionUser={sessionUser}
          onSessionUserChange={onSessionUserChange}
        />
      )}
    </>
  );
}
