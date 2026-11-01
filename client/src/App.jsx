import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight,
  Award, Check, ChevronLeft, ChevronRight, Compass, Copy, Download, Eye, FilePlus2, FolderOpen, Globe, LockKeyhole, MapPin, Maximize2, Menu, Minimize2, Moon, Music, Pencil, Plus, QrCode, RotateCcw, Save, Search, Share2, ShieldCheck, Sparkles, Sun, Trash2, UserCheck, Users, X,
} from 'lucide-react';
import QRCode from 'qrcode';
import {
  approveEditorAccount,
  bulkApprovePages,
  createPage,
  deleteEditorAccount,
  getAdminAccounts,
  getPages,
  loginEditor,
  registerEditor,
  resetLocalPages,
  savePage,
  verifySuperAdmin,
} from './api.js';

const INITIAL_SLUG = 'home';
const BLOCK_TYPES = [
  ['heading', 'Бөлім тақырыбы'],
  ['text', 'Мәтін'],
  ['feature', 'Ерекше тақырып'],
  ['quote', 'Дәйексөз'],
  ['image', 'Сурет'],
  ['list', 'Тізім'],
  ['stats', 'Сандар'],
  ['cards', 'Карточкалар'],
  ['callout', 'Екпінді блок'],
  ['qr', 'QR сілтеме'],
];
const NAV_ORDER = ['home', 'people', 'heritage', 'projects', 'about', 'library'];

const NAV_LABELS_MAP = {
  kk: {
    home: 'Басты бет',
    people: 'Тұлғалар',
    heritage: 'Музыкалық мұра',
    projects: 'Жобалар',
    about: 'Қор туралы',
    library: 'Цифрлық кітапхана',
    'about-charter': 'Қордың құрылымы мен міндеттері',
    'about-leadership': 'Қор басшылығы мен ғылыми кеңес',
    'projects-alley': 'Күйшілер аллеясы',
    'projects-monument': 'Дина Нұрпейісова монументі',
    'projects-muragerler': '«Мұрагерлер» жастар үйірмесі',
    'people-kuyshi': '101 Күйші каноны',
    'people-zhyrau': '110 Жырау мен жыршы',
    'people-anshi': '110 Дәстүрлі әнші',
    'library-vol-1': 'I том · Күй әлемі',
    'library-vol-2': 'II том · Ғасырлар үні',
    'library-vol-3': 'III том · Ұлы дала әуені',
  },
  ru: {
    home: 'Главная',
    people: 'Деятели',
    heritage: 'Музыкальное наследие',
    projects: 'Проекты',
    about: 'О фонде',
    library: 'Цифровая библиотека',
    'about-charter': 'Структура и задачи фонда',
    'about-leadership': 'Руководство и научный совет',
    'projects-alley': 'Аллея Кюйши',
    'projects-monument': 'Монумент Дины Нурпеисовой',
    'projects-muragerler': 'Молодежный клуб «Мұрагерлер»',
    'people-kuyshi': 'Канон 101 Кюйши',
    'people-zhyrau': 'Канон 110 Жырау и жыршы',
    'people-anshi': 'Канон 110 Традиционных певцов',
    'library-vol-1': 'Том I · Мир кюя',
    'library-vol-2': 'Том II · Голос веков',
    'library-vol-3': 'Том III · Мелодии Великой степи',
  },
  en: {
    home: 'Home',
    people: 'Notable Figures',
    heritage: 'Musical Heritage',
    projects: 'Projects',
    about: 'About Us',
    library: 'Digital Library',
    'about-charter': 'Charter & Objectives',
    'about-leadership': 'Leadership & Advisory Board',
    'projects-alley': 'Kuyshiler Alley',
    'projects-monument': 'Dina Nurpeisova Monument',
    'projects-muragerler': '"Muragerler" Youth Club',
    'people-kuyshi': 'Canon of 101 Kuyshis',
    'people-zhyrau': 'Canon of 110 Zhyrau',
    'people-anshi': 'Canon of 110 Traditional Singers',
    'library-vol-1': 'Vol. I · World of Kui',
    'library-vol-2': 'Vol. II · Echo of Centuries',
    'library-vol-3': 'Vol. III · Steppe Melodies',
  },
};

const UI_TRANSLATIONS = {
  kk: {
    brandSubtitle: 'Қазақ музыкасының цифрлық энциклопедиясы',
    heroKicker: 'Қазақ музыка мұрасының цифрлық орталығы',
    heroTitle: 'Күй анасы.',
    heroTitleEm: 'Ұлы дала әуені.',
    peopleBtn: 'Тұлғалар бөлімі',
    heritageBtn: 'Музыкалық мұра',
    searchPlaceholder: 'Тұлғаларды, күйлерді немесе материалдарды іздеу...',
    notFound: 'Нәтиже табылмады.',
    libraryBtn: 'Кітапханаға өту',
    aboutFund: 'Қор туралы',
    leadersTitle: 'Жобаның басты тұлғалары',
    leadersKicker: 'ЖОБА АВТОРЛАРЫ МЕН ЖЕТЕКШІЛЕРІ',
    galleryKicker: 'АСТАНА · КҮЙШІ ДИНА КӨШЕСІ',
    galleryTitle: 'Күйшілер аллеясының фотопанорамасы',
    galleryDesc: 'Елорда төріндегі қазақ музыкалық өркениетінің сәулеттік кешені мен тарихи мемориалдары.',
    exploreAlley: 'Аллеяны толық көру',
    exploreBtn: 'Толығырақ көру',
    adminPanel: 'Әкімшілік панель',
    footerCopy: '© 2026 «КҮЙ АНАСЫ» жеке қоры',
    footerDesc: 'Қазақ музыкасының цифрлық энциклопедиясы',
    readMore: 'Оқу',
    backHome: 'Басты бет',
    subpagesTitle: 'Бөлім материалдары',
    subpagesKicker: 'ОСЫ БӨЛІМДЕГІ БЕТТЕР',
    calloutTitle: 'Қазақ музыкасының үш томдық жинағы.',
    calloutDesc: 'Күй өнері, жыраулық дәстүр мен әншілік мектептер туралы зерттеу материалдары.',
    calloutBtn: 'Кітапхананы қарау',
    muragerlerKicker: 'ЖАСТАР БАСТАМАСЫ · МӘДЕНИ САБАҚТАСТЫҚ',
    muragerlerTitle: '«Мұрагерлер» жастар үйірмесі',
    muragerlerSlogan: '«Мұраны сақта, жаңғырт, дамыт!»',
    muragerlerDesc: '«Күй анасы» жеке қоры жанындағы өскелең ұрпақты ұлттық музыка өнеріне баулу және жас дарындарды жан-жақты қолдау бастамасы.',
    muragerlerBtn: 'Үйірме туралы толық білу',
  },
  ru: {
    brandSubtitle: 'Цифровая энциклопедия казахской музыки',
    heroKicker: 'Цифровой центр музыкального наследия Казахстана',
    heroTitle: 'Күй анасы.',
    heroTitleEm: 'Мелодии Великой степи.',
    peopleBtn: 'Раздел деятелей',
    heritageBtn: 'Музыкальное наследие',
    searchPlaceholder: 'Поиск деятелей, кюев, книг и материалов...',
    notFound: 'По запросу ничего не найдено.',
    libraryBtn: 'Перейти в библиотеку',
    aboutFund: 'О фонде',
    leadersTitle: 'Ключевые лица проекта',
    leadersKicker: 'АВТОРЫ И РУКОВОДИТЕЛИ ПРОЕКТА',
    galleryKicker: 'АСТАНА · УЛИЦА КУЙШИ ДИНА',
    galleryTitle: 'Фотопанорама Аллеи Кюйши',
    galleryDesc: 'Архитектурный комплекс и исторические мемориалы казахской музыкальной цивилизации в столице.',
    exploreAlley: 'Исследовать аллею',
    exploreBtn: 'Смотреть подробнее',
    adminPanel: 'Панель управления',
    footerCopy: '© 2026 Частный фонд «КҮЙ АНАСЫ»',
    footerDesc: 'Цифровая энциклопедия казахской музыки',
    readMore: 'Читать',
    backHome: 'Главная',
    subpagesTitle: 'Материалы раздела',
    subpagesKicker: 'СТРАНИЦЫ ДАННОГО РАЗДЕЛА',
    calloutTitle: 'Трехтомное собрание казахской музыки.',
    calloutDesc: 'Исследовательские материалы об искусстве кюя, традиции жырау и школах пения.',
    calloutBtn: 'Смотреть библиотеку',
    muragerlerKicker: 'МОЛОДЕЖНАЯ ИНИЦИАТИВА · КУЛЬТУРНАЯ ПРЕЕМСТВЕННОСТЬ',
    muragerlerTitle: 'Молодежный клуб «Мұрагерлер»',
    muragerlerSlogan: '«Сохраняй, возрождай, развивай наследие!»',
    muragerlerDesc: 'Молодежная инициатива при фонде «Күй анасы» по приобщению подрастающего поколения к традиционной музыке и всесторонней поддержке юных талантов.',
    muragerlerBtn: 'Подробнее о клубе',
  },
  en: {
    brandSubtitle: 'Digital Encyclopedia of Kazakh Music',
    heroKicker: 'Digital Center of Kazakh Musical Heritage',
    heroTitle: 'Kui Anasy.',
    heroTitleEm: 'Steppe Melodies.',
    peopleBtn: 'Notable People',
    heritageBtn: 'Musical Heritage',
    searchPlaceholder: 'Search artists, kuy records, books...',
    notFound: 'No results found.',
    libraryBtn: 'Explore Library',
    aboutFund: 'About the Foundation',
    leadersTitle: 'Key Figures of the Project',
    leadersKicker: 'PROJECT LEADERS & AUTHORS',
    galleryKicker: 'ASTANA · KUYSHI DINA STREET',
    galleryTitle: 'Photo Panorama of Kuyshiler Alley',
    galleryDesc: 'Architectural complex and historical memorials of Kazakh musical civilization in the capital.',
    exploreAlley: 'Explore the Alley',
    exploreBtn: 'Explore details',
    adminPanel: 'Admin Panel',
    footerCopy: '© 2026 "KUI ANASY" Private Foundation',
    footerDesc: 'Digital Encyclopedia of Kazakh Music',
    readMore: 'Read more',
    backHome: 'Home',
    subpagesTitle: 'Section Materials',
    subpagesKicker: 'PAGES IN THIS SECTION',
    calloutTitle: 'Three-volume collection of Kazakh traditional music.',
    calloutDesc: 'Research materials, biographies, and audio archives of the great steppe masters.',
    calloutBtn: 'Browse Library',
    muragerlerKicker: 'YOUTH INITIATIVE · CULTURAL CONTINUITY',
    muragerlerTitle: '"Muragerler" Youth Club',
    muragerlerSlogan: '"Preserve, Revive, Develop the Heritage!"',
    muragerlerDesc: 'A youth initiative by the "Kui Anasy" Foundation to engage the younger generation in traditional Kazakh music and support emerging talents.',
    muragerlerBtn: 'Learn More About the Club',
  },
};

const PROJECT_LEADERS = [
  {
    id: 'tolegen-kuanyshev',
    name: 'Қуанышев Төлеген Шағытбайұлы',
    role: 'Қор құрылтайшысы · Жоба жетекшісі',
    badge: 'Қор басшылығы · Идея авторы',
    bio: 'Педагогика ғылымдарының кандидаты, профессор. «Күй анасы» жеке қорының құрылтайшысы. 2021 жылы Астанадағы Дина Нұрпейісова монументін орнату, Күйшілер аллеясын құру және «Ұлы дала әуенінің тұлғалары» үш томдық жинағының бастамашысы әрі жетекшісі.',
    initials: 'ТҚ',
    photo: '/images/tolegen-kuanyshev-founder.jpg',
    highlights: [
      'Дина Нұрпейісова монументі идеясының авторы (2021)',
      'Астанадағы Күйшілер аллеясының бастамашысы',
      '«Ұлы дала әуенінің тұлғалары» жинағының жетекшісі',
      'П.ғ.к., профессор, қоғам қайраткері',
    ],
  },
  {
    id: 'erzat-zhetibayev',
    name: 'Жетибаев Ерзат Өмірзақұлы',
    role: 'Ғылыми кеңесші · Бас сарапшы',
    badge: 'Ғылыми бағыт · Редакция',
    bio: 'Филология ғылымдарының кандидаты. «Ұлы дала әуенінің тұлғалары» үш томдық академиялық басылымының ғылыми кеңесшісі, тарихи-музыкалық зерттеулердің методологиялық және деректанушылық сапасына жауапты жетекші ғалым.',
    initials: 'ЕЖ',
    photo: null,
    highlights: [
      '«Ұлы дала әуенінің тұлғалары» ғылыми кеңесшісі',
      '321+ тарихи тұлғаның ғылыми канонын сараптау',
      'Ф.ғ.к., фольклортанушы әрі деректанушы',
      'Академиялық контент сапасы мен библиография',
    ],
  },
  {
    id: 'zhalyn-bauyrzhan',
    name: 'Жалын Бауыржан',
    role: 'Мүсінші · Монументалист суретші',
    badge: 'Сәулет және монумент',
    bio: 'Астана қаласындағы Күйшілер аллеясында орнатылған «Күй анасы — Дина» қола монументінің басты мүсінші-авторы (бірлескен авторлар: Болатбек Еркебайұлы, Аманжол Бекенұлы).',
    initials: 'ЖБ',
    photo: null,
    highlights: [
      'Дина Нұрпейісованың қола ескерткішінің авторы',
      'Қазақстанның кәсіби мүсінші-монументалисі',
      'Күйшілер аллеясының сәулеттік композициясы',
      'Ұлттық нақыштағы көркем бейнелерді сомдаушы',
    ],
  },
];

const MURAGERLER_FEATURES = {
  kk: [
    {
      title: 'Дина атындағы стипендия',
      desc: 'Жас талантты күйшілер мен дәстүрлі өнерпаздарға жыл сайынғы арнайы шәкіртақы және қолдау.',
    },
    {
      title: 'Ашық аспан концерттері',
      desc: 'Жазғы маусымда Күйшілер аллеясында өтетін ашық аспан астындағы кештер мен дәрістер.',
    },
    {
      title: 'Тәлімгерлік шеберлік сабақтары',
      desc: 'Еліміздің белгілі күйші-ғалымдары мен кәсіби ұстаздарының мектептердегі дәрістері.',
    },
    {
      title: 'Фольклорлық экспедициялар',
      desc: 'Көне күйлер мен дала сарындарының шығу аңыздарын зерттейтін жас өлкетанушылар сапарлары.',
    },
  ],
  ru: [
    {
      title: 'Стипендия имени Дины',
      desc: 'Ежегодные специальные стипендии и поддержка юных талантливых кюйши и исполнителей.',
    },
    {
      title: 'Концерты под открытым небом',
      desc: 'Летние музыкальные вечера, лекции и выступления на Аллее Кюйши в Астане.',
    },
    {
      title: 'Наставнические мастер-классы',
      desc: 'Уроки мастерства от признанных ученых-музыковедов и мастеров сцены в школах столицы.',
    },
    {
      title: 'Фольклорные экспедиции',
      desc: 'Краеведческие экспедиции молодежи по исследованию исторических истоков и легенд кюев.',
    },
  ],
  en: [
    {
      title: 'Dina Nurpeisova Scholarship',
      desc: 'Annual grants and financial support for young gifted kuyshis and traditional artists.',
    },
    {
      title: 'Open-Air Concerts',
      desc: 'Summer evening performances and lectures held at the Kuyshiler Alley in Astana.',
    },
    {
      title: 'Masterclasses & Mentorship',
      desc: 'Interactive workshops in schools led by prominent musicologists and virtuosos.',
    },
    {
      title: 'Folklore Expeditions',
      desc: 'Youth research trips exploring historical legends and origins of traditional kuys.',
    },
  ],
};

const ALLEY_GALLERY = [
  {
    id: 1,
    image: '/images/alley-arch-main.jpg',
    genre: 'АРХИТЕКТУРАЛЫҚ КЕШЕН · 2021',
    title: 'Күйшілер аллеясының бас қақпасы',
    subtitle: 'Астана · Күйші Дина көшесі',
    desc: 'Астана қаласының Күйші Дина көшесінде бой көтерген салтанатты бас қақпа. Жоғарғы жағы киелі Шаңырақпен және қоладан құйылған ноталық белгілермен безендірілген.',
    targetSlug: 'projects-alley',
  },
  {
    id: 2,
    image: '/images/dina-monument-full.jpg',
    genre: 'МОНУМЕНТАЛДЫ ӨНЕР · 2021',
    title: '«Күй анасы — Дина» монументі',
    subtitle: '2021 ж. орнатылған',
    desc: 'Қазақтың ұлы күйші-композиторы Дина Нұрпейісованың 160 жылдығына орай орнатылған айбынды қола ескерткіш пен мәрмәр тұғыр. Мүсіншісі — Жалын Бауыржан.',
    targetSlug: 'projects-monument',
  },
  {
    id: 3,
    image: '/images/dina-sculpture-bronze.jpg',
    genre: 'МҮСІНДІК КОМПОЗИЦИЯ',
    title: 'Дина бейнесінің қола шешімі',
    subtitle: 'Ұлттық мұра сомдалуы',
    desc: 'Домбыраны пернесінен құдіретті сарын төккен сәті. Ұлттық киім мен күйшілік асқақ рухтың терең шеберлікпен сомдалған бейнесі.',
    targetSlug: 'projects-monument',
  },
  {
    id: 4,
    image: '/images/stele-kuyshi-side-a.jpg',
    genre: 'ТАРИХИ МЕМОРИАЛ · 101 КҮЙШІ',
    title: '101 Күйші канондық стеласы',
    subtitle: 'Қола қобыз және домбыра',
    desc: 'Қазақ даласының ғасырлар қойнауынан жеткен 101 ұлы күйші-композиторының есімдері тасқа қашалған қос бетті мәрмәр-гранит кешені.',
    targetSlug: 'people-kuyshi',
  },
  {
    id: 5,
    image: '/images/stele-zhyrau-side-a.jpg',
    genre: '«ҒАСЫРЛАР ҮНІ» · 110 САҢЛАҚ',
    title: '110 Жырау мен жыршы стеласы',
    subtitle: 'Жыр сүлейлері шежіресі',
    desc: 'Тоныкөк пен Қорқыттан бастау алатын көне жыраулық дәстүр мен эпостық жыр сүлейлерінің 110 өкіліне арналған еңселі стела (2025 ж.).',
    targetSlug: 'people-zhyrau',
  },
  {
    id: 6,
    image: '/images/dina-dedication-plaque.jpg',
    genre: 'ҚҰЖАТТЫҚ ДЕРЕК · ТАРИХ',
    title: 'Монументтің ресми естелік тақтасы',
    subtitle: 'Ресми естелік тақта',
    desc: 'Аллея мен монументтің ашылу күні, идея авторы профессор Төлеген Қуанышев және мүсіншілер ұжымының авторлық құқықтық деректері.',
    targetSlug: 'projects-monument',
  },
  {
    id: 7,
    image: '/images/tolegen-kuanyshev-founder.jpg',
    genre: 'ЖОБА ЖЕТЕКШІСІ · ҚҰРЫЛТАЙШЫ',
    title: 'Профессор Төлеген Қуанышев',
    subtitle: 'Қор басшылығы · Идея авторы',
    desc: '«Күй анасы» жеке қорының құрылтайшысы, Күйшілер аллеясы мен Дина монументінің басты бастамашысы әрі үш томдық ғылыми жинақтың жетекшісі.',
    targetSlug: 'about-leadership',
  },
  {
    id: 8,
    image: '/images/alley-gazebo.jpg',
    genre: 'ҚАЛАЛЫҚ КЕҢІСТІК · АСТАНА',
    title: 'Аллеяның демалыс пен мәдениет аймағы',
    subtitle: 'Заманауи мәдени кеңістік',
    desc: 'Елорда тұрғындары мен руханият жанашырларына арналған заманауи сәулеттік орындықтар, күмбезді демалыс беседкасы мен көгалдандырылған жасыл желек.',
    targetSlug: 'projects-alley',
  },
];

const PARENT_SECTIONS = [
  { slug: 'people', title: 'Тұлғалар (күйшілер, жыраулар, әншілер)' },
  { slug: 'heritage', title: 'Музыкалық мұра (күйлер, әндер, сарындар)' },
  { slug: 'projects', title: 'Жобалар (мәдени бастамалар, аллеялар)' },
  { slug: 'library', title: 'Цифрлық кітапхана (кітаптар, жинақтар)' },
  { slug: 'about', title: 'Қор туралы (ұйым, қызмет)' },
];

function DombraSilhouette({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 160 520" fill="currentColor" aria-hidden="true">
      <path d="M78 0c-4 0-7 3-7 7v180c-18 8-36 28-44 52-16 48-10 114 16 160 22 39 48 48 74 48s52-9 74-48c26-46 32-112 16-160-8-24-26-44-44-52V7c0-4-3-7-7-7h-8zm-2 225c2 0 4 2 4 4v85c0 2-2 4-4 4s-4-2-4-4v-85c0-2 2-4 4-4zm8 140c8 0 15 7 15 15s-7 15-15 15-15-7-15-15 7-15 15-15z" />
    </svg>
  );
}

function OrnamentDivider() {
  return (
    <div className="ornament-divider" aria-hidden="true">
      <span className="ornament-glyph">❖</span>
    </div>
  );
}

function App() {
  const [pages, setPages] = useState([]);
  const [activeSlug, setActiveSlug] = useState(INITIAL_SLUG);
  const [adminOpen, setAdminOpen] = useState(window.location.hash.startsWith('#admin'));
  const [lang, setLang] = useState(() => localStorage.getItem('kui-lang') || 'kk');
  const [theme, setTheme] = useState(() => localStorage.getItem('kui-theme') || 'light');

  const [sessionUser, setSessionUser] = useState(() => {
    try {
      const raw = sessionStorage.getItem('kui-auth-session');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('kui-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLangChange = (newLang) => {
    setLang(newLang);
    localStorage.setItem('kui-lang', newLang);
  };

  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.kk;
  const navLabels = NAV_LABELS_MAP[lang] || NAV_LABELS_MAP.kk;

  useEffect(() => {
    getPages()
      .then(setPages)
      .catch((error) => setLoadError(error.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleHash = () => setAdminOpen(window.location.hash.startsWith('#admin'));
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleSetSessionUser = (user) => {
    setSessionUser(user);
    if (user) {
      sessionStorage.setItem('kui-auth-session', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('kui-auth-session');
    }
  };

  const sortedPages = useMemo(
    () => [...pages].sort((a, b) => a.position - b.position),
    [pages],
  );
  const navPages = useMemo(
    () => [...sortedPages]
      .filter((page) => !page.parent_slug)
      .sort((a, b) => {
        const aOrder = NAV_ORDER.indexOf(a.slug);
        const bOrder = NAV_ORDER.indexOf(b.slug);
        return (aOrder < 0 ? NAV_ORDER.length : aOrder) - (bOrder < 0 ? NAV_ORDER.length : bOrder);
      }),
    [sortedPages],
  );
  const searchResults = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    if (!needle) return [];
    return pages
      .filter((page) => !page.status || page.status === 'published' || sessionUser)
      .filter((page) => `${page.title} ${page.description} ${(page.blocks || []).map((block) => `${block.title} ${block.body}`).join(' ')}`.toLocaleLowerCase().includes(needle));
  }, [pages, query, sessionUser]);

  const activePage = pages.find((page) => page.slug === activeSlug) || pages[0];
  const navigate = (slug) => {
    setActiveSlug(slug);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <div className="loading-screen"><span className="brand-mark"><i /><i /><i /></span><p>Жүктелуде…</p></div>;
  }

  if (loadError) {
    return (
      <div className="loading-screen error-screen">
        <span className="brand-mark"><i /><i /><i /></span>
        <h1>Сайтпен байланыс жоқ</h1>
        <p>{loadError}</p>
        <p className="setup-hint">Алдымен серверде PostgreSQL дерекқорын қосып, <code>npm run dev</code> пәрменін орындаңыз.</p>
      </div>
    );
  }

  if (adminOpen) {
    return (
      <AdminPanel
        pages={sortedPages}
        sessionUser={sessionUser}
        onSessionUserChange={handleSetSessionUser}
        onPagesChange={setPages}
        onExit={() => { window.location.hash = ''; }}
        navLabels={navLabels}
      />
    );
  }

  return (
    <div className="site-shell">
      {/* Vintage Paper Texture Overlay */}
      <div className="vintage-parchment-overlay" aria-hidden="true" />

      {/* Authentic Kazakh Vertical Ornamental Flanks on Underlay */}
      <div className="shell-vertical-ornament ornament-left" aria-hidden="true" />
      <div className="shell-vertical-ornament ornament-right" aria-hidden="true" />

      <header className="site-header">
        <a className="brand" href="#" onClick={(event) => { event.preventDefault(); navigate('home'); }}>
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <span className="brand-copy"><strong>Күй анасы</strong></span>
        </a>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Мәзір">
          {menuOpen ? <X /> : <Menu />}
        </button>

        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`}>
          {navPages.map((page) => (
            <button key={page.slug} className={page.slug === activePage?.slug ? 'nav-link active' : 'nav-link'} onClick={() => navigate(page.slug)}>
              {navLabels[page.slug] || page.title}
            </button>
          ))}
        </nav>

        <div className="header-actions">
          <div className="header-extra-controls">
            {/* Trilingual switcher */}
            <div className="lang-switcher">
              <button className={`lang-btn ${lang === 'kk' ? 'active' : ''}`} onClick={() => handleLangChange('kk')}>ҚАЗ</button>
              <button className={`lang-btn ${lang === 'ru' ? 'active' : ''}`} onClick={() => handleLangChange('ru')}>РУС</button>
              <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => handleLangChange('en')}>ENG</button>
            </div>

            {/* Dark / Light theme toggle */}
            <button className="theme-toggle-btn" onClick={toggleTheme} title={theme === 'dark' ? 'Жарық тақырып' : 'Қараңғы тақырып'}>
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>

          <button className="icon-button" aria-label="Іздеу" onClick={() => setSearchOpen(!searchOpen)}><Search size={19} /></button>
        </div>
      </header>

      {searchOpen && (
        <section className="search-wrap">
          <div className="search-bar">
            <Search size={18} />
            <input type="search" placeholder={t.searchPlaceholder} value={query} onChange={(event) => setQuery(event.target.value)} autoFocus />
            {query && <button className="icon-button" onClick={() => setQuery('')}><X size={17} /></button>}
          </div>
          {query.trim() && (
            <div className="search-results">
              {searchResults.length ? searchResults.map((page) => (
                <button key={page.slug} onClick={() => { navigate(page.slug); setSearchOpen(false); setQuery(''); }}>
                  <strong>{page.title}</strong>
                  <span>{navLabels[page.parent_slug] || navLabels[page.slug] || 'Парақша'}</span>
                </button>
              )) : <p>{t.notFound}</p>}
            </div>
          )}
        </section>
      )}

      {activePage && (
        <main>
          {activePage.slug === 'home' ? (
            <HomePage page={activePage} onNavigate={navigate} t={t} navLabels={navLabels} lang={lang} />
          ) : (
            <StandardPage page={activePage} onNavigate={navigate} query={query} allPages={pages} isEditor={!!sessionUser} t={t} navLabels={navLabels} />
          )}
        </main>
      )}

      <footer className="site-footer">
        <DombraSilhouette className="dombra-watermark dombra-watermark-footer" />
        <div className="footer-main">
          <div className="footer-brand">
            <a className="brand" href="#" onClick={(event) => { event.preventDefault(); navigate('home'); }}>
              <span className="brand-mark"><i /><i /><i /></span>
              <span className="brand-copy"><strong>Күй анасы</strong></span>
            </a>
            <p>Қазақтың ұлттық музыкалық мұрасын сақтау, зерттеу және келер ұрпаққа жеткізуге арналған цифрлық бастама.</p>
          </div>
          <div>
            <span className="footer-heading">Бөлімдер</span>
            <div className="footer-links">
              {navPages.filter((page) => page.slug !== 'home').slice(0, 4).map((page) => (
                <button key={page.slug} onClick={() => navigate(page.slug)}>
                  {navLabels[page.slug] || page.title}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="footer-heading">Басқару</span>
            <p>Энциклопедия мазмұнын басқару және жаңа парақшалар енгізу.</p>
            <a href="#admin">{t.adminPanel} <ArrowUpRight size={14} /></a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{t.footerCopy}</span>
          <span>{t.footerDesc}</span>
        </div>
      </footer>
    </div>
  );
}



function AppleTvMediaGallery({ items, onNavigate, t }) {
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
                          <span className="tv-gallery-badge">{item.genre}</span>
                        </div>
                        <div className="media-gallery-bottom-content">
                          <div className="media-gallery-headline">
                            <span className="media-gallery-genre">{item.genre}</span>
                            <h3 className="media-gallery-title">{item.title}</h3>
                          </div>
                          <p className="media-gallery-desc">{item.desc}</p>
                          <span className="media-gallery-button">
                            <span>{t.exploreBtn || 'Толығырақ көру'}</span>
                            <ArrowRight size={15} />
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
              <ChevronLeft size={26} />
            </button>
            <button
              type="button"
              className="tv-gallery-nav-btn next-btn"
              onClick={handleNext}
              aria-label="Келесі слайд"
            >
              <ChevronRight size={26} />
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

function HeroImageRotator({ lang = 'kk' }) {
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

function HomePage({ page, onNavigate, t, navLabels, lang = 'kk' }) {
  const blocks = page.blocks || [];
  const intro = blocks.find((block) => block.type === 'quote');
  const stats = blocks.find((block) => block.type === 'stats');
  const feature = blocks.find((block) => block.type === 'feature');
  const latest = blocks.find((block) => block.type === 'cards');

  return (
    <div className="homepage-wrapper">
      <section className="archive-hero content-width">
        <div className="archive-hero-copy">
          <p className="hero-kicker">{t.heroKicker}</p>
          <h1>{t.heroTitle}<br /><em>{t.heroTitleEm}</em></h1>
          <p>{page.description}</p>
          <p className="hero-english">Kazakh music, its people and living traditions.</p>
          <div className="hero-actions">
            <button className="button button-dark" onClick={() => onNavigate('people')}>{t.peopleBtn} <ArrowRight size={17} /></button>
            <button className="text-button" onClick={() => onNavigate('heritage')}>{t.heritageBtn} <ArrowUpRight size={16} /></button>
          </div>
        </div>

        <HeroImageRotator lang={lang} />
      </section>

      {/* Дина Нұрпейісова блогы */}
      {feature && (
        <section className="featured-person">
          <figure className="featured-person-image">
            <img src="/images/dina-monument.jpg" alt="Дина Нұрпейісова ескерткіші" />
            <figcaption>Дина Нұрпейісова ескерткіші · Астана</figcaption>
          </figure>

          <div className="featured-person-copy">
            <span className="hero-kicker">ТҰЛҒА · {feature.eyebrow || '1861 — 1955'}</span>
            <h2>{feature.title}</h2>
            <p>{feature.body}</p>
            <button className="underlined-link" onClick={() => onNavigate('people')}>
              Тұлғалар каталогы <ArrowRight size={15} />
            </button>
          </div>
          <span className="featured-person-pattern" aria-hidden="true" />
        </section>
      )}

      {stats && (
        <section className="archive-stats content-width">
          <h2>Бір мұра.<br /><strong>Үш дәстүр.</strong></h2>
          {stats.items?.map((item) => (
            <div className="archive-stat-row" key={item.label}>
              <strong>{item.value}</strong>
              <p>{item.label}</p>
            </div>
          ))}
        </section>
      )}

      {intro && (
        <section className="editorial-intro content-width">
          <div className="intro-copy">
            <h2>{intro.title}</h2>
            <p>{intro.body}</p>
            <button className="underlined-link" onClick={() => onNavigate('about')}>
              {t.aboutFund} <ArrowRight size={15} />
            </button>
          </div>

          <figure className="intro-artwork">
            <img src="/images/dombra-player-illustration.png" alt="Домбырашының көркем бейнесі" loading="lazy" />
            <figcaption>КӨРКЕМ БЕЙНЕ · АТРИБУЦИЯ ЖОҚ</figcaption>
          </figure>
          <span className="intro-pattern" aria-hidden="true" />
        </section>
      )}

      {latest && (
        <section className="discover-section content-width">
          <div className="section-topline">
            <h2>{latest.title}</h2>
            <button className="underlined-link" onClick={() => onNavigate('library')}>
              {t.libraryBtn} <ArrowRight size={15} />
            </button>
          </div>
          <div className="discover-spread">
            {(latest.items || []).slice(0, 3).map((item, index) => (
              <button className="discover-card" key={item.title} onClick={() => onNavigate(item.slug || 'heritage')}>
                <img src={['/images/book-kui-alemi.jpg', '/images/book-gasyrlar-uni.jpg', '/images/book-uly-dala-aueni.jpg'][index]} alt="" />
                <span className="discover-card-copy">
                  <span>{item.meta}</span>
                  <strong>{item.title}</strong>
                  <span className="discover-description">{item.description}</span>
                </span>
                <ArrowUpRight size={22} />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Күйшілер аллеясының Apple TV үлгісіндегі фотопанорамасы */}
      <AppleTvMediaGallery items={ALLEY_GALLERY} onNavigate={onNavigate} t={t} />

      {/* Жоба жетекшілері мен басты тұлғалары */}
      <section className="project-leaders-section content-width">
        <div className="section-topline section-topline-centered">
          <span className="block-kicker">{t.leadersKicker}</span>
          <h2>{t.leadersTitle}</h2>
        </div>
        <div className="leaders-grid">
          {PROJECT_LEADERS.map((leader) => (
            <article key={leader.id} className="leader-card">
              <div className="leader-avatar-cover">
                {leader.photo ? (
                  <img src={leader.photo} alt={leader.name} className="leader-photo-img" />
                ) : (
                  <div className="leader-avatar-orb">
                    <span>{leader.initials}</span>
                  </div>
                )}
              </div>

              <div className="leader-body">
                <span className="leader-pill-badge">{leader.badge}</span>
                <h3 className="leader-name">{leader.name}</h3>
                <p className="leader-specialty">{leader.role}</p>
                <p className="leader-bio">{leader.bio}</p>

                {leader.highlights && leader.highlights.length > 0 && (
                  <div className="leader-highlights">
                    {leader.highlights.map((item, idx) => (
                      <div key={idx} className="leader-highlight-item">
                        <Check size={13} className="leader-check-icon" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* «Мұрагерлер» жастар үйірмесі арнайы блогы */}
      <section className="muragerler-section content-width">
        <div className="muragerler-card">
          <div className="muragerler-header">
            <div className="muragerler-header-copy">
              <span className="muragerler-slogan-pill">
                <Sparkles size={14} className="muragerler-slogan-icon" />
                <span>{t.muragerlerSlogan || '«Мұраны сақта, жаңғырт, дамыт!»'}</span>
              </span>
              <span className="block-kicker">{t.muragerlerKicker || 'ЖАСТАР БАСТАМАСЫ · МӘДЕНИ САБАҚТАСТЫҚ'}</span>
              <h2 className="muragerler-title">{t.muragerlerTitle || '«Мұрагерлер» жастар үйірмесі'}</h2>
              <p className="muragerler-desc">{t.muragerlerDesc || '«Күй анасы» жеке қоры жанындағы өскелең ұрпақты ұлттық музыка өнеріне баулу және жас дарындарды жан-жақты қолдау бастамасы.'}</p>
            </div>
            <button
              className="muragerler-cta-btn"
              onClick={() => onNavigate('projects-muragerler')}
            >
              <span>{t.muragerlerBtn || 'Үйірме туралы толық білу'}</span>
              <ArrowRight size={17} />
            </button>
          </div>

          <div className="muragerler-features-grid">
            {(MURAGERLER_FEATURES[lang] || MURAGERLER_FEATURES.kk).map((feature, idx) => (
              <div key={idx} className="muragerler-feature-box">
                <div className="muragerler-feature-icon-orb">
                  {idx === 0 && <Award size={20} />}
                  {idx === 1 && <Music size={20} />}
                  {idx === 2 && <Users size={20} />}
                  {idx === 3 && <Compass size={20} />}
                </div>
                <div className="muragerler-feature-copy">
                  <h4>{feature.title}</h4>
                  <p>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Callout onNavigate={onNavigate} t={t} />
    </div>
  );
}

function StandardPage({ page, onNavigate, query, allPages = [], isEditor = false, t, navLabels }) {
  const relevantBlocks = (page.blocks || []).filter((block) => !query || `${block.title} ${block.body}`.toLowerCase().includes(query.toLowerCase()));
  const parentCategory = PARENT_SECTIONS.find((p) => p.slug === page.parent_slug);
  const themeSlug = page.parent_slug || page.slug;
  const subpages = allPages.filter((p) => p.parent_slug === page.slug && (isEditor || !p.status || p.status === 'published'));

  return (
    <>
      <section className={`page-banner page-banner-${themeSlug}`} data-section={themeSlug}>
        <SectionMotif slug={themeSlug} />
        <div className="page-banner-image"><img src={getSectionImage(themeSlug)} alt="" /></div>
        <div className="content-width page-banner-inner">
          {page.parent_slug && (
            <span className="block-kicker banner-parent-kicker">
              {navLabels[page.parent_slug] || parentCategory?.title}
            </span>
          )}
          <h1>{navLabels[page.slug] || page.title}</h1>
          <p>{page.description}</p>
          <div className="breadcrumb">
            <button onClick={() => onNavigate('home')}>{t.backHome}</button>
            <span>/</span>
            {page.parent_slug && (
              <>
                <button onClick={() => onNavigate(page.parent_slug)}>
                  {navLabels[page.parent_slug] || parentCategory?.title}
                </button>
                <span>/</span>
              </>
            )}
            <span>{navLabels[page.slug] || page.title}</span>
          </div>
        </div>
      </section>

      <section className="editorial content-width">
        {relevantBlocks.map((block, index) => <ContentBlock key={block.id || index} block={block} index={index} pageSlug={themeSlug} />)}
        {relevantBlocks.length === 0 && <p className="empty-search">{t.notFound}</p>}

        {subpages.length > 0 && !query && (
          <div className="subpages-container">
            <div className="section-topline">
              <div>
                <span className="block-kicker">{t.subpagesKicker}</span>
                <h2>{t.subpagesTitle} ({subpages.length})</h2>
              </div>
            </div>
            <div className="subpages-grid">
              {subpages.map((sub) => (
                <article key={sub.slug} className="subpage-card" onClick={() => onNavigate(sub.slug)}>
                  <div className="subpage-card-header">
                    <span className="subpage-badge">{navLabels[page.slug] || page.title}</span>
                    <small>{sub.blocks?.length || 0} модуль</small>
                  </div>
                  <h3>{sub.title}</h3>
                  <p>{sub.description || 'Толық мазмұнын ашу үшін басыңыз.'}</p>
                  <span className="subpage-read-link">{t.readMore} <ArrowRight size={14} /></span>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
      <Callout onNavigate={onNavigate} t={t} />
    </>
  );
}

function getSectionImage(slug) {
  const images = {
    people: '/images/dina-monument.jpg',
    heritage: '/images/dombra-player-illustration.png',
    library: '/images/book-kui-alemi.jpg',
    projects: '/images/kuyshiler-alley.jpg',
    about: '/images/dina-monument.jpg',
  };
  return images[slug] || '/images/kuyshiler-alley.jpg';
}

function SectionMotif({ slug }) {
  if (slug === 'heritage') {
    return <svg className="section-motif motif-wave-banner" viewBox="0 0 520 230" aria-hidden="true"><path d="M-20 165C45 165 45 45 110 45s65 120 130 120 65-120 130-120 65 120 170 120" /></svg>;
  }
  return null;
}

function ContentBlock({ block, index, pageSlug }) {
  if (block.type === 'quote') {
    return (
      <figure className="editorial-quote">
        <p>«{block.body}»</p>
        <cite>{block.title}</cite>
      </figure>
    );
  }
  if (block.type === 'stats') {
    return (
      <div className="editorial-stats">
        {(block.items || []).map((item, itemIndex) => (
          <div key={item.label || itemIndex}>
            <span>{String(itemIndex + 1).padStart(2, '0')}</span>
            <strong>{item.value}</strong>
            <p>{item.label}</p>
          </div>
        ))}
      </div>
    );
  }
  if (block.type === 'cards') {
    return (
      <section className="editorial-cards">
        <h2>{block.title}</h2>
        {block.body && <p>{block.body}</p>}
        <div className="mini-card-grid">
          {(block.items || []).map((card, cardIndex) => (
            <article className="mini-card" key={card.title || cardIndex}>
              <div className="mini-card-image"><img src={card.image || ['/images/book-kui-alemi.jpg', '/images/book-gasyrlar-uni.jpg', '/images/book-uly-dala-aueni.jpg'][cardIndex % 3]} alt="" /></div>
              <span>{card.meta}</span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }
  if (block.type === 'callout') {
    return (
      <div className="editorial-callout">
        {block.eyebrow && <span className="block-kicker">{block.eyebrow}</span>}
        <h2>{block.title}</h2>
        <p>{block.body}</p>
        {block.link && <a className="underlined-link" href={block.link} target="_blank" rel="noreferrer">{block.linkLabel || 'Толығырақ'} <ArrowRight size={14} /></a>}
      </div>
    );
  }
  if (block.type === 'image') {
    return (
      <figure className="editorial-image-block">
        <img src={block.link || '/images/kuyshiler-alley.jpg'} alt={block.title || ''} />
        {block.body && <figcaption>{block.body}</figcaption>}
      </figure>
    );
  }
  if (block.type === 'qr') {
    return <QRBlock block={block} />;
  }
  if (block.type === 'list') {
    return (
      <div className="editorial-list-block">
        <h2>{block.title}</h2>
        {block.body && <p>{block.body}</p>}
        <ul>{(block.items || []).map((item, idx) => <li key={idx}>{item.text}</li>)}</ul>
      </div>
    );
  }
  return (
    <article className={`editorial-block ${index % 2 === 1 ? 'block-offset' : ''}`}>
      {block.eyebrow && <span className="block-kicker">{block.eyebrow}</span>}
      <h2>{block.title}</h2>
      <p>{block.body}</p>
    </article>
  );
}

function QRBlock({ block }) {
  const [dataUrl, setDataUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (block.link && block.link.trim()) {
      QRCode.toDataURL(block.link.trim(), {
        width: 256,
        margin: 2,
        color: { dark: '#1f1610', light: '#ffffff' },
      })
        .then(setDataUrl)
        .catch(() => {});
    } else {
      setDataUrl('');
    }
  }, [block.link]);

  const handleCopy = () => {
    if (block.link) {
      navigator.clipboard.writeText(block.link).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="qr-block">
      <div className="qr-card-ornament" aria-hidden="true">❖ ── ◈ ── ❖</div>
      <div className="qr-image-container">
        {dataUrl ? (
          <img src={dataUrl} alt={block.title || 'QR Code'} />
        ) : (
          <div className="qr-placeholder">{block.link ? 'QR код дайындалуда…' : 'Сілтеме көрсетілмеген'}</div>
        )}
      </div>
      <figcaption>{block.title || 'Сілтеме QR-коды'}</figcaption>
      <p className="qr-hint">Телефон камерасымен сканерлеп, сілтемеге жылдам өтіңіз</p>
      {block.link && (
        <div className="qr-link-row">
          <a href={block.link} target="_blank" rel="noreferrer" className="qr-link-url">
            {block.link} <ArrowUpRight size={14} />
          </a>
          <button type="button" className="qr-copy-btn" onClick={handleCopy}>
            {copied ? <Check size={13} /> : <Copy size={13} />}
            <span>{copied ? 'Көшірілді!' : 'Көшіру'}</span>
          </button>
        </div>
      )}
    </div>
  );
}

function Callout({ onNavigate, t }) {
  return (
    <section className="callout">
      <div className="callout-content">
        <h2>{t?.calloutTitle || 'Қазақ музыкасының үш томдық жинағы.'}</h2>
        <p>{t?.calloutDesc || 'Күй өнері, жыраулық дәстүр мен әншілік мектептер туралы зерттеу материалдары.'}</p>
        <button className="button button-dark" onClick={() => onNavigate('library')}>{t?.calloutBtn || 'Кітапхананы қарау'} <ArrowRight size={16} /></button>
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// ADMIN PANEL COMPONENT WITH 2 ROLES & ADVANCED APPROVAL WORKFLOW
// -------------------------------------------------------------

function ConstructorQRPreview({ link }) {
  const [dataUrl, setDataUrl] = useState('');
  useEffect(() => {
    if (link) {
      QRCode.toDataURL(link, { width: 120, margin: 1 }).then(setDataUrl).catch(() => {});
    }
  }, [link]);
  if (!dataUrl) return null;
  return (
    <>
      <img src={dataUrl} alt="QR Preview" />
      <div className="constructor-qr-preview-info">
        <strong>QR дайын!</strong>
        <p>Бұл QR-код мақала ішінде сақталып, оқырмандарға көрсетіледі.</p>
      </div>
    </>
  );
}

function AdminPanel({ pages, sessionUser, onSessionUserChange, onPagesChange, onExit, navLabels }) {
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

function AuthView({ onLoginSuccess, onExit }) {
  const [roleMode, setRoleMode] = useState('super');
  const [editorMode, setEditorMode] = useState('login');
  const [superToken, setSuperToken] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const handleSuperSubmit = (e) => {
    e.preventDefault();
    setError('');
    setNotice('');
    if (!superToken.trim()) {
      setError('Бас әкімшінің құпия кілтін енгізіңіз.');
      return;
    }
    if (verifySuperAdmin(superToken)) {
      onLoginSuccess({
        role: 'SUPER_ADMIN',
        fullName: 'Бас әкімші',
        token: superToken.trim(),
      });
    } else {
      setError('Құпия кілт қате. Қайта тексеріп көріңіз.');
    }
  };

  const handleEditorSubmit = (e) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (editorMode === 'login') {
      try {
        const account = loginEditor({ username, password });
        onLoginSuccess({
          role: 'EDITOR',
          id: account.id,
          fullName: account.fullName,
          username: account.username,
        });
      } catch (err) {
        setError(err.message);
      }
    } else {
      if (!fullName.trim() || !username.trim() || !password.trim()) {
        setError('Барлық өрістерді толтырыңыз.');
        return;
      }
      try {
        registerEditor({ fullName, username, password });
        setNotice('Өтінішіңіз сәтті қабылданды! Бас әкімші мақұлдағаннан кейін жүйеге кіре аласыз.');
        setEditorMode('login');
        setPassword('');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="brand">
          <span className="brand-mark">К</span>
          <span className="brand-copy"><strong>Күй анасы</strong><small>КОНСТРУКТОРҒА КІРУ</small></span>
        </div>
        <button className="admin-exit" onClick={onExit} style={{ marginLeft: 'auto' }}>
          <ArrowLeft size={16} /> Сайтқа қайту
        </button>
      </header>

      <div className="auth-box">
        <h2 className="auth-box-title">Басқару жүйесі</h2>
        <p>Энциклопедия мазмұнын өңдеу немесе жаңа парақшалар енгізу үшін жүйеге кіріңіз.</p>

        <div className="auth-role-tabs">
          <button className={roleMode === 'super' ? 'active' : ''} onClick={() => { setRoleMode('super'); setError(''); setNotice(''); }}>
            <ShieldCheck size={16} /> Бас әкімші
          </button>
          <button className={roleMode === 'editor' ? 'active' : ''} onClick={() => { setRoleMode('editor'); setError(''); setNotice(''); }}>
            <UserCheck size={16} /> Редактор / Әкімші
          </button>
        </div>

        {error && <div className="editor-alert error-alert" style={{ marginBottom: '14px' }}>{error}</div>}
        {notice && <div className="editor-alert success-alert" style={{ marginBottom: '14px' }}><Check size={16} /> {notice}</div>}

        {roleMode === 'super' ? (
          <form className="auth-form" onSubmit={handleSuperSubmit}>
            <label>
              Бас әкімшінің құпия кілті (Master Secret Key)
              <input
                type="password"
                value={superToken}
                onChange={(e) => setSuperToken(e.target.value)}
                placeholder="Құпия кілтті енгізіңіз..."
                autoFocus
              />
            </label>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--muted)' }}>
              Бас әкімші құпия кілті қауіпсіздік параметрлерінде (Environment variable) сақталады. Барлық өкілеттікке ие.
            </p>
            <button type="submit" className="button button-dark">Кіру</button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleEditorSubmit}>
            {editorMode === 'register' && (
              <label>
                Аты-жөніңіз (ФИО)
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Мысалы: Айдос Смағұлов"
                  required
                />
              </label>
            )}
            <label>
              Логин
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="aidos"
                required
              />
            </label>
            <label>
              Құпиясөз
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </label>

            <button type="submit" className="button button-dark">
              {editorMode === 'login' ? 'Кіру' : 'Тіркелуге өтініш беру'}
            </button>

            <div className="auth-switch-mode">
              {editorMode === 'login' ? (
                <>Аккаунтыңыз жоқ па? <button type="button" onClick={() => { setEditorMode('register'); setError(''); }}>Тіркелу</button></>
              ) : (
                <>Бұрын тіркелгенсіз бе? <button type="button" onClick={() => { setEditorMode('login'); setError(''); }}>Кіру</button></>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function moveBlock(draft, updateDraft, index, direction) {
  const blocks = [...draft.blocks];
  const [block] = blocks.splice(index, 1);
  blocks.splice(index + direction, 0, block);
  updateDraft('blocks', blocks);
}

function createEmptyPage(position) {
  return {
    slug: '',
    title: '',
    description: '',
    position,
    parent_slug: 'people',
    lang: 'kk',
    status: 'pending',
    change_summary: '',
    blocks: [],
  };
}

function createBlock(type) {
  const defaults = {
    heading: { title: 'Жаңа бөлім', body: '' },
    feature: { eyebrow: '', title: 'Ерекше тақырып', body: '' },
    quote: { title: 'Дереккөз', body: 'Дәйексөз мәтіні' },
    image: { title: '', body: 'Суретке түсіндірме', link: '' },
    list: { title: 'Тізім', body: '', items: [{ text: 'Жаңа тармақ' }] },
    stats: { title: 'Сандар', body: '', items: [{ value: '0', label: 'Көрсеткіш' }] },
    cards: { title: 'Карточкалар', body: '', items: [{ title: 'Карточка атауы', meta: 'Санат', description: 'Қысқаша түсіндірме' }] },
    callout: { eyebrow: 'НАЗАР АУДАРЫҢЫЗ', title: 'Екпінді блок', body: '', link: '', linkLabel: 'Толығырақ' },
    qr: { title: 'Сілтемені QR арқылы ашыңыз', body: '', link: '' },
  };
  return { id: crypto.randomUUID(), type, ...(defaults[type] || { title: '', body: '' }) };
}

function ItemsEditor({ block, onItemChange, onItemsChange }) {
  const items = block.items || [];
  const fields = block.type === 'stats'
    ? [['value', 'Мәні'], ['label', 'Атауы']]
    : block.type === 'cards'
      ? [['title', 'Карточка атауы'], ['meta', 'Қысқа белгі'], ['description', 'Түсіндірме']]
      : [['text', 'Тізім тармағы']];
  const emptyItem = Object.fromEntries(fields.map(([key]) => [key, '']));
  return (
    <div className="items-editor">
      <div className="items-editor-heading"><strong>{block.type === 'stats' ? 'Көрсеткіштер' : block.type === 'cards' ? 'Карточкалар' : 'Тізім тармақтары'}</strong><span>{items.length}</span></div>
      {items.map((item, index) => (
        <div className="item-edit-row" key={`${block.id}-${index}`}>
          <div className="item-edit-fields">{fields.map(([key, label]) => <label key={key}>{label}{key === 'description' || block.type === 'list' ? <textarea rows={2} value={item[key] || ''} onChange={(event) => onItemChange(index, key, event.target.value)} /> : <input value={item[key] || ''} onChange={(event) => onItemChange(index, key, event.target.value)} />}</label>)}</div>
          <button type="button" className="item-remove" onClick={() => onItemsChange(items.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Өшіру: ${index + 1}`}><Trash2 size={15} /></button>
        </div>
      ))}
      <button type="button" className="item-add-button" onClick={() => onItemsChange([...items, emptyItem])}><Plus size={15} /> Тағы қосу</button>
    </div>
  );
}

function toSlug(value) {
  const transliteration = {
    а: 'a', ә: 'a', б: 'b', в: 'v', г: 'g', ғ: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh', з: 'z', и: 'i', й: 'y',
    к: 'k', қ: 'q', л: 'l', м: 'm', н: 'n', ң: 'ng', о: 'o', ө: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u',
    ұ: 'u', ү: 'u', ф: 'f', х: 'kh', һ: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ъ: '', ы: 'y', і: 'i',
    ь: '', э: 'e', ю: 'yu', я: 'ya',
  };
  return value
    .toLocaleLowerCase()
    .replace(/[а-яёәғқңөұүһі]/g, (char) => transliteration[char] || char)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default App;
