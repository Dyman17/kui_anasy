import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { KUISHI_MASTERS } from '../constants/kuishiData';
import './HeritageMap.css';

/*
 * Interactive historical map of küi regions and schools.
 * - Simplified Kazakhstan silhouette (approximate, schematic, not a survey map).
 * - Smooth zoom by animating the SVG viewBox (rAF + easing), instant under prefers-reduced-motion.
 * - Küishi are assigned to regions ONLY by matching keywords against the `region`
 *   text already stored in kuishiData.js. Nothing is invented here.
 */

const VB_W = 1000;
const VB_H = 560;
const FULL_VIEW = { x: 0, y: 0, w: VB_W, h: VB_H };
const ZOOM_W = 380;
const ANIM_MS = 900;

// Equirectangular projection tuned to Kazakhstan (lon 46–88, lat 40.5–55.6).
const project = (lon, lat) => [
  Math.round((lon - 46) * 24 * 10) / 10,
  Math.round((55.6 - lat) * 35.8 * 10) / 10,
];

// Approximate border outline (lon, lat), clockwise from the west.
const OUTLINE_LONLAT = [
  [46.5, 48.4], [47.3, 50.3], [48.7, 50.6], [48.8, 51.6], [50.8, 51.7], [52.3, 51.8],
  [54.6, 51.0], [55.7, 50.6], [57.0, 51.1], [58.6, 51.1], [59.9, 50.8], [61.4, 50.8],
  [61.7, 52.0], [60.0, 52.1], [61.0, 53.0], [62.0, 53.9], [65.2, 54.6], [67.8, 54.9],
  [69.2, 55.4], [70.8, 55.2], [71.2, 54.1], [73.4, 53.9], [73.8, 53.6], [76.2, 54.2],
  [77.9, 53.3], [80.0, 51.0], [81.5, 50.8], [83.4, 51.0], [85.0, 50.0], [86.8, 49.8],
  [87.3, 49.1], [86.0, 48.5], [85.5, 47.1], [83.0, 47.2], [82.3, 45.5], [79.9, 44.9],
  [80.5, 43.0], [80.2, 42.1], [79.0, 42.8], [76.0, 43.0], [75.0, 42.8], [73.5, 42.5],
  [71.0, 42.2], [70.5, 41.5], [69.2, 41.0], [68.0, 40.6], [66.5, 41.9], [66.0, 43.0],
  [64.5, 43.6], [62.0, 43.5], [58.6, 45.6], [56.0, 45.0], [56.0, 41.3], [53.0, 42.0],
  [52.5, 42.2], [51.8, 43.5], [51.0, 44.4], [50.3, 44.6], [51.3, 45.3], [53.0, 45.3],
  [53.2, 46.6], [51.5, 47.0], [49.8, 46.4], [48.6, 46.3], [47.2, 47.5],
];

const OUTLINE_PATH = `M${OUTLINE_LONLAT.map(([lo, la]) => project(lo, la).join(',')).join(' L')} Z`;

// Region markers. `keys` are matched against each master's `region` text.
const REGIONS = [
  { id: 'bokey', name: 'Бөкей Ордасы', at: [47.6, 48.8], keys: ['бөкей', 'нарын'] },
  { id: 'saraishyq', name: 'Сарайшық / Атырау', at: [51.7, 47.3], keys: ['сарайшық', 'атырау'] },
  { id: 'mangystau', name: 'Маңғыстау', at: [53.4, 44.1], keys: ['маңғыстау'] },
  { id: 'aral', name: 'Шалқар / Арал', at: [60.6, 47.2], keys: ['шалқар', 'арал'] },
  { id: 'karatau', name: 'Қаратау / Түркістан / Отырар', at: [68.6, 43.3], keys: ['қаратау', 'түркістан', 'отырар', 'созақ'] },
  { id: 'ulytau', name: 'Ұлытау / Жезқазған', at: [67.3, 48.2], keys: ['ұлытау', 'жезқазған'] },
  { id: 'saryarka', name: 'Сарыарқа / Қарқаралы', at: [75.0, 49.6], keys: ['сарыарқа', 'қарқаралы', 'қарақаралы'] },
  { id: 'tarbagatai', name: 'Тарбағатай / Алтай', at: [83.4, 48.4], keys: ['тарбағатай', 'алтай'] },
  { id: 'jetysu', name: 'Жетісу', at: [78.4, 44.7], keys: ['жетісу'] },
].map((r) => {
  const [x, y] = project(r.at[0], r.at[1]);
  return { ...r, x, y };
});

const LABELS = {
  kk: {
    kicker: 'КҮЙ КАРТАСЫ · ТАРИХИ ӨҢІРЛЕР',
    title: 'Күй мектептерінің тарихи картасы',
    lead: 'Өңірді таңдаңыз: карта сол аймаққа жақындап, сол жердің күйшілері туралы мәлімет ашылады.',
    resetBtn: 'Картаны толық көру',
    regionsList: 'Өңірлер тізімі',
    mapLabel: 'Қазақстанның тарихи өңірлері мен күй мектептерінің интерактивті картасы',
    pickPrompt: 'Картадан немесе тізімнен өңірді таңдаңыз.',
    empty: 'Бұл өңір бойынша мәліметтер толықтырылуда',
    years: 'Өмір сүрген жылдары',
    status: 'Дәстүрі',
    kuis: 'Басты күйлері',
    toArticle: 'Мақалаға өту',
    count: (n) => `${n} күйші`,
    schematic: 'Сызба карта · шекаралар шамамен көрсетілген',
  },
  ru: {
    kicker: 'КАРТА КЮЕВ · ИСТОРИЧЕСКИЕ РЕГИОНЫ',
    title: 'Историческая карта кюйных школ',
    lead: 'Выберите регион: карта приблизится к нему и откроет сведения о кюйши этого края.',
    resetBtn: 'Показать всю карту',
    regionsList: 'Список регионов',
    mapLabel: 'Интерактивная карта исторических регионов Казахстана и кюйных школ',
    pickPrompt: 'Выберите регион на карте или в списке.',
    empty: 'Сведения по этому региону дополняются',
    years: 'Годы жизни',
    status: 'Традиция',
    kuis: 'Известные кюи',
    toArticle: 'Перейти к статье',
    count: (n) => `кюйши: ${n}`,
    schematic: 'Схематичная карта · границы показаны приблизительно',
  },
  en: {
    kicker: 'KÜI MAP · HISTORICAL REGIONS',
    title: 'Historical map of küi schools',
    lead: 'Choose a region: the map zooms in and opens the küishi of that land.',
    resetBtn: 'View full map',
    regionsList: 'Regions',
    mapLabel: 'Interactive map of the historical regions of Kazakhstan and its küi schools',
    pickPrompt: 'Choose a region on the map or in the list.',
    empty: 'Information on this region is being compiled',
    years: 'Years of life',
    status: 'Tradition',
    kuis: 'Famous küis',
    toArticle: 'Go to article',
    count: (n) => `${n} küishi`,
    schematic: 'Schematic map · borders are approximate',
  },
};

const CANON_SLUG = 'people-kuyshi';

const formatYears = (dates = '') => dates.replace(/\s*[–—-]\s*/g, ' — ');

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function zoomViewFor(region) {
  const w = ZOOM_W;
  const h = (ZOOM_W * VB_H) / VB_W;
  const x = Math.min(Math.max(region.x - w / 2, 0), VB_W - w);
  const y = Math.min(Math.max(region.y - h / 2, 0), VB_H - h);
  return { x, y, w, h };
}

export function HeritageMap({ lang = 'kk', onNavigate }) {
  const L = LABELS[lang] || LABELS.kk;
  const svgRef = useRef(null);
  const viewRef = useRef({ ...FULL_VIEW });
  const rafRef = useRef(0);
  const panelHeadingRef = useRef(null);
  const [activeId, setActiveId] = useState(null);

  const mastersByRegion = useMemo(() => {
    const map = {};
    REGIONS.forEach((r) => {
      map[r.id] = KUISHI_MASTERS.filter((m) => {
        const text = (m.region || '').toLocaleLowerCase('kk');
        return r.keys.some((k) => text.includes(k));
      });
    });
    return map;
  }, []);

  const applyView = useCallback((v) => {
    viewRef.current = v;
    const svg = svgRef.current;
    if (!svg) return;
    svg.setAttribute('viewBox', `${v.x} ${v.y} ${v.w} ${v.h}`);
    // Counter-scale markers so they keep a constant on-screen size while zooming.
    const k = `scale(${v.w / VB_W})`;
    svg.querySelectorAll('.hm-marker-inner').forEach((node) => node.setAttribute('transform', k));
  }, []);

  const animateTo = useCallback((target) => {
    cancelAnimationFrame(rafRef.current);
    if (prefersReducedMotion()) {
      applyView(target);
      return;
    }
    const from = { ...viewRef.current };
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / ANIM_MS, 1);
      const e = easeInOutCubic(t);
      applyView({
        x: from.x + (target.x - from.x) * e,
        y: from.y + (target.y - from.y) * e,
        w: from.w + (target.w - from.w) * e,
        h: from.h + (target.h - from.h) * e,
      });
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }, [applyView]);

  useEffect(() => {
    applyView(FULL_VIEW);
    return () => cancelAnimationFrame(rafRef.current);
  }, [applyView]);

  const selectRegion = (region, { moveFocus = false } = {}) => {
    setActiveId(region.id);
    animateTo(zoomViewFor(region));
    if (moveFocus && panelHeadingRef.current) {
      panelHeadingRef.current.focus({ preventScroll: true });
    }
  };

  const resetMap = () => {
    setActiveId(null);
    animateTo(FULL_VIEW);
  };

  const openArticle = (master) => {
    try { sessionStorage.setItem('kui-canon-focus', master.id); } catch (e) { /* storage unavailable */ }
    if (typeof onNavigate === 'function') {
      onNavigate(CANON_SLUG);
    } else {
      window.location.hash = CANON_SLUG;
    }
  };

  const onMarkerKey = (event, region) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectRegion(region, { moveFocus: true });
    }
  };

  const active = REGIONS.find((r) => r.id === activeId) || null;
  const activeMasters = active ? mastersByRegion[active.id] : [];

  return (
    <section className="heritage-map content-width" aria-labelledby="heritage-map-title">
      <header className="hm-head">
        <span className="block-kicker">{L.kicker}</span>
        <h2 id="heritage-map-title">{L.title}</h2>
        <p className="hm-lead">{L.lead}</p>
      </header>

      <div className={`hm-layout ${active ? 'is-zoomed' : ''}`}>
        <div className="hm-stage">
          <svg
            ref={svgRef}
            className="hm-svg"
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            preserveAspectRatio="xMidYMid meet"
            role="group"
            aria-label={L.mapLabel}
          >
            <defs>
              <pattern id="hm-hatch" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="14" className="hm-hatch-line" />
              </pattern>
            </defs>
            <path d={OUTLINE_PATH} className="hm-land" />
            <path d={OUTLINE_PATH} className="hm-land-hatch" fill="url(#hm-hatch)" />
            <path d={OUTLINE_PATH} className="hm-border" />

            {REGIONS.map((r) => {
              const isActive = r.id === activeId;
              const n = mastersByRegion[r.id].length;
              return (
                <g
                  key={r.id}
                  className={`hm-marker ${isActive ? 'active' : ''} ${n === 0 ? 'no-data' : ''}`}
                  transform={`translate(${r.x} ${r.y})`}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isActive}
                  aria-label={`${r.name} · ${n > 0 ? L.count(n) : L.empty}`}
                  onClick={() => selectRegion(r)}
                  onKeyDown={(e) => onMarkerKey(e, r)}
                >
                  <g className="hm-marker-inner">
                    <circle r="22" className="hm-hit" />
                    <circle r="15" className="hm-focus-ring" />
                    <rect x="-7" y="-7" width="14" height="14" transform="rotate(45)" className="hm-rhombus" />
                    <text x="14" y="-12" className="hm-label">{r.name}</text>
                  </g>
                </g>
              );
            })}
          </svg>
          <p className="hm-note">{L.schematic}</p>
        </div>

        <aside className="hm-panel" aria-live="polite">
          <div className="hm-panel-top">
            <h3 ref={panelHeadingRef} tabIndex={-1} className="hm-panel-title">
              <span className="hm-diamond" aria-hidden="true">◆</span>
              {active ? active.name : L.regionsList}
            </h3>
            {active && (
              <button type="button" className="hm-reset" onClick={resetMap}>
                {L.resetBtn}
              </button>
            )}
          </div>

          {!active && <p className="hm-prompt">{L.pickPrompt}</p>}

          {active && activeMasters.length === 0 && (
            <p className="hm-empty">{L.empty}</p>
          )}

          {active && activeMasters.length > 0 && (
            <ul className="hm-cards">
              {activeMasters.map((m) => (
                <li key={m.id}>
                  <article className="hm-card">
                    <h4 className="hm-card-name">{m.name}</h4>
                    <p className="hm-card-years">
                      <span className="hm-visually-hidden">{L.years}: </span>
                      {formatYears(m.dates)}
                    </p>
                    <p className="hm-card-meta">
                      <span>{L.status}:</span> {m.schoolName}
                    </p>
                    <p className="hm-card-meta hm-card-region">{m.region}</p>
                    {m.kuis && m.kuis.length > 0 && (
                      <div className="hm-card-kuis">
                        <span>{L.kuis}:</span>
                        <ul>
                          {m.kuis.slice(0, 4).map((k) => <li key={k}>{k}</li>)}
                        </ul>
                      </div>
                    )}
                    <button type="button" className="hm-card-link" onClick={() => openArticle(m)}>
                      {L.toArticle} <span aria-hidden="true">→</span>
                    </button>
                  </article>
                </li>
              ))}
            </ul>
          )}

          <nav className="hm-region-list" aria-label={L.regionsList}>
            {REGIONS.map((r) => (
              <button
                key={r.id}
                type="button"
                className={`hm-region-btn ${r.id === activeId ? 'active' : ''}`}
                aria-pressed={r.id === activeId}
                onClick={() => selectRegion(r, { moveFocus: true })}
              >
                <span className="hm-region-name">{r.name}</span>
                <span className="hm-region-count">{mastersByRegion[r.id].length || '—'}</span>
              </button>
            ))}
          </nav>
        </aside>
      </div>
    </section>
  );
}

export default HeritageMap;
