import { useEffect, useMemo, useRef, useState } from 'react';
import {
  NAV_ORDER,
  NAV_LABELS_MAP,
  UI_TRANSLATIONS,
} from './constants';
import { getPages, logoutSession } from './api';

// Dedicated Sub-Pages
import MonumentPage from './pages/MonumentPage';
import AlleyPage from './pages/AlleyPage';
import CanonPage from './pages/CanonPage';
import LibraryVolumePage from './pages/LibraryVolumePage';
import MuragerlerPage from './pages/MuragerlerPage';
import { LeadershipPage, CharterPage } from './pages/AboutDedicatedPages';

// Modularized Views & Components
import OrnamentRail from './components/OrnamentRail';
import Header from './components/Header';
import { Footer } from './components/Footer';
import { BrandMark } from './components/BrandMark';
import { HomePage } from './pages/HomePage';
import { StandardPage } from './pages/StandardPage';
import { AdminPanel } from './admin/AdminPanel';
import { NotFoundPage } from './pages/NotFoundPage';
import { useRoute, navigate as routerNavigate, buildHref } from './app/router';
import { useDocumentMeta } from './app/useDocumentMeta';

const LANGS = ['kk', 'ru', 'en'];
const SKIP_LABELS = { kk: 'Негізгі мазмұнға өту', ru: 'Перейти к содержанию', en: 'Skip to content' };
const VOLUME_SLUGS = ['library-vol-1', 'library-vol-2', 'library-vol-3'];

function readStored(key, fallback, allowed) {
  try {
    const value = localStorage.getItem(key);
    return value && (!allowed || allowed.includes(value)) ? value : fallback;
  } catch {
    return fallback;
  }
}

function writeStored(key, value) {
  try { localStorage.setItem(key, value); } catch { /* storage unavailable */ }
}

function App() {
  const [pages, setPages] = useState([]);
  const route = useRoute();
  const activeSlug = route.slug;
  const adminOpen = route.admin;
  const [lang, setLang] = useState(() => route.lang || readStored('kui-lang', 'kk', LANGS));

  const [sessionUser, setSessionUser] = useState(() => {
    try {
      const raw = sessionStorage.getItem('kui-auth-session');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);

  // The site has a single dark «Түнгі дала» look (owner decision, 05.11.2026).
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    try { localStorage.removeItem('kui-theme'); } catch { /* storage unavailable */ }
  }, []);

  const handleLangChange = (newLang) => {
    setLang(newLang);
    writeStored('kui-lang', newLang);
    // Keep an explicit language prefix in the URL in sync with the switcher.
    if (route.lang && !route.admin) routerNavigate(route.slug, newLang);
  };

  const handleToggleSearch = (open) => {
    setSearchOpen(open);
    if (!open) setQuery('');
  };

  // A language prefix in the URL wins over the stored preference.
  useEffect(() => {
    if (route.lang && route.lang !== lang) {
      setLang(route.lang);
      writeStored('kui-lang', route.lang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.lang]);

  // Back/Forward and link navigation land at the top of the page.
  const firstRoute = useRef(true);
  useEffect(() => {
    if (firstRoute.current) { firstRoute.current = false; return; }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [route.slug, route.admin]);

  useEffect(() => {
    getPages()
      .then(setPages)
      .catch((error) => setLoadError(error.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSetSessionUser = (user) => {
    if (!user && sessionUser?.token) logoutSession(sessionUser.token);
    setSessionUser(user);
    if (user) {
      try { sessionStorage.setItem('kui-auth-session', JSON.stringify(user)); } catch { /* storage unavailable */ }
    } else {
      try { sessionStorage.removeItem('kui-auth-session'); } catch { /* storage unavailable */ }
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

  const activePage = pages.find((page) => page.slug === activeSlug) || null;
  const navigate = (slug) => routerNavigate(slug, route.lang);

  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.kk;
  const navLabels = NAV_LABELS_MAP[lang] || NAV_LABELS_MAP.kk;

  let metaTitle = t.siteTitle ? `${t.siteTitle} — ${t.brandSubtitle}` : '';
  let metaSuffix = '';
  if (adminOpen) {
    metaTitle = t.adminPanel;
    metaSuffix = t.siteTitle;
  } else if (activePage && activePage.slug !== 'home') {
    metaTitle = navLabels[activePage.slug] || activePage.title;
    metaSuffix = t.siteTitle;
  } else if (!activePage && !loading && !loadError) {
    metaTitle = t.notFoundTitle;
    metaSuffix = t.siteTitle;
  }
  useDocumentMeta({ title: metaTitle, suffix: metaSuffix, lang });

  if (loading) {
    return <div className="loading-screen"><BrandMark /><p>Жүктелуде…</p></div>;
  }

  if (loadError) {
    return (
      <div className="loading-screen error-screen">
        <BrandMark />
        <h1>Сайтпен байланыс жоқ</h1>
        <p>{loadError}</p>
        <p className="setup-hint">Алдымен серверде PostgreSQL дерекқорын қосып, <code>npm run dev</code> пәрменін орындаңыз.</p>
      </div>
    );
  }

  if (adminOpen) {
    return (
      <AdminPanel
        sessionUser={sessionUser}
        onSessionUserChange={handleSetSessionUser}
        onPagesChange={setPages}
        onExit={() => { window.location.hash = ''; }}
        navLabels={navLabels}
      />
    );
  }

  return (
    <>
      {/* Kazakh national ornament rail (24px desktop / 16px mobile) */}
      <OrnamentRail />

      <div className="site-shell">
        <a
          className="skip-link"
          href="#main-content"
          onClick={(e) => { e.preventDefault(); document.getElementById('main-content')?.focus(); }}
        >
          {SKIP_LABELS[lang] || SKIP_LABELS.kk}
        </a>
        <Header
          navPages={navPages}
          activeSlug={activeSlug}
          activePage={activePage}
          navLabels={navLabels}
          lang={lang}
          onLangChange={handleLangChange}
          hrefFor={(slug) => buildHref(slug, route.lang)}
          sessionUser={sessionUser}
          onSessionUserChange={handleSetSessionUser}
          onNavigate={navigate}
          searchOpen={searchOpen}
          onToggleSearch={handleToggleSearch}
          query={query}
          onQueryChange={setQuery}
          searchResults={searchResults}
          t={t}
        />

      <main id="main-content" tabIndex={-1}>
        {!activePage ? (
          <NotFoundPage onNavigate={navigate} t={t} />
        ) : (
          <>
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
          ) : VOLUME_SLUGS.includes(activePage.slug) ? (
            <LibraryVolumePage volumeSlug={activePage.slug} onNavigate={navigate} lang={lang} t={t} navLabels={navLabels} />
          ) : activePage.slug === 'about-leadership' ? (
            <LeadershipPage onNavigate={navigate} lang={lang} t={t} navLabels={navLabels} />
          ) : activePage.slug === 'about-charter' ? (
            <CharterPage onNavigate={navigate} lang={lang} t={t} navLabels={navLabels} />
          ) : (
            <StandardPage page={activePage} onNavigate={navigate} allPages={pages} isEditor={!!sessionUser} t={t} navLabels={navLabels} />
          )}
          </>
        )}
      </main>

      <Footer
        navPages={navPages}
        navLabels={navLabels}
        lang={lang}
        hrefFor={(slug) => buildHref(slug, route.lang)}
        onNavigate={navigate}
        t={t}
      />
    </div>
    </>
  );
}


export default App;
