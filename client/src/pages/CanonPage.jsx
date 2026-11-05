import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useFocusTrap } from '../components/useFocusTrap';
import {
  PiSparkleDuotone,
  PiMagnifyingGlassDuotone,
  PiMusicNotesDuotone,
  PiUserDuotone,
  PiMapPinDuotone,
  PiBookOpenDuotone,
  PiCheckCircleDuotone,
} from 'react-icons/pi';

import { CANON_DATA } from '../constants/kuishiData';

export default function CanonPage({ type = 'kuyshi', onNavigate, lang = 'kk', t, navLabels = {} }) {
  const canon = CANON_DATA[type] || CANON_DATA.kuyshi;
  const c = canon[lang] || canon.kk;
  // Fallback to kk masters if other lang empty
  const mastersList = (c.masters && c.masters.length > 0) ? c.masters : canon.kk.masters;

  const [activeSchool, setActiveSchool] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaster, setSelectedMaster] = useState(null);

  const filteredMasters = useMemo(() => {
    return mastersList.filter((m) => {
      const matchSchool = activeSchool === 'all' || m.school === activeSchool;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.region.toLowerCase().includes(q) ||
        (m.kuis && m.kuis.some((k) => k.toLowerCase().includes(q)));
      return matchSchool && matchQuery;
    });
  }, [mastersList, activeSchool, searchQuery]);

  const modalRef = useRef(null);
  useFocusTrap(modalRef, !!selectedMaster, { initialFocus: '.modal-close-btn' });

  useEffect(() => {
    if (!selectedMaster) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setSelectedMaster(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedMaster]);

  // Arriving from the heritage map: open the requested master's card.
  useEffect(() => {
    let focusId = null;
    try {
      focusId = sessionStorage.getItem('kui-canon-focus');
      if (focusId) sessionStorage.removeItem('kui-canon-focus');
    } catch (e) { focusId = null; }
    if (!focusId) return;
    const target = mastersList.find((m) => m.id === focusId);
    if (!target) return;
    setSelectedMaster(target);
    const timer = setTimeout(() => {
      const el = document.getElementById(`canon-master-${focusId}`);
      if (el) el.scrollIntoView({ block: 'center' });
    }, 350);
    return () => clearTimeout(timer);
  }, [mastersList]);

  return (
    <div className="dedicated-subpage canon-subpage">
      {/* 1. Page Banner */}
      <section className="page-banner page-banner-people">
        <div className="page-banner-image">
          <img src="/images/dina-monument.jpg" alt={c.title} />
        </div>
        <div className="content-width page-banner-inner">
          <span className="block-kicker banner-parent-kicker">{navLabels['people'] || 'Тұлғалар'}</span>
          <h1>{c.title}</h1>
          <p>{c.lead}</p>

          <div className="breadcrumb">
            <button onClick={() => onNavigate('home')}>{t.backHome || 'Басты бет'}</button>
            <span>/</span>
            <button onClick={() => onNavigate('people')}>{navLabels['people'] || 'Тұлғалар'}</button>
            <span>/</span>
            <span>{c.title}</span>
          </div>
        </div>
      </section>

      {/* 2. Interactive Search & Filters */}
      <section className="subpage-section content-width">
        <div className="canon-filter-bar">
          <div className="canon-search-box">
            <PiMagnifyingGlassDuotone size={20} className="search-icon" />
            <input
              type="text"
              placeholder={lang === 'kk' ? 'Есімі, өңірі немесе шығармасы бойынша іздеу...' : 'Поиск по имени, региону или произведению...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>

          <div className="canon-school-pills">
            {c.schools.map((s) => (
              <button
                key={s.id}
                className={`canon-pill ${activeSchool === s.id ? 'active' : ''}`}
                onClick={() => setActiveSchool(s.id)}
              >
                <span>{s.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Masters Grid */}
        <div className="canon-masters-grid">
          {filteredMasters.map((m) => {
            return (
              <div key={m.id} id={`canon-master-${m.id}`} className="canon-master-card">
                <div className="master-avatar-wrap">
                  <img src={m.img} alt={m.name} />
                  <span className="master-school-tag">{m.schoolName}</span>
                </div>
                <div className="master-card-content">
                  <div className="master-header">
                    <h3>{m.name}</h3>
                    <span className="master-dates">{m.dates}</span>
                  </div>
                  <p className="master-region">
                    <PiMapPinDuotone size={15} />
                    <span>{m.region}</span>
                  </p>
                  <p className="master-bio">{m.bio}</p>

                  <div className="master-works">
                    <strong>{type === 'kuyshi' ? 'Басты күйлері:' : type === 'zhyrau' ? 'Басты толғаулары:' : 'Басты әндері:'}</strong>
                    <div className="works-pills">
                      {m.kuis.map((work, wIdx) => (
                        <span key={wIdx} className="work-pill">{work}</span>
                      ))}
                    </div>
                  </div>

                  <div className="master-actions">
                    <button
                      className="details-btn"
                      onClick={() => setSelectedMaster(m)}
                    >
                      <span>Толығырақ</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredMasters.length === 0 && (
          <div className="empty-canon-state">
            <p>{lang === 'kk' ? 'Бұл санат бойынша ешқандай тұлға табылмады.' : 'По данному фильтру ничего не найдено.'}</p>
            <button className="button button-outline" onClick={() => { setActiveSchool('all'); setSearchQuery(''); }}>
              {lang === 'kk' ? 'Сүзгілерді тазарту' : 'Сбросить фильтры'}
            </button>
          </div>
        )}
      </section>

      {/* Detail Modal */}
      {selectedMaster && (
        <div className="master-modal-backdrop" onClick={() => setSelectedMaster(null)}>
          <div className="master-modal-card" ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="canon-modal-title" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedMaster(null)} aria-label={t.closeLabel}>✕</button>
            <div className="modal-header">
              <img src={selectedMaster.img} alt={selectedMaster.name} />
              <div>
                <span className="block-kicker">{selectedMaster.schoolName}</span>
                <h2 id="canon-modal-title">{selectedMaster.name}</h2>
                <span className="modal-dates">{selectedMaster.dates} · {selectedMaster.region}</span>
              </div>
            </div>
            <div className="modal-body">
              <h4>Өмірбаяны мен шығармашылық мұрасы</h4>
              <p>{selectedMaster.bio}</p>
              <h4 style={{ marginTop: 20 }}>Шығармалары мен туындылары:</h4>
              <div className="works-pills">
                {selectedMaster.kuis.map((w, idx) => (
                  <span key={idx} className="work-pill" style={{ padding: '6px 14px', fontSize: 14 }}>{w}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <div className="subpage-bottom-nav content-width">
        <button className="button button-outline" onClick={() => onNavigate('people')}>
          <span>← {navLabels['people'] || 'Тұлғалар бөлімі'}</span>
        </button>
      </div>
    </div>
  );
}

