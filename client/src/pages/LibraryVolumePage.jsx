import React, { useState } from 'react';
import {
  PiSparkleDuotone,
  PiBookOpenDuotone,
  PiDownloadSimpleDuotone,
  PiMusicNotesDuotone,
  PiBookmarkDuotone,
  PiCaretLeftDuotone,
  PiCaretRightDuotone,
  PiFilePdfDuotone,
  PiCheckCircleDuotone,
  PiListNumbersDuotone,
} from 'react-icons/pi';

const VOLUMES_DATA = {
  'library-vol-1': {
    volNumber: 'I ТОМ',
    title: '«Күй әлемі» (Күйшілер антологиясы)',
    lead: 'Қазақтың аспаптық күй өнеріне арналған іргелі ғылыми-энциклопедиялық том. 101 ұлы күйшінің өмірбаяны, күйлердің шығу тарихы, ноталық партитуралары мен сирек аудиожазбалары.',
    img: '/images/book-kui-alemi.jpg',
    meta: {
      pages: '512 бет',
      year: '2026 жыл',
      isbn: 'ISBN 978-601-7890-11-2',
      editors: 'ҚР ҰҒА академиктері, өнертану ғылымдарының докторлары',
      format: 'Қатты мұқаба · Алтын бедерлі безендіру',
    },
    chapters: [
      { num: 'I БӨЛІМ', title: 'Батыс Қазақстанның төкпе күй дәстүрі', pages: '15–168 бет', desc: 'Құрманғазы, Дәулеткерей, Дина, Сейтек, Мәмен, Қали мектептері.' },
      { num: 'II БӨЛІМ', title: 'Арқа мен Шығыстың шертпе күй мектебі', pages: '169–310 бет', desc: 'Тәттімбет, Тоқа, Қыздарбек, Әбікен, Мағауия дәстүрлері.' },
      { num: 'III БӨЛІМ', title: 'Қаратау және Сыр бойының аспаптық сарындары', pages: '311–430 бет', desc: 'Қазанғаптың 62 Ақжелеңі, Сүгірдің қобыз сарындары, Ықылас мұрасы.' },
      { num: 'IV БӨЛІМ', title: 'Жетісу, Алтай және Тарбағатай күйшілік өнері', pages: '431–490 бет', desc: 'Байсерке, Қожеке, Мергенбай, Әшім мұралары.' },
      { num: 'ҚОСЫМША', title: 'Күйлердің цифрлық ноталық каноны мен дискграфия', pages: '491–512 бет', desc: '101 күйдің екі дауысты классикалық партитурасы.' },
    ],
    samplePages: [
      {
        pageNo: 1,
        title: 'Алғысөз: Ұлы даланың күй өркениеті',
        text: 'Күй — қазақ болмысының, оның рухани әлемінің ең биік шыңы. Сөз жетпес терең сезімдер мен ғасырлар қасіреті де, жеңіс шаттығы да қара домбыраның қос ішегінде күй болып төгілген.\n\nБұл томда қазақ тарихындағы 101 дәулескер күйшінің өмір жолы мен олардың алтын қоры ғылыми тұрғыда жүйеленді.',
      },
      {
        pageNo: 2,
        title: 'Құрманғазының төкпе күй философиясы',
        text: 'Құрманғазының «Сарыарқасы» — ұлттық азаттықтың ұлы манифесі. Күйдегі қағыс жылдамдығы мен диапазонның кеңдігі шексіз даланың кеңістігін бейнелейді.\n\nОның туындыларында төкпе қағыстың барлық күрделі элементтері: іліп қағу, бүрме, біртұтас шерту әдістері қолданылады.',
      },
    ],
  },
  'library-vol-2': {
    volNumber: 'II ТОМ',
    title: '«Ғасырлар үні» (Жыраулар антологиясы)',
    lead: 'Қазақтың эпостық жыр дәстүрі мен жыраулық поэзиясына арналған екінші том. Алтын Орда дәуірінен бүгінгі күнге дейінгі 110 ұлы жыраудың толғаулары мен мақамдық сарындары.',
    img: '/images/book-gasyrlar-uni.jpg',
    meta: {
      pages: '480 бет',
      year: '2026 жыл',
      isbn: 'ISBN 978-601-7890-12-9',
      editors: 'Фольклортанушы ғалымдар, этномузыкатанушылар',
      format: 'Қатты мұқаба · Құжаттық фотоиллюстрациялар',
    },
    chapters: [
      { num: 'I БӨЛІМ', title: 'Алтын Орда мен Қазақ хандығы кезеңінің жыраулары', pages: '12–140 бет', desc: 'Асан қайғы, Қазтуған, Доспамбет, Шалкиіз, Жиембет толғаулары.' },
      { num: 'II БӨЛІМ', title: 'Хандық дәуір мен Зар заман поэзиясы', pages: '141–280 бет', desc: 'Ақтамберді, Бұқар жырау, Махамбет, Дулат, Шортанбай.' },
      { num: 'III БӨЛІМ', title: 'Сыр сүлейлері мен жыршылық дәстүр', pages: '281–390 бет', desc: 'Базар жырау, Нұртуған, Қарасақал Ерімбет, Дүр Оңғар нақылдары.' },
      { num: 'IV БӨЛІМ', title: 'Жетісу және Батыс эпос мектептері', pages: '391–480 бет', desc: 'Сүйінбай, Жамбыл, Мұрын жыраудың «Қырымның қырық батыры».' },
    ],
    samplePages: [
      {
        pageNo: 1,
        title: 'Кіріспе: Жыраулық дәстүр және мемлекеттілік',
        text: 'Жыраулар — жай ғана ақындар емес, олар ел тағдырын шешетін хан кеңесшілері, мемлекеттік қайраткерлер және халықтың рухани ұстаздары болған.\n\nӘрбір толғауда Ұлы даланың саяси-философиялық ой-толғамы мен батырлық рухы көрініс табады.',
      },
      {
        pageNo: 2,
        title: 'Асан қайғының философиялық мұрасы',
        text: '«Құйрығы жоқ, жалы жоқ, құлан қайтіп күн көрер?» деп толғанған Асан қайғы бабамыз ұлттың бірлігі мен болашағын ойлаған дала данасы.\n\nОның әрбір сөзі ғасырлар бойы қазақ қоғамының рухани бағдаршамы болып келеді.',
      },
    ],
  },
  'library-vol-3': {
    volNumber: 'III ТОМ',
    title: '«Ұлы дала әуені» (Әншілер антологиясы)',
    lead: 'Қазақтың дәстүрлі ән өнері мен сал-серілік мәдениетін жинақтаған үшінші том. 110 әнші-композитордың туындылары, ән мектептерінің ерекшеліктері мен тарихи жазбалар.',
    img: '/images/book-uly-dala-aueni.jpg',
    meta: {
      pages: '496 бет',
      year: '2026 жыл',
      isbn: 'ISBN 978-601-7890-13-6',
      editors: 'Құрманғазы атындағы Қазақ ұлттық консерваториясының ғылыми кеңесі',
      format: 'Қатты мұқаба · Сирек мұрағаттық ноталар',
    },
    chapters: [
      { num: 'I БӨЛІМ', title: 'Арқаның сал-серілік ән өнері', pages: '14–180 бет', desc: 'Біржан сал, Ақан сері, Жаяу Мұса, Үкілі Ыбырай, Мәди, Балуан Шолақ.' },
      { num: 'II БӨЛІМ', title: 'Батыс Қазақстанның ән мектебі', pages: '181–295 бет', desc: 'Мұхит, Қызыл, Шынтас, Ғарифолла Құрманғалиев дәстүрі.' },
      { num: 'III БӨЛІМ', title: 'Жетісу және Сыр өңірінің ән дәстүрі', pages: '296–410 бет', desc: 'Кенен Әзірбаев, Әсет Найманбайұлы, Жүсіпбек, Манарбек.' },
      { num: 'IV БӨЛІМ', title: 'Әлемдік сахнадағы қазақ әні және аудио канон', pages: '411–496 бет', desc: 'Әміре Қашаубаевтың Париж сапары, сирек фонограммалар тарихы.' },
    ],
    samplePages: [
      {
        pageNo: 1,
        title: 'Арқа ән мектебінің құдіреті',
        text: 'Арқаның кең даласында қалыптасқан ән өнері өзінің асқақ диапазонымен, кең тынысымен және нәзік иірімдерімен ерекшеленеді.\n\nБіржан сал мен Ақан серінің әндері адам дауысының барлық мүмкіндігін ашатын классикалық туындылар болып табылады.',
      },
      {
        pageNo: 2,
        title: 'Әміре Қашаубаев және 1925 жылғы Париж салтанаты',
        text: '1925 жылы Парижде өткен Дүниежүзілік көрмеде Әміре қазақтың «Ағаш аяқ», «Балқадиша», «Дударай» әндерін орындап, күллі Еуропаны таңғалдырды.\n\nБұл қазақ музыка өнерінің халықаралық деңгейде ресми түрде мойындалуының бастауы болды.',
      },
    ],
  },
};

export default function LibraryVolumePage({ volumeSlug = 'library-vol-1', onNavigate, lang = 'kk', t, navLabels = {} }) {
  const vol = VOLUMES_DATA[volumeSlug] || VOLUMES_DATA['library-vol-1'];
  const [readerOpen, setReaderOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <div className="dedicated-subpage volume-subpage">
      {/* 1. Page Banner */}
      <section className="page-banner page-banner-library">
        <div className="page-banner-image">
          <img src={vol.img} alt={vol.title} />
        </div>
        <div className="content-width page-banner-inner">
          <span className="block-kicker banner-parent-kicker">{navLabels['library'] || 'Цифрлық кітапхана'}</span>
          <span className="volume-number-pill">{vol.volNumber}</span>
          <h1>{vol.title}</h1>
          <p>{vol.lead}</p>

          <div className="breadcrumb">
            <button onClick={() => onNavigate('home')}>{t.backHome || 'Басты бет'}</button>
            <span>/</span>
            <button onClick={() => onNavigate('library')}>{navLabels['library'] || 'Кітапхана'}</button>
            <span>/</span>
            <span>{vol.volNumber}</span>
          </div>

          <div className="subpage-hero-actions">
            <button className="subpage-action-btn primary" onClick={() => setReaderOpen(true)}>
              <PiBookOpenDuotone size={18} />
              <span>{lang === 'kk' ? 'Кітапты онлайн оқу' : 'Читать онлайн'}</span>
            </button>
            <a
              href={vol.img}
              download
              className="subpage-action-btn outline"
              title="Мұқабасын көру"
            >
              <PiDownloadSimpleDuotone size={18} />
              <span>{lang === 'kk' ? 'Мұқабасын жүктеу' : 'Скачать обложку'}</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. Metadata Grid */}
      <section className="subpage-section content-width">
        <div className="volume-meta-card">
          <div className="volume-cover-art">
            <img src={vol.img} alt={vol.title} />
          </div>
          <div className="volume-meta-details">
            <span className="block-kicker">ҒЫЛЫМИ БАСЫЛЫМ ТӨЛҚҰЖАТЫ</span>
            <h3>{vol.title}</h3>
            <div className="meta-pairs-grid">
              <div>
                <strong>Көлемі:</strong>
                <p>{vol.meta.pages}</p>
              </div>
              <div>
                <strong>Басылған жылы:</strong>
                <p>{vol.meta.year}</p>
              </div>
              <div>
                <strong>Халықаралық коды:</strong>
                <p>{vol.meta.isbn}</p>
              </div>
              <div>
                <strong>Форматы:</strong>
                <p>{vol.meta.format}</p>
              </div>
              <div className="meta-full">
                <strong>Ғылыми редакциясы:</strong>
                <p>{vol.meta.editors}</p>
              </div>
            </div>
            <div className="volume-cta-row">
              <button className="button button-dark" onClick={() => setReaderOpen(true)}>
                <PiBookOpenDuotone size={17} style={{ marginRight: 6 }} />
                <span>{lang === 'kk' ? 'Онлайн оқу режимін ашу' : 'Открыть режим чтения'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Table of Contents */}
      <section className="subpage-section content-width">
        <div className="subpage-section-header">
          <span className="block-kicker">МАЗМҰНЫ ЖӘНЕ ҚҰРЫЛЫМЫ</span>
          <h2>Томның негізгі тараулары</h2>
        </div>

        <div className="volume-chapters-list">
          {vol.chapters.map((ch, idx) => (
            <div key={idx} className="volume-chapter-item">
              <div className="chapter-header">
                <span className="chapter-badge">{ch.num}</span>
                <span className="chapter-pages">{ch.pages}</span>
              </div>
              <h4>{ch.title}</h4>
              <p>{ch.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Digital Reader Modal */}
      {readerOpen && (
        <div className="reader-modal-backdrop" onClick={() => setReaderOpen(false)}>
          <div className="reader-modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="reader-toolbar">
              <div className="reader-info">
                <PiBookOpenDuotone size={18} />
                <span>{vol.title} · Бет {currentPage + 1} / {vol.samplePages.length}</span>
              </div>
              <button className="reader-close-btn" onClick={() => setReaderOpen(false)}>✕</button>
            </div>

            <div className="reader-book-spread">
              <div className="book-page">
                <span className="page-number-corner">{vol.samplePages[currentPage]?.pageNo}</span>
                <h3>{vol.samplePages[currentPage]?.title}</h3>
                <div className="page-body">
                  <p>{vol.samplePages[currentPage]?.text}</p>
                </div>
                <div className="page-footer-decor">❖ ─── ◈ ─── ❖</div>
              </div>
            </div>

            <div className="reader-pagination-bar">
              <button
                className="page-nav-btn"
                disabled={currentPage === 0}
                onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              >
                <PiCaretLeftDuotone size={18} />
                <span>Алдыңғы бет</span>
              </button>
              <span className="page-indicator">{currentPage + 1} / {vol.samplePages.length}</span>
              <button
                className="page-nav-btn"
                disabled={currentPage >= vol.samplePages.length - 1}
                onClick={() => setCurrentPage((prev) => Math.min(vol.samplePages.length - 1, prev + 1))}
              >
                <span>Келесі бет</span>
                <PiCaretRightDuotone size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <div className="subpage-bottom-nav content-width">
        <button className="button button-outline" onClick={() => onNavigate('library')}>
          <span>← {navLabels['library'] || 'Кітапханаға оралу'}</span>
        </button>
      </div>
    </div>
  );
}
