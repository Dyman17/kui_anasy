import React, { useEffect, useState } from 'react';
import { BrandMark } from './BrandMark';
import './SteppeHero.css';
import { scrollToElement } from '../app/smoothScroll';

/*
 * Home hero «Дала кеші» (owner's design, 05.11.2026).
 *
 * Media slot on the right. Today it holds a DRAFT image (the dombra photo already in the
 * project). The owner will supply a generated short video of an elder with a dombra;
 * when it arrives, put the files in /public/media/ and switch HERO_MEDIA to:
 *   { type: 'video', src: '/media/hero-elder.mp4', poster: '/media/hero-elder.jpg', alt: '…' }
 * The video is decorative: muted, looping, never autoplayed for reduced-motion users.
 *
 * Background: HERO_BACKGROUND is null until the steppe-at-sunset image is supplied;
 * the CSS draws a palette-based sky in the meantime. Set it to e.g.
 * '/images/hero-steppe-sunset.jpg' once the file exists.
 */
// Draft still: front view of the dombra, cropped and compressed from dombra-real.png (kept untouched).
// While `draft` is true the image is decorative (alt=""): the owner decides the final asset and its alt.
const HERO_MEDIA = {
  type: 'image',
  src: '/images/dombra-front.webp',
  width: 420,
  height: 1592,
  alt: { kk: 'Домбыра', ru: 'Домбра', en: 'Dombra' },
  draft: true,
};

const HERO_BACKGROUND = null;

const COPY = {
  kk: {
    kicker: '«Күй анасы» жеке қоры',
    title: 'Күй анасы',
    person: 'Дина Нұрпейісова · 1861–1955',
    lead: 'Дина Нұрпейісова — Күй анасы. Батыс төкпе мектебінің мұрасы, өңірлер картасы мен қор кітапханасы.',
    toMap: 'Күй картасына',
    aboutDina: 'Дина туралы',
  },
  ru: {
    kicker: 'Частный фонд «Күй анасы»',
    title: 'Күй анасы',
    person: 'Дина Нурпеисова · 1861–1955',
    lead: 'Дина Нурпеисова — «Күй анасы», мать кюя. Наследие западной школы токпе, карта регионов и библиотека фонда.',
    toMap: 'К карте кюев',
    aboutDina: 'О Дине',
  },
  en: {
    kicker: '«Күй анасы» private foundation',
    title: 'Күй анасы',
    person: 'Dina Nurpeisova · 1861–1955',
    lead: 'Dina Nurpeisova — «Күй анасы», the mother of küi. The legacy of the western tökpe school, a map of regions and the foundation library.',
    toMap: 'To the küi map',
    aboutDina: 'About Dina',
  },
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false);
  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(query.matches);
    query.addEventListener?.('change', onChange);
    return () => query.removeEventListener?.('change', onChange);
  }, []);
  return reduced;
}

function scrollToId(id, fallbackToNext = false) {
  let target = id ? document.getElementById(id) : null;
  // Safe fallback: the section right after the hero, so the button never does nothing.
  if (!target && fallbackToNext) target = document.querySelector('.steppe-hero')?.nextElementSibling;
  if (!target) return;
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  scrollToElement(target, { reduced });
  const focusTarget = target.querySelector('h2') || target;
  if (!focusTarget.hasAttribute('tabindex')) focusTarget.setAttribute('tabindex', '-1');
  focusTarget.focus({ preventScroll: true });
}

export function SteppeHero({ lang = 'kk', mapTargetId, dinaTargetId }) {
  const copy = COPY[lang] || COPY.kk;
  const reducedMotion = usePrefersReducedMotion();
  const mediaAlt = HERO_MEDIA.alt?.[lang] || HERO_MEDIA.alt?.kk || '';

  return (
    <section
      className="steppe-hero"
      aria-labelledby="steppe-hero-title"
      style={HERO_BACKGROUND ? { '--hero-photo': `url("${HERO_BACKGROUND}")` } : undefined}
      data-has-photo={HERO_BACKGROUND ? 'true' : 'false'}
    >
      <div className="steppe-hero-sky" aria-hidden="true">
        <span className="steppe-hero-sun" />
        <span className="steppe-hero-horizon" />
      </div>
      <span className="steppe-hero-year" aria-hidden="true">1861</span>

      <div className="steppe-hero-inner">
        <div className="steppe-hero-copy">
          <BrandMark className="steppe-hero-emblem" />
          <p className="steppe-hero-kicker">{copy.kicker}</p>
          <h1 id="steppe-hero-title" className="steppe-hero-title">{copy.title}</h1>
          <span className="steppe-hero-rule" aria-hidden="true"><span /></span>
          <p className="steppe-hero-person">{copy.person}</p>
          <p className="steppe-hero-lead">{copy.lead}</p>
          <div className="steppe-hero-actions">
            <button type="button" className="steppe-btn steppe-btn-gold" onClick={() => scrollToId(mapTargetId, true)}>
              {copy.toMap}
            </button>
            {dinaTargetId && (
              <button type="button" className="steppe-btn steppe-btn-dark" onClick={() => scrollToId(dinaTargetId)}>
                {copy.aboutDina}
              </button>
            )}
          </div>
        </div>

        <figure
          className={`steppe-hero-media steppe-hero-media-${HERO_MEDIA.type}`}
          data-draft={HERO_MEDIA.draft ? 'true' : undefined}
          aria-hidden={HERO_MEDIA.draft ? 'true' : undefined}
        >
          {HERO_MEDIA.type === 'video' ? (
            <video
              src={HERO_MEDIA.src}
              poster={HERO_MEDIA.poster}
              muted
              loop
              playsInline
              autoPlay={!reducedMotion}
              preload="metadata"
              aria-label={mediaAlt}
            />
          ) : (
            <span className="steppe-hero-dombra">
              <img
                src={HERO_MEDIA.src}
                alt={HERO_MEDIA.draft ? '' : mediaAlt}
                width={HERO_MEDIA.width}
                height={HERO_MEDIA.height}
                decoding="async"
                fetchpriority="high"
              />
            </span>
          )}
        </figure>
      </div>
    </section>
  );
}
