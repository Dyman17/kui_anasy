import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight,
  Check, Eye, FilePlus2, FolderOpen, LockKeyhole, Menu, Pencil, Plus, RotateCcw, Save, Search, Trash2, X,
} from 'lucide-react';
import QRCode from 'qrcode';
import { createPage, getPages, resetLocalPages, savePage } from './api.js';

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
  heritage: 'Музыка',
  projects: 'Жобалар',
  about: 'Жоба туралы',
  library: 'Кітапхана',
};

function App() {
  const [pages, setPages] = useState([]);
  const [activeSlug, setActiveSlug] = useState(INITIAL_SLUG);
  const [adminOpen, setAdminOpen] = useState(window.location.hash.startsWith('#admin'));
  const [token, setToken] = useState(sessionStorage.getItem('kui-admin-token') || '');
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

  const sortedPages = useMemo(
    () => [...pages].sort((a, b) => a.position - b.position),
    [pages],
  );
  const navPages = useMemo(
    () => [...sortedPages].sort((a, b) => {
      const aOrder = NAV_ORDER.indexOf(a.slug);
      const bOrder = NAV_ORDER.indexOf(b.slug);
      return (aOrder < 0 ? NAV_ORDER.length : aOrder) - (bOrder < 0 ? NAV_ORDER.length : bOrder);
    }),
    [sortedPages],
  );
  const searchResults = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    if (!needle) return [];
    return pages.filter((page) => `${page.title} ${page.description} ${page.blocks.map((block) => `${block.title} ${block.body}`).join(' ')}`.toLocaleLowerCase().includes(needle));
  }, [pages, query]);
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
        token={token}
        onTokenChange={(value) => {
          setToken(value);
          if (value) sessionStorage.setItem('kui-admin-token', value);
          else sessionStorage.removeItem('kui-admin-token');
        }}
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
        <div className="search-wrap">
          <div className="search-bar">
            <Search size={19} />
            <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Тұлға, күй немесе тақырыпты іздеу…" />
            <button className="icon-button" onClick={() => { setSearchOpen(false); setQuery(''); }} aria-label="Іздеуді жабу"><X size={18} /></button>
          </div>
          {query.trim() && <div className="search-results">{searchResults.length ? searchResults.map((page) => <button key={page.slug} onClick={() => { navigate(page.slug); setSearchOpen(false); }}><span>{page.title}</span><ArrowRight size={15} /></button>) : <p>Сұрауыңыз бойынша бөлім табылмады.</p>}</div>}
        </div>
      )}

      {activePage && (
        <main>
          {activePage.slug === 'home' ? (
            <HomePage page={activePage} onNavigate={navigate} />
          ) : (
            <StandardPage page={activePage} onNavigate={navigate} query={query} />
          )}
        </main>
      )}

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <a className="brand" href="#" onClick={(event) => { event.preventDefault(); navigate('home'); }}>
                <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
                <span className="brand-copy"><strong>Күй анасы</strong></span>
            </a>
            <p>Ұлы даланың әуені мен рухани мұрасын келер ұрпаққа жеткіземіз.</p>
          </div>
          <div><span className="footer-heading">БӨЛІМДЕР</span><div className="footer-links">
            {navPages.filter((page) => page.slug !== 'home').slice(0, 4).map((page) => <button key={page.slug} onClick={() => navigate(page.slug)}>{NAV_LABELS[page.slug] || page.title}</button>)}
          </div></div>
          <div><span className="footer-heading">РЕДАКТОРҒА</span><p>Энциклопедия материалдарын сайт арқылы басқару.</p><a href="#admin">Әкімші панелін ашу <ArrowUpRight size={14} /></a></div>
        </div>
        <div className="footer-bottom"><span>© 2026 «Күй анасы» қоғамдық қоры</span><span>Қазақтың дәстүрлі музыка энциклопедиясы</span></div>
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
          <p className="hero-kicker">ҰЛЫ ДАЛА ӘУЕНІНІҢ ТҰЛҒАЛАРЫ</p>
          <h1>Дала сөйлейді.<br /><em>Домбыра сыр шертеді.</em></h1>
          <p>{page.description}</p>
          <p className="hero-english">Kazakh music, its people and living traditions.</p>
          <div className="hero-actions">
            <button className="button button-dark" onClick={() => onNavigate('people')}>Тұлғаларды зерттеу <ArrowRight size={17} /></button>
            <button className="text-button" onClick={() => onNavigate('heritage')}>Музыканы ашу <ArrowUpRight size={16} /></button>
          </div>
        </div>
        <figure className="hero-image">
          <img src="/images/kuyshiler-alley.jpg" alt="Күйшілер аллеясындағы қазақ күй өнерінің тұлғаларына арналған ескерткіш тақта" />
          <figcaption><strong>Күйшілер аллеясы</strong><span>Астана · Қазақстан</span></figcaption>
        </figure>
      </section>

      {stats && <section className="archive-stats content-width"><h2>Бір мұра.<br /><strong>Үш дәстүр.</strong></h2>{stats.items?.map((item) => <div className="archive-stat-row" key={item.label}><strong>{item.value}</strong><p>{item.label}</p></div>)}</section>}

      {intro && (
        <section className="editorial-intro content-width">
          <div className="intro-copy"><h2>{intro.title}</h2><p>{intro.body}</p><button className="underlined-link" onClick={() => onNavigate('about')}>Жоба туралы <ArrowRight size={15} /></button></div>
          <figure className="intro-artwork">
            <img src="/images/dombra-player-illustration.png" alt="Домбырашының көркем бейнесі; тарихи тұлғаның расталған портреті емес" loading="lazy" />
            <figcaption>КӨРКЕМ БЕЙНЕ · АТРИБУЦИЯ ЖОҚ</figcaption>
          </figure>
          <span className="intro-pattern" aria-hidden="true" />
        </section>
      )}

      {feature && (
        <section className="featured-person">
          <figure className="featured-person-image"><img src="/images/dina-monument.jpg" alt="Дина Нұрпейісова ескерткіші" /><figcaption>Дина Нұрпейісова ескерткіші · Астана</figcaption></figure>
          <div className="featured-person-copy"><span className="hero-kicker">ТҰЛҒА · {feature.eyebrow || '1861 — 1955'}</span><h2>{feature.title}</h2><p>{feature.body}</p><button className="underlined-link" onClick={() => onNavigate('people')}>Тұлғалар каталогы <ArrowRight size={15} /></button></div>
          <span className="featured-person-pattern" aria-hidden="true" />
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

function StandardPage({ page, onNavigate, query }) {
  const relevantBlocks = (page.blocks || []).filter((block) => !query || `${block.title} ${block.body}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <>
      <section className={`page-banner page-banner-${page.slug}`} data-section={page.slug}>
        <SectionMotif slug={page.slug} />
        <div className="page-banner-image"><img src={getSectionImage(page.slug)} alt="" /></div>
        <div className="content-width page-banner-inner"><h1>{NAV_LABELS[page.slug] || page.title}</h1><p>{page.description}</p><div className="breadcrumb"><button onClick={() => onNavigate('home')}>Басты бет</button><span>/</span><span>{NAV_LABELS[page.slug] || page.title}</span></div></div>
      </section>
      <section className="editorial content-width">
        {relevantBlocks.map((block, index) => <ContentBlock key={block.id || index} block={block} index={index} pageSlug={page.slug} />)}
        {relevantBlocks.length === 0 && <p className="empty-search">Сұрауыңыз бойынша ақпарат табылмады.</p>}
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
    return <svg className="section-motif motif-wave-banner" viewBox="0 0 520 230" aria-hidden="true">
      <path d="M-20 165C45 165 45 45 110 45s65 120 130 120 65-120 130-120 65 120 170 120" />
      <path d="M-20 185C45 185 45 65 110 65s65 120 130 120 65-120 130-120 65 120 170 120" />
      <path d="M-20 205C45 205 45 85 110 85s65 120 130 120 65-120 130-120 65 120 170 120" />
    </svg>;
  }
  if (slug === 'library') {
    return <svg className="section-motif motif-print-banner" viewBox="0 0 360 220" aria-hidden="true">
      <path d="M48 35h160l76 49v111H48zM208 35v49h76" />
      <path d="M76 104h178M76 129h142M76 154h160M76 178h83" />
      <path d="M301 57a31 31 0 1 1-62 0 31 31 0 0 1 62 0zM270 41v32m-16-16h32" />
    </svg>;
  }
  return <svg className="section-motif motif-dala-banner" viewBox="0 0 400 240" aria-hidden="true">
    <path d="M25 210V160h55v-45h55V70h55v45h55v45h55v50" />
    <path d="M65 210v-32h42v-42h42v-36h42v36h42v42h42v32" />
    <path d="M105 210v-17h28v-31h28v-25h42v25h28v31h28v17" />
    <path d="M20 220h350M45 230h300" />
  </svg>;
}

function ContentBlock({ block, index, pageSlug }) {
  if (block.type === 'qr') return <QrCodeBlock block={block} />;
  if (block.type === 'heading') {
    return <article className={`editorial-block editorial-heading-block ${index % 2 ? 'block-offset' : ''}`}>{block.eyebrow && <span className="block-kicker">{block.eyebrow}</span>}<h2>{block.title}</h2>{block.body && <p>{block.body}</p>}</article>;
  }
  if (block.type === 'image') {
    const imageSrc = safeMediaSrc(block.link);
    return imageSrc ? <figure className="editorial-image-block"><img src={imageSrc} alt={block.title || ''} loading="lazy" /><figcaption>{block.body || block.title}</figcaption></figure> : null;
  }
  if (block.type === 'list') {
    return <section className="editorial-list-block"><h2>{block.title}</h2>{block.body && <p>{block.body}</p>}<ul>{(block.items || []).map((item, itemIndex) => <li key={`${item.text}-${itemIndex}`}>{item.text}</li>)}</ul></section>;
  }
  if (block.type === 'callout') {
    const href = safeLink(block.link);
    return <aside className="editorial-callout"><span className="block-kicker">{block.eyebrow || 'НАЗАР АУДАРЫҢЫЗ'}</span><h2>{block.title}</h2><p>{block.body}</p>{href && <a className="underlined-link" href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined}>{block.linkLabel || 'Толығырақ'} <ArrowUpRight size={15} /></a>}</aside>;
  }
  if (block.type === 'stats') {
    return <section className="editorial-stats-block">{block.title && <h2>{block.title}</h2>}<div className="editorial-stats">{block.items?.map((item, itemIndex) => <div key={`${item.label}-${itemIndex}`}><span>0{itemIndex + 1}</span><strong>{item.value}</strong><p>{item.label}</p></div>)}</div></section>;
  }
  if (block.type === 'cards') {
    const covers = ['/images/book-kui-alemi.jpg', '/images/book-gasyrlar-uni.jpg', '/images/book-uly-dala-aueni.jpg'];
    return <div className="editorial-cards"><h2>{block.title}</h2>{block.body && <p>{block.body}</p>}<div className={`mini-card-grid ${pageSlug === 'library' ? 'book-grid' : ''}`}>{(block.items || []).map((item, itemIndex) => <article className="mini-card" key={`${item.title}-${itemIndex}`}>{pageSlug === 'library' && <div className="mini-card-image"><img src={covers[itemIndex % covers.length]} alt={item.title} loading="lazy" /></div>}<span>{item.meta}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></div>;
  }
  if (block.type === 'quote') {
    return <blockquote className="editorial-quote"><p>{block.body}</p><cite>{block.title}</cite></blockquote>;
  }
  if (block.type === 'feature') {
    return <article className={`editorial-block ${index % 2 ? 'block-offset' : ''}`}>{block.eyebrow && <span className="block-kicker">{block.eyebrow}</span>}<h2>{block.title}</h2><p>{block.body}</p></article>;
  }
  const href = safeLink(block.link);
  return <article className={`editorial-block ${index % 2 ? 'block-offset' : ''}`}><h2>{block.title}</h2><p>{block.body}</p>{href && <a className="underlined-link" href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined}>{block.linkLabel || 'Толығырақ'} <ArrowUpRight size={15} /></a>}</article>;
}

function QrCodeBlock({ block }) {
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    setImage('');
    setError('');
    if (!block.link?.trim()) return () => { active = false; };
    try {
      const url = new URL(block.link);
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error('QR code only supports HTTP and HTTPS links.');
      QRCode.toDataURL(url.toString(), {
        width: 256,
        margin: 2,
        color: { dark: '#33000e', light: '#fff8f6' },
      }).then((dataUrl) => {
        if (active) setImage(dataUrl);
      }).catch((qrError) => {
        if (active) setError(qrError.message);
      });
    } catch (qrError) {
      setError(qrError.message);
    }
    return () => { active = false; };
  }, [block.link]);

  if (!block.link?.trim()) return <div className="qr-placeholder">QR код жасау үшін сілтемені енгізіңіз.</div>;
  if (error) return <p className="qr-error">QR кодты жасау мүмкін болмады: {error}</p>;
  return <figure className="qr-block">
    {image ? <img src={image} alt={block.title || 'Сілтемені ашуға арналған QR код'} width="256" height="256" /> : <div className="qr-loading">QR код жасалуда…</div>}
    {block.title && <figcaption>{block.title}</figcaption>}
    <a href={safeLink(block.link)} target="_blank" rel="noreferrer">{block.link}</a>
  </figure>;
}

function safeMediaSrc(value) {
  if (typeof value !== 'string') return '';
  const source = value.trim();
  return source.startsWith('/') && !source.startsWith('//') || /^https:\/\//i.test(source) ? source : '';
}

function safeLink(value) {
  if (typeof value !== 'string') return '';
  const target = value.trim();
  return target.startsWith('/') && !target.startsWith('//') || /^https?:\/\//i.test(target) ? target : '';
}

function Callout({ onNavigate }) {
  return <section className="callout"><div className="callout-content"><h2>Үш томдықты ашыңыз.</h2><p>Қазақ музыкасының тұлғалары, әні мен күйі — бір кеңістікте.</p><button className="button button-dark" onClick={() => onNavigate('library')}>Цифрлық кітапхана <ArrowRight size={16} /></button></div></section>;
}

function AdminPanel({ pages, token, onTokenChange, onPagesChange, onExit }) {
  const [route, setRoute] = useState(window.location.hash || '#admin');
  const [draft, setDraft] = useState(() => createEmptyPage(pages.filter((page) => page.is_custom).length));
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const customPages = pages.filter((page) => page.is_custom);
  const editingSlug = route.startsWith('#admin/edit/') ? route.slice('#admin/edit/'.length) : '';
  const activePage = customPages.find((page) => page.slug === editingSlug);

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
      const payload = { ...draft, slug, title: draft.title.trim() };
      if (draft.slug) {
        const saved = await savePage(payload, token);
        onPagesChange((current) => current.map((page) => page.slug === saved.slug ? saved : page));
        setDraft(saved);
        setNotice('Бет сақталды.');
      } else {
        const saved = await createPage({ ...payload, position: customPages.length }, token);
        onPagesChange((current) => [...current, saved]);
        window.location.hash = `#admin/edit/${encodeURIComponent(saved.slug)}`;
        setNotice('Жаңа бет жасалды және сақталды.');
      }
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleResetAll = () => {
    if (window.confirm('Барлық сақталған өзгерістер өшіріліп, бастапқы деректер қайтарылады. Жалғастырасыз ба?\n\nСбросить все локальные данные и вернуть сайт к исходному состоянию?')) {
      const reset = resetLocalPages();
      onPagesChange(reset);
      setNotice('Деректер бастапқы қалпына келтірілді.');
      setTimeout(() => {
        window.location.hash = '';
        window.location.reload();
      }, 200);
    }
  };

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <a className="brand" href="#" onClick={(event) => { event.preventDefault(); onExit(); }}>
          <span className="brand-mark">К</span><span className="brand-copy"><strong>Күй анасы</strong><small>КОНСТРУКТОР</small></span>
        </a>
        <nav className="constructor-nav" aria-label="Конструктор">
          <button className={route === '#admin' || route.startsWith('#admin/edit/') ? 'active' : ''} onClick={() => { window.location.hash = '#admin'; }}>Жаңа бет</button>
          <button className={route === '#admin/pages' ? 'active' : ''} onClick={() => { window.location.hash = '#admin/pages'; }}>Менің беттерім <span>{customPages.length}</span></button>
        </nav>
        <label className="topbar-token"><LockKeyhole size={14} /><input id="admin-token" type="password" value={token} onChange={(event) => onTokenChange(event.target.value)} placeholder="Әкімші кілті" /></label>
        <button className="admin-exit" onClick={onExit}><ArrowLeft size={16} /> Сайт</button>
      </header>
      {route === '#admin/pages' ? (
        <main className="pages-manager">
          <div className="pages-manager-heading"><div><span className="block-kicker">КОНСТРУКТОРДА ЖАСАЛҒАН</span><h1>Менің беттерім</h1><p>Бетті таңдап, мазмұнын жалғастырыңыз.</p></div><div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}><button className="button button-outline" type="button" title="Сбросить все изменения" onClick={handleResetAll}><RotateCcw size={16} /> Бастапқы қалпына келтіру</button><button className="button button-dark" onClick={() => { window.location.hash = '#admin'; }}><FilePlus2 size={17} /> Жаңа бет жасау</button></div></div>
          {!token && <div className="editor-alert info-alert"><LockKeyhole size={17} /><span>Сақтау үшін серверге орнатылған әкімші кілтін енгізіңіз.</span></div>}
          {error && <div className="editor-alert error-alert">{error}</div>}
          {customPages.length ? <div className="page-library">{customPages.map((page) => (
            <article className="page-library-card" key={page.slug}>
              <div><span className="page-library-slug">/{page.slug}</span><h2>{page.title}</h2><p>{page.description || 'Қысқаша сипаттамасы жоқ.'}</p><small>{page.blocks.length} модуль</small></div>
              <button className="button button-outline" onClick={() => { window.location.hash = `#admin/edit/${encodeURIComponent(page.slug)}`; }}><Pencil size={15} /> Өңдеу</button>
            </article>
          ))}</div> : <div className="pages-empty"><FolderOpen size={34} /><h2>Әзірге беттер жоқ</h2><p>Конструкторда бірінші бетіңізді жасап, осы жерден кейін қайта ашыңыз.</p><button className="button button-dark" onClick={() => { window.location.hash = '#admin'; }}><Plus size={16} /> Бет құрастыру</button></div>}
        </main>
      ) : (
        <div className="builder-workspace">
          {!previewOpen && <aside className="builder-sidebar">
            <span className="block-kicker">ҚҰРАСТЫРУ</span><h2>Модульдер</h2><p>Қажетті бөлімді басыңыз — ол бетке қосылады.</p>
            <div className="module-picker">{BLOCK_TYPES.map(([type, label]) => <button key={type} onClick={() => updateDraft('blocks', [...(draft?.blocks || []), createBlock(type)])}><Plus size={15} /><span>{label}</span></button>)}</div>
          </aside>}
          <main className={`admin-editor builder-canvas ${previewOpen ? 'is-preview' : ''}`}>
            <div className="editor-heading">
              <div><span className="block-kicker">{draft?.slug ? 'БЕТТІ ӨҢДЕУ' : 'ЖАҢА БЕТ'}</span><h1>{draft?.title || 'Атаусыз бет'}</h1>{draft?.slug && <small className="page-slug-preview">/{draft.slug}</small>}</div>
              <div className="editor-actions">
                <button disabled={!draft} className="button button-outline" onClick={() => setPreviewOpen((open) => !open)}>{previewOpen ? <Pencil size={16} /> : <Eye size={16} />} {previewOpen ? 'Өңдеу' : 'Алдын ала көру'}</button>
                {!previewOpen && <button disabled={!draft || !token || saving} className="button button-dark" onClick={handleSave}><Save size={16} /> {saving ? 'Сақталуда…' : 'Сақтау'}</button>}
              </div>
            </div>
            {error && <div className="editor-alert error-alert">{error}</div>}
            {notice && <div className="editor-alert success-alert"><Check size={16} /> {notice}</div>}
            {!token && !previewOpen && <div className="editor-alert info-alert"><LockKeyhole size={17} /><span>Өзгерістерді сақтау үшін әкімші кілтін енгізіңіз.</span></div>}
            {draft && previewOpen ? <div className="editor-preview"><StandardPage page={{ ...draft, slug: draft.slug || toSlug(draft.title) || 'preview' }} onNavigate={() => {}} query="" /></div> : draft && <>
              <section className="edit-card page-settings-card">
                <label>Бет атауы<input value={draft.title} onChange={(event) => updateDraft('title', event.target.value)} placeholder="Мысалы: Ақан сері" /></label>
                <label>Қысқаша сипаттама<textarea rows="2" value={draft.description} onChange={(event) => updateDraft('description', event.target.value)} placeholder="Беттің қысқаша кіріспесі" /></label>
                <small className="page-slug-preview">{draft.slug ? `Сілтеме: /${draft.slug}` : toSlug(draft.title) ? `Сілтеме: /${toSlug(draft.title)}` : 'Бет сілтемесі атаудан жасалады'}</small>
              </section>
              {draft.blocks.length ? <div className="block-edit-list">{draft.blocks.map((block, index) => (
                <section className="edit-card block-edit-card" key={block.id}>
                  <div className="edit-card-heading"><div><span>{String(index + 1).padStart(2, '0')}</span><strong>{BLOCK_TYPES.find(([type]) => type === block.type)?.[1] || 'Модуль'}</strong></div><div className="block-controls"><button disabled={index === 0} title="Жоғары жылжыту" onClick={() => moveBlock(draft, updateDraft, index, -1)}><ArrowUp size={15} /></button><button disabled={index === draft.blocks.length - 1} title="Төмен жылжыту" onClick={() => moveBlock(draft, updateDraft, index, 1)}><ArrowDown size={15} /></button><button className="delete-block" title="Модульді өшіру" onClick={() => updateDraft('blocks', draft.blocks.filter((item) => item.id !== block.id))}><Trash2 size={15} /></button></div></div>
                  {block.type !== 'image' && <label>Тақырып<input value={block.title || ''} onChange={(event) => updateBlock(block.id, 'title', event.target.value)} /></label>}
                  {block.type === 'image' && <label>Суретке балама мәтін<input value={block.title || ''} onChange={(event) => updateBlock(block.id, 'title', event.target.value)} placeholder="Суретте не бейнеленген?" /></label>}
                  {block.type === 'qr' && <label>QR кодқа апаратын сілтеме<input type="url" value={block.link || ''} onChange={(event) => updateBlock(block.id, 'link', event.target.value)} placeholder="https://example.com" /></label>}
                  {!['stats', 'qr'].includes(block.type) && <label>{block.type === 'image' ? 'Суретке түсіндірме' : 'Мәтін'}<textarea rows={block.type === 'text' ? 7 : 4} value={block.body || ''} onChange={(event) => updateBlock(block.id, 'body', event.target.value)} /></label>}
                  {['feature', 'heading', 'callout'].includes(block.type) && <label>Қосымша белгі<input value={block.eyebrow || ''} onChange={(event) => updateBlock(block.id, 'eyebrow', event.target.value)} placeholder="ҚОСЫМША БЕЛГІ" /></label>}
                  {['image', 'text', 'feature', 'callout'].includes(block.type) && <label>{block.type === 'image' ? 'Сурет мекенжайы' : 'Сілтеме (міндетті емес)'}<input value={block.link || ''} onChange={(event) => updateBlock(block.id, 'link', event.target.value)} placeholder={block.type === 'image' ? '/images/example.jpg немесе https://...' : 'https://...'} /></label>}
                  {block.type === 'callout' && <label>Сілтеме батырмасының мәтіні<input value={block.linkLabel || ''} onChange={(event) => updateBlock(block.id, 'linkLabel', event.target.value)} placeholder="Толығырақ" /></label>}
                  {['stats', 'cards', 'list'].includes(block.type) && <ItemsEditor block={block} onItemChange={(itemIndex, key, value) => updateBlockItem(block, itemIndex, key, value)} onItemsChange={(items) => updateBlockItems(block.id, items)} />}
                </section>
              ))}</div> : <div className="builder-empty"><FilePlus2 size={34} /><h2>Бет әлі бос</h2><p>Сол жақ панельден модуль таңдаңыз — бет сол жерден құрастырылады.</p></div>}
            </>}
          </main>
        </div>
      )}
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
  return { slug: '', title: '', description: '', position, blocks: [] };
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
    а: 'a', ә: 'a', б: 'b', в: 'v', г: 'g', ғ: 'g', д: 'd', е: 'e', ё: 'yo',
    ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', қ: 'q', л: 'l', м: 'm', н: 'n',
    ң: 'ng', о: 'o', ө: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ұ: 'u',
    ү: 'u', ф: 'f', х: 'kh', һ: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch',
    ъ: '', ы: 'y', і: 'i', ь: '', э: 'e', ю: 'yu', я: 'ya',
  };
  return value.toLocaleLowerCase()
    .replace(/[а-яёәғқңөұүһі]/g, (character) => transliteration[character])
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default App;
