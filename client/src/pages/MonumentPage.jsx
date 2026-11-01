import React, { useState } from 'react';
import {
  PiSparkleDuotone,
  PiMusicNotesDuotone,
  PiPlayCircleDuotone,
  PiPauseCircleDuotone,
  PiBookOpenDuotone,
  PiEyeDuotone,
  PiCalendarBlankDuotone,
} from 'react-icons/pi';

const CONTENT = {
  kk: {
    kicker: 'ҰЛЫ КҮЙШІНІҢ 160 ЖЫЛДЫҒЫНА АРНАЛҒАН',
    title: 'Дина Нұрпейісованың монументі',
    lead: 'Қазақтың даңқты күйші-композиторы, Құрманғазының батасын алған дәулескер өнер иесі Дина Нұрпейісованың елордадағы қола мүсіні. Ұлттық музыка салтанатының көркем символы.',
    anatomyTitle: 'Монументтің көркемдік ерекшеліктері',
    anatomyKicker: 'СӘУЛЕТ ЖӘНЕ МҮСІНДІК ТАЛДАУ',
    anatomy: [
      {
        title: 'Қағыс шеберлігі мен саусақтар қозғалысы',
        desc: 'Мүсінші Дина ананың домбыраның шанағы мен пернелеріндегі саусақтарын ерекше дәлдікпен берген. Мұнда оның күрделі штрихтар мен төкпе қағысты еркін билеген сәті бейнеленген.',
        img: '/images/dina-sculpture-bronze.jpg',
      },
      {
        title: 'Ұлттық кимешек пен зерлі камзол',
        desc: 'Әже бейнесіндегі терең даналық, ұлттық кимешектің әр бүрмесі мен оюлы камзол өрнектері қазақ анасының биік парасаты мен таза рухын айшықтайды.',
        img: '/images/dina-monument.jpg',
      },
      {
        title: 'Киелі қара домбыраның сұлбасы',
        desc: 'Динаның қолындағы аспап — Батыс Қазақстанның төкпе дәстүріне тән қалақша пішінді, шанағы кең, ұзын мойынды түпнұсқа домбырасының дәл көшірмесі.',
        img: '/images/dombra-real.png',
      },
      {
        title: 'Гранит тұғырдағы арнау сөздер',
        desc: 'Биік қызыл гранит тұғырға қашалған арнау жазуы мен қазақы ою-өрнектер күй өнерінің ұрпақтар сабақтастығын паш етеді.',
        img: '/images/dina-dedication-plaque.jpg',
      },
    ],
    kuisTitle: 'Динаның алтын қордағы таңдаулы күйлері',
    kuisKicker: 'МУЗЫКАЛЫҚ МҰРА',
    kuis: [
      {
        title: 'Бұлбұл',
        tempo: 'Жылдам · Шабытты',
        story: 'Құстың сайраған үнін домбыраның қос ішегінде құйқылжыта бейнелейтін виртуоздық туынды. Динаның әлемдік деңгейде мойындалған інжу-маржаны.',
      },
      {
        title: '16 жыл (Он алтыншы жыл)',
        tempo: 'Драматикалық · Екпінді',
        story: '1916 жылғы ұлт-азаттық көтеріліс кезінде жастарды майданға қара жұмысқа алу жарлығына қарсы халық наразылығы мен ана жүрегінің зары.',
      },
      {
        title: 'Әсемқоңыр',
        tempo: 'Салмақты · Лирикалық',
        story: 'Қызы Әсемге арналған мөлдір махаббат пен аналық мейірімнің асқақ үні. Терең философиялық сарынға толы шертпелі туынды.',
      },
      {
        title: 'Тойбастар',
        tempo: 'Мерекелік · Салтанатты',
        story: 'Ұлы даланың қуанышы мен салтанатын паш ететін, елдік жиындар мен тойлардың шымылдығын ашатын шаттық күйі.',
      },
      {
        title: 'Науайы',
        tempo: 'Классикалық · Терең',
        story: 'Шығыс ойшылы Әлішер Науаи рухына бағытталған күрделі музыкалық иірімдер мен ғасырлар тереңіне бойлайтын ой толғауы.',
      },
      {
        title: 'Қарақасқа ат',
        tempo: 'Ойнақы · Жорға ырғағы',
        story: 'Тұлпардың жүрісін, желмен жарысқан екпінін домбыра қағысымен айнытпай беретін ырғақты шеберлік туындысы.',
      },
    ],
  },
  ru: {
    kicker: 'К 160-ЛЕТИЮ ВЕЛИКОЙ КЮЙШИ',
    title: 'Монумент Дине Нурпеисовой',
    lead: 'Бронзовый монумент выдающемуся композитору и виртуозу домбры Дине Нурпеисовой, благословленной великим Курмангазы. Символ казахского музыкального гения в столице.',
    anatomyTitle: 'Художественные детали монумента',
    anatomyKicker: 'СКУЛЬПТУРНЫЙ АНАЛИЗ',
    anatomy: [
      {
        title: 'Виртуозная техника рук',
        desc: 'Скульптор с исключительной анатомической точностью передал положение пальцев на грифе и деке, отобразив стремительный штрих төкпе.',
        img: '/images/dina-sculpture-bronze.jpg',
      },
      {
        title: 'Национальный кимешек и камзол',
        desc: 'Мудрость веков в чертах лица, аутентичные складки кимешека и орнаменты жилета передают величие казахской матери.',
        img: '/images/dina-monument.jpg',
      },
      {
        title: 'Сакральная домбра',
        desc: 'Инструмент в руках Дины в точности воспроизводит западноказахстанскую домбру с удлиненным грифом и овальным корпусом.',
        img: '/images/dombra-real.png',
      },
      {
        title: 'Гранитный постамент и плита',
        desc: 'Мемориальная гранитная стела с памятной надписью и высеченными национальными узорами.',
        img: '/images/dina-dedication-plaque.jpg',
      },
    ],
    kuisTitle: 'Золотой фонд произведений Дины',
    kuisKicker: 'ШЕДЕВРЫ КЮЯ',
    kuis: [
      { title: 'Бұлбұл (Соловей)', tempo: 'Стремительный · Виртуозный', story: 'Кюй, с поразительной точностью имитирующий пение соловья на струнах домбры. Принес Дине всесоюзную славу в 1937 году.' },
      { title: '16 жыл (Шестнадцатый год)', tempo: 'Драматический', story: 'Создан в ответ на восстание 1916 года и призыв сыновей на тыловые работы. Выражает материнскую боль и народный гнев.' },
      { title: 'Әсемқоңыр', tempo: 'Лирический · Глубокий', story: 'Посвящен дочери Асем. Проникновенная музыкальная поэма о материнской любви и нежности.' },
      { title: 'Тойбастар', tempo: 'Праздничный · Торжественный', story: 'Светлый гимн народному празднику, открывающий степные торжества и радостные сходы.' },
      { title: 'Науайы', tempo: 'Философский · Классический', story: 'Посвящение великому мыслителю Алишеру Навои, полное утонченных интонаций.' },
      { title: 'Қарақасқа ат', tempo: 'Ритмичный · Иноходь', story: 'Передает аллюр степного скакуна, стремительный бег и свист степного ветра.' },
    ],
  },
  en: {
    kicker: 'HONORING THE 160TH ANNIVERSARY',
    title: 'Monument to Dina Nurpeissova',
    lead: 'The bronze monument dedicated to Dina Nurpeissova, the legendary kui master blessed by Kurmangazy. An enduring symbol of Kazakh traditional music in the capital.',
    anatomyTitle: 'Artistic Anatomy & Symbolism',
    anatomyKicker: 'SCULPTURAL ANALYSIS',
    anatomy: [
      {
        title: 'Hand Articulation & Tremolo',
        desc: 'Capturing Dina\'s unique right-hand stroke and delicate finger placement along the neck of the dombra.',
        img: '/images/dina-sculpture-bronze.jpg',
      },
      {
        title: 'Traditional Kimeshek & Attire',
        desc: 'The dignity of a matriarch portrayed in the folds of the traditional kimeshek headdress and embroidered vest.',
        img: '/images/dina-monument.jpg',
      },
      {
        title: 'Authentic Dombra Silhouette',
        desc: 'Modeled precisely after her historical instrument, featuring the wide resonator bowl typical of Western Kazakhstan.',
        img: '/images/dombra-real.png',
      },
      {
        title: 'Granite Pedestal Inscription',
        desc: 'The red granite pedestal inscribed with commemorative dedication text honoring her contributions to world music.',
        img: '/images/dina-dedication-plaque.jpg',
      },
    ],
    kuisTitle: 'Masterpieces in the Golden Archive',
    kuisKicker: 'MUSICAL HERITAGE',
    kuis: [
      { title: 'Bulbul (The Nightingale)', tempo: 'Virtuosic · Swift', story: 'Imitates bird song through nuanced harmonics and rapid fretwork, gaining her nationwide acclaim in 1937.' },
      { title: '16 Zhyl (The Year of 1916)', tempo: 'Dramatic · Intense', story: 'Composed during the 1916 uprising when her son was conscripted, embodying maternal grief and national resilience.' },
      { title: 'Asemkonyr', tempo: 'Lyrical · Meditative', story: 'Dedicated to her beloved daughter Asem, radiating tender maternal devotion and poise.' },
      { title: 'Toybastar', tempo: 'Festive · Ceremonial', story: 'A joyful piece designed to herald weddings, seasonal festivals, and community celebrations.' },
      { title: 'Navayi', tempo: 'Philosophical', story: 'An introspective reflection honoring Eastern polymath Alisher Navoi.' },
      { title: 'Qaraqasqa At (The Steppe Horse)', tempo: 'Rhythmic · Gallop', story: 'Simulates the cadence and gallop of a prized steed across the open steppe.' },
    ],
  },
};

export default function MonumentPage({ onNavigate, lang = 'kk', t, navLabels = {} }) {
  const c = CONTENT[lang] || CONTENT.kk;
  const [playingIndex, setPlayingIndex] = useState(null);

  const togglePlay = (idx) => {
    setPlayingIndex(playingIndex === idx ? null : idx);
  };

  return (
    <div className="dedicated-subpage monument-subpage">
      {/* 1. Page Banner */}
      <section className="page-banner page-banner-projects">
        <div className="page-banner-image">
          <img src="/images/dina-monument.jpg" alt="Дина Нұрпейісованың монументі" />
        </div>
        <div className="content-width page-banner-inner">
          <span className="block-kicker banner-parent-kicker">{navLabels['projects'] || 'Жобалар'}</span>
          <h1>{c.title}</h1>
          <p>{c.lead}</p>

          <div className="breadcrumb">
            <button onClick={() => onNavigate('home')}>{t.backHome || 'Басты бет'}</button>
            <span>/</span>
            <button onClick={() => onNavigate('projects')}>{navLabels['projects'] || 'Жобалар'}</button>
            <span>/</span>
            <span>{c.title}</span>
          </div>
        </div>
      </section>

      {/* 2. Sculptural Anatomy Grid */}
      <section className="subpage-section content-width">
        <div className="subpage-section-header">
          <span className="block-kicker">{c.anatomyKicker}</span>
          <h2>{c.anatomyTitle}</h2>
        </div>

        <div className="anatomy-grid">
          {c.anatomy.map((item, idx) => (
            <div key={idx} className="anatomy-card">
              <div className="anatomy-img">
                <img src={item.img} alt={item.title} />
              </div>
              <div className="anatomy-body">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Dina's Golden Repertoire */}
      <section className="subpage-section content-width">
        <div className="subpage-section-header">
          <span className="block-kicker">{c.kuisKicker}</span>
          <h2>{c.kuisTitle}</h2>
        </div>

        <div className="kuis-grid">
          {c.kuis.map((kui, idx) => {
            const isPlaying = playingIndex === idx;
            return (
              <div key={idx} className={`kui-track-card ${isPlaying ? 'playing' : ''}`}>
                <div className="kui-card-top">
                  <span className="kui-tempo-badge">{kui.tempo}</span>
                  <button
                    className="kui-play-btn"
                    onClick={() => togglePlay(idx)}
                    title={isPlaying ? 'Тоқтату' : 'Тыңдау'}
                  >
                    {isPlaying ? <PiPauseCircleDuotone size={34} /> : <PiPlayCircleDuotone size={34} />}
                  </button>
                </div>
                <h3>{kui.title}</h3>
                <p>{kui.story}</p>
                {isPlaying && (
                  <div className="kui-player-visualizer">
                    <span className="visualizer-bar" />
                    <span className="visualizer-bar" />
                    <span className="visualizer-bar" />
                    <span className="visualizer-bar" />
                    <span className="visualizer-bar" />
                    <small>{lang === 'kk' ? 'Күй орындалуда...' : 'Воспроизведение кюя...'}</small>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Nav */}
      <div className="subpage-bottom-nav content-width">
        <button className="button button-outline" onClick={() => onNavigate('projects-alley')}>
          <span>← {navLabels['projects-alley'] || 'Күйшілер аллеясы'}</span>
        </button>
        <button className="button button-dark" onClick={() => onNavigate('projects-muragerler')}>
          <span>{navLabels['projects-muragerler'] || '«Мұрагерлер» үйірмесі'} →</span>
        </button>
      </div>
    </div>
  );
}

