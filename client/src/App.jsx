import { useEffect, useMemo, useRef, useState } from 'react';
import {
  PiSunDuotone,
  PiMoonStarsDuotone,
} from 'react-icons/pi';
import {
  RiSearch2Line,
  RiCloseLine,
  RiMenu4Line,
  RiShieldKeyholeLine,
} from 'react-icons/ri';
import {
  INITIAL_SLUG,
  NAV_ORDER,
  NAV_LABELS_MAP,
  UI_TRANSLATIONS,
} from './constants';
import { getPages } from './api';

// Dedicated Sub-Pages
import MonumentPage from './pages/MonumentPage';
import AlleyPage from './pages/AlleyPage';
import CanonPage from './pages/CanonPage';
import LibraryVolumePage from './pages/LibraryVolumePage';
import MuragerlerPage from './pages/MuragerlerPage';
import { LeadershipPage, CharterPage } from './pages/AboutDedicatedPages';

// Modularized Views & Components
import { HomePage } from './pages/HomePage';
import { StandardPage } from './pages/StandardPage';
import { AppleTvMediaGallery } from './components/AppleTvMediaGallery';
import { AdminPanel } from './admin/AdminPanel';
import { AuthView } from './admin/AuthView';

function App() {
  const [pages, setPages] = useState([]);
  const [activeSlug, setActiveSlug] = useState(INITIAL_SLUG);
  const [adminOpen, setAdminOpen] = useState(window.location.hash.startsWith('#admin'));
  const [lang, setLang] = useState(() => localStorage.getItem('kui-lang') || 'kk');
  const [theme, setTheme] = useState(() => localStorage.getItem('kui-theme') || 'light');

  const [sessionUser, setSessionUser] = useState(() => {
    try {
      const raw = sessionStorage.getItem('kui-auth-session');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('kui-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLangChange = (newLang) => {
    setLang(newLang);
    localStorage.setItem('kui-lang', newLang);
  };

  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.kk;
  const navLabels = NAV_LABELS_MAP[lang] || NAV_LABELS_MAP.kk;

  useEffect(() => {
    getPages()
      .then(setPages)
      .catch((error) => setLoadError(error.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleHash = () => {
      const h = window.location.hash;
      setAdminOpen(h.startsWith('#admin'));
      if (h && !h.startsWith('#admin')) {
        const clean = h.replace(/^#\/?/, '');
        if (clean) setActiveSlug(clean);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleSetSessionUser = (user) => {
    setSessionUser(user);
    if (user) {
      sessionStorage.setItem('kui-auth-session', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('kui-auth-session');
    }
  };

  const sortedPages = useMemo(
    () => [...pages].sort((a, b) => a.position - b.position),
    [pages],
  );
  const navPages = useMemo(
    () => [...sortedPages]
      .filter((page) => !page.parent_slug)
      .sort((a, b) => {
        const aOrder = NAV_ORDER.indexOf(a.slug);
        const bOrder = NAV_ORDER.indexOf(b.slug);
        return (aOrder < 0 ? NAV_ORDER.length : aOrder) - (bOrder < 0 ? NAV_ORDER.length : bOrder);
      }),
    [sortedPages],
  );
  const searchResults = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    if (!needle) return [];
    return pages
      .filter((page) => !page.status || page.status === 'published' || sessionUser)
      .filter((page) => `${page.title} ${page.description} ${(page.blocks || []).map((block) => `${block.title} ${block.body}`).join(' ')}`.toLocaleLowerCase().includes(needle));
  }, [pages, query, sessionUser]);

  const activePage = pages.find((page) => page.slug === activeSlug) || pages[0];
  const navigate = (slug) => {
    setActiveSlug(slug);
    setMenuOpen(false);
    if (!window.location.hash.startsWith('#admin')) {
      window.location.hash = slug === 'home' ? '' : `#${slug}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <div className="loading-screen"><span className="brand-mark"><i /><i /><i /></span><p>Жүктелуде…</p></div>;
  }

  if (loadError) {
    return (
      <div className="loading-screen error-screen">
        <span className="brand-mark"><i /><i /><i /></span>
        <h1>Сайтпен байланыс жоқ</h1>
        <p>{loadError}</p>
        <p className="setup-hint">Алдымен серверде PostgreSQL дерекқорын қосып, <code>npm run dev</code> пәрменін орындаңыз.</p>
      </div>
    );
  }

  if (adminOpen) {
    return (
      <AdminPanel
        pages={sortedPages}
        sessionUser={sessionUser}
        onSessionUserChange={handleSetSessionUser}
        onPagesChange={setPages}
        onExit={() => { window.location.hash = ''; }}
        navLabels={navLabels}
      />
    );
  }

  return (
    <div className="site-shell">
      {/* Vintage Paper Texture Overlay */}
      <div className="vintage-parchment-overlay" aria-hidden="true" />

      {/* Authentic Kazakh Vertical Ornamental Flanks on Underlay */}
      <div className="shell-vertical-ornament ornament-left" aria-hidden="true" />
      <div className="shell-vertical-ornament ornament-right" aria-hidden="true" />

      {/* Cultural Heritage Contours (18-19th c. Dombra, Kobyz & Torsyk) on Underlay */}
      <div className="shell-cultural-contours" aria-hidden="true" />

      <header className="site-header">
        <a className="brand" href="#" onClick={(event) => { event.preventDefault(); navigate('home'); }}>
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <span className="brand-copy"><strong>Күй анасы</strong></span>
        </a>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Мәзір">
          {menuOpen ? <RiCloseLine size={24} /> : <RiMenu4Line size={24} />}
        </button>

        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`}>
          {navPages.map((page) => (
            <button key={page.slug} className={page.slug === activePage?.slug ? 'nav-link active' : 'nav-link'} onClick={() => navigate(page.slug)}>
              {navLabels[page.slug] || page.title}
            </button>
          ))}
        </nav>

        <div className="header-actions">
          <div className="header-extra-controls">
            {/* Trilingual switcher */}
            <div className="lang-switcher">
              <button className={`lang-btn ${lang === 'kk' ? 'active' : ''}`} onClick={() => handleLangChange('kk')}>ҚАЗ</button>
              <button className={`lang-btn ${lang === 'ru' ? 'active' : ''}`} onClick={() => handleLangChange('ru')}>РУС</button>
              <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => handleLangChange('en')}>ENG</button>
            </div>

            {/* Dark / Light theme toggle */}
            <button className="theme-toggle-btn" onClick={toggleTheme} title={theme === 'dark' ? 'Жарық тақырып' : 'Қараңғы тақырып'}>
              {theme === 'dark' ? <PiSunDuotone size={19} /> : <PiMoonStarsDuotone size={19} />}
            </button>
          </div>

          <button className="icon-button" aria-label="Іздеу" onClick={() => setSearchOpen(!searchOpen)}><RiSearch2Line size={18} /></button>
        </div>
      </header>

      {searchOpen && (
        <section className="search-wrap">
          <div className="search-bar">
            <RiSearch2Line size={18} />
            <input type="search" placeholder={t.searchPlaceholder} value={query} onChange={(event) => setQuery(event.target.value)} autoFocus />
            {query && <button className="icon-button" onClick={() => setQuery('')}><RiCloseLine size={18} /></button>}
          </div>
          {query.trim() && (
            <div className="search-results">
              {searchResults.length ? searchResults.map((page) => (
                <button key={page.slug} onClick={() => { navigate(page.slug); setSearchOpen(false); setQuery(''); }}>
                  <strong>{page.title}</strong>
                  <span>{navLabels[page.parent_slug] || navLabels[page.slug] || 'Парақша'}</span>
                </button>
              )) : <p>{t.notFound}</p>}
            </div>
          )}
        </section>
      )}

      {activePage && (
        <main>
          {activePage.slug === 'home' ? (
            <HomePage page={activePage} onNavigate={navigate} t={t} navLabels={navLabels} lang={lang} />
          ) : activePage.slug === 'projects-muragerler' ? (
            <MuragerlerPage onNavigate={navigate} lang={lang} t={t} navLabels={navLabels} />
          ) : activePage.slug === 'projects-alley' ? (
            <AlleyPage onNavigate={navigate} lang={lang} t={t} navLabels={navLabels} />
          ) : activePage.slug === 'projects-monument' ? (
            <MonumentPage onNavigate={navigate} lang={lang} t={t} navLabels={navLabels} />
          ) : activePage.slug === 'people-kuyshi' ? (
            <CanonPage type="kuyshi" onNavigate={navigate} lang={lang} t={t} navLabels={navLabels} />
          ) : activePage.slug === 'people-zhyrau' ? (
            <CanonPage type="zhyrau" onNavigate={navigate} lang={lang} t={t} navLabels={navLabels} />
          ) : activePage.slug === 'people-anshi' ? (
            <CanonPage type="anshi" onNavigate={navigate} lang={lang} t={t} navLabels={navLabels} />
          ) : activePage.slug.startsWith('library-vol-') ? (
            <LibraryVolumePage volumeSlug={activePage.slug} onNavigate={navigate} lang={lang} t={t} navLabels={navLabels} />
          ) : activePage.slug === 'about-leadership' ? (
            <LeadershipPage onNavigate={navigate} lang={lang} t={t} navLabels={navLabels} />
          ) : activePage.slug === 'about-charter' ? (
            <CharterPage onNavigate={navigate} lang={lang} t={t} navLabels={navLabels} />
          ) : (
            <StandardPage page={activePage} onNavigate={navigate} query={query} allPages={pages} isEditor={!!sessionUser} t={t} navLabels={navLabels} />
          )}
        </main>
      )}

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <a className="brand" href="#" onClick={(event) => { event.preventDefault(); navigate('home'); }}>
              <span className="brand-mark"><i /><i /><i /></span>
              <span className="brand-copy"><strong>Күй анасы</strong></span>
            </a>
            <p>Қазақтың ұлттық музыкалық мұрасын сақтау, зерттеу және келер ұрпаққа жеткізуге арналған цифрлық бастама.</p>
          </div>
          <div>
            <span className="footer-heading"><PiBookmarksDuotone size={15} style={{ marginRight: 6, verticalAlign: '-2px' }} />Бөлімдер</span>
            <div className="footer-links">
              {navPages.filter((page) => page.slug !== 'home').slice(0, 4).map((page) => (
                <button key={page.slug} onClick={() => navigate(page.slug)}>
                  {navLabels[page.slug] || page.title}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="footer-heading"><PiGearDuotone size={15} style={{ marginRight: 6, verticalAlign: '-2px' }} />Басқару</span>
            <p>Энциклопедия мазмұнын басқару және жаңа парақшалар енгізу.</p>
            <a href="#admin">{t.adminPanel} <RiShieldKeyholeLine size={15} style={{ marginLeft: 6, verticalAlign: '-2px' }} /></a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{t.footerCopy}</span>
          <span>{t.footerDesc}</span>
        </div>
      </footer>
    </div>
  );
}




export default App;
