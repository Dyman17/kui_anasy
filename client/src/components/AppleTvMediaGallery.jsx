import React, { useState, useEffect, useRef } from 'react';
import { TbPanoramaHorizontal, TbChevronLeft, TbChevronRight } from 'react-icons/tb';

export function AppleTvMediaGallery({ items, onNavigate, t }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);

  const total = items.length;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  useEffect(() => {
    if (isPaused || total <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, total]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    <section className="tv-gallery-section content-width" aria-labelledby="tv-media-gallery-title">
      <div className="tv-gallery-header">
        <span className="block-kicker">{t.galleryKicker}</span>
        <h2 id="tv-media-gallery-title" className="tv-gallery-title">{t.galleryTitle}</h2>
        <p className="tv-gallery-subtitle">{t.galleryDesc}</p>
      </div>

      <div className="tv-gallery-stage">
        <div
          id="tv-media-gallery"
          className="media-gallery tv-media-gallery"
          role="group"
          data-analytics-section-engagement="name:tv-plus-gallery"
          data-analytics-gallery-id="Tv Plus Gallery"
          aria-label="Күйшілер аллеясының фотопанорамасы"
          data-media-gallery=""
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="tv-gallery-viewport">
            <ul className="media-gallery-item-container" role="list">
              {items.map((item, idx) => {
                const isCurrent = idx === activeIndex;

                return (
                  <li
                    key={item.id}
                    id={`endless-entertainment-gallery-item-${item.id}`}
                    className={`media-gallery-item theme-dark ${isCurrent ? 'current current-item' : ''}`}
                    data-media-gallery-item={item.id}
                    data-title={item.title}
                    role="tabpanel"
                    aria-labelledby={`media-gallery-item-${item.id}-link`}
                    aria-hidden={!isCurrent}
                    style={{
                      '--progress': isCurrent ? 1 : 0,
                    }}
                  >
                    <a
                      id={`media-gallery-item-${item.id}-link`}
                      className="media-gallery-wrapper-link fam-media-gallery-wrapper-link"
                      href={`#${item.targetSlug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(item.targetSlug);
                      }}
                      aria-label={`${item.title} - ${item.desc}`}
                    >
                      <div className="media-gallery-bg-wrapper">
                        <picture className="media-gallery-bg" data-lazy="">
                          <img src={item.image} alt={item.title} loading={idx === 0 ? 'eager' : 'lazy'} />
                        </picture>
                        <div className="media-gallery-scrim" aria-hidden="true" />
                      </div>

                      <div className="media-gallery-contents">
                        <div className="media-gallery-top-content tv-gallery-top-content-s-only">
                          <span className="tv-gallery-badge"><TbPanoramaHorizontal size={14} style={{ marginRight: 6, verticalAlign: '-2px' }} />{item.genre}</span>
                        </div>
                        <div className="media-gallery-bottom-content">
                          <div className="media-gallery-headline">
                            <span className="media-gallery-genre">{item.genre}</span>
                            <h3 className="media-gallery-title">{item.title}</h3>
                          </div>
                          <p className="media-gallery-desc">{item.desc}</p>
                          <span className="media-gallery-button">
                            <span>{t.exploreBtn || 'Толығырақ көру'}</span>
                            <RiPlayCircleLine size={17} />
                          </span>
                        </div>
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>

            <button
              type="button"
              className="tv-gallery-nav-btn prev-btn"
              onClick={handlePrev}
              aria-label="Алдыңғы слайд"
            >
              <TbChevronLeft size={26} />
            </button>
            <button
              type="button"
              className="tv-gallery-nav-btn next-btn"
              onClick={handleNext}
              aria-label="Келесі слайд"
            >
              <TbChevronRight size={26} />
            </button>
          </div>

          <div className="tv-gallery-pagination" role="tablist" aria-label="Слайдтар">
            {items.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={idx === activeIndex}
                aria-label={`${item.title} (${idx + 1} / ${total})`}
                className={`tv-gallery-dot ${idx === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(idx)}
              >
                <span className="tv-gallery-dot-inner" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const HERO_SLIDES = {
  kk: [
    {
      image: '/images/kuyshiler-alley.jpg',
      title: 'Күйшілер аллеясы',
      subtitle: 'Астана · Қазақстан',
      alt: 'Астана қаласындағы Күйшілер аллеясының көрінісі',
    },
    {
      image: '/images/dina-monument-full.jpg',
      title: '«Күй анасы — Дина» монументі',
      subtitle: 'Астана · 2021 ж. орнатылған',
      alt: 'Дина Нұрпейісованың қола монументі',
    },
    {
      image: '/images/alley-arch-main.jpg',
      title: 'Күйшілер аллеясының бас қақпасы',
      subtitle: 'Күйші Дина көшесі · Астана',
      alt: 'Күйшілер аллеясының салтанатты бас қақпасы',
    },
    {
      image: '/images/stele-kuyshi-side-a.jpg',
      title: '101 Күйші канондық стеласы',
      subtitle: 'Мәрмәр-гранит кешені',
      alt: '101 Күйші мемориалдық тақтасы',
    },
    {
      image: '/images/stele-zhyrau-side-a.jpg',
      title: '110 Жырау мен жыршы стеласы',
      subtitle: '«Ғасырлар үні» кешені',
      alt: '110 Жырау мен жыршы стеласы',
    },
    {
      image: '/images/dina-sculpture-bronze.jpg',
      title: 'Дина бейнесінің қола шешімі',
      subtitle: 'Мүсінші: Жалын Бауыржан',
      alt: 'Дина Нұрпейісованың қола мүсіні',
    },
    {
      image: '/images/alley-gazebo.jpg',
      title: 'Саябақтың мәдени кеңістігі',
      subtitle: 'Елорда тұрғындары мен қонақтарына',
      alt: 'Күйшілер аллеясының саябақ аймағы',
    },
  ],
  ru: [
    {
      image: '/images/kuyshiler-alley.jpg',
      title: 'Аллея Кюйши',
      subtitle: 'Астана · Казахстан',
      alt: 'Панорама Аллеи Кюйши в Астане',
    },
    {
      image: '/images/dina-monument-full.jpg',
      title: 'Монумент Дины Нурпеисовой',
      subtitle: 'Астана · Установлен в 2021 г.',
      alt: 'Бронзовый монумент Дины Нурпеисовой',
    },
    {
      image: '/images/alley-arch-main.jpg',
      title: 'Главная арка Аллеи Кюйши',
      subtitle: 'Улица Кюйши Дина · Астана',
      alt: 'Входная триумфальная арка аллеи',
    },
    {
      image: '/images/stele-kuyshi-side-a.jpg',
      title: 'Стела «101 Кюйши»',
      subtitle: 'Мраморно-гранитный мемориал',
      alt: 'Стела с именами 101 композитора-кюйши',
    },
    {
      image: '/images/stele-zhyrau-side-a.jpg',
      title: 'Стела «110 Жырау и жыршы»',
      subtitle: 'Комплекс «Голос веков»',
      alt: 'Мемориальная стела жырау',
    },
    {
      image: '/images/dina-sculpture-bronze.jpg',
      title: 'Бронзовая скульптура Дины',
      subtitle: 'Скульптор: Жалын Бауыржан',
      alt: 'Скульптура Дины с домброй',
    },
    {
      image: '/images/alley-gazebo.jpg',
      title: 'Культурное пространство аллеи',
      subtitle: 'Для жителей и гостей столицы',
      alt: 'Парковая зона Аллеи Кюйши',
    },
  ],
  en: [
    {
      image: '/images/kuyshiler-alley.jpg',
      title: 'Kuyshiler Alley',
      subtitle: 'Astana · Kazakhstan',
      alt: 'Panoramic view of Kuyshiler Alley in Astana',
    },
    {
      image: '/images/dina-monument-full.jpg',
      title: 'Dina Nurpeisova Monument',
      subtitle: 'Astana · Erected in 2021',
      alt: 'Bronze monument of Dina Nurpeisova',
    },
    {
      image: '/images/alley-arch-main.jpg',
      title: 'Main Arch of the Alley',
      subtitle: 'Kuyshi Dina Street · Astana',
      alt: 'Ceremonial arch entrance to Kuyshiler Alley',
    },
    {
      image: '/images/stele-kuyshi-side-a.jpg',
      title: '101 Kuyshis Memorial Stele',
      subtitle: 'Marble & granite historical canon',
      alt: 'Memorial stele inscribed with 101 kuyshis',
    },
    {
      image: '/images/stele-zhyrau-side-a.jpg',
      title: '110 Zhyrau & Epic Bards Stele',
      subtitle: '"Echo of Centuries" complex',
      alt: 'Memorial stele dedicated to 110 zhyrau',
    },
    {
      image: '/images/dina-sculpture-bronze.jpg',
      title: 'Bronze Sculpture of Dina',
      subtitle: 'Sculptor: Zhalyn Bauyrzhan',
      alt: 'Bronze sculpture of Dina Nurpeisova playing dombra',
    },
    {
      image: '/images/alley-gazebo.jpg',
      title: 'Alley Cultural Space',
      subtitle: 'For residents and guests of Astana',
      alt: 'Park relaxation area of Kuyshiler Alley',
    },
  ],
};
