import React, { useState, useMemo } from 'react';
import {
  PiSparkleDuotone,
  PiMagnifyingGlassDuotone,
  PiMusicNotesDuotone,
  PiPlayCircleDuotone,
  PiPauseCircleDuotone,
  PiUserDuotone,
  PiMapPinDuotone,
  PiBookOpenDuotone,
  PiCheckCircleDuotone,
} from 'react-icons/pi';

const CANON_DATA = {
  kuyshi: {
    kk: {
      kicker: 'ҰЛЫ ДАЛА МҰРАСЫ · 101 ДӘУЛЕСКЕР',
      title: '101 Күйші каноны',
      lead: 'Қазақ музыка өркениетінің негізін қалаған төкпе және шертпе күй дәстүрінің 101 көрнекті шебері. Батыстың асау толқынынан Сарыарқаның мұңды шертпесіне дейінгі толық канон.',
      schools: [
        { id: 'all', name: 'Барлығы (101)' },
        { id: 'west', name: 'Батыс (Төкпе дәстүрі)' },
        { id: 'arka', name: 'Арқа (Шертпе дәстүрі)' },
        { id: 'south', name: 'Қаратау & Сыр бойы' },
        { id: 'jetysu', name: 'Жетісу & Шығыс' },
      ],
      masters: [
        {
          id: 'qurmangazy',
          name: 'Құрманғазы Сағырбайұлы',
          dates: '1818–1896',
          region: 'Батыс Қазақстан, Бөкей ордасы',
          school: 'west',
          schoolName: 'Төкпе күй дәстүрі',
          kuis: ['Сарыарқа', 'Адай', 'Серпер', 'Кісен ашқан', 'Түрмеден қашқан', 'Балбырауын'],
          bio: 'Қазақ халқының классик композиторы, төкпе күй атасы. Оның туындылары еркіндік пен қайсарлықтың, ел тағдырының ұлы симфониясы болып саналады.',
          img: '/images/steppe-archive-1910.jpg',
        },
        {
          id: 'dina',
          name: 'Дина Нұрпейісова',
          dates: '1861–1955',
          region: 'Батыс Қазақстан, Нарын құмы',
          school: 'west',
          schoolName: 'Төкпе күй дәстүрі',
          kuis: ['Бұлбұл', '16 жыл', 'Әсемқоңыр', 'Тойбастар', 'Науайы', 'Қарақасқа ат'],
          bio: '«Күй анасы» атанған ұлы күйші. Құрманғазының тікелей батасын алған, төкпе дәстүрін XX ғасырдың ортасына дейін жеткізген классик.',
          img: '/images/dina-monument.jpg',
        },
        {
          id: 'dauletkerei',
          name: 'Дәулеткерей Шығайұлы',
          dates: '1820–1887',
          region: 'Бөкей ордасы',
          school: 'west',
          schoolName: 'Төкпе күй дәстүрі',
          kuis: ['Жігер', 'Қоңыр', 'Көркем ханым', 'Бұлбұл', 'Салық өлген', 'Тартыс'],
          bio: 'Төре күйінің негізін салушы, терең философиялық лириканың шебері. Дәулеткерей күйлері салмақтылығымен және нәзік иірімдерімен ерекшеленеді.',
          img: '/images/stele-kuyshi-side-a.jpg',
        },
        {
          id: 'tattimbet',
          name: 'Тәттімбет Қазанғапұлы',
          dates: '1815–1862',
          region: 'Сарыарқа, Қарақаралы',
          school: 'arka',
          schoolName: 'Шертпе күй мектебі',
          kuis: ['Саржайлау', 'Сылқылдақ', 'Былқылдақ', 'Көкейкесті', 'Қосбасар', 'Теспақ'],
          bio: 'Арқаның шертпе күй мектебінің шыңы. Оның күйлері адам жанының ішкі тебіренісін, сұлулық пен нәзік сезімдерді суреттейді.',
          img: '/images/book-kui-alemi.jpg',
        },
        {
          id: 'qazangap',
          name: 'Қазанғап Тілепбергенұлы',
          dates: '1854–1921',
          region: 'Арал өңірі, Сыр бойы',
          school: 'south',
          schoolName: 'Сыр бойы мектебі',
          kuis: ['Ақжелең (62 тарау)', 'Көкіл', 'Ноғайлы босқыны', 'Жұртта қалған', 'Құралай'],
          bio: 'Сыр бойының ұлы күйшісі. Ақжелеңнің 62 түрін шығарып, қазақ күй өнеріне теңдессіз циклдік құрылым енгізген кемеңгер.',
          img: '/images/stele-kuyshi-side-b.jpg',
        },
        {
          id: 'sugir',
          name: 'Сүгір Әлиұлы',
          dates: '1882–1961',
          region: 'Оңтүстік Қазақстан, Созақ',
          school: 'south',
          schoolName: 'Қаратау мектебі',
          kuis: ['Аққу', 'Бозінген', 'Шалқыма', 'Майда қоңыр', 'Телқоңыр', 'Бес жорға'],
          bio: 'Ықыластың қобыз сарындарын домбыраға алғаш түсірген Қаратау шертпесінің падишасы.',
          img: '/images/dombra-player-illustration.png',
        },
        {
          id: 'ykylas',
          name: 'Ықылас Дүкенұлы',
          dates: '1843–1916',
          region: 'Сарыарқа, Қаратау',
          school: 'south',
          schoolName: 'Қобыз дәстүрі',
          kuis: ['Жезкиік', 'Қазан', 'Қасқыр', 'Аққу', 'Ықыластың қобызы', 'Жалғыз аяқ'],
          bio: 'Қорқыт атадан кейінгі қобыз күйінің ұлы реформаторы, бақсылық сарыннан кәсіби аспаптық күйге көтерген тұлға.',
          img: '/images/kobyz-real.png',
        },
        {
          id: 'seitek',
          name: 'Сейтек Оразалыұлы',
          dates: '1861–1933',
          region: 'Бөкей ордасы, Астрахан',
          school: 'west',
          schoolName: 'Төкпе күй дәстүрі',
          kuis: ['Заман-ай', 'Тойбастар', 'Арман', 'Бес қыз', 'Қарашаш', 'Жантаза'],
          bio: 'Тұтқында жүріп күй шығарған, азаттық рухын жырлаған дала тарланы.',
          img: '/images/kuyshiler-alley.jpg',
        },
        {
          id: 'bayserke',
          name: 'Байсерке Қылышұлы',
          dates: '1841–1906',
          region: 'Жетісу өңірі',
          school: 'jetysu',
          schoolName: 'Жетісу дәстүрі',
          kuis: ['Байсерке', 'Ат жорғалау', 'Ұран', 'Көк қаршыға'],
          bio: 'Жетісу төкпе мектебінің көрнекті өкілі, шебер домбырашы.',
          img: '/images/alley-arch-main.jpg',
        },
      ],
    },
    ru: {
      kicker: 'НАСЛЕДИЕ ВЕЛИКОЙ СТЕПИ · 101 МАСТЕР',
      title: 'Канон 101 Кюйши',
      lead: 'Полный канон 101 выдающегося степного композитора, заложивших основы казахской инструментальной музыки в традициях төкпе и шертпе.',
      schools: [
        { id: 'all', name: 'Все (101)' },
        { id: 'west', name: 'Запад (Төкпе)' },
        { id: 'arka', name: 'Сарыарка (Шертпе)' },
        { id: 'south', name: 'Каратау & Сырдарья' },
        { id: 'jetysu', name: 'Жетысу & Восток' },
      ],
      masters: [],
    },
    en: {
      kicker: 'HERITAGE OF THE STEPPE · 101 MASTERS',
      title: 'Canon of 101 Kuyshis',
      lead: 'The definitive canon of 101 prominent steppe composers who founded the classical Kazakh instrumental traditions of Tokpe and Shertpe.',
      schools: [
        { id: 'all', name: 'All (101)' },
        { id: 'west', name: 'West (Tokpe)' },
        { id: 'arka', name: 'Saryarka (Shertpe)' },
        { id: 'south', name: 'Karatau & Syr' },
        { id: 'jetysu', name: 'Jetysu & East' },
      ],
      masters: [],
    },
  },
  zhyrau: {
    kk: {
      kicker: 'БАБАЛАР ҮНІ · 110 ЖЫРАУ МЕН ЖЫРШЫ',
      title: '110 Жырау мен жыршы каноны',
      lead: 'Қазақтың эпостық дастандарын, толғаулары мен даналық сөздерін ғасырлардан ғасырға жеткізген 110 ұлы жыраулар мен жыршылар антологиясы.',
      schools: [
        { id: 'all', name: 'Барлығы (110)' },
        { id: 'khanate', name: 'Алтын Орда & Қазақ хандығы (XV–XVII ғғ.)' },
        { id: 'zarzaman', name: 'Зар заман кезеңі (XVIII–XIX ғғ.)' },
        { id: 'syr', name: 'Сыр сүлейлері' },
        { id: 'jetysu', name: 'Жетісу & Батыс' },
      ],
      masters: [
        {
          id: 'asan',
          name: 'Асан қайғы Сәбитұлы',
          dates: 'XIV–XV ғғ.',
          region: 'Алтын Орда, Дешті Қыпшақ',
          school: 'khanate',
          schoolName: 'Алтын Орда дәуірі',
          kuis: ['Жерұйық толғауы', 'Бұл заманда не ғаріп?', 'Құйрығы жоқ, жалы жоқ'],
          bio: 'Ұлы даланың ойшылы, философ-жырау. Елдің берекесі мен халыққа жайлы мекен іздеп «Желмаямен» жер кезген тарихи тұлға.',
          img: '/images/book-gasyrlar-uni.jpg',
        },
        {
          id: 'qaztugan',
          name: 'Қазтуған Сүйінішұлы',
          dates: 'XV ғ.',
          region: 'Еділ бойы, Қазақ хандығы',
          school: 'khanate',
          schoolName: 'Қазақ хандығы құрылуы',
          kuis: ['Мадақ жыры', 'Алаң да алаң, алаң жұрт', 'Еділді көрсең есіл жұрт'],
          bio: 'Жорық жырауы, қолбасшы батыр. Оның толғаулары ел мен жерді қорғаудың, туған табиғатқа сүйіспеншіліктің гимні.',
          img: '/images/stele-zhyrau-side-a.jpg',
        },
        {
          id: 'dospambet',
          name: 'Доспамбет жырау',
          dates: 'XVI ғ.',
          region: 'Азау қаласы, Ноғай ордасы',
          school: 'khanate',
          schoolName: 'Батырлық поэзия',
          kuis: ['Азау, Азау дегенің', 'Қоғалы көлдер, қом сулар', 'Айнала бұлақ басы тең'],
          bio: 'Әскери ақсүйек, ержүрек батыр-жырау. Қазақ әдебиетіндегі жауынгерлік лириканың қас шебері.',
          img: '/images/stele-zhyrau-side-b.jpg',
        },
        {
          id: 'bukhar',
          name: 'Бұқар жырау Қалқаманұлы',
          dates: '1668–1781',
          region: 'Сарыарқа, Баянауыл',
          school: 'zarzaman',
          schoolName: 'Хандық дәуір толғаулары',
          kuis: ['Ай, Абылай, Абылай', 'Тілек', 'Бірінші тілек тілеңіз', 'Асқар таудың өлгені'],
          bio: 'Абылай ханның бас кеңесшісі, мемлекет қайраткері, халық бірлігінің рухани қорғаны болған кемеңгер жырау.',
          img: '/images/book-gasyrlar-uni.jpg',
        },
        {
          id: 'makhambet',
          name: 'Махамбет Өтемісұлы',
          dates: '1804–1846',
          region: 'Батыс Қазақстан, Нарын құмы',
          school: 'zarzaman',
          schoolName: 'Азаттық рухы',
          kuis: ['Ереуіл атқа ер салмай', 'Мұнар күн', 'Беркіш мырзаға', 'Жайықтың бойы көк шалғын'],
          bio: 'Исатай Тайманұлы көтерілісінің жалынды жыршысы, алдаспан ақын, халық бостандығының ұраны.',
          img: '/images/stele-kuyshi-side-a.jpg',
        },
        {
          id: 'bazar',
          name: 'Базар жырау Оңдасұлы',
          dates: '1842–1911',
          region: 'Сыр бойы, Қармақшы',
          school: 'syr',
          schoolName: 'Сыр сүлейлері',
          kuis: ['Әркімнің бір заманы', 'Жақсы мен жаман', 'Өмір өткелі'],
          bio: 'Сыр сүлейлері мектебінің ақыл-ой падишасы, терең философиялық термелердің авторы.',
          img: '/images/book-uly-dala-aueni.jpg',
        },
        {
          id: 'zhambyl',
          name: 'Жамбыл Жабаев',
          dates: '1846–1945',
          region: 'Жетісу, Хан тауы',
          school: 'jetysu',
          schoolName: 'Жетісу эпостық дәстүрі',
          kuis: ['Ленинградтық өренім', 'Өтеген батыр', 'Сұраншы батыр', 'Зілді бұйрық'],
          bio: 'Жүз жасаған жыр алыбы, ХХ ғасырдың Гомері атанған ұлы жырау.',
          img: '/images/dina-monument.jpg',
        },
      ],
    },
  },
  anshi: {
    kk: {
      kicker: 'СЫРЛЫ ДАЛА САЗЫ · 110 ӘНШІ',
      title: '110 Дәстүрлі әнші каноны',
      lead: 'Қазақ әнінің кең тынысын, биік диапазонын және көркемдік эстетикасын қалыптастырған 110 ұлы дала композиторлары мен әнші-серілері.',
      schools: [
        { id: 'all', name: 'Барлығы (110)' },
        { id: 'arka', name: 'Арқа ән мектебі' },
        { id: 'west', name: 'Батыс Қазақстан' },
        { id: 'jetysu', name: 'Жетісу ән дәстүрі' },
        { id: 'syr', name: 'Сыр бойы термешілері' },
      ],
      masters: [
        {
          id: 'birzhan',
          name: 'Біржан сал Қожағұлұлы',
          dates: '1834–1897',
          region: 'Көкшетау, Арқа',
          school: 'arka',
          schoolName: 'Арқа ән мектебі',
          kuis: ['Теміртас', 'Айтбай', 'Жамбас сипар', 'Көлбай-Жанбай', 'Ләйлім шырақ'],
          bio: 'Қазақтың ән өнерінің хас шебері, сал-серілік салттың көшбасшысы, Сарамен айтысқан дала бұлбұлы.',
          img: '/images/book-uly-dala-aueni.jpg',
        },
        {
          id: 'akan',
          name: 'Ақан сері Қорамсаұлы',
          dates: '1843–1913',
          region: 'Көкшетау өңірі',
          school: 'arka',
          schoolName: 'Арқа ән мектебі',
          kuis: ['Құлагер', 'Маңмаңгер', 'Сырымбет', 'Балқадиша', 'Ақтоқты', 'Көкжендет'],
          bio: 'Қазақ романтикалық ән лирикасының шыңы. Құлагерге арналған реквием-әні бүкіл қазақтың қайғы-мұңының символы.',
          img: '/images/book-kui-alemi.jpg',
        },
        {
          id: 'mukhit',
          name: 'Мұхит Мералыұлы',
          dates: '1841–1918',
          region: 'Батыс Қазақстан, Қаратөбе',
          school: 'west',
          schoolName: 'Батыс дәстүрі',
          kuis: ['Айнамкөз', 'Зәуреш', 'Паңкөйлек', 'Қиыл', 'Дүние-ай', 'Кіші айда'],
          bio: 'Батыс Қазақстан ән мектебінің негізін қалаушы, дауыс мүмкіндігі аса кең, күрделі фальцеттік иірімдер шебері.',
          img: '/images/stele-kuyshi-side-b.jpg',
        },
        {
          id: 'zhayau',
          name: 'Жаяу Мұса Байжанұлы',
          dates: '1835–1918',
          region: 'Баянауыл өңірі',
          school: 'arka',
          schoolName: 'Арқа ән мектебі',
          kuis: ['Ақсиса', 'Хаулау', 'Сұрша қыз', 'Шолпан', 'Көкаршын'],
          bio: 'Композитор, ақын, әлеуметтік теңсіздікке қарсы күрескен халық батыры. «Ақсиса» — қазақ наразылық музыкасының шыңы.',
          img: '/images/stele-kuyshi-side-a.jpg',
        },
        {
          id: 'amre',
          name: 'Әміре Қашаубаев',
          dates: '1888–1934',
          region: 'Шығыс Қазақстан, Семей',
          school: 'arka',
          schoolName: 'Арқа ән мектебі',
          kuis: ['Ағаш аяқ', 'Балқадиша', 'Дударай', 'Бес қарагер', 'Жалғыз арша'],
          bio: '1925 жылы Париждегі ЭКСПО көрмесінде қазақ әнін бүкіл Еуропаға танытқан біртуар ұлы тенор.',
          img: '/images/dina-monument.jpg',
        },
        {
          id: 'kenen',
          name: 'Кенен Әзірбаев',
          dates: '1884–1976',
          region: 'Жамбыл облысы, Қордай',
          school: 'jetysu',
          schoolName: 'Жетісу дәстүрі',
          kuis: ['Бозторғай', 'Базар-Назар', 'Көкшолақ', 'Бұлбұлға'],
          bio: 'Жетісу ән-жыр мектебінің абызы, әнші әрі композитор, ақындар айтысының майталманы.',
          img: '/images/book-gasyrlar-uni.jpg',
        },
        {
          id: 'garifolla',
          name: 'Ғарифолла Құрманғалиев',
          dates: '1909–1993',
          region: 'Батыс Қазақстан, Қаратөбе',
          school: 'west',
          schoolName: 'Батыс дәстүрі',
          kuis: ['Бозжорға', 'Он алты қыз', 'Сүйген жар', 'Ақ кербез'],
          bio: 'Мұхит мектебінің ең көрнекті мирасқоры, қайталанбас биік тенор иесі, Қазақстанның халық әртісі.',
          img: '/images/dina-monument-full.jpg',
        },
      ],
    },
  },
};

export default function CanonPage({ type = 'kuyshi', onNavigate, lang = 'kk', t, navLabels = {} }) {
  const canon = CANON_DATA[type] || CANON_DATA.kuyshi;
  const c = canon[lang] || canon.kk;
  // Fallback to kk masters if other lang empty
  const mastersList = (c.masters && c.masters.length > 0) ? c.masters : canon.kk.masters;

  const [activeSchool, setActiveSchool] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingId, setPlayingId] = useState(null);
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

  const togglePlay = (id) => {
    setPlayingId(playingId === id ? null : id);
  };

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
            const isPlaying = playingId === m.id;
            return (
              <div key={m.id} className={`canon-master-card ${isPlaying ? 'playing' : ''}`}>
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
                      className={`play-sample-btn ${isPlaying ? 'active' : ''}`}
                      onClick={() => togglePlay(m.id)}
                    >
                      {isPlaying ? <PiPauseCircleDuotone size={20} /> : <PiPlayCircleDuotone size={20} />}
                      <span>{isPlaying ? 'Тоқтату' : 'Үлгі тыңдау'}</span>
                    </button>
                    <button
                      className="details-btn"
                      onClick={() => setSelectedMaster(m)}
                    >
                      <span>Толығырақ</span>
                    </button>
                  </div>

                  {isPlaying && (
                    <div className="playing-indicator">
                      <span className="wave-bar" />
                      <span className="wave-bar" />
                      <span className="wave-bar" />
                      <span className="wave-bar" />
                      <small>Аудио жазба ойнатылуда...</small>
                    </div>
                  )}
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
          <div className="master-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedMaster(null)}>✕</button>
            <div className="modal-header">
              <img src={selectedMaster.img} alt={selectedMaster.name} />
              <div>
                <span className="block-kicker">{selectedMaster.schoolName}</span>
                <h2>{selectedMaster.name}</h2>
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

