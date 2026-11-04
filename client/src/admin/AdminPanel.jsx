import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  FilePlus2, Trash2, ArrowUp, ArrowDown, ShieldCheck, UserCheck, Eye, Pencil, Save, Plus,
  Users, ArrowLeft, Check, FolderOpen, X, History,
} from 'lucide-react';
import {
  createPage, savePage, getAdminPages, getPages, approvePages, rejectPage,
  getEditors, approveEditor, deleteEditor, getSessionUser,
} from '../api';
import { BLOCK_TYPES, PARENT_SECTIONS, UI_TRANSLATIONS } from '../constants';
import { ConstructorQRPreview } from '../components/ConstructorQRPreview';
import { BrandMark } from '../components/BrandMark';
import { StandardPage } from '../pages/StandardPage';
import { AuthView } from './AuthView';
import { ItemsEditor } from './ItemsEditor';
import { AuditLogView } from './AuditLogView';
import { createEmptyPage, createBlock, moveBlock, toSlug } from './adminUtils';

/** For editing, an editor's unapproved draft takes precedence over the published version. */
function withDraft(page) {
  if (!page?.pending_draft) return page;
  return { ...page, ...page.pending_draft };
}

/**
 * Pages whose public view is still rendered by dedicated JSX (App.jsx), so CMS edits are not visible yet.
 * Temporary: removed page by page as their content moves into CMS blocks (plan stage C).
 */
const CODE_RENDERED_SLUGS = new Set([
  'home', 'projects-muragerler', 'projects-alley', 'projects-monument',
  'people-kuyshi', 'people-zhyrau', 'people-anshi', 'about-leadership', 'about-charter',
]);
const isCodeRendered = (slug) => CODE_RENDERED_SLUGS.has(slug) || slug.startsWith('library-vol-');

function needsReview(page) {
  return page.status === 'pending' || !!page.pending_draft;
}

export function AdminPanel({ sessionUser, onSessionUserChange, onPagesChange, onExit, navLabels }) {
  const [route, setRoute] = useState(window.location.hash || '#admin');
  const [adminPages, setAdminPages] = useState([]);
  const [draft, setDraft] = useState(() => createEmptyPage(0));
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedSlugs, setSelectedSlugs] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [accounts, setAccounts] = useState([]);
  /** A notice to show after the next route change (e.g. after creating a page). */
  const flashNotice = useRef('');

  const token = sessionUser?.token;
  const isSuperAdmin = sessionUser?.role === 'SUPER_ADMIN';
  const editablePages = adminPages;
  const editingSlug = route.startsWith('#admin/edit/') ? decodeURIComponent(route.slice('#admin/edit/'.length)) : '';
  const activePage = editablePages.find((page) => page.slug === editingSlug);
  const pendingAccounts = accounts.filter((a) => a.status === 'pending');

  /** A 401 means the server session is gone: drop the local session and show the login form. */
  const handleApiError = useCallback((apiError) => {
    if (apiError?.status === 401) {
      onSessionUserChange(null);
      return;
    }
    setError(apiError.message);
  }, [onSessionUserChange]);

  const refreshPages = useCallback(async () => {
    if (!token) return;
    try {
      setAdminPages(await getAdminPages(token));
      onPagesChange(await getPages());
    } catch (apiError) {
      handleApiError(apiError);
    }
  }, [token, onPagesChange, handleApiError]);

  const refreshAccounts = useCallback(async () => {
    if (!token || !isSuperAdmin) return;
    try {
      setAccounts(await getEditors(token));
    } catch (apiError) {
      handleApiError(apiError);
    }
  }, [token, isSuperAdmin, handleApiError]);

  useEffect(() => {
    if (!token) return;
    getSessionUser(token).catch(handleApiError);
    refreshPages();
    refreshAccounts();
    // Reload only when the session changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    const handleHash = () => setRoute(window.location.hash || '#admin');
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    if (route === '#admin') setDraft(createEmptyPage(editablePages.length));
    else if (activePage) setDraft(structuredClone(withDraft(activePage)));
    else setDraft(null);
    setPreviewOpen(false);
    setError('');
    // Notices survive a reload of the same page so that "sent for review" stays visible.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route, activePage?.slug, activePage?.updated_at, activePage?.pending_at]);

  useEffect(() => {
    setNotice(flashNotice.current);
    flashNotice.current = '';
  }, [route]);

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
      // Authorship, status and approval fields are assigned by the server.
      const payload = {
        slug,
        title: draft.title.trim(),
        description: draft.description || '',
        position: Number.isInteger(draft.position) ? draft.position : editablePages.length,
        parent_slug: draft.parent_slug || 'people',
        change_summary: draft.change_summary?.trim() || (draft.slug ? 'Мәтін мен модульдер жаңартылды' : 'Жаңадан жасалған бет'),
        blocks: draft.blocks,
      };

      if (draft.slug) {
        await savePage(payload, token);
        await refreshPages();
        setNotice(isSuperAdmin
          ? 'Бет сәтті бекітілді және жарияланды.'
          : 'Өзгерістер Бас әкімшінің мақұлдауына жіберілді. Оқырмандар әзірге бұрынғы нұсқаны көреді.');
      } else {
        const saved = await createPage(payload, token);
        await refreshPages();
        flashNotice.current = isSuperAdmin
          ? 'Жаңа бет жасалып, бірден жарияланды.'
          : 'Жаңа бет Бас әкімшінің қарауына жіберілді. Бекітілгенге дейін сайтта көрінбейді.';
        window.location.hash = `#admin/edit/${encodeURIComponent(saved.slug)}`;
      }
    } catch (saveError) {
      handleApiError(saveError);
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async (slugs) => {
    if (!slugs.length) return;
    setError('');
    try {
      const approved = await approvePages(slugs, token);
      await refreshPages();
      setSelectedSlugs([]);
      setNotice(approved.length === 1
        ? `«${approved[0].title}» беті бекітіліп, жарияланды.`
        : `Таңдалған ${approved.length} бет бір уақытта бекітіліп, жарияланды.`);
    } catch (apiError) {
      handleApiError(apiError);
    }
  };

  const handleReject = async (page) => {
    const reason = window.prompt(`«${page.title}» — қабылдамау себебі (журналға жазылады):`, '');
    if (reason === null) return;
    setError('');
    try {
      await rejectPage(page.slug, reason, token);
      await refreshPages();
      setNotice(`«${page.title}» бойынша өзгерістер қабылданбады.`);
    } catch (apiError) {
      handleApiError(apiError);
    }
  };

  const toggleSelectPage = (slug) => {
    setSelectedSlugs((prev) => prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]);
  };

  const handleSelectAll = (list) => {
    if (selectedSlugs.length === list.length) setSelectedSlugs([]);
    else setSelectedSlugs(list.map((p) => p.slug));
  };

  const handleApproveAccount = async (acc) => {
    try {
      await approveEditor(acc.id, token);
      await refreshAccounts();
      setNotice(`${acc.full_name} аккаунтына рұқсат берілді.`);
    } catch (apiError) {
      handleApiError(apiError);
    }
  };

  const handleDeleteAccount = async (acc) => {
    if (!window.confirm(`${acc.full_name} редакторының аккаунтын өшіруді растайсыз ба?`)) return;
    try {
      await deleteEditor(acc.id, token);
      await refreshAccounts();
      setNotice('Аккаунт өшірілді.');
    } catch (apiError) {
      handleApiError(apiError);
    }
  };

  if (!sessionUser) {
    return <AuthView onLoginSuccess={onSessionUserChange} onExit={onExit} />;
  }

  const filteredPages = editablePages.filter((p) => {
    if (statusFilter === 'pending') return needsReview(p);
    if (statusFilter === 'published') return p.status === 'published' && !p.pending_draft;
    return true;
  });

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <a className="brand" href="#" onClick={(event) => { event.preventDefault(); onExit(); }}>
          <BrandMark />
          <span className="brand-copy"><strong>Күй анасы</strong><small>КОНСТРУКТОР</small></span>
        </a>
        <nav className="constructor-nav" aria-label="Конструктор">
          <button className={route === '#admin' || route.startsWith('#admin/edit/') ? 'active' : ''} onClick={() => { window.location.hash = '#admin'; }}>Жаңа бет</button>
          <button className={route === '#admin/pages' ? 'active' : ''} onClick={() => { window.location.hash = '#admin/pages'; }}>Беттер <span>{editablePages.length}</span></button>
          {isSuperAdmin && (
            <button className={route === '#admin/users' ? 'active' : ''} onClick={() => { window.location.hash = '#admin/users'; }}>
              <Users size={15} /> Әкімшілер {pendingAccounts.length > 0 && <span>{pendingAccounts.length}</span>}
            </button>
          )}
          {isSuperAdmin && (
            <button className={route === '#admin/audit' ? 'active' : ''} onClick={() => { window.location.hash = '#admin/audit'; }}>
              <History size={15} /> Журнал
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
      {route === '#admin/audit' && isSuperAdmin ? (
        <AuditLogView token={token} onApiError={handleApiError} />
      ) : route === '#admin/users' && isSuperAdmin ? (
        <main className="pages-manager">
          <div className="pages-manager-heading">
            <div>
              <span className="block-kicker">БАҚЫЛАУ ПАНЕЛІ</span>
              <h1>Әкімшілер мен Редакторлар</h1>
              <p>Сайтқа тіркелген редакторларға рұқсат беру немесе өшіру.</p>
            </div>
          </div>
          {error && <div className="editor-alert error-alert">{error}</div>}
          {notice && <div className="editor-alert success-alert"><Check size={16} /> {notice}</div>}
          {accounts.length === 0 && (
            <div className="pages-empty">
              <Users size={34} />
              <h2>Тіркелген редакторлар жоқ</h2>
              <p>Редактор «Кіру → Редактор → Тіркелу» арқылы өтініш бере алады.</p>
            </div>
          )}
          <div className="page-library">
            {accounts.map((acc) => (
              <div key={acc.id} className="account-card">
                <div className="account-info">
                  <h3>{acc.full_name}</h3>
                  <p>Логин: <strong>{acc.username}</strong> · Тіркелген күні: {new Date(acc.created_at).toLocaleDateString()}</p>
                </div>
                <div className="account-actions">
                  {acc.status === 'pending' ? (
                    <>
                      <span className="page-status-badge badge-pending">Мақұлдауды күтуде</span>
                      <button className="button button-dark" onClick={() => handleApproveAccount(acc)}><Check size={15} /> Рұқсат беру</button>
                    </>
                  ) : (
                    <span className="page-status-badge badge-published">Рұқсат берілген</span>
                  )}
                  <button className="button button-outline" onClick={() => handleDeleteAccount(acc)} title="Өшіру"><Trash2 size={15} /></button>
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
              <span className="block-kicker">САЙТ БЕТТЕРІ</span>
              <h1>Беттер</h1>
              <p>Бетті таңдап өңдеңіз, мақұлдаңыз немесе сақтаңыз.</p>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
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
              Барлығы ({editablePages.length})
            </button>
            <button className={statusFilter === 'pending' ? 'active' : ''} onClick={() => setStatusFilter('pending')}>
              Қаралуда ({editablePages.filter(needsReview).length})
            </button>
            <button className={statusFilter === 'published' ? 'active' : ''} onClick={() => setStatusFilter('published')}>
              Жарияланғандар ({editablePages.filter((p) => p.status === 'published' && !p.pending_draft).length})
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
                onClick={() => handleApprove(selectedSlugs)}
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
                        <span className="page-library-tag">{navLabels[page.parent_slug] || page.parent_slug || 'Тұлғалар'}</span>
                        <span className={`page-status-badge ${needsReview(page) || page.status === 'rejected' ? 'badge-pending' : 'badge-published'}`}>
                          {page.status === 'pending' ? 'Қаралуда (Күтуде)'
                            : page.status === 'rejected' ? 'Қабылданбады'
                            : page.pending_draft ? 'Жарияланған · өзгерістер қаралуда' : 'Жарияланған'}
                        </span>
                        <span className="page-library-slug">/{page.slug}</span>
                      </div>
                      <h2>{page.title}</h2>
                      {isCodeRendered(page.slug) && (
                        <p className="editor-status-notice">
                          Бұл бет әзірге код арқылы көрсетіледі: мұндағы өзгерістер сайтта көрінбейді. Мазмұнды CMS-ке көшіру жұмысы жүріп жатыр.
                        </p>
                      )}
                      <p>{page.description || 'Қысқаша сипаттамасы жоқ.'}</p>

                      <div className="page-audit-box">
                        <span>👤 <strong>Авторы:</strong> {page.created_by || 'Бас әкімші'}</span>
                        {page.pending_draft && (
                          <span>✏️ <strong>Жаңа нұсқа:</strong> {page.pending_by} ({new Date(page.pending_at).toLocaleString()}) — {page.pending_draft.change_summary}</span>
                        )}
                        {page.change_summary && <span>📝 <strong>Өзгерістер:</strong> {page.change_summary}</span>}
                        {page.approved_at && (
                          <span>✅ <strong>Бекіткен:</strong> {page.approved_by || 'Бас әкімші'} ({new Date(page.approved_at).toLocaleString()})</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {isSuperAdmin && needsReview(page) && (
                      <>
                        <button className="button button-dark" onClick={() => handleApprove([page.slug])} title="Бұл бетті бекітіп, жариялау">
                          <Check size={15} /> Бекіту
                        </button>
                        <button className="button button-outline" onClick={() => handleReject(page)} title="Өзгерістерді қабылдамау">
                          <X size={15} /> Қабылдамау
                        </button>
                      </>
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
                <StandardPage page={{ ...draft, slug: draft.slug || toSlug(draft.title) || 'preview' }} onNavigate={() => {}} query="" navLabels={navLabels} t={UI_TRANSLATIONS.kk} />
              </div>
            ) : draft && (
              <>
                <section className="edit-card page-settings-card">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    <label>
                      Негізгі бөлім (Бұл бет қай санатқа тиесілі?)
                      <select
                        value={draft.parent_slug || 'people'}
                        onChange={(event) => updateDraft('parent_slug', event.target.value)}
                      >
                        {PARENT_SECTIONS.map((sec) => (
                          <option key={sec.slug} value={sec.slug}>
                            {navLabels[sec.slug] || sec.slug} — {sec.title}
                          </option>
                        ))}
                      </select>
                    </label>

                  </div>

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
                        {block.type === 'qr' && (
  <div>
    <label>
      QR кодқа апаратын сілтеме
      <input
        type="url"
        value={block.link || ''}
        onChange={(event) => updateBlock(block.id, 'link', event.target.value)}
        placeholder="https://example.com"
      />
    </label>
    <div className="constructor-qr-preview">
      {block.link ? (
        <ConstructorQRPreview link={block.link} />
      ) : (
        <div className="constructor-qr-preview-info">Сілтемені енгізген сәтте QR-код осы жерде бірден шығады.</div>
      )}
    </div>
  </div>
)}
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
