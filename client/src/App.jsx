import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight,
  Check, Eye, FilePlus2, FolderOpen, LockKeyhole, Menu, Pencil, Plus, RotateCcw, Save, Search, ShieldCheck, Trash2, UserCheck, Users, X,
} from 'lucide-react';
import QRCode from 'qrcode';
import {
  approveEditorAccount,
  bulkApprovePages,
  createPage,
  deleteEditorAccount,
  getAdminAccounts,
  getPages,
  loginEditor,
  registerEditor,
  resetLocalPages,
  savePage,
  verifySuperAdmin,
} from './api.js';

const INITIAL_SLUG = 'home';
const BLOCK_TYPES = [
  ['heading', 'Бөлім тақырыбы'],
  ['text', 'Мәтін'],
  ['feature', 'Ерекше тақырып'],
  ['quote', 'Дәйексөз'],
  ['image', 'Сурет'],
  ['list', 'Тізім'],
  ['stats', 'Сандар'],
  ['cards', 'Карточкалар'],
  ['callout', 'Екпінді блок'],
  ['qr', 'QR сілтеме'],
];
const NAV_ORDER = ['home', 'people', 'heritage', 'projects', 'about', 'library'];
const NAV_LABELS = {
  home: 'Басты бет',
  people: 'Тұлғалар',
  heritage: 'Музыкалық мұра',
  projects: 'Жобалар',
  about: 'Қор туралы',
  library: 'Цифрлық кітапхана',
};

const PARENT_SECTIONS = [
  { slug: 'people', title: 'Тұлғалар (күйшілер, жыраулар, әншілер)' },
  { slug: 'heritage', title: 'Музыкалық мұра (күйлер, әндер, сарындар)' },
  { slug: 'projects', title: 'Жобалар (мәдени бастамалар, аллеялар)' },
  { slug: 'library', title: 'Цифрлық кітапхана (кітаптар, жинақтар)' },
  { slug: 'about', title: 'Қор туралы (ұйым, қызмет)' },
];

function App() {
  const [pages, setPages] = useState([]);
  const [activeSlug, setActiveSlug] = useState(INITIAL_SLUG);
  const [adminOpen, setAdminOpen] = useState(window.location.hash.startsWith('#admin'));
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
    getPages()
      .then(setPages)
      .catch((error) => setLoadError(error.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleHash = () => setAdminOpen(window.location.hash.startsWith('#admin'));
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
      />
    );
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#" onClick={(event) => { event.preventDefault(); navigate('home'); }}>
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <span className="brand-copy"><strong>Күй анасы</strong></span>
        </a>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Мәзір">
          {menuOpen ? <X /> : <Menu />}
        </button>
        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`}>
          {navPages.map((page) => (
            <button key={page.slug} className={page.slug === activePage?.slug ? 'nav-link active' : 'nav-link'} onClick={() => navigate(page.slug)}>
              {NAV_LABELS[page.slug] || page.title}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <button className="icon-button" aria-label="Іздеу" onClick={() => setSearchOpen(!searchOpen)}><Search size={19} /></button>
        </div>
      </header>

      {searchOpen && (
        <section className="search-wrap">
          <div className="search-bar">
            <Search size={18} />
            <input type="search" placeholder="Тұлғаларды, күйлерді немесе материалдарды іздеу..." value={query} onChange={(event) => setQuery(event.target.value)} autoFocus />
            {query && <button className="icon-button" onClick={() => setQuery('')}><X size={17} /></button>}
          </div>
          {query.trim() && (
            <div className="search-results">
              {searchResults.length ? searchResults.map((page) => (
                <button key={page.slug} onClick={() => { navigate(page.slug); setSearchOpen(false); setQuery(''); }}>
                  <strong>{page.title}</strong>
                  <span>{NAV_LABELS[page.parent_slug] || NAV_LABELS[page.slug] || 'Парақша'}</span>
                </button>
              )) : <p>Нәтиже табылмады.</p>}
            </div>
          )}
        </section>
      )}

      {activePage && (
        <main>
          {activePage.slug === 'home' ? (
            <HomePage page={activePage} onNavigate={navigate} />
          ) : (
            <StandardPage page={activePage} onNavigate={navigate} query={query} allPages={pages} isEditor={!!sessionUser} />
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
          <div><span className="footer-heading">Бөлімдер</span><div className="footer-links">
            {navPages.filter((page) => page.slug !== 'home').slice(0, 4).map((page) => <button key={page.slug} onClick={() => navigate(page.slug)}>{NAV_LABELS[page.slug] || page.title}</button>)}
          </div></div>
          <div><span className="footer-heading">Басқару</span><p>Энциклопедия мазмұнын басқару және жаңа парақшалар енгізу.</p><a href="#admin">Әкімшілік панельге өту <ArrowUpRight size={14} /></a></div>
        </div>
        <div className="footer-bottom"><span>© 2026 «КҮЙ АНАСЫ» жеке қоры</span><span>Қазақ музыкасының цифрлық энциклопедиясы</span></div>
      </footer>
    </div>
  );
}

function HomePage({ page, onNavigate }) {
  const blocks = page.blocks || [];
  const intro = blocks.find((block) => block.type === 'quote');
  const stats = blocks.find((block) => block.type === 'stats');
  const feature = blocks.find((block) => block.type === 'feature');
  const latest = blocks.find((block) => block.type === 'cards');

  return (
    <>
      <section className="archive-hero content-width">
        <div className="archive-hero-copy">
          <p className="hero-kicker">Қазақ музыка мұрасының цифрлық орталығы</p>
          <h1>Күй анасы.<br /><em>Ұлы дала әуені.</em></h1>
          <p>{page.description}</p>
          <p className="hero-english">Kazakh music, its people and living traditions.</p>
          <div className="hero-actions">
            <button className="button button-dark" onClick={() => onNavigate('people')}>Тұлғалар бөлімі <ArrowRight size={17} /></button>
            <button className="text-button" onClick={() => onNavigate('heritage')}>Музыкалық мұра <ArrowUpRight size={16} /></button>
          </div>
        </div>
        <figure className="hero-image">
          <img src="/images/kuyshiler-alley.jpg" alt="Астана қаласындағы Күйшілер аллеясы ұлттық музыка тұлғаларына арналған мәдени кеңістік" />
          <figcaption><strong>Күйшілер аллеясы</strong><span>Астана · Қазақстан</span></figcaption>
        </figure>
      </section>

      {/* Дина Нұрпейісова блогы - басты беттің жоғарғы жағына шығарылды */}
      {feature && (
        <section className="featured-person">
          <figure className="featured-person-image"><img src="/images/dina-monument.jpg" alt="Дина Нұрпейісова ескерткіші" /><figcaption>Дина Нұрпейісова ескерткіші · Астана</figcaption></figure>
          <div className="featured-person-copy"><span className="hero-kicker">ТҰЛҒА · {feature.eyebrow || '1861 — 1955'}</span><h2>{feature.title}</h2><p>{feature.body}</p><button className="underlined-link" onClick={() => onNavigate('people')}>Тұлғалар каталогы <ArrowRight size={15} /></button></div>
          <span className="featured-person-pattern" aria-hidden="true" />
        </section>
      )}

      {stats && <section className="archive-stats content-width"><h2>Бір мұра.<br /><strong>Үш дәстүр.</strong></h2>{stats.items?.map((item) => <div className="archive-stat-row" key={item.label}><strong>{item.value}</strong><p>{item.label}</p></div>)}</section>}

      {intro && (
        <section className="editorial-intro content-width">
          <div className="intro-copy"><h2>{intro.title}</h2><p>{intro.body}</p><button className="underlined-link" onClick={() => onNavigate('about')}>Қор туралы <ArrowRight size={15} /></button></div>
          <figure className="intro-artwork">
            <img src="/images/dombra-player-illustration.png" alt="Домбырашының көркем бейнесі" loading="lazy" />
            <figcaption>КӨРКЕМ БЕЙНЕ · АТРИБУЦИЯ ЖОҚ</figcaption>
          </figure>
          <span className="intro-pattern" aria-hidden="true" />
        </section>
      )}

      {latest && (
        <section className="discover-section content-width">
          <div className="section-topline"><h2>{latest.title}</h2><button className="underlined-link" onClick={() => onNavigate('library')}>Кітапханаға өту <ArrowRight size={15} /></button></div>
          <div className="discover-spread">
            {(latest.items || []).slice(0, 3).map((item, index) => (
              <button className="discover-card" key={item.title} onClick={() => onNavigate(item.slug || 'heritage')}>
                <img src={['/images/book-kui-alemi.jpg', '/images/book-gasyrlar-uni.jpg', '/images/book-uly-dala-aueni.jpg'][index]} alt="" />
                <span className="discover-card-copy">
                  <span>{item.meta}</span>
                  <strong>{item.title}</strong>
                  <span className="discover-description">{item.description}</span>
                </span>
                <ArrowUpRight size={22} />
              </button>
            ))}
          </div>
        </section>
      )}
      <Callout onNavigate={onNavigate} />
    </>
  );
}

function StandardPage({ page, onNavigate, query, allPages = [], isEditor = false }) {
  const relevantBlocks = (page.blocks || []).filter((block) => !query || `${block.title} ${block.body}`.toLowerCase().includes(query.toLowerCase()));
  const parentCategory = PARENT_SECTIONS.find((p) => p.slug === page.parent_slug);
  const themeSlug = page.parent_slug || page.slug;
  const subpages = allPages.filter((p) => p.parent_slug === page.slug && (isEditor || !p.status || p.status === 'published'));

  return (
    <>
      <section className={`page-banner page-banner-${themeSlug}`} data-section={themeSlug}>
        <SectionMotif slug={themeSlug} />
        <div className="page-banner-image"><img src={getSectionImage(themeSlug)} alt="" /></div>
        <div className="content-width page-banner-inner">
          {page.parent_slug && (
            <span className="block-kicker banner-parent-kicker">
              {NAV_LABELS[page.parent_slug] || parentCategory?.title}
            </span>
          )}
          <h1>{NAV_LABELS[page.slug] || page.title}</h1>
          <p>{page.description}</p>
          <div className="breadcrumb">
            <button onClick={() => onNavigate('home')}>Басты бет</button>
            <span>/</span>
            {page.parent_slug && (
              <>
                <button onClick={() => onNavigate(page.parent_slug)}>
                  {NAV_LABELS[page.parent_slug] || parentCategory?.title}
                </button>
                <span>/</span>
              </>
            )}
            <span>{NAV_LABELS[page.slug] || page.title}</span>
          </div>
        </div>
      </section>
      <section className="editorial content-width">
        {relevantBlocks.map((block, index) => <ContentBlock key={block.id || index} block={block} index={index} pageSlug={themeSlug} />)}
        {relevantBlocks.length === 0 && <p className="empty-search">Сұрауыңыз бойынша ақпарат табылмады.</p>}

        {subpages.length > 0 && !query && (
          <div className="subpages-container">
            <div className="section-topline">
              <div>
                <span className="block-kicker">ОСЫ БӨЛІМДЕГІ БЕТТЕР</span>
                <h2>Бөлім материалдары ({subpages.length})</h2>
              </div>
            </div>
            <div className="subpages-grid">
              {subpages.map((sub) => (
                <article key={sub.slug} className="subpage-card" onClick={() => onNavigate(sub.slug)}>
                  <div className="subpage-card-header">
                    <span className="subpage-badge">{NAV_LABELS[page.slug] || page.title}</span>
                    <small>{sub.blocks?.length || 0} модуль</small>
                  </div>
                  <h3>{sub.title}</h3>
                  <p>{sub.description || 'Толық мазмұнын ашу үшін басыңыз.'}</p>
                  <span className="subpage-read-link">Оқу <ArrowRight size={14} /></span>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
      <Callout onNavigate={onNavigate} />
    </>
  );
}

function getSectionImage(slug) {
  const images = {
    people: '/images/dina-monument.jpg',
    heritage: '/images/dombra-player-illustration.png',
    library: '/images/book-kui-alemi.jpg',
    projects: '/images/kuyshiler-alley.jpg',
    about: '/images/dina-monument.jpg',
  };
  return images[slug] || '/images/kuyshiler-alley.jpg';
}

function SectionMotif({ slug }) {
  if (slug === 'heritage') {
    return <svg className="section-motif motif-wave-banner" viewBox="0 0 520 230" aria-hidden="true"><path d="M-20 165C45 165 45 45 110 45s65 120 130 120 65-120 130-120 65 120 170 120" /></svg>;
  }
  return null;
}

function ContentBlock({ block, index, pageSlug }) {
  if (block.type === 'quote') {
    return (
      <figure className="editorial-quote">
        <p>«{block.body}»</p>
        <cite>{block.title}</cite>
      </figure>
    );
  }
  if (block.type === 'stats') {
    return (
      <div className="editorial-stats">
        {(block.items || []).map((item, itemIndex) => (
          <div key={item.label || itemIndex}>
            <span>{String(itemIndex + 1).padStart(2, '0')}</span>
            <strong>{item.value}</strong>
            <p>{item.label}</p>
          </div>
        ))}
      </div>
    );
  }
  if (block.type === 'cards') {
    return (
      <section className="editorial-cards">
        <h2>{block.title}</h2>
        <p>{block.body}</p>
        <div className="mini-card-grid">
          {(block.items || []).map((card, cardIndex) => (
            <article className="mini-card" key={card.title || cardIndex}>
              <div className="mini-card-image"><img src={['/images/book-kui-alemi.jpg', '/images/book-gasyrlar-uni.jpg', '/images/book-uly-dala-aueni.jpg'][cardIndex % 3]} alt="" /></div>
              <span>{card.meta}</span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }
  if (block.type === 'callout') {
    return (
      <div className="editorial-callout">
        {block.eyebrow && <span className="block-kicker">{block.eyebrow}</span>}
        <h2>{block.title}</h2>
        <p>{block.body}</p>
        {block.link && <a className="underlined-link" href={block.link} target="_blank" rel="noreferrer">{block.linkLabel || 'Толығырақ'} <ArrowRight size={14} /></a>}
      </div>
    );
  }
  if (block.type === 'image') {
    return (
      <figure className="editorial-image-block">
        <img src={block.link || '/images/kuyshiler-alley.jpg'} alt={block.title || ''} />
        {block.body && <figcaption>{block.body}</figcaption>}
      </figure>
    );
  }
  if (block.type === 'qr') {
    return <QRBlock block={block} />;
  }
  if (block.type === 'list') {
    return (
      <div className="editorial-list-block">
        <h2>{block.title}</h2>
        {block.body && <p>{block.body}</p>}
        <ul>{(block.items || []).map((item, idx) => <li key={idx}>{item.text}</li>)}</ul>
      </div>
    );
  }
  return (
    <article className={`editorial-block ${index % 2 === 1 ? 'block-offset' : ''}`}>
      {block.eyebrow && <span className="block-kicker">{block.eyebrow}</span>}
      <h2>{block.title}</h2>
      <p>{block.body}</p>
    </article>
  );
}

function QRBlock({ block }) {
  const [dataUrl, setDataUrl] = useState('');
  useEffect(() => {
    if (block.link) {
      QRCode.toDataURL(block.link, { width: 256, margin: 2 }).then(setDataUrl).catch(() => {});
    }
  }, [block.link]);
  return (
    <div className="qr-block">
      {dataUrl ? <img src={dataUrl} alt="QR Code" /> : <div className="qr-placeholder">QR код дайындалуда…</div>}
      <figcaption>{block.title || 'Сілтеме QR коды'}</figcaption>
      {block.link && <a href={block.link} target="_blank" rel="noreferrer">{block.link}</a>}
    </div>
  );
}

function Callout({ onNavigate }) {
  return (
    <section className="callout">
      <div className="callout-content">
        <h2>Қазақ музыкасының үш томдық жинағы.</h2>
        <p>Күй өнері, жыраулық дәстүр мен әншілік мектептер туралы зерттеу материалдары.</p>
        <button className="button button-dark" onClick={() => onNavigate('library')}>Кітапхананы қарау <ArrowRight size={16} /></button>
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// ADMIN PANEL COMPONENT WITH 2 ROLES & ADVANCED APPROVAL WORKFLOW
// -------------------------------------------------------------
function AdminPanel({ pages, sessionUser, onSessionUserChange, onPagesChange, onExit }) {
  const [route, setRoute] = useState(window.location.hash || '#admin');
  const [draft, setDraft] = useState(() => createEmptyPage(pages.filter((p) => p.is_custom).length));
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedSlugs, setSelectedSlugs] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'published'
  const [accounts, setAccounts] = useState(() => getAdminAccounts());

  const isSuperAdmin = sessionUser?.role === 'SUPER_ADMIN';
  const customPages = pages.filter((page) => page.is_custom);
  const editingSlug = route.startsWith('#admin/edit/') ? route.slice('#admin/edit/'.length) : '';
  const activePage = customPages.find((page) => page.slug === editingSlug);
  const pendingAccounts = accounts.filter((a) => a.status === 'pending');

  useEffect(() => {
    const handleHash = () => setRoute(window.location.hash || '#admin');
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    if (route === '#admin') setDraft(createEmptyPage(customPages.length));
    else if (activePage) setDraft(structuredClone(activePage));
    else setDraft(null);
    setPreviewOpen(false);
    setError('');
    setNotice('');
  }, [route, activePage?.slug]);

  const updateDraft = (key, value) => setDraft((current) => ({ ...current, [key]: value }));
  const updateBlock = (id, key, value) => setDraft((current) => ({
    ...current,
    blocks: current.blocks.map((block) => block.id === id ? { ...block, [key]: value } : block),
  }));
  const updateBlockItems = (id, items) => updateBlock(id, 'items', items);
  const updateBlockItem = (block, itemIndex, key, value) => updateBlockItems(
    block.id,
    (block.items || []).map((item, index) => index === itemIndex ? { ...item, [key]: value } : item),
  );

  const handleSave = async () => {
    setError('');
    setNotice('');
    if (!draft?.title.trim()) {
      setError('Бет атауын енгізіңіз.');
      return;
    }
    const slug = draft.slug || toSlug(draft.title);
    if (!slug) {
      setError('Бет атауын латын әрпімен немесе кириллицамен енгізіңіз.');
      return;
    }
    setSaving(true);
    try {
      const now = new Date().toISOString();
      const isPublishing = isSuperAdmin;
      const payload = {
        ...draft,
        slug,
        title: draft.title.trim(),
        parent_slug: draft.parent_slug || 'people',
        status: isPublishing ? 'published' : 'pending',
        created_by: draft.created_by || (isSuperAdmin ? 'Бас әкімші' : sessionUser?.fullName || 'Редактор'),
        created_at: draft.created_at || now,
        approved_by: isPublishing ? 'Бас әкімші' : draft.approved_by || '',
        approved_at: isPublishing ? now : draft.approved_at || '',
        change_summary: draft.change_summary?.trim() || (draft.slug ? 'Мәтін мен модульдер жаңартылды' : 'Жаңадан жасалған бет'),
      };

      if (draft.slug) {
        const saved = await savePage(payload, sessionUser?.token);
        onPagesChange((current) => current.map((p) => p.slug === saved.slug ? saved : p));
        setDraft(saved);
        setNotice(isPublishing ? 'Бет сәтті бекітілді және жарияланды.' : 'Өзгерістер Бас әкімшінің мақұлдауына жіберілді.');
      } else {
        const saved = await createPage({ ...payload, position: customPages.length }, sessionUser?.token);
        onPagesChange((current) => [...current, saved]);
        window.location.hash = `#admin/edit/${encodeURIComponent(saved.slug)}`;
        setNotice(isPublishing ? 'Жаңа бет жасалып, бірден жарияланды.' : 'Жаңа бет Бас әкімшінің қарауына жіберілді.');
      }
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  // Super Admin: Single Approve
  const handleSingleApprove = async (pageSlug) => {
    const target = customPages.find((p) => p.slug === pageSlug);
    if (!target) return;
    const now = new Date().toISOString();
    const approved = {
      ...target,
      status: 'published',
      approved_by: 'Бас әкімші',
      approved_at: now,
    };
    try {
      await savePage(approved, sessionUser?.token);
      onPagesChange((current) => current.map((p) => p.slug === pageSlug ? approved : p));
      setNotice(`«${target.title}» беті сәтті бекітіліп, жарияланды.`);
    } catch (e) {
      setError(e.message);
    }
  };

  // Super Admin: Bulk Approve
  const handleBulkApprove = () => {
    if (selectedSlugs.length === 0) return;
    const updated = bulkApprovePages(selectedSlugs, 'Бас әкімші');
    onPagesChange(updated);
    setNotice(`Таңдалған ${selectedSlugs.length} бет бір уақытта бекітіліп, жарияланды!`);
    setSelectedSlugs([]);
  };

  // Toggle select page for bulk
  const toggleSelectPage = (slug) => {
    setSelectedSlugs((prev) => prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]);
  };

  const handleSelectAll = (filteredList) => {
    if (selectedSlugs.length === filteredList.length) setSelectedSlugs([]);
    else setSelectedSlugs(filteredList.map((p) => p.slug));
  };

  const handleResetAll = () => {
    if (window.confirm('Барлық сақталған өзгерістер өшіріліп, бастапқы деректер қайтарылады. Жалғастырасыз ба?')) {
      const reset = resetLocalPages();
      onPagesChange(reset);
      setNotice('Деректер бастапқы қалпына келтірілді.');
      setTimeout(() => {
        window.location.hash = '';
        window.location.reload();
      }, 200);
    }
  };

  // Account approvals by Super Admin
  const handleApproveAccount = (accId) => {
    const updated = approveEditorAccount(accId);
    setAccounts(getAdminAccounts());
    setNotice(`${updated.fullName} аккаунтына рұқсат берілді.`);
  };

  const handleDeleteAccount = (accId) => {
    if (window.confirm('Бұл редактордың аккаунтын өшіруді растайсыз ба?')) {
      const updated = deleteEditorAccount(accId);
      setAccounts(updated);
      setNotice('Аккаунт өшірілді.');
    }
  };

  // If not logged in, render the Auth Card
  if (!sessionUser) {
    return <AuthView onLoginSuccess={onSessionUserChange} onExit={onExit} />;
  }

  const filteredPages = customPages.filter((p) => {
    if (statusFilter === 'pending') return p.status === 'pending';
    if (statusFilter === 'published') return p.status === 'published';
    return true;
  });

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <a className="brand" href="#" onClick={(event) => { event.preventDefault(); onExit(); }}>
          <span className="brand-mark">К</span>
          <span className="brand-copy"><strong>Күй анасы</strong><small>КОНСТРУКТОР</small></span>
        </a>
        <nav className="constructor-nav" aria-label="Конструктор">
          <button className={route === '#admin' || route.startsWith('#admin/edit/') ? 'active' : ''} onClick={() => { window.location.hash = '#admin'; }}>Жаңа бет</button>
          <button className={route === '#admin/pages' ? 'active' : ''} onClick={() => { window.location.hash = '#admin/pages'; }}>Менің беттерім <span>{customPages.length}</span></button>
          {isSuperAdmin && (
            <button className={route === '#admin/users' ? 'active' : ''} onClick={() => { window.location.hash = '#admin/users'; }}>
              <Users size={15} /> Әкімшілер {pendingAccounts.length > 0 && <span>{pendingAccounts.length}</span>}
            </button>
          )}
        </nav>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isSuperAdmin ? (
            <span className="admin-role-badge super-badge"><ShieldCheck size={14} /> Бас әкімші</span>
          ) : (
            <span className="admin-role-badge editor-badge"><UserCheck size={14} /> {sessionUser.fullName} (Редактор)</span>
          )}
          <button className="admin-exit" onClick={() => onSessionUserChange(null)} title="Жүйеден шығу">Шығу</button>
          <button className="admin-exit" onClick={onExit}><ArrowLeft size={16} /> Сайт</button>
        </div>
      </header>

      {/* VIEW: USERS MANAGEMENT (Super Admin only) */}
      {route === '#admin/users' && isSuperAdmin ? (
        <main className="pages-manager">
          <div className="pages-manager-heading">
            <div>
              <span className="block-kicker">БАҚЫЛАУ ПАНЕЛІ</span>
              <h1>Әкімшілер мен Редакторлар</h1>
              <p>Сайтқа тіркелген редакторларға рұқсат беру немесе өшіру.</p>
            </div>
          </div>
          {notice && <div className="editor-alert success-alert"><Check size={16} /> {notice}</div>}
          <div className="page-library">
            {accounts.map((acc) => (
              <div key={acc.id} className="account-card">
                <div className="account-info">
                  <h3>{acc.fullName}</h3>
                  <p>Логин: <strong>{acc.username}</strong> · Тіркелген күні: {new Date(acc.registeredAt).toLocaleDateString()}</p>
                </div>
                <div className="account-actions">
                  {acc.status === 'pending' ? (
                    <>
                      <span className="page-status-badge badge-pending">Мақұлдауды күтуде</span>
                      <button className="button button-dark" onClick={() => handleApproveAccount(acc.id)}><Check size={15} /> Рұқсат беру</button>
                    </>
                  ) : (
                    <span className="page-status-badge badge-published">Рұқсат берілген</span>
                  )}
                  <button className="button button-outline" onClick={() => handleDeleteAccount(acc.id)} title="Өшіру"><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        </main>
      ) : route === '#admin/pages' ? (
        /* VIEW: PAGES MANAGER */
        <main className="pages-manager">
          <div className="pages-manager-heading">
            <div>
              <span className="block-kicker">КОНСТРУКТОРДА ЖАСАЛҒАН</span>
              <h1>Менің беттерім</h1>
              <p>Бетті таңдап өңдеңіз, мақұлдаңыз немесе сақтаңыз.</p>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {isSuperAdmin && (
                <button className="button button-outline" type="button" title="Сбросить все изменения" onClick={handleResetAll}>
                  <RotateCcw size={16} /> Бастапқы қалпына келтіру
                </button>
              )}
              <button className="button button-dark" onClick={() => { window.location.hash = '#admin'; }}>
                <FilePlus2 size={17} /> Жаңа бет жасау
              </button>
            </div>
          </div>

          {!isSuperAdmin && (
            <div className="editor-status-notice">
              <strong>Ескертпе:</strong> Сіз Редактор мәртебесіндесіз. Сіз енгізген өзгерістер Бас әкімші бекіткеннен кейін ғана сайтта жарияланады.
            </div>
          )}

          {error && <div className="editor-alert error-alert">{error}</div>}
          {notice && <div className="editor-alert success-alert"><Check size={16} /> {notice}</div>}

          {/* Filter and Bulk Action Toolbar */}
          <div className="page-filter-tabs">
            <button className={statusFilter === 'all' ? 'active' : ''} onClick={() => setStatusFilter('all')}>
              Барлығы ({customPages.length})
            </button>
            <button className={statusFilter === 'pending' ? 'active' : ''} onClick={() => setStatusFilter('pending')}>
              Қаралуда ({customPages.filter((p) => p.status === 'pending').length})
            </button>
            <button className={statusFilter === 'published' ? 'active' : ''} onClick={() => setStatusFilter('published')}>
              Жарияланғандар ({customPages.filter((p) => p.status === 'published').length})
            </button>
          </div>

          {isSuperAdmin && filteredPages.length > 0 && (
            <div className="bulk-toolbar">
              <div className="bulk-selection-info">
                <input
                  type="checkbox"
                  className="page-select-checkbox"
                  checked={selectedSlugs.length > 0 && selectedSlugs.length === filteredPages.length}
                  onChange={() => handleSelectAll(filteredPages)}
                />
                <span>Барлығын таңдау ({selectedSlugs.length} таңдалды)</span>
              </div>
              <button
                className="button button-dark"
                disabled={selectedSlugs.length === 0}
                onClick={handleBulkApprove}
              >
                <Check size={16} /> Таңдалғандарды бірге бекіту ({selectedSlugs.length})
              </button>
            </div>
          )}

          {filteredPages.length ? (
            <div className="page-library">
              {filteredPages.map((page) => (
                <article className="page-library-card" key={page.slug}>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', flex: 1 }}>
                    {isSuperAdmin && (
                      <input
                        type="checkbox"
                        className="page-select-checkbox"
                        checked={selectedSlugs.includes(page.slug)}
                        onChange={() => toggleSelectPage(page.slug)}
                        style={{ marginTop: '6px' }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '4px' }}>
                        <span className="page-library-tag">{NAV_LABELS[page.parent_slug] || page.parent_slug || 'Тұлғалар'}</span>
                        <span className={`page-status-badge ${page.status === 'pending' ? 'badge-pending' : 'badge-published'}`}>
                          {page.status === 'pending' ? 'Қаралуда (Күтуде)' : 'Жарияланған'}
                        </span>
                        <span className="page-library-slug">/{page.slug}</span>
                      </div>
                      <h2>{page.title}</h2>
                      <p>{page.description || 'Қысқаша сипаттамасы жоқ.'}</p>

                      {/* Audit metadata box */}
                      <div className="page-audit-box">
                        <span>👤 <strong>Авторы:</strong> {page.created_by || 'Бас әкімші'} {page.created_at ? `(${new Date(page.created_at).toLocaleString()})` : ''}</span>
                        {page.change_summary && <span>📝 <strong>Өзгерістер:</strong> {page.change_summary}</span>}
                        {page.approved_at && (
                          <span>✅ <strong>Бекіткен:</strong> {page.approved_by || 'Бас әкімші'} ({new Date(page.approved_at).toLocaleString()})</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {isSuperAdmin && page.status === 'pending' && (
                      <button className="button button-dark" onClick={() => handleSingleApprove(page.slug)} title="Бұл бетті бекітіп, жариялау">
                        <Check size={15} /> Бекіту
                      </button>
                    )}
                    <button className="button button-outline" onClick={() => { window.location.hash = `#admin/edit/${encodeURIComponent(page.slug)}`; }}>
                      <Pencil size={15} /> Өңдеу
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="pages-empty">
              <FolderOpen size={34} />
              <h2>Бұл санатта беттер жоқ</h2>
              <p>Жаңа бет құрастырып, сақтаңыз.</p>
              <button className="button button-dark" onClick={() => { window.location.hash = '#admin'; }}><Plus size={16} /> Бет құрастыру</button>
            </div>
          )}
        </main>
      ) : (
        /* VIEW: CONSTRUCTOR / BUILDER WORKSPACE */
        <div className="builder-workspace">
          {!previewOpen && (
            <aside className="builder-sidebar">
              <span className="block-kicker">ҚҰРАСТЫРУ</span>
              <h2>Модульдер</h2>
              <p>Қажетті бөлімді басыңыз — ол бетке қосылады.</p>
              <div className="module-picker">
                {BLOCK_TYPES.map(([type, label]) => (
                  <button key={type} onClick={() => updateDraft('blocks', [...(draft?.blocks || []), createBlock(type)])}>
                    <Plus size={15} /><span>{label}</span>
                  </button>
                ))}
              </div>
            </aside>
          )}

          <main className={`admin-editor builder-canvas ${previewOpen ? 'is-preview' : ''}`}>
            <div className="editor-heading">
              <div>
                <span className="block-kicker">{draft?.slug ? 'БЕТТІ ӨҢДЕУ' : 'ЖАҢА БЕТ'}</span>
                <h1>{draft?.title || 'Атаусыз бет'}</h1>
                {draft?.slug && <small className="page-slug-preview">/{draft.slug}</small>}
              </div>
              <div className="editor-actions">
                <button disabled={!draft} className="button button-outline" onClick={() => setPreviewOpen((open) => !open)}>
                  {previewOpen ? <Pencil size={16} /> : <Eye size={16} />} {previewOpen ? 'Өңдеу' : 'Алдын ала көру'}
                </button>
                {!previewOpen && (
                  <button disabled={!draft || saving} className="button button-dark" onClick={handleSave}>
                    <Save size={16} /> {saving ? 'Сақталуда…' : isSuperAdmin ? 'Бекіту және жариялау' : 'Қарауға жіберу'}
                  </button>
                )}
              </div>
            </div>

            {error && <div className="editor-alert error-alert">{error}</div>}
            {notice && <div className="editor-alert success-alert"><Check size={16} /> {notice}</div>}

            {draft && previewOpen ? (
              <div className="editor-preview">
                <StandardPage page={{ ...draft, slug: draft.slug || toSlug(draft.title) || 'preview' }} onNavigate={() => {}} query="" />
              </div>
            ) : draft && (
              <>
                <section className="edit-card page-settings-card">
                  <label>
                    Негізгі бөлім (Бұл бет қай бөлімнің ішінде болады?)
                    <select
                      value={draft.parent_slug || 'people'}
                      onChange={(event) => updateDraft('parent_slug', event.target.value)}
                    >
                      {PARENT_SECTIONS.map((sec) => (
                        <option key={sec.slug} value={sec.slug}>
                          {NAV_LABELS[sec.slug] || sec.slug} — {sec.title}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>Бет атауы<input value={draft.title} onChange={(event) => updateDraft('title', event.target.value)} placeholder="Мысалы: Ақан сері" /></label>
                  <label>Қысқаша сипаттама<textarea rows="2" value={draft.description} onChange={(event) => updateDraft('description', event.target.value)} placeholder="Беттің қысқаша кіріспесі" /></label>
                  <label>
                    Енгізілген өзгерістер сипаттамасы (Журналға жазылады)
                    <input
                      value={draft.change_summary || ''}
                      onChange={(event) => updateDraft('change_summary', event.target.value)}
                      placeholder="Мысалы: Өмірбаяны түзетілді, 2 жаңа күй қосылды..."
                    />
                  </label>
                  <small className="page-slug-preview">
                    {draft.slug ? `Сілтеме: /${draft.slug}` : toSlug(draft.title) ? `Сілтеме: /${toSlug(draft.title)}` : 'Бет сілтемесі атаудан жасалады'}
                  </small>
                </section>

                {draft.blocks.length ? (
                  <div className="block-edit-list">
                    {draft.blocks.map((block, index) => (
                      <section className="edit-card block-edit-card" key={block.id}>
                        <div className="edit-card-heading">
                          <div>
                            <span>{String(index + 1).padStart(2, '0')}</span>
                            <strong>{BLOCK_TYPES.find(([type]) => type === block.type)?.[1] || 'Модуль'}</strong>
                          </div>
                          <div className="block-controls">
                            <button disabled={index === 0} title="Жоғары жылжыту" onClick={() => moveBlock(draft, updateDraft, index, -1)}><ArrowUp size={15} /></button>
                            <button disabled={index === draft.blocks.length - 1} title="Төмен жылжыту" onClick={() => moveBlock(draft, updateDraft, index, 1)}><ArrowDown size={15} /></button>
                            <button className="delete-block" title="Модульді өшіру" onClick={() => updateDraft('blocks', draft.blocks.filter((item) => item.id !== block.id))}><Trash2 size={15} /></button>
                          </div>
                        </div>
                        {block.type !== 'image' && <label>Тақырып<input value={block.title || ''} onChange={(event) => updateBlock(block.id, 'title', event.target.value)} /></label>}
                        {block.type === 'image' && <label>Суретке балама мәтін<input value={block.title || ''} onChange={(event) => updateBlock(block.id, 'title', event.target.value)} placeholder="Суретте не бейнеленген?" /></label>}
                        {block.type === 'qr' && <label>QR кодқа апаратын сілтеме<input type="url" value={block.link || ''} onChange={(event) => updateBlock(block.id, 'link', event.target.value)} placeholder="https://example.com" /></label>}
                        {!['stats', 'qr'].includes(block.type) && <label>{block.type === 'image' ? 'Суретке түсіндірме' : 'Мәтін'}<textarea rows={block.type === 'text' ? 7 : 4} value={block.body || ''} onChange={(event) => updateBlock(block.id, 'body', event.target.value)} /></label>}
                        {['feature', 'heading', 'callout'].includes(block.type) && <label>Қосымша белгі<input value={block.eyebrow || ''} onChange={(event) => updateBlock(block.id, 'eyebrow', event.target.value)} placeholder="ҚОСЫМША БЕЛГІ" /></label>}
                        {['image', 'text', 'feature', 'callout'].includes(block.type) && <label>{block.type === 'image' ? 'Сурет мекенжайы' : 'Сілтеме (міндетті емес)'}<input value={block.link || ''} onChange={(event) => updateBlock(block.id, 'link', event.target.value)} placeholder={block.type === 'image' ? '/images/example.jpg немесе https://...' : 'https://...'} /></label>}
                        {block.type === 'callout' && <label>Сілтеме батырмасының мәтіні<input value={block.linkLabel || ''} onChange={(event) => updateBlock(block.id, 'linkLabel', event.target.value)} placeholder="Толығырақ" /></label>}
                        {['stats', 'cards', 'list'].includes(block.type) && <ItemsEditor block={block} onItemChange={(itemIndex, key, value) => updateBlockItem(block, itemIndex, key, value)} onItemsChange={(items) => updateBlockItems(block.id, items)} />}
                      </section>
                    ))}
                  </div>
                ) : (
                  <div className="builder-empty">
                    <FilePlus2 size={34} />
                    <h2>Бет әлі бос</h2>
                    <p>Сол жақ панельден модуль таңдаңыз — бет сол жерден құрастырылады.</p>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// AUTHENTICATION VIEW (Super Admin & Editor Login/Register)
// -------------------------------------------------------------
function AuthView({ onLoginSuccess, onExit }) {
  const [roleMode, setRoleMode] = useState('super'); // 'super' | 'editor'
  const [editorMode, setEditorMode] = useState('login'); // 'login' | 'register'
  const [superToken, setSuperToken] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const handleSuperSubmit = (e) => {
    e.preventDefault();
    setError('');
    setNotice('');
    if (!superToken.trim()) {
      setError('Бас әкімшінің құпия кілтін енгізіңіз.');
      return;
    }
    if (verifySuperAdmin(superToken)) {
      onLoginSuccess({
        role: 'SUPER_ADMIN',
        fullName: 'Бас әкімші',
        token: superToken.trim(),
      });
    } else {
      setError('Құпия кілт қате. Қайта тексеріп көріңіз.');
    }
  };

  const handleEditorSubmit = (e) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (editorMode === 'login') {
      try {
        const account = loginEditor({ username, password });
        onLoginSuccess({
          role: 'EDITOR',
          id: account.id,
          fullName: account.fullName,
          username: account.username,
        });
      } catch (err) {
        setError(err.message);
      }
    } else {
      // Register
      if (!fullName.trim() || !username.trim() || !password.trim()) {
        setError('Барлық өрістерді толтырыңыз.');
        return;
      }
      try {
        registerEditor({ fullName, username, password });
        setNotice('Өтінішіңіз сәтті қабылданды! Бас әкімші мақұлдағаннан кейін жүйеге кіре аласыз.');
        setEditorMode('login');
        setPassword('');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="brand">
          <span className="brand-mark">К</span>
          <span className="brand-copy"><strong>Күй анасы</strong><small>КОНСТРУКТОРҒА КІРУ</small></span>
        </div>
        <button className="admin-exit" onClick={onExit} style={{ marginLeft: 'auto' }}>
          <ArrowLeft size={16} /> Сайтқа қайту
        </button>
      </header>

      <div className="auth-box">
        <h2 className="auth-box-title">Басқару жүйесі</h2>
        <p>Энциклопедия мазмұнын өңдеу немесе жаңа парақшалар енгізу үшін жүйеге кіріңіз.</p>

        <div className="auth-role-tabs">
          <button className={roleMode === 'super' ? 'active' : ''} onClick={() => { setRoleMode('super'); setError(''); setNotice(''); }}>
            <ShieldCheck size={16} /> Бас әкімші
          </button>
          <button className={roleMode === 'editor' ? 'active' : ''} onClick={() => { setRoleMode('editor'); setError(''); setNotice(''); }}>
            <UserCheck size={16} /> Редактор / Әкімші
          </button>
        </div>

        {error && <div className="editor-alert error-alert" style={{ marginBottom: '14px' }}>{error}</div>}
        {notice && <div className="editor-alert success-alert" style={{ marginBottom: '14px' }}><Check size={16} /> {notice}</div>}

        {roleMode === 'super' ? (
          <form className="auth-form" onSubmit={handleSuperSubmit}>
            <label>
              Бас әкімшінің құпия кілті (Master Secret Key)
              <input
                type="password"
                value={superToken}
                onChange={(e) => setSuperToken(e.target.value)}
                placeholder="Құпия кілтті енгізіңіз..."
                autoFocus
              />
            </label>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--muted)' }}>
              Бас әкімші құпия кілті қауіпсіздік параметрлерінде (Environment variable) сақталады. Барлық өкілеттікке ие.
            </p>
            <button type="submit" className="button button-dark">Кіру</button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleEditorSubmit}>
            {editorMode === 'register' && (
              <label>
                Аты-жөніңіз (ФИО)
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Мысалы: Айдос Смағұлов"
                  required
                />
              </label>
            )}
            <label>
              Логин
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="aidos"
                required
              />
            </label>
            <label>
              Құпиясөз
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </label>

            <button type="submit" className="button button-dark">
              {editorMode === 'login' ? 'Кіру' : 'Тіркелуге өтініш беру'}
            </button>

            <div className="auth-switch-mode">
              {editorMode === 'login' ? (
                <>Аккаунтыңыз жоқ па? <button type="button" onClick={() => { setEditorMode('register'); setError(''); }}>Тіркелу</button></>
              ) : (
                <>Бұрын тіркелгенсіз бе? <button type="button" onClick={() => { setEditorMode('login'); setError(''); }}>Кіру</button></>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function moveBlock(draft, updateDraft, index, direction) {
  const blocks = [...draft.blocks];
  const [block] = blocks.splice(index, 1);
  blocks.splice(index + direction, 0, block);
  updateDraft('blocks', blocks);
}

function createEmptyPage(position) {
  return {
    slug: '',
    title: '',
    description: '',
    position,
    parent_slug: 'people',
    status: 'pending',
    change_summary: '',
    blocks: [],
  };
}

function createBlock(type) {
  const defaults = {
    heading: { title: 'Жаңа бөлім', body: '' },
    feature: { eyebrow: '', title: 'Ерекше тақырып', body: '' },
    quote: { title: 'Дереккөз', body: 'Дәйексөз мәтіні' },
    image: { title: '', body: 'Суретке түсіндірме', link: '' },
    list: { title: 'Тізім', body: '', items: [{ text: 'Жаңа тармақ' }] },
    stats: { title: 'Сандар', body: '', items: [{ value: '0', label: 'Көрсеткіш' }] },
    cards: { title: 'Карточкалар', body: '', items: [{ title: 'Карточка атауы', meta: 'Санат', description: 'Қысқаша түсіндірме' }] },
    callout: { eyebrow: 'НАЗАР АУДАРЫҢЫЗ', title: 'Екпінді блок', body: '', link: '', linkLabel: 'Толығырақ' },
    qr: { title: 'Сілтемені QR арқылы ашыңыз', body: '', link: '' },
  };
  return { id: crypto.randomUUID(), type, ...(defaults[type] || { title: '', body: '' }) };
}

function ItemsEditor({ block, onItemChange, onItemsChange }) {
  const items = block.items || [];
  const fields = block.type === 'stats'
    ? [['value', 'Мәні'], ['label', 'Атауы']]
    : block.type === 'cards'
      ? [['title', 'Карточка атауы'], ['meta', 'Қысқа белгі'], ['description', 'Түсіндірме']]
      : [['text', 'Тізім тармағы']];
  const emptyItem = Object.fromEntries(fields.map(([key]) => [key, '']));
  return (
    <div className="items-editor">
      <div className="items-editor-heading"><strong>{block.type === 'stats' ? 'Көрсеткіштер' : block.type === 'cards' ? 'Карточкалар' : 'Тізім тармақтары'}</strong><span>{items.length}</span></div>
      {items.map((item, index) => (
        <div className="item-edit-row" key={`${block.id}-${index}`}>
          <div className="item-edit-fields">{fields.map(([key, label]) => <label key={key}>{label}{key === 'description' || block.type === 'list' ? <textarea rows={2} value={item[key] || ''} onChange={(event) => onItemChange(index, key, event.target.value)} /> : <input value={item[key] || ''} onChange={(event) => onItemChange(index, key, event.target.value)} />}</label>)}</div>
          <button type="button" className="item-remove" onClick={() => onItemsChange(items.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Өшіру: ${index + 1}`}><Trash2 size={15} /></button>
        </div>
      ))}
      <button type="button" className="item-add-button" onClick={() => onItemsChange([...items, emptyItem])}><Plus size={15} /> Тағы қосу</button>
    </div>
  );
}

function toSlug(value) {
  const transliteration = {
    а: 'a', ә: 'a', б: 'b', в: 'v', г: 'g', ғ: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh', з: 'z', и: 'i', й: 'y',
    к: 'k', қ: 'q', л: 'l', м: 'm', н: 'n', ң: 'ng', о: 'o', ө: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u',
    ұ: 'u', ү: 'u', ф: 'f', х: 'kh', һ: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ъ: '', ы: 'y', і: 'i',
    ь: '', э: 'e', ю: 'yu', я: 'ya',
  };
  return value
    .toLocaleLowerCase()
    .replace(/[а-яёәғқңөұүһі]/g, (char) => transliteration[char] || char)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default App;
