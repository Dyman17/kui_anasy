import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { BrandMark } from './BrandMark';
import {
  RiSearch2Line,
  RiCloseLine,
  RiMenu4Line,
  RiUser3Line,
  RiShieldKeyholeLine,
  RiArrowRightLine,
  RiLogoutBoxRLine,
  RiBookOpenLine,
} from 'react-icons/ri';
import { PiSunDuotone, PiMoonStarsDuotone } from 'react-icons/pi';

export default function Header({
  navPages,
  activeSlug,
  activePage,
  navLabels,
  lang,
  onLangChange,
  theme,
  onToggleTheme,
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
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const searchInputRef = useRef(null);
  const accountMenuRef = useRef(null);

  // Close menus on Escape key and provide "/" shortcut for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (searchOpen) onToggleSearch(false);
        if (mobileOpen) setMobileOpen(false);
        if (accountMenuOpen) setAccountMenuOpen(false);
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
  }, [searchOpen, mobileOpen, accountMenuOpen, onToggleSearch]);

  // Lock body scroll when mobile navigation or search modal is open
  useEffect(() => {
    if (mobileOpen || searchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen, searchOpen]);

  // Auto-focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 80);
    }
  }, [searchOpen]);

  // Close account menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setAccountMenuOpen(false);
      }
    };
    if (accountMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [accountMenuOpen]);

  // Helper to determine if a main navigation section is active
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

  // Section descriptions for the mobile overlay menu
  const sectionDescriptions = {
    home: { kk: 'Басты парақша және бағдарлама', ru: 'Главная страница и концепция', en: 'Main page & introduction' },
    people: { kk: '101 күйші, 110 жырау, 110 әнші', ru: 'Каноны 101 кюйши, 110 жырау, 110 певцов', en: 'Canons of kuyshi, zhyrau, and singers' },
    heritage: { kk: 'Аудио архив және дәстүрлі музыка', ru: 'Аудиоархив и музыкальное наследие', en: 'Audio archive and living music' },
    projects: { kk: 'Күйшілер аллеясы мен монумент', ru: 'Аллея кюйши и мемориалы', en: 'Kuyshiler Alley and memorials' },
    library: { kk: '3 томдық академиялық басылым', ru: '3-томное академическое издание', en: '3-volume academic publication' },
    about: { kk: 'Қор жарғысы мен ғылыми кеңес', ru: 'Устав фонда и ученый совет', en: 'Charter & advisory board' },
  };

  const accountLabels = {
    kk: { login: 'Кіру', profile: 'Кабинет', logout: 'Шығу', admin: 'Басқару панелі' },
    ru: { login: 'Войти', profile: 'Кабинет', logout: 'Выйти', admin: 'Панель управления' },
    en: { login: 'Sign In', profile: 'Account', logout: 'Sign Out', admin: 'Admin Panel' },
  }[lang] || { login: 'Кіру', profile: 'Кабинет', logout: 'Шығу', admin: 'Басқару панелі' };

  return (
    <>
      <header className="site-header" role="banner">
        {/* Brand Identity: Emblem Rosette + Alistair Signature Lettering */}
        <a
          className="brand"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('home');
          }}
          aria-label="Күй анасы — Басты бетке өту"
        >
          <BrandMark />
          <span className="brand-copy">
            <strong>Күй анасы</strong>
            <small>ЦИФРЛЫҚ ЭНЦИКЛОПЕДИЯ</small>
          </span>
        </a>

        {/* Desktop Main Navigation (Strictly 6 main sections) */}
        <nav className="desktop-main-nav" aria-label="Басты навигация">
          {navPages.map((page) => {
            const active = isSectionActive(page.slug);
            return (
              <button
                key={page.slug}
                className={`nav-link ${active ? 'active' : ''}`}
                onClick={() => handleNavClick(page.slug)}
                aria-current={active ? 'page' : undefined}
              >
                <span>{navLabels[page.slug] || page.title}</span>
              </button>
            );
          })}
        </nav>

        {/* Functional Utilities Toolbar */}
        <div className="header-actions">
          {/* Search Trigger with Keyboard Shortcut Hint */}
          <button
            className="header-action-btn search-trigger-btn"
            onClick={() => onToggleSearch(!searchOpen)}
            aria-label="Іздеу (Қысқа перне: /)"
            title="Іздеу (/)"
          >
            <RiSearch2Line size={17} />
            <span className="shortcut-hint" aria-hidden="true">/</span>
          </button>

          {/* Trilingual Segmented Switcher */}
          <div className="header-lang-switcher" role="group" aria-label="Тіл таңдау">
            <button
              className={`lang-pill ${lang === 'kk' ? 'active' : ''}`}
              onClick={() => onLangChange('kk')}
              aria-pressed={lang === 'kk'}
            >
              ҚАЗ
            </button>
            <button
              className={`lang-pill ${lang === 'ru' ? 'active' : ''}`}
              onClick={() => onLangChange('ru')}
              aria-pressed={lang === 'ru'}
            >
              РУС
            </button>
            <button
              className={`lang-pill ${lang === 'en' ? 'active' : ''}`}
              onClick={() => onLangChange('en')}
              aria-pressed={lang === 'en'}
            >
              ENG
            </button>
          </div>

          {/* Theme Toggle (Күн / Түн) */}
          <button
            className="header-action-btn theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Жарық тақырыпқа ауысу' : 'Қараңғы «Түнгі дала» тақырыбына ауысу'}
            title={theme === 'dark' ? 'Жарық тақырып' : 'Түнгі дала'}
          >
            {theme === 'dark' ? <PiSunDuotone size={18} /> : <PiMoonStarsDuotone size={18} />}
          </button>

          {/* Account Entry Point */}
          <div className="account-dropdown-wrap" ref={accountMenuRef}>
            {sessionUser ? (
              <>
                <button
                  className="header-account-btn logged-in"
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  aria-expanded={accountMenuOpen}
                  aria-haspopup="true"
                  title={sessionUser.fullName || 'Пайдаланушы'}
                >
                  <span className="account-avatar-dot" aria-hidden="true" />
                  <span className="account-name-short">
                    {sessionUser.fullName ? sessionUser.fullName.split(' ')[0] : 'Әкімші'}
                  </span>
                </button>

                {accountMenuOpen && (
                  <div className="account-popover-menu" role="menu">
                    <div className="popover-user-info">
                      <strong>{sessionUser.fullName || 'Бас әкімші'}</strong>
                      <span className="popover-role-badge">
                        {sessionUser.role === 'SUPER_ADMIN' ? 'Бас әкімші' : 'Редактор'}
                      </span>
                    </div>
                    <div className="popover-divider" />
                    <button
                      className="popover-item"
                      role="menuitem"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        window.location.hash = '#admin';
                      }}
                    >
                      <RiShieldKeyholeLine size={16} />
                      <span>{accountLabels.admin}</span>
                    </button>
                    <button
                      className="popover-item logout-item"
                      role="menuitem"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        onSessionUserChange(null);
                      }}
                    >
                      <RiLogoutBoxRLine size={16} />
                      <span>{accountLabels.logout}</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button
                className="header-account-btn login-btn"
                onClick={() => { window.location.hash = '#admin'; }}
                title="Әкімшілік кіру"
                aria-label="Әкімшілік панельге кіру"
              >
                <RiUser3Line size={16} />
                <span className="account-login-text">{accountLabels.login}</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileOpen(true)}
            aria-expanded={mobileOpen}
            aria-label="Навигация мәзірін ашу"
          >
            <RiMenu4Line size={22} />
          </button>
        </div>
      </header>

      {/* Accessible Search Overlay / Modal (Portaled above all content & rails) */}
      {searchOpen && typeof document !== 'undefined' && createPortal(
        <div className="search-modal-backdrop" onClick={() => onToggleSearch(false)}>
          <div
            className="search-modal-card"
            role="dialog"
            aria-modal="true"
            aria-label="Сайт бойынша іздеу"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="search-modal-header">
              <RiSearch2Line size={20} className="search-modal-icon" />
              <input
                ref={searchInputRef}
                type="search"
                className="search-modal-input"
                placeholder={t.searchPlaceholder}
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                aria-label="Іздеу сұранысы"
              />
              <button
                className="search-modal-close"
                onClick={() => onToggleSearch(false)}
                aria-label="Іздеуді жабу (Esc)"
              >
                <RiCloseLine size={20} />
              </button>
            </div>

            <div className="search-modal-body">
              {query.trim() ? (
                searchResults.length > 0 ? (
                  <div className="search-results-list" role="listbox">
                    {searchResults.map((page) => (
                      <button
                        key={page.slug}
                        className="search-result-item"
                        onClick={() => {
                          onNavigate(page.slug);
                          onToggleSearch(false);
                          onQueryChange('');
                        }}
                      >
                        <div className="result-info">
                          <strong className="result-title">{page.title}</strong>
                          <span className="result-category">
                            {navLabels[page.parent_slug] || navLabels[page.slug] || 'Парақша'}
                          </span>
                        </div>
                        <RiArrowRightLine size={16} className="result-arrow" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="search-empty-state">
                    <p>{t.notFound}</p>
                    <small>Басқа атаумен немесе күйші есімімен қайталап көріңіз.</small>
                  </div>
                )
              ) : (
                <div className="search-hints-box">
                  <span className="hints-label">Жиі ізделетін бөлімдер:</span>
                  <div className="hints-pills">
                    <button onClick={() => { onNavigate('people-kuyshi'); onToggleSearch(false); }}>101 Күйші</button>
                    <button onClick={() => { onNavigate('projects-alley'); onToggleSearch(false); }}>Күйшілер аллеясы</button>
                    <button onClick={() => { onNavigate('library-vol-1'); onToggleSearch(false); }}>I том · Күй әлемі</button>
                    <button onClick={() => { onNavigate('about-leadership'); onToggleSearch(false); }}>Ғылыми кеңес</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Full-Screen Mobile Navigation Overlay (Portaled above all content & rails) */}
      {mobileOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="mobile-nav-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Негізгі мәзір"
        >
          {/* Overlay Top Bar */}
          <div className="mobile-overlay-header">
            <a
              className="brand"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('home');
              }}
            >
              <BrandMark />
              <span className="brand-copy">
                <strong>Күй анасы</strong>
              </span>
            </a>

            <button
              className="mobile-overlay-close-btn"
              onClick={() => setMobileOpen(false)}
              aria-label="Мәзірді жабу (Esc)"
            >
              <RiCloseLine size={24} />
            </button>
          </div>

          {/* Overlay Navigation Links with Museum Typographic Polish */}
          <nav className="mobile-overlay-nav">
            <span className="mobile-nav-heading">МӘЗІР БӨЛІМДЕРІ</span>
            <div className="mobile-nav-list">
              {navPages.map((page, index) => {
                const active = isSectionActive(page.slug);
                const desc = sectionDescriptions[page.slug]?.[lang] || sectionDescriptions[page.slug]?.kk || '';
                return (
                  <button
                    key={page.slug}
                    className={`mobile-nav-item ${active ? 'active' : ''}`}
                    onClick={() => handleNavClick(page.slug)}
                    aria-current={active ? 'page' : undefined}
                  >
                    <div className="mobile-item-left">
                      <span className="mobile-item-num">0{index + 1}</span>
                      <div className="mobile-item-copy">
                        <strong className="mobile-item-title">{navLabels[page.slug] || page.title}</strong>
                        {desc && <span className="mobile-item-desc">{desc}</span>}
                      </div>
                    </div>
                    <RiArrowRightLine size={18} className="mobile-item-arrow" />
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Overlay Bottom Utility Bar */}
          <div className="mobile-overlay-footer">
            <div className="mobile-footer-row">
              {/* Language Switcher */}
              <div className="header-lang-switcher mobile-lang" role="group" aria-label="Тіл таңдау">
                <button
                  className={`lang-pill ${lang === 'kk' ? 'active' : ''}`}
                  onClick={() => onLangChange('kk')}
                >
                  ҚАЗ
                </button>
                <button
                  className={`lang-pill ${lang === 'ru' ? 'active' : ''}`}
                  onClick={() => onLangChange('ru')}
                >
                  РУС
                </button>
                <button
                  className={`lang-pill ${lang === 'en' ? 'active' : ''}`}
                  onClick={() => onLangChange('en')}
                >
                  ENG
                </button>
              </div>

              {/* Theme Toggle Button */}
              <button
                className="header-action-btn mobile-theme-btn"
                onClick={onToggleTheme}
                aria-label="Тақырыпты өзгерту"
              >
                {theme === 'dark' ? <PiSunDuotone size={20} /> : <PiMoonStarsDuotone size={20} />}
                <span>{theme === 'dark' ? 'Жарық' : 'Түнгі дала'}</span>
              </button>
            </div>

            {/* Account Entry Button */}
            <div className="mobile-footer-account">
              {sessionUser ? (
                <div className="mobile-account-card">
                  <div className="mobile-account-info">
                    <strong>{sessionUser.fullName || 'Бас әкімші'}</strong>
                    <small>{sessionUser.role === 'SUPER_ADMIN' ? 'Бас әкімші' : 'Редактор'}</small>
                  </div>
                  <div className="mobile-account-actions">
                    <button
                      className="mobile-account-admin-btn"
                      onClick={() => {
                        setMobileOpen(false);
                        window.location.hash = '#admin';
                      }}
                    >
                      {accountLabels.admin}
                    </button>
                    <button
                      className="mobile-account-logout-btn"
                      onClick={() => {
                        setMobileOpen(false);
                        onSessionUserChange(null);
                      }}
                    >
                      <RiLogoutBoxRLine size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="mobile-login-entry-btn"
                  onClick={() => {
                    setMobileOpen(false);
                    window.location.hash = '#admin';
                  }}
                >
                  <RiUser3Line size={18} />
                  <span>{accountLabels.login} — Әкімшілік панель</span>
                </button>
              )}
            </div>

            <div className="mobile-overlay-watermark">
              <span>КҮЙ АНАСЫ ҚОРЫ · 2026</span>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
