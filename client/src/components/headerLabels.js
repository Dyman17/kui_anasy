// UI strings for the site header, search dialog and mobile menu (kk / ru / en).

export const LANG_OPTIONS = [
  { code: 'kk', label: 'KZ', name: 'Қазақша' },
  { code: 'ru', label: 'RU', name: 'Русский' },
  { code: 'en', label: 'EN', name: 'English' },
];

export const HEADER_LABELS = {
  kk: {
    brand: 'Күй анасы',
    tagline: 'Қазақ дәстүрлі музыкасының цифрлық мұра порталы',
    home: 'Басты бет',
    mainNav: 'Басты навигация',
    search: 'Іздеу',
    searchDialog: 'Сайт бойынша іздеу',
    searchInput: 'Іздеу сұранысы',
    searchClose: 'Іздеуді жабу (Esc)',
    searchRetry: 'Басқа атаумен немесе күйші есімімен қайталап көріңіз.',
    searchResults: 'Табылған нәтижелер',
    hintsLabel: 'Жиі ізделетін бөлімдер',
    hints: ['Күйшілер', 'Күйшілер аллеясы', 'I том · Күй әлемі', 'Ғылыми кеңес'],
    page: 'Парақша',
    language: 'Тіл таңдау',
    openMenu: 'Мәзірді ашу',
    closeMenu: 'Мәзірді жабу (Esc)',
    menu: 'Негізгі мәзір',
    qrRow: 'Осы беттің QR-коды',
  },
  ru: {
    brand: 'Күй анасы',
    tagline: 'Цифровой портал наследия казахской традиционной музыки',
    home: 'Главная',
    mainNav: 'Основная навигация',
    search: 'Поиск',
    searchDialog: 'Поиск по сайту',
    searchInput: 'Поисковый запрос',
    searchClose: 'Закрыть поиск (Esc)',
    searchRetry: 'Попробуйте другое название или имя кюйши.',
    searchResults: 'Найденные страницы',
    hintsLabel: 'Часто ищут',
    hints: ['Кюйши', 'Аллея кюйши', 'Том I · Күй әлемі', 'Научный совет'],
    page: 'Страница',
    language: 'Выбор языка',
    openMenu: 'Открыть меню',
    closeMenu: 'Закрыть меню (Esc)',
    menu: 'Главное меню',
    qrRow: 'QR-код этой страницы',
  },
  en: {
    brand: 'Күй анасы',
    tagline: 'Digital heritage portal of Kazakh traditional music',
    home: 'Home',
    mainNav: 'Main navigation',
    search: 'Search',
    searchDialog: 'Search the site',
    searchInput: 'Search query',
    searchClose: 'Close search (Esc)',
    searchRetry: 'Try another title or a kuishi name.',
    searchResults: 'Pages found',
    hintsLabel: 'Frequently searched',
    hints: ['Kuishi', 'Kuyshiler Alley', 'Volume I · Күй әлемі', 'Academic council'],
    page: 'Page',
    language: 'Choose language',
    openMenu: 'Open menu',
    closeMenu: 'Close menu (Esc)',
    menu: 'Main menu',
    qrRow: 'QR code for this page',
  },
};

export const HINT_SLUGS = ['people-kuyshi', 'projects-alley', 'library-vol-1', 'about-leadership'];

// Shorter labels where the full section name does not fit the header row.
export const SHORT_NAV_LABELS = {
  kk: { library: 'Кітапхана' },
  ru: { library: 'Библиотека' },
  en: { library: 'Library' },
};

export const ACCOUNT_LABELS = {
  kk: { login: 'Кіру', profile: 'Кабинет', logout: 'Шығу', admin: 'Басқару панелі', superAdmin: 'Бас әкімші', editor: 'Редактор' },
  ru: { login: 'Войти', profile: 'Кабинет', logout: 'Выйти', admin: 'Панель управления', superAdmin: 'Главный администратор', editor: 'Редактор' },
  en: { login: 'Sign in', profile: 'Account', logout: 'Sign out', admin: 'Admin panel', superAdmin: 'Super admin', editor: 'Editor' },
};
