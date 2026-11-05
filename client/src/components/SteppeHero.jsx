import React, { useEffect, useState } from 'react';
import { BrandMark } from './BrandMark';
import './SteppeHero.css';
import { scrollToElement } from '../app/smoothScroll';

/*
 * Home hero «Дала кеші» (owner's design, 05.11.2026).
 *
 * HERO_MEDIA is the full-bleed scene behind the copy: a generated still of an elder with a dombra
 * (artwork, not a real person: see the «Көркем бейне» caption). The owner's future short clip of the
 * same scene replaces it by switching to:
 *   { type: 'video', src: '/media/hero-elder.mp4', poster: '/images/hero-elder-1376.webp', ... }
 * The video is muted and looping, plays over its poster, and never autoplays under prefers-reduced-motion.
 * HERO_BACKGROUND is the steppe-sunset colour field shown under the scene while it loads (and as a fallback).
 */
const HERO_MEDIA = {
  type: 'image',
  src: '/images/hero-elder-1376.webp',
  srcMobile: '/images/hero-elder-768.webp',
  width: 1376,
  height: 768,
  widthMobile: 768,
  heightMobile: 669,
  // Decorative scene: the caption below states what it is, so no alt text is needed.
  alt: '',
};

const HERO_BACKGROUND = '/images/banner-steppe-1376.webp';
const EAGLE_SRC = '/images/eagle-400.webp';

const ART_CAPTION = { kk: 'Көркем бейне', ru: 'Художественный образ', en: 'Artistic image' };

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

  return (
    <section
      className="steppe-hero"
      aria-labelledby="steppe-hero-title"
      style={HERO_BACKGROUND ? { '--hero-photo': `url("${HERO_BACKGROUND}")` } : undefined}
      data-has-photo={HERO_BACKGROUND ? 'true' : 'false'}
    >
      <div className="steppe-hero-scene" aria-hidden="true">
        {HERO_MEDIA.type === 'video' ? (
          <video
            className="steppe-hero-media"
            src={HERO_MEDIA.src}
            poster={HERO_MEDIA.poster}
            muted
            loop
            playsInline
            autoPlay={!reducedMotion}
            preload="metadata"
          />
        ) : (
          <picture>
            <source media="(max-width: 960px)" srcSet={HERO_MEDIA.srcMobile} width={HERO_MEDIA.widthMobile} height={HERO_MEDIA.heightMobile} />
            <img
              className="steppe-hero-media"
              src={HERO_MEDIA.src}
              alt=""
              width={HERO_MEDIA.width}
              height={HERO_MEDIA.height}
              decoding="async"
              fetchpriority="high"
            />
          </picture>
        )}
        <img className="steppe-hero-eagle" src={EAGLE_SRC} alt="" width="400" height="204" decoding="async" />
        <span className="steppe-hero-art">{ART_CAPTION[lang] || ART_CAPTION.kk}</span>
      </div>

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
      </div>
    </section>
  );
}
