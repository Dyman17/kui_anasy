import React, { useState, useEffect } from 'react';
import {
  FilePlus2, Trash2, ArrowUp, ArrowDown, Download, RotateCcw,
  ShieldCheck, UserCheck, Eye, Pencil, Save, Plus,
  Users, ArrowLeft, Check, FolderOpen
} from 'lucide-react';
import {
  createPage, savePage, getAdminAccounts,
  approveEditorAccount, deleteEditorAccount, bulkApprovePages, resetLocalPages
} from '../api';
import { BLOCK_TYPES, PARENT_SECTIONS, UI_TRANSLATIONS } from '../constants';
import { ConstructorQRPreview } from '../components/ConstructorQRPreview';
import { StandardPage } from '../pages/StandardPage';
import { AuthView } from './AuthView';
import { ItemsEditor } from './ItemsEditor';
import { createEmptyPage, createBlock, moveBlock, toSlug } from './adminUtils';

export function AdminPanel({ pages, sessionUser, onSessionUserChange, onPagesChange, onExit, navLabels }) {
  const [route, setRoute] = useState(window.location.hash || '#admin');
  const [draft, setDraft] = useState(() => createEmptyPage(pages.filter((p) => p.is_custom).length));
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedSlugs, setSelectedSlugs] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
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
        lang: draft.lang || 'kk',
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

  const handleBulkApprove = () => {
    if (selectedSlugs.length === 0) return;
    const updated = bulkApprovePages(selectedSlugs, 'Бас әкімші');
    onPagesChange(updated);
    setNotice(`Таңдалған ${selectedSlugs.length} бет бір уақытта бекітіліп, жарияланды!`);
    setSelectedSlugs([]);
  };

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
                        <span className="page-library-tag">{navLabels[page.parent_slug] || page.parent_slug || 'Тұлғалар'}</span>
                        <span className={`page-status-badge ${page.status === 'pending' ? 'badge-pending' : 'badge-published'}`}>
                          {page.status === 'pending' ? 'Қаралуда (Күтуде)' : 'Жарияланған'}
                        </span>
                        <span className="page-library-slug">/{page.slug}</span>
                      </div>
                      <h2>{page.title}</h2>
                      <p>{page.description || 'Қысқаша сипаттамасы жоқ.'}</p>

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

                    <label>
                      Тілдік нұсқасы (Тіл таңдау)
                      <select
                        value={draft.lang || 'kk'}
                        onChange={(event) => updateDraft('lang', event.target.value)}
                      >
                        <option value="kk">Қазақ тілінде (Негізгі)</option>
                        <option value="ru">Русский язык</option>
                        <option value="en">English version</option>
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
