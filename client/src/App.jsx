import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, AudioLines, BookOpen,
  Check, ChevronDown, Compass, Feather, Headphones, Landmark, LockKeyhole,
  Menu, Music2, Plus, Quote, Save, Search, Settings2, Trash2, Users, X,
} from 'lucide-react';
import { createPage, getPages, savePage } from './api.js';

const INITIAL_SLUG = 'home';
const EMPTY_BLOCK = () => ({
  id: crypto.randomUUID(),
  type: 'text',
  title: 'Жаңа бөлім',
  body: 'Мұнда мәтінді жазыңыз.',
});
const NAV_ICONS = {
  home: Compass,
  about: Landmark,
  people: Users,
  heritage: Music2,
  library: BookOpen,
  projects: Feather,
};

function App() {
  const [pages, setPages] = useState([]);
  const [activeSlug, setActiveSlug] = useState(INITIAL_SLUG);
  const [adminOpen, setAdminOpen] = useState(window.location.hash === '#admin');
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
    const handleHash = () => setAdminOpen(window.location.hash === '#admin');
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const sortedPages = useMemo(
    () => [...pages].sort((a, b) => a.position - b.position),
    [pages],
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
    return <div className="loading-screen"><span className="brand-mark">К</span><p>Дала әуені жүктелуде…</p></div>;
  }

  if (loadError) {
    return (
      <div className="loading-screen error-screen">
        <span className="brand-mark">К</span>
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
      <div className="announcement">
        <span>Қазақтың дәстүрлі музыка мұрасын бірге сақтайық</span>
        <a href="#support" onClick={(event) => { event.preventDefault(); navigate('projects'); }}>Жоба туралы <ArrowUpRight size={13} /></a>
      </div>
      <header className="site-header">
        <a className="brand" href="#" onClick={(event) => { event.preventDefault(); navigate('home'); }}>
          <span className="brand-mark">К</span>
          <span className="brand-copy"><strong>КҮЙ АНАСЫ</strong><small>ҚОҒАМДЫҚ ҚОРЫ</small></span>
        </a>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Мәзір">
          {menuOpen ? <X /> : <Menu />}
        </button>
        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`}>
          {sortedPages.map((page) => (
            <button key={page.slug} className={page.slug === activePage?.slug ? 'nav-link active' : 'nav-link'} onClick={() => navigate(page.slug)}>
              {page.slug === 'home' ? 'Басты бет' : page.title}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <button className="icon-button" aria-label="Іздеу" onClick={() => setSearchOpen(!searchOpen)}><Search size={19} /></button>
          <button className="language-switch">ҚАЗ <ChevronDown size={13} /></button>
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
              <span className="brand-mark">К</span>
              <span className="brand-copy"><strong>КҮЙ АНАСЫ</strong><small>ҚОҒАМДЫҚ ҚОРЫ</small></span>
            </a>
            <p>Ұлы даланың әуені мен рухани мұрасын келер ұрпаққа жеткіземіз.</p>
          </div>
          <div><span className="footer-heading">БӨЛІМДЕР</span><div className="footer-links">
            {sortedPages.slice(1, 5).map((page) => <button key={page.slug} onClick={() => navigate(page.slug)}>{page.title}</button>)}
          </div></div>
          <div><span className="footer-heading">БАЙЛАНЫС</span><p>Астана, Қазақстан</p><a href="mailto:info@kuianasy.kz">info@kuianasy.kz</a></div>
        </div>
        <div className="footer-bottom"><span>© 2026 «Күй анасы» қоғамдық қоры</span><a href="#admin">Әкімші панелі <ArrowUpRight size={13} /></a><span>Ұлттық мұра — ортақ аманат</span></div>
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
      <section className="hero">
        <div className="hero-art" aria-hidden="true">
          <div className="sun-disc" />
          <div className="ornament ornament-one" />
          <div className="ornament ornament-two" />
          <div className="hero-horizon" />
          <div className="hero-dombra"><span /><i /><b /></div>
          <span className="hero-coordinate">51°09' N&nbsp; 71°26' E</span>
        </div>
        <div className="hero-content">
          <div className="eyebrow"><span /> ҰЛЫ ДАЛАНЫҢ МУЗЫКАЛЫҚ МҰРАСЫ</div>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
          <div className="hero-actions">
            <button className="button button-dark" onClick={() => onNavigate('people')}>Тұлғалармен танысу <ArrowRight size={17} /></button>
            <button className="text-button" onClick={() => onNavigate('about')}>Қор туралы <ArrowUpRight size={16} /></button>
          </div>
          <div className="hero-note"><AudioLines size={17} /><span>Дәстүрлі әуен — ұлттың жады</span></div>
        </div>
        <div className="hero-caption"><span>01 / 06</span><span>ASTANA · QAZAQSTAN</span></div>
      </section>

      {stats && <section className="stats-strip">{stats.items?.map((item) => <div className="stat-item" key={item.label}><strong>{item.value}</strong><span>{item.label}</span></div>)}</section>}

      {intro && (
        <section className="intro-section content-width">
          <div className="section-label"><span>БІЗДІҢ МИССИЯ</span><i /></div>
          <div className="intro-copy"><Quote size={26} /><h2>{intro.title}</h2><p>{intro.body}</p><button className="underlined-link" onClick={() => onNavigate('about')}>Қор жайлы көбірек <ArrowRight size={15} /></button></div>
          <span className="intro-index">I</span>
        </section>
      )}

      {feature && (
        <section className="feature-section">
          <div className="feature-photo"><div className="photo-shape"><Music2 size={54} strokeWidth={1} /><span>ДИНА<br />НҰРПЕЙІСОВА</span></div><span className="photo-caption">ҚАЗАҚ КҮЙ ӨНЕРІНІҢ АҢЫЗЫ</span></div>
          <div className="feature-copy"><div className="section-label"><span>ЕРЕКШЕ ТҰЛҒА</span><i /></div><p className="feature-years">{feature.eyebrow || '1861 — 1955'}</p><h2>{feature.title}</h2><p>{feature.body}</p><button className="underlined-link" onClick={() => onNavigate('people')}>Өмірбаянын оқу <ArrowRight size={15} /></button><div className="feature-number">01</div></div>
        </section>
      )}

      {latest && (
        <section className="discover-section content-width">
          <div className="section-topline"><div><div className="section-label"><span>ЗЕРТТЕҢІЗ</span><i /></div><h2>{latest.title}</h2></div><button className="underlined-link" onClick={() => onNavigate('heritage')}>Барлығын көру <ArrowRight size={15} /></button></div>
          <div className="discover-grid">{(latest.items || []).map((item, index) => {
            const Icon = [Headphones, Users, BookOpen][index % 3];
            return <button className={`discover-card discover-card-${index + 1}`} key={item.title} onClick={() => onNavigate(item.slug || 'heritage')}>
              <span className="card-icon"><Icon size={20} /></span><span className="card-count">{item.meta}</span><strong>{item.title}</strong><span className="card-link">ЗЕРТТЕУ <ArrowUpRight size={13} /></span>
            </button>;
          })}</div>
        </section>
      )}
      <Callout onNavigate={onNavigate} />
    </>
  );
}

function StandardPage({ page, onNavigate, query }) {
  const Icon = NAV_ICONS[page.slug] || Music2;
  const relevantBlocks = (page.blocks || []).filter((block) => !query || `${block.title} ${block.body}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <>
      <section className="page-banner"><div className="page-banner-art"><div className="banner-sun" /><Icon size={145} strokeWidth={0.65} /></div><div className="content-width page-banner-inner"><div className="eyebrow"><span /> КҮЙ АНАСЫ · ЦИФРЛЫҚ ЭНЦИКЛОПЕДИЯ</div><h1>{page.title}</h1><p>{page.description}</p><div className="breadcrumb"><button onClick={() => onNavigate('home')}>Басты бет</button><span>/</span><span>{page.title}</span></div></div></section>
      <section className="editorial content-width">
        {relevantBlocks.map((block, index) => <ContentBlock key={block.id || index} block={block} index={index} />)}
        {relevantBlocks.length === 0 && <p className="empty-search">Сұрауыңыз бойынша ақпарат табылмады.</p>}
      </section>
      <Callout onNavigate={onNavigate} />
    </>
  );
}

function ContentBlock({ block, index }) {
  if (block.type === 'stats') {
    return <div className="editorial-stats">{block.items?.map((item) => <div key={item.label}><strong>{item.value}</strong><span>{item.label}</span></div>)}</div>;
  }
  if (block.type === 'cards') {
    return <div className="editorial-cards"><div className="section-label"><span>БАҒЫТТАР</span><i /></div><h2>{block.title}</h2><p>{block.body}</p><div className="mini-card-grid">{(block.items || []).map((item) => <article className="mini-card" key={item.title}><span>{item.meta}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></div>;
  }
  if (block.type === 'quote') {
    return <blockquote className="editorial-quote"><Quote size={24} /><p>{block.body}</p><cite>{block.title}</cite></blockquote>;
  }
  if (block.type === 'feature') {
    return <article className={`editorial-block ${index % 2 ? 'block-offset' : ''}`}><span className="block-kicker">{block.eyebrow || 'МҰРА ЖӘНЕ ТАРИХ'}</span><h2>{block.title}</h2><p>{block.body}</p></article>;
  }
  return <article className={`editorial-block ${index % 2 ? 'block-offset' : ''}`}><span className="block-kicker">0{index + 1} / ТАРИХ</span><h2>{block.title}</h2><p>{block.body}</p>{block.link && <a className="underlined-link" href={block.link} target="_blank" rel="noreferrer">Толығырақ <ArrowUpRight size={15} /></a>}</article>;
}

function Callout({ onNavigate }) {
  return <section className="callout"><div className="callout-pattern" /><div className="callout-content"><div className="section-label"><span>ОРТАҚ МҰРА</span><i /></div><h2>Ұлы дала әуені<br />ұрпаққа аманат.</h2><p>Қазақтың музыкалық мұрасын танып-біліңіз және оны бірге сақтайық.</p><button className="button button-light" onClick={() => onNavigate('library')}>Кітапханаға өту <ArrowRight size={16} /></button></div><span className="callout-stamp">QAZAQ<br />MURASY<br /><i>✳</i></span></section>;
}

function AdminPanel({ pages, token, onTokenChange, onPagesChange, onExit }) {
  const [activeSlug, setActiveSlug] = useState(pages[0]?.slug || '');
  const [draft, setDraft] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [itemsDrafts, setItemsDrafts] = useState({});
  const [itemsErrors, setItemsErrors] = useState({});
  const activePage = pages.find((page) => page.slug === activeSlug);

  useEffect(() => {
    setDraft(activePage ? structuredClone(activePage) : null);
    setItemsDrafts(Object.fromEntries((activePage?.blocks || [])
      .filter((block) => ['stats', 'cards'].includes(block.type))
      .map((block) => [block.id, JSON.stringify(block.items || [], null, 2)])));
    setItemsErrors({});
  }, [activeSlug, pages]);

  const updateDraft = (key, value) => setDraft((current) => ({ ...current, [key]: value }));
  const updateBlock = (id, key, value) => setDraft((current) => ({
    ...current,
    blocks: current.blocks.map((block) => block.id === id ? { ...block, [key]: value } : block),
  }));
  const handleSave = async () => {
    setError('');
    setNotice('');
    setSaving(true);
    try {
      const blocks = draft.blocks.map((block) => {
        if (!['stats', 'cards'].includes(block.type)) return block;
        const items = JSON.parse(itemsDrafts[block.id] ?? JSON.stringify(block.items || []));
        if (!Array.isArray(items)) throw new Error('Карточка деректері массив болуы керек.');
        return { ...block, items };
      });
      const saved = await savePage({ ...draft, blocks }, token);
      onPagesChange((current) => current.map((page) => page.slug === saved.slug ? saved : page));
      setNotice('Өзгерістер сақталды.');
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };
  const handleAddPage = async () => {
    setError('');
    try {
      const slug = toSlug(newTitle) || `page-${Date.now()}`;
      const created = await createPage({ slug, title: newTitle.trim(), description: '', position: pages.length, blocks: [EMPTY_BLOCK()] }, token);
      onPagesChange((current) => [...current, created]);
      setActiveSlug(created.slug);
      setNewTitle('');
      setNotice('Жаңа бөлім жасалды.');
    } catch (createError) {
      setError(createError.message);
    }
  };

  return (
    <div className="admin-shell">
      <header className="admin-topbar"><a className="brand" href="#" onClick={(event) => { event.preventDefault(); onExit(); }}><span className="brand-mark">К</span><span className="brand-copy"><strong>КҮЙ АНАСЫ</strong><small>ӘКІМШІ ПАНЕЛІ</small></span></a><span className="admin-mode"><span /> Жобаны басқару</span><button className="admin-exit" onClick={onExit}><ArrowLeft size={16} /> Сайтқа оралу</button></header>
      <div className="admin-layout">
        <aside className="admin-sidebar"><div className="admin-side-title"><span>МАЗМҰН</span><Settings2 size={15} /></div>
          <div className="admin-page-list">{pages.map((page) => <button key={page.slug} className={page.slug === activeSlug ? 'admin-page active' : 'admin-page'} onClick={() => setActiveSlug(page.slug)}><span>{page.title}</span><ArrowUpRight size={14} /></button>)}</div>
          <div className="add-page-box"><label htmlFor="new-page">ЖАҢА БӨЛІМ</label><input id="new-page" value={newTitle} onChange={(event) => setNewTitle(event.target.value)} placeholder="Бөлім атауы" /><button disabled={!newTitle.trim() || !token} onClick={handleAddPage}><Plus size={15} /> Бөлім қосу</button></div>
          <div className="token-box"><label htmlFor="admin-token"><LockKeyhole size={14} /> ӘКІМШІ КІЛТІ</label><input id="admin-token" type="password" value={token} onChange={(event) => onTokenChange(event.target.value)} placeholder="ADMIN_TOKEN" /><small>Құпиясөз Render серверінде орнатылады.</small></div>
        </aside>
        <main className="admin-editor">
          <div className="editor-heading"><div><span className="block-kicker">БЕТТІ ӨҢДЕУ</span><h1>{draft?.title || 'Бөлімді таңдаңыз'}</h1></div><button disabled={!draft || !token || saving} className="button button-dark" onClick={handleSave}><Save size={16} /> {saving ? 'Сақталуда…' : 'Сақтау'}</button></div>
          {error && <div className="editor-alert error-alert">{error}</div>}
          {notice && <div className="editor-alert success-alert"><Check size={16} /> {notice}</div>}
          {!token && <div className="editor-alert info-alert"><LockKeyhole size={17} /><span>Өңдеу үшін сервер иесінен әкімші кілтін сұрап, жоғарыға енгізіңіз.</span></div>}
          {draft && <>
            <section className="edit-card"><div className="edit-card-heading"><div><span>01</span><strong>Бет туралы</strong></div><span>МІНДЭТТІ МӘТІН</span></div><label>Бөлім атауы<input value={draft.title} onChange={(event) => updateDraft('title', event.target.value)} /></label><label>Қысқаша сипаттама<textarea rows="3" value={draft.description} onChange={(event) => updateDraft('description', event.target.value)} /></label></section>
            <div className="blocks-heading"><div><span className="block-kicker">ҚҰРЫЛЫМ</span><h2>Контент блоктары <span>{draft.blocks.length}</span></h2></div><button className="add-block-button" onClick={() => updateDraft('blocks', [...draft.blocks, EMPTY_BLOCK()])}><Plus size={16} /> Блок қосу</button></div>
            <div className="block-edit-list">{draft.blocks.map((block, index) => <section className="edit-card block-edit-card" key={block.id}><div className="edit-card-heading"><div><span>{String(index + 1).padStart(2, '0')}</span><strong>Контент блогы</strong></div><div className="block-controls"><button disabled={index === 0} title="Жоғары жылжыту" onClick={() => moveBlock(draft, updateDraft, index, -1)}><ArrowUp size={15} /></button><button disabled={index === draft.blocks.length - 1} title="Төмен жылжыту" onClick={() => moveBlock(draft, updateDraft, index, 1)}><ArrowDown size={15} /></button><button className="delete-block" title="Блокты өшіру" onClick={() => updateDraft('blocks', draft.blocks.filter((item) => item.id !== block.id))}><Trash2 size={15} /></button></div></div><label>Блок түрі<select value={block.type} onChange={(event) => { const type = event.target.value; updateBlock(block.id, 'type', type); if (['stats', 'cards'].includes(type)) setItemsDrafts((current) => ({ ...current, [block.id]: JSON.stringify(block.items || [], null, 2) })); }}><option value="text">Мәтін</option><option value="feature">Ерекше тақырып</option><option value="quote">Дәйексөз</option><option value="stats">Сандар</option><option value="cards">Карточкалар</option></select></label><label>Тақырып<input value={block.title || ''} onChange={(event) => updateBlock(block.id, 'title', event.target.value)} /></label><label>Мәтін<textarea rows="4" value={block.body || ''} onChange={(event) => updateBlock(block.id, 'body', event.target.value)} /></label>{block.type === 'feature' && <label>Қосымша белгі<input value={block.eyebrow || ''} onChange={(event) => updateBlock(block.id, 'eyebrow', event.target.value)} placeholder="1861 — 1955" /></label>}{['stats', 'cards'].includes(block.type) && <label>Карточка деректері (JSON)<textarea className="json-input" rows="5" value={itemsDrafts[block.id] ?? JSON.stringify(block.items || [], null, 2)} onChange={(event) => { const value = event.target.value; setItemsDrafts((current) => ({ ...current, [block.id]: value })); try { const items = JSON.parse(value); if (!Array.isArray(items)) throw new Error('JSON массив емес.'); updateBlock(block.id, 'items', items); setItemsErrors((current) => ({ ...current, [block.id]: '' })); } catch { setItemsErrors((current) => ({ ...current, [block.id]: 'Дұрыс JSON массив енгізіңіз.' })); } }} /></label>}{itemsErrors[block.id] && <div className="json-error">{itemsErrors[block.id]}</div>}</section>)}</div>
          </>}
        </main>
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
