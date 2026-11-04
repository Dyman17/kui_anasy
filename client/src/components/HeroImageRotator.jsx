import React, { useState, useEffect, useRef, useMemo } from 'react';
import { HERO_SLIDES } from '../constants';

export function HeroImageRotator({ lang = 'kk' }) {
  const slides = HERO_SLIDES[lang] || HERO_SLIDES.kk;
  const count = slides.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [withTransition, setWithTransition] = useState(true);
  const touchStartX = useRef(null);

  // Auto-swipe every 2 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setWithTransition(true);
      setCurrentIndex((prev) => prev + 1);
    }, 2000);
    return () => clearInterval(timer);
  }, [count]);

  const handleTransitionEnd = () => {
    // When reaching the clone (index === count), instantly reset to index 0 without transition
    if (currentIndex >= count) {
      setWithTransition(false);
      setCurrentIndex(0);
    }
  };

  // Smoothly re-enable transition after zero-delay reset
  useEffect(() => {
    if (!withTransition) {
      const frame1 = requestAnimationFrame(() => {
        const frame2 = requestAnimationFrame(() => {
          setWithTransition(true);
        });
        return () => cancelAnimationFrame(frame2);
      });
      return () => cancelAnimationFrame(frame1);
    }
  }, [withTransition]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 35) {
      setWithTransition(true);
      if (diff > 0) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : count - 1));
      }
    }
    touchStartX.current = null;
  };

  const activeIndex = currentIndex % count;
  const currentSlide = slides[activeIndex] || slides[0];

  // Extended slides list with clone of first item at the end for continuous forward loop
  const extendedSlides = useMemo(() => [
    ...slides,
    { ...slides[0], key: 'hero-clone-0' },
  ], [slides]);

  return (
    <figure
      className="hero-image hero-image-rotator"
      aria-label="Басты фотопанорама"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="hero-rotator-track-wrapper">
        <div
          className="hero-rotator-track"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: withTransition ? 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedSlides.map((slide, idx) => {
            const isCurrent = idx === activeIndex || (idx === count && activeIndex === 0);
            return (
              <div
                key={slide.key || `${slide.image}-${idx}`}
                className={`hero-rotator-slide ${isCurrent ? 'active' : ''}`}
                aria-hidden={!isCurrent}
              >
                <img
                  src={slide.image}
                  alt={isCurrent ? slide.title : ''}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
              </div>
            );
          })}
        </div>
      </div>

      <figcaption>
        <div className="hero-rotator-caption-copy" key={activeIndex}>
          <strong>{currentSlide.title}</strong>
          <span>{currentSlide.subtitle}</span>
        </div>

        <div className="hero-rotator-dots" role="tablist" aria-label="Фотолар тізімі">
          {slides.map((slide, idx) => (
            <button
              key={slide.image}
              type="button"
              role="tab"
              aria-selected={idx === activeIndex}
              aria-label={slide.title}
              className={`hero-rotator-dot ${idx === activeIndex ? 'active' : ''}`}
              onClick={() => {
                setWithTransition(true);
                setCurrentIndex(idx);
              }}
            />
          ))}
        </div>
      </figcaption>
    </figure>
  );
}
