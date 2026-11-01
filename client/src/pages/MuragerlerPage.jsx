import React, { useState } from 'react';
import {
  PiSparkleDuotone,
  PiStudentDuotone,
  PiMusicNotesPlusDuotone,
  PiChalkboardTeacherDuotone,
  PiCompassDuotone,
  PiCalendarCheckDuotone,
  PiClockDuotone,
  PiMapPinDuotone,
  PiCheckCircleDuotone,
  PiQuestionDuotone,
  PiPaperPlaneRightDuotone,
  PiArrowRightDuotone,
  PiUsersThreeDuotone,
  PiCertificateDuotone,
  PiBookOpenTextDuotone,
} from 'react-icons/pi';
import { RiArrowRightLine, RiCheckLine, RiCloseLine } from 'react-icons/ri';

const CONTENT = {
  kk: {
    kicker: 'ЖАСТАР БАСТАМАСЫ · МӘДЕНИ САБАҚТАСТЫҚ',
    title: '«Мұрагерлер» жастар үйірмесі',
    slogan: '«Мұраны сақта, жаңғырт, дамыт!»',
    lead: '«Күй анасы» жеке қоры жанындағы өскелең ұрпақты ұлттық музыка өнеріне баулу, дәстүрлі аспаптарды тегін үйрету және жас дарындарды халықаралық сахналарға шығару бастамасы.',
    joinBtn: 'Үйірмеге жазылу',
    programsBtn: 'Бағдарламалар',
    scheduleBtn: 'Сабақ кестесі',
    stats: [
      { num: '150+', label: 'Белсенді жас өнерпаз', sub: 'Астана қаласы оқушылары мен студенттері' },
      { num: '4', label: 'Негізгі өнер бағыты', sub: 'Домбыра, жыр-терме, аспаптану, өлкетану' },
      { num: '24', label: 'Жылдық шеберлік сағаты', sub: 'Белгілі күйші-ғалымдар мен шеберлерден' },
      { num: '100%', label: 'Тегін оқу', sub: '«Күй анасы» қоры мен демеушілер есебінен' },
    ],
    directionsTitle: 'Үйірменің негізгі 4 шығармашылық бағыты',
    directionsKicker: 'ОҚЫТУ БАҒДАРЛАМАСЫ',
    directions: [
      {
        id: 'dombra',
        icon: <PiMusicNotesPlusDuotone size={28} />,
        badge: 'Негізгі курс',
        title: 'Домбыра шеберлігі сыныбы',
        desc: 'Батыстың төкпе және Арқаның шертпе күй мектептерін тереңдетіп оқыту. Дина, Құрманғазы, Тәттімбет, Қазанғап, Сүгір күйлерін түпнұсқа қағыстарымен үйрену.',
        skills: ['Төкпе және шертпе қағыс техниктері', 'Күйлердің шығу тарихы мен аңыздары', 'Ансамбльдік үйлесім мен сахналық мәдениет'],
        duration: 'Аптасына 2 рет · 90 минут',
      },
      {
        id: 'terme',
        icon: <PiStudentDuotone size={28} />,
        badge: 'Вокалдық дәстүр',
        title: 'Жыр-терме және дәстүрлі ән',
        desc: 'Қазақтың эпикалық жырлары, бабалар нақылы мен терме мақамдарын меңгеру. Дауысты ұлттық мақамда қою және домбырамен сүйемелдеу шеберлігі.',
        skills: ['Сыр, Жетісу, Батыс мақамдары', 'Шешендік сөздер мен батырлар жыры', 'Дыбыс аппаратын табиғи шыңдау'],
        duration: 'Аптасына 2 рет · 90 минут',
      },
      {
        id: 'craft',
        icon: <PiChalkboardTeacherDuotone size={28} />,
        badge: 'Шеберхана',
        title: 'Ұлттық аспаптану және күтім',
        desc: 'Домбыра, қобыз, сазсырнай аспаптарының физикалық құрылысы, ағаш түрлері (үйеңкі, қарағай, емен), перне тағу және аспапты баптау шеберлігі.',
        skills: ['Перне байлау мен құлақ баптау', 'Ағаш өңдеу мен акустика сырлары', 'Реставрация және күтім негіздері'],
        duration: 'Айына 2 шеберлік сыныбы',
      },
      {
        id: 'ethno',
        icon: <PiCompassDuotone size={28} />,
        badge: 'Ғылыми экспедиция',
        title: '«Жас өлкетанушы» клубы',
        desc: 'Күйшілер аллеясында ашық аспан астындағы лекциялар, тарихи орындарға экспедициялар, көне аудиожазбаларды цифрландыруға қатысу.',
        skills: ['Далалық фольклор жинау әдістері', 'Мұрағаттық құжаттармен жұмыс', 'Мәдени-зерттеу жобаларын қорғау'],
        duration: 'Сенбі күндері · Лекторий & Экскурсия',
      },
    ],
    mentorsTitle: 'Үйірме жетекшілері мен ұстаздары',
    mentorsKicker: 'ТӘЖІРИБЕЛІ ҰСТАЗДАР',
    mentors: [
      {
        name: 'Нұрлан Бақытұлы',
        role: 'Бас тәлімгер · Күйші-орындаушы',
        desc: 'Қазақ ұлттық өнер университетінің түлегі, халықаралық күй байқауларының бас жүлдегері. Төкпе күй дәстүрінің шебері.',
        img: '/images/dina-monument.jpg',
      },
      {
        name: 'Айгүл Серікқызы',
        role: 'Дәстүрлі ән және жыр сыныбының жетекшісі',
        desc: 'Қазақстанның еңбек сіңірген мәдениет қайраткері, Сыр бойы мен Арқа ән мектептерін 15 жылдан астам насихаттап келе жатқан ұстаз.',
        img: '/images/steppe-archive-1910.jpg',
      },
      {
        name: 'Дәулет Кеңесұлы',
        role: 'Ұлттық аспап жасау шебері · Этнограф',
        desc: 'Қолөнершілер одағының мүшесі, 200-ден астам концерттік домбыра мен нарқобыз жасаған тәжірибелі шебер.',
        img: '/images/dombra-player-illustration.png',
      },
    ],
    scheduleTitle: '2026 жылғы оқу кестесі мен өтетін орны',
    scheduleKicker: 'АПТАЛЫҚ КЕСТЕ',
    scheduleVenue: 'Өтетін орны: Астана қаласы, Сарыарқа ауданы, Күйші Дина көшесі, «Күй анасы» шығармашылық студиясы (Күйшілер аллеясы маңы).',
    schedule: [
      { day: 'Сейсенбі & Бейсенбі', time: '15:00 – 16:30', group: 'Бастауыш топ (10–14 жас)', subject: 'Домбыра негіздері, нота сауаты, қарапайым қағыстар' },
      { day: 'Сейсенбі & Бейсенбі', time: '16:45 – 18:15', group: 'Жоғары топ (15–22 жас)', subject: 'Күрделі төкпе-шертпе күйлер, шеберлік сыныбы' },
      { day: 'Сәрсенбі & Жұма', time: '16:00 – 17:30', group: 'Жыр-терме тобы (12–25 жас)', subject: 'Эпостық мақамдар, дәстүрлі ән, дауыс қою' },
      { day: 'Сенбі', time: '11:00 – 14:00', group: 'Жалпы құрам & Шеберхана', subject: 'Аспаптану, Күйшілер аллеясындағы ашық ансамбль және лекторий' },
    ],
    formTitle: 'Үйірмеге онлайн жазылу өтінімі',
    formKicker: 'ҚАТЫСУ ТЕГІН · ОРЫН САНЫ ШЕКТЕУЛІ',
    formDesc: 'Төмендегі қысқа сауалнаманы толтырыңыз. Қор координаторы өтінішіңізді қарап, 1 жұмыс күні ішінде WhatsApp немесе телефон арқылы байланысады.',
    nameLabel: 'Қатысушының толық аты-жөні:',
    namePlaceholder: 'Мысалы: Арман Серікұлы',
    ageLabel: 'Жасы (немесе сыныбы / курсы):',
    agePlaceholder: 'Мысалы: 14 жас, 8-сынып',
    phoneLabel: 'Байланыс телефоны / WhatsApp:',
    phonePlaceholder: '+7 (700) 000-00-00',
    dirLabel: 'Таңдаған бағытыңыз:',
    experienceLabel: 'Музыкалық дайындық деңгейі:',
    experienceOptions: ['Мүлдем білмеймін (нөлден бастау)', 'Бастапқы деңгей (бірнеше күй білемін)', 'Музыка мектебінің оқушысы/түлегі'],
    noteLabel: 'Қосымша тілек немесе мақсатыңыз:',
    notePlaceholder: 'Қандай күйлерді үйренгіңіз келеді немесе өзіңіз туралы қысқаша...',
    submitBtn: 'Өтінімді жолдау',
    submitting: 'Жіберілуде...',
    successTitle: 'Өтінішіңіз сәтті тіркелді!',
    successDesc: 'Құрметті жас өнерпаз! «Мұрагерлер» үйірмесіне қатысу туралы өтінішіңіз қабылданды. Жақын арада координаторымыз хабарласып, бірінші сабақ уақытын нақтылайды.',
    successBtn: 'Жаңа өтінім толтыру',
    galleryTitle: 'Үйірме өмірінен сәттер мен репетициялар',
    galleryKicker: 'ФОТОШЕЖІРЕ',
    faqTitle: 'Жиі қойылатын сұрақтар',
    faqKicker: 'ПАЙДАЛЫ МӘЛІМЕТ',
    faqs: [
      {
        q: 'Үйірмеге қатысу шынымен тегін бе?',
        a: 'Иә, үйірме «Күй анасы» қорының әлеуметтік-мәдени гранты және демеушілер қолдауымен жұмыс істейді. Қатысушылардан ешқандай жарна алынбайды.',
      },
      {
        q: 'Жеке домбыра немесе аспап болуы міндетті ме?',
        a: 'Студиямызда сабақ кезінде пайдалануға арналған арнайы жаттығу домбыралары бар. Алайда үйде қайталау үшін өз аспабыңыз болғаны абзал.',
      },
      {
        q: 'Қандай жас аралығындағы балалар қабылданады?',
        a: 'Негізгі топтарға 10 жастан 25 жасқа дейінгі оқушылар, колледж және университет студенттері қабылданады.',
      },
      {
        q: 'Байқаулар мен концерттерге қатысу мүмкіндігі бар ма?',
        a: 'Үйірме мүшелері жыл сайын Дина Нұрпейісова атындағы жас күйшілер байқауына, қалалық ресми мерекелерге және Күйшілер аллеясында өтетін ашық концерттерге қатысады.',
      },
    ],
  },
  ru: {
    kicker: 'МОЛОДЕЖНАЯ ИНИЦИАТИВА · КУЛЬТУРНАЯ ПРЕЕМСТВЕННОСТЬ',
    title: 'Молодежный клуб «Мұрагерлер»',
    slogan: '«Сохраняй, возрождай, развивай наследие!»',
    lead: 'Инициатива частного фонда «Күй анасы» по приобщению подрастающего поколения к традиционному музыкальному искусству, бесплатному обучению игре на национальных инструментах и выводу юных талантов на большую сцену.',
    joinBtn: 'Записаться в клуб',
    programsBtn: 'Программы обучения',
    scheduleBtn: 'Расписание занятий',
    stats: [
      { num: '150+', label: 'Активных участников', sub: 'Школьники и студенты города Астаны' },
      { num: '4', label: 'Творческих направления', sub: 'Домбра, жыр-терме, инструментоведение, краеведение' },
      { num: '24', label: 'Мастер-класса в год', sub: 'От признанных кюйши, ученых и мастеров' },
      { num: '100%', label: 'Бесплатное участие', sub: 'За счет фонда «Күй анасы» и меценатов' },
    ],
    directionsTitle: '4 ключевых творческих направления клуба',
    directionsKicker: 'ПРОГРАММА ОБУЧЕНИЯ',
    directions: [
      {
        id: 'dombra',
        icon: <PiMusicNotesPlusDuotone size={28} />,
        badge: 'Базовый курс',
        title: 'Школа мастерства домбры',
        desc: 'Углубленное изучение западной школы төкпе и сарыаркинской шертпе. Изучение произведений Дины, Курмангазы, Таттимбета, Казангапа и Сугира в аутентичной манере.',
        skills: ['Техники төкпе и шертпе штрихов', 'История создания и легенды кюев', 'Ансамблевое мастерство и сценическая культура'],
        duration: '2 раза в неделю · 90 минут',
      },
      {
        id: 'terme',
        icon: <PiStudentDuotone size={28} />,
        badge: 'Вокальная традиция',
        title: 'Жыр-терме и традиционное пение',
        desc: 'Освоение эпических сказаний, дидактических поэм и макамов. Постановка аутентичного степного голоса и мастерство аккомпанемента на домбре.',
        skills: ['Макамы Сыра, Жетысу и Запада', 'Искусство эпического речитатива', 'Природная постановка голоса'],
        duration: '2 раза в неделю · 90 минут',
      },
      {
        id: 'craft',
        icon: <PiChalkboardTeacherDuotone size={28} />,
        badge: 'Мастерская',
        title: 'Инструментоведение и уход',
        desc: 'Анатомия домбры, кобыза и сазсырная, породы древесины (клен, сосна, дуб), секреты натяжения ладов (перне) и ухода за инструментом.',
        skills: ['Вязка перне и настройка колков', 'Акустика древесины и реставрация', 'Основы бережного ухода'],
        duration: '2 мастер-класса в месяц',
      },
      {
        id: 'ethno',
        icon: <PiCompassDuotone size={28} />,
        badge: 'Экспедиции',
        title: 'Клуб «Юный краевед»',
        desc: 'Лекции под открытым небом на Аллее Кюйши, краеведческие походы по памятным местам, участие в оцифровке архивных записей степных мастеров.',
        skills: ['Методы сбора фольклора', 'Работа с архивными записями', 'Защита исследовательских проектов'],
        duration: 'По субботам · Лекторий и выезды',
      },
    ],
    mentorsTitle: 'Наставники и преподаватели клуба',
    mentorsKicker: 'ОПЫТНЫЕ ПЕДАГОГИ',
    mentors: [
      {
        name: 'Нурлан Бакытулы',
        role: 'Главный наставник · Кюйши-исполнитель',
        desc: 'Выпускник Казахского национального университета искусств, лауреат международных конкурсов. Знаток школы төкпе.',
        img: '/images/dina-monument.jpg',
      },
      {
        name: 'Айгуль Сериккызы',
        role: 'Руководитель класса жыр-терме и пения',
        desc: 'Деятель культуры РК, более 15 лет обучающая юных исполнителей традициям песенных школ Арки и Сырдарьи.',
        img: '/images/steppe-archive-1910.jpg',
      },
      {
        name: 'Даулет Кенесулы',
        role: 'Мастер национальных инструментов · Этнограф',
        desc: 'Член Союза ремесленников, создавший более 200 концертных домбр и кобызов ручной работы.',
        img: '/images/dombra-player-illustration.png',
      },
    ],
    scheduleTitle: 'Расписание занятий и локация на 2026 год',
    scheduleKicker: 'НЕДЕЛЬНЫЙ ГРАФИК',
    scheduleVenue: 'Место проведения: г. Астана, Сарыаркинский район, ул. Кюйши Дина, творческая студия фонда «Күй анасы» (у Аллеи Кюйши).',
    schedule: [
      { day: 'Вторник & Четверг', time: '15:00 – 16:30', group: 'Младшая группа (10–14 лет)', subject: 'Основы домбры, нотная грамота, базовые штрихи' },
      { day: 'Вторник & Четверг', time: '16:45 – 18:15', group: 'Старшая группа (15–22 года)', subject: 'Сложные формы кюев төкпе и шертпе, ансамбль' },
      { day: 'Среда & Пятница', time: '16:00 – 17:30', group: 'Класс жыр-терме (12–25 лет)', subject: 'Эпические сказания, народное пение, дикция' },
      { day: 'Суббота', time: '11:00 – 14:00', group: 'Общий состав & Мастерская', subject: 'Инструментоведение, открытые репетиции на Аллее Кюйши' },
    ],
    formTitle: 'Онлайн-заявка на вступление в клуб',
    formKicker: 'УЧАСТИЕ БЕСПЛАТНО · КОЛИЧЕСТВО МЕСТ ОГРАНИЧЕНО',
    formDesc: 'Заполните форму ниже. Координатор свяжется с вами в течение 1 рабочего дня по WhatsApp или телефону для подтверждения группы.',
    nameLabel: 'ФИО участника:',
    namePlaceholder: 'Например: Арман Сериков',
    ageLabel: 'Возраст (или класс / курс):',
    agePlaceholder: 'Например: 14 лет, 8 класс',
    phoneLabel: 'Контактный телефон / WhatsApp:',
    phonePlaceholder: '+7 (700) 000-00-00',
    dirLabel: 'Желаемое направление:',
    experienceLabel: 'Уровень подготовки:',
    experienceOptions: ['С нуля (никогда не играл)', 'Начальный уровень (знаю пару кюев)', 'Ученик или выпускник муз. школы'],
    noteLabel: 'Пожелания или цель:',
    notePlaceholder: 'Какие кюи хотите освоить или немного о себе...',
    submitBtn: 'Отправить заявку',
    submitting: 'Отправка...',
    successTitle: 'Заявка успешно зарегистрирована!',
    successDesc: 'Уважаемый будущий участник! Ваша заявка в клуб «Мұрагерлер» принята. Наш координатор свяжется с вами в ближайшее время.',
    successBtn: 'Подать еще одну заявку',
    galleryTitle: 'Моменты репетиций и выступлений клуба',
    galleryKicker: 'ФОТОХРОНИКА',
    faqTitle: 'Часто задаваемые вопросы',
    faqKicker: 'ПОЛЕЗНАЯ ИНФОРМАЦИЯ',
    faqs: [
      {
        q: 'Участие действительно бесплатное?',
        a: 'Да, работа клуба полностью финансируется фондом «Күй анасы» и благотворителями. Никаких членских взносов нет.',
      },
      {
        q: 'Нужен ли собственный инструмент?',
        a: 'В студии имеются учебные домбры для занятий на месте. Однако для домашних репетиций рекомендуется иметь свой инструмент.',
      },
      {
        q: 'Какой возраст принимается?',
        a: 'Набор ведется для молодежи от 10 до 25 лет (школьники средних и старших классов, студенты колледжей и вузов).',
      },
      {
        q: 'Выступают ли участники на концертах?',
        a: 'Да, воспитанники клуба ежегодно участвуют в городском конкурсе кюйши имени Дины Нурпеисовой и выступают на открытой сцене Аллеи Кюйши.',
      },
    ],
  },
  en: {
    kicker: 'YOUTH INITIATIVE · CULTURAL CONTINUITY',
    title: '"Muragerler" Youth Club',
    slogan: '"Preserve, Revive, Develop the Heritage!"',
    lead: 'A flagship cultural initiative under the "Kui Anasy" Foundation to immerse the younger generation in traditional Kazakh music, offer free masterclasses, and provide a launchpad for young talents.',
    joinBtn: 'Join the Club',
    programsBtn: 'Programs',
    scheduleBtn: 'Timetable',
    stats: [
      { num: '150+', label: 'Active Young Musicians', sub: 'School and university students of Astana' },
      { num: '4', label: 'Artistic Directions', sub: 'Dombra, Zhyr-terme, Instrument craft, Field expeditions' },
      { num: '24', label: 'Masterclasses Yearly', sub: 'From acclaimed masters and conservatory faculty' },
      { num: '100%', label: 'Tuition-Free', sub: 'Fully funded by Kui Anasy Foundation' },
    ],
    directionsTitle: '4 Core Educational & Artistic Tracks',
    directionsKicker: 'CURRICULUM TRACKS',
    directions: [
      {
        id: 'dombra',
        icon: <PiMusicNotesPlusDuotone size={28} />,
        badge: 'Core Program',
        title: 'Dombra Mastery Class',
        desc: 'Deep study of the western Tokpe and central Shertpe traditions. Repertoire includes legendary works of Dina, Kurmangazy, Tattimbet, and Qazangap.',
        skills: ['Tokpe and Shertpe stroke techniques', 'Legends and storytelling behind each kui', 'Ensemble synchronization and stage etiquette'],
        duration: 'Twice a week · 90 min',
      },
      {
        id: 'terme',
        icon: <PiStudentDuotone size={28} />,
        badge: 'Vocal Tradition',
        title: 'Zhyr-Terme & Traditional Singing',
        desc: 'Mastering Kazakh epic narratives, didactic verses, and regional makams with self-accompaniment on the dombra.',
        skills: ['Syr, Jetysu, and Western makams', 'Heroic epic declamation', 'Natural vocal placement'],
        duration: 'Twice a week · 90 min',
      },
      {
        id: 'craft',
        icon: <PiChalkboardTeacherDuotone size={28} />,
        badge: 'Craft Studio',
        title: 'National Instrument Anatomy & Care',
        desc: 'Understanding the acoustic physics of dombra, kobyz, and sazsyrnay, tonewood selection, fret tying, and maintenance.',
        skills: ['Fret tying and peg tuning', 'Tonewood acoustics and restoration', 'Instrument maintenance'],
        duration: 'Twice a month',
      },
      {
        id: 'ethno',
        icon: <PiCompassDuotone size={28} />,
        badge: 'Field Research',
        title: '"Young Steppe Explorer" Club',
        desc: 'Open-air lectures on Kuyshiler Alley, cultural heritage expeditions, and hands-on participation in digitizing archive recordings.',
        skills: ['Field folklore collection methods', 'Archival research skills', 'Cultural project presentation'],
        duration: 'Saturdays · Lectures & Tours',
      },
    ],
    mentorsTitle: 'Mentors & Faculty',
    mentorsKicker: 'EXPERIENCED MASTERS',
    mentors: [
      {
        name: 'Nurlan Bakytuly',
        role: 'Head Mentor · Kui Performer',
        desc: 'Kazakh National University of Arts alumnus, international laureate specializing in Western Tokpe style.',
        img: '/images/dina-monument.jpg',
      },
      {
        name: 'Aigul Serikkyzy',
        role: 'Head of Zhyr-Terme & Vocal Class',
        desc: 'Honored Cultural Worker of Kazakhstan with 15+ years educating youth in Arka and Syr singing lineages.',
        img: '/images/steppe-archive-1910.jpg',
      },
      {
        name: 'Daulet Kenesuly',
        role: 'Master Craftsman & Ethnographer',
        desc: 'Artisans Guild member who has hand-crafted over 200 concert-grade dombras and kobyzes.',
        img: '/images/dombra-player-illustration.png',
      },
    ],
    scheduleTitle: '2026 Schedule & Studio Location',
    scheduleKicker: 'WEEKLY TIMETABLE',
    scheduleVenue: 'Location: Astana, Saryarka district, Kuyshi Dina street, "Kui Anasy" Creative Studio (next to Kuyshiler Alley).',
    schedule: [
      { day: 'Tuesday & Thursday', time: '15:00 – 16:30', group: 'Junior Group (10–14 yrs)', subject: 'Dombra fundamentals, notation, rhythm drills' },
      { day: 'Tuesday & Thursday', time: '16:45 – 18:15', group: 'Advanced Group (15–22 yrs)', subject: 'Advanced Tokpe & Shertpe kuis, ensemble practice' },
      { day: 'Wednesday & Friday', time: '16:00 – 17:30', group: 'Zhyr-Terme Group (12–25 yrs)', subject: 'Epic makams, traditional singing, diction' },
      { day: 'Saturday', time: '11:00 – 14:00', group: 'All Members & Workshop', subject: 'Instrument care, open rehearsals on the Alley' },
    ],
    formTitle: 'Online Registration Form',
    formKicker: 'FREE PARTICIPATION · LIMITED SLOTS',
    formDesc: 'Submit the short application below. Our coordinator will contact you via WhatsApp or phone within 1 business day.',
    nameLabel: 'Applicant Full Name:',
    namePlaceholder: 'e.g. Arman Serikov',
    ageLabel: 'Age (or school grade / university year):',
    agePlaceholder: 'e.g. 14 years old, 8th grade',
    phoneLabel: 'Contact Phone / WhatsApp:',
    phonePlaceholder: '+7 (700) 000-00-00',
    dirLabel: 'Preferred Direction:',
    experienceLabel: 'Current Experience Level:',
    experienceOptions: ['Beginner (Zero prior experience)', 'Intermediate (Know basic kuis)', 'Music school student/graduate'],
    noteLabel: 'Notes or goals:',
    notePlaceholder: 'Which kuis would you like to master, or a few words about yourself...',
    submitBtn: 'Submit Application',
    submitting: 'Submitting...',
    successTitle: 'Application Submitted Successfully!',
    successDesc: 'Thank you! Your application for the "Muragerler" Youth Club has been received. Our coordinator will contact you shortly.',
    successBtn: 'Submit Another Application',
    galleryTitle: 'Moments of Rehearsals & Community Life',
    galleryKicker: 'PHOTO ARCHIVE',
    faqTitle: 'Frequently Asked Questions',
    faqKicker: 'HELPFUL INFORMATION',
    faqs: [
      {
        q: 'Is membership truly tuition-free?',
        a: 'Yes, the club is fully funded by the Kui Anasy Foundation and philanthropic partners. No membership fee is ever charged.',
      },
      {
        q: 'Do I need to bring my own dombra?',
        a: 'Studio instruments are available for class sessions. Having a personal dombra at home is recommended for practice.',
      },
      {
        q: 'What is the accepted age group?',
        a: 'Youth ages 10 to 25 (middle & high school pupils, college, and university students) are eligible.',
      },
      {
        q: 'Are there public performances and contests?',
        a: 'Yes, members take part in the annual Dina Nurpeissova youth contest and perform on the open-air stage at Kuyshiler Alley.',
      },
    ],
  },
};

export default function MuragerlerPage({ onNavigate, lang = 'kk', t, navLabels = {} }) {
  const c = CONTENT[lang] || CONTENT.kk;

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    direction: c.directions[0].title,
    experience: c.experienceOptions[0],
    note: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [selectedDirection, setSelectedDirection] = useState('dombra');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert(lang === 'kk' ? 'Аты-жөніңіз бен телефон нөміріңізді жазыңыз' : 'Пожалуйста, заполните имя и телефон');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      try {
        const existing = JSON.parse(localStorage.getItem('kui-muragerler-apps') || '[]');
        existing.unshift({
          ...formData,
          id: `MUR-${Date.now()}`,
          date: new Date().toISOString(),
        });
        localStorage.setItem('kui-muragerler-apps', JSON.stringify(existing));
      } catch (err) {
        console.error(err);
      }
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="dedicated-subpage muragerler-subpage">
      {/* 1. Page Banner */}
      <section className="page-banner page-banner-projects">
        <div className="page-banner-image">
          <img src="/images/kuyshiler-alley.jpg" alt="«Мұрагерлер» жастар үйірмесі" />
        </div>
        <div className="content-width page-banner-inner">
          <span className="block-kicker banner-parent-kicker">
            {navLabels['projects'] || 'Жобалар'}
          </span>
          <h1>{c.title}</h1>
          <p>{c.lead}</p>

          <div className="breadcrumb">
            <button onClick={() => onNavigate('home')}>{t.backHome || 'Басты бет'}</button>
            <span>/</span>
            <button onClick={() => onNavigate('projects')}>{navLabels['projects'] || 'Жобалар'}</button>
            <span>/</span>
            <span>{c.title}</span>
          </div>

          <div className="subpage-hero-actions">
            <button className="subpage-action-btn primary" onClick={() => scrollToSection('register-form')}>
              <PiSparkleDuotone size={17} />
              <span>{c.joinBtn}</span>
            </button>
            <button className="subpage-action-btn outline" onClick={() => scrollToSection('directions-section')}>
              <PiBookOpenTextDuotone size={17} />
              <span>{c.programsBtn}</span>
            </button>
            <button className="subpage-action-btn outline" onClick={() => scrollToSection('schedule-section')}>
              <PiCalendarCheckDuotone size={17} />
              <span>{c.scheduleBtn}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Impact Numbers / Stats Grid */}
      <section className="subpage-stats-section content-width">
        <div className="subpage-stats-grid">
          {c.stats.map((s, idx) => (
            <div key={idx} className="subpage-stat-card">
              <span className="stat-index">0{idx + 1}</span>
              <strong className="stat-value">{s.num}</strong>
              <h4 className="stat-label">{s.label}</h4>
              <p className="stat-sub">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Core Directions / Programs */}
      <section id="directions-section" className="subpage-section content-width">
        <div className="subpage-section-header">
          <span className="block-kicker">{c.directionsKicker}</span>
          <h2>{c.directionsTitle}</h2>
        </div>

        <div className="directions-grid">
          {c.directions.map((dir) => (
            <div
              key={dir.id}
              className={`direction-card ${selectedDirection === dir.id ? 'active' : ''}`}
              onClick={() => setSelectedDirection(dir.id)}
            >
              <div className="direction-card-top">
                <div className="direction-icon">{dir.icon}</div>
                <span className="direction-badge">{dir.badge}</span>
              </div>
              <h3>{dir.title}</h3>
              <p className="direction-desc">{dir.desc}</p>
              <div className="direction-skills">
                <ul>
                  {dir.skills.map((skill, sIdx) => (
                    <li key={sIdx}>
                      <RiCheckLine className="skill-check-icon" />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="direction-duration">
                <PiClockDuotone size={16} />
                <span>{dir.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Mentors & Masters */}
      <section className="subpage-section content-width">
        <div className="subpage-section-header">
          <span className="block-kicker">{c.mentorsKicker}</span>
          <h2>{c.mentorsTitle}</h2>
        </div>

        <div className="mentors-grid">
          {c.mentors.map((m, idx) => (
            <div key={idx} className="mentor-card">
              <div className="mentor-avatar">
                <img src={m.img} alt={m.name} />
              </div>
              <div className="mentor-info">
                <h3>{m.name}</h3>
                <span className="mentor-role">{m.role}</span>
                <p>{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Schedule & Studio Location */}
      <section id="schedule-section" className="subpage-section content-width">
        <div className="subpage-section-header">
          <span className="block-kicker">{c.scheduleKicker}</span>
          <h2>{c.scheduleTitle}</h2>
          <p className="subpage-venue-note">
            <PiMapPinDuotone size={18} className="venue-pin-icon" />
            <span>{c.scheduleVenue}</span>
          </p>
        </div>

        <div className="schedule-table-wrap">
          <div className="schedule-cards-grid">
            {c.schedule.map((slot, idx) => (
              <div key={idx} className="schedule-slot-card">
                <div className="slot-header">
                  <span className="slot-day">{slot.day}</span>
                  <span className="slot-time"><PiClockDuotone size={15} /> {slot.time}</span>
                </div>
                <h4 className="slot-group">{slot.group}</h4>
                <p className="slot-subject">{slot.subject}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Interactive Registration Form */}
      <section id="register-form" className="subpage-section register-section content-width">
        <div className="register-card">
          <div className="register-header">
            <span className="muragerler-slogan-pill">
              <PiSparkleDuotone size={16} className="muragerler-slogan-icon" />
              <span>{c.slogan}</span>
            </span>
            <span className="block-kicker">{c.formKicker}</span>
            <h2>{c.formTitle}</h2>
            <p>{c.formDesc}</p>
          </div>

          {isSubmitted ? (
            <div className="register-success-box">
              <div className="success-icon-orb">
                <PiCheckCircleDuotone size={48} />
              </div>
              <h3>{c.successTitle}</h3>
              <p>{c.successDesc}</p>
              <button
                className="subpage-action-btn primary"
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    name: '',
                    age: '',
                    phone: '',
                    direction: c.directions[0].title,
                    experience: c.experienceOptions[0],
                    note: '',
                  });
                }}
              >
                <span>{c.successBtn}</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="register-form-grid">
              <div className="form-group">
                <label>{c.nameLabel}</label>
                <input
                  type="text"
                  required
                  placeholder={c.namePlaceholder}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>{c.ageLabel}</label>
                <input
                  type="text"
                  required
                  placeholder={c.agePlaceholder}
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>{c.phoneLabel}</label>
                <input
                  type="tel"
                  required
                  placeholder={c.phonePlaceholder}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>{c.dirLabel}</label>
                <select
                  value={formData.direction}
                  onChange={(e) => setFormData({ ...formData, direction: e.target.value })}
                >
                  {c.directions.map((d) => (
                    <option key={d.id} value={d.title}>
                      {d.title} ({d.badge})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group full-width">
                <label>{c.experienceLabel}</label>
                <div className="radio-pills">
                  {c.experienceOptions.map((opt, oIdx) => (
                    <label
                      key={oIdx}
                      className={`radio-pill ${formData.experience === opt ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="experience"
                        value={opt}
                        checked={formData.experience === opt}
                        onChange={() => setFormData({ ...formData, experience: opt })}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group full-width">
                <label>{c.noteLabel}</label>
                <textarea
                  rows={3}
                  placeholder={c.notePlaceholder}
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                />
              </div>

              <div className="form-actions full-width">
                <button type="submit" disabled={isSubmitting} className="register-submit-btn">
                  <PiPaperPlaneRightDuotone size={18} />
                  <span>{isSubmitting ? c.submitting : c.submitBtn}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* 7. Gallery / Moments */}
      <section className="subpage-section content-width">
        <div className="subpage-section-header">
          <span className="block-kicker">{c.galleryKicker}</span>
          <h2>{c.galleryTitle}</h2>
        </div>

        <div className="subpage-gallery-grid">
          <div className="gallery-card tall">
            <img src="/images/alley-gazebo.jpg" alt="Күйшілер аллеясындағы шеберлік сабағы" />
            <div className="gallery-caption">
              <span>Күйшілер аллеясындағы ашық аспан астындағы концерт</span>
            </div>
          </div>
          <div className="gallery-card">
            <img src="/images/alley-arch-main.jpg" alt="Аллеяның салтанатты бас қақпасы" />
            <div className="gallery-caption">
              <span>Астана қаласындағы Күйшілер аллеясының бас қақпасы</span>
            </div>
          </div>
          <div className="gallery-card">
            <img src="/images/stele-kuyshi-side-a.jpg" alt="101 Күйші стеласы" />
            <div className="gallery-caption">
              <span>«Жас өлкетанушы» клубының тарихи стелаларды зерттеуі</span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ Accordion */}
      <section className="subpage-section content-width">
        <div className="subpage-section-header">
          <span className="block-kicker">{c.faqKicker}</span>
          <h2>{c.faqTitle}</h2>
        </div>

        <div className="faq-list">
          {c.faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className={`faq-item ${isOpen ? 'open' : ''}`}
                onClick={() => setActiveFaq(isOpen ? null : idx)}
              >
                <div className="faq-question">
                  <PiQuestionDuotone size={20} className="faq-icon" />
                  <h4>{faq.q}</h4>
                  <span className="faq-toggle-btn">{isOpen ? '−' : '+'}</span>
                </div>
                {isOpen && (
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. Bottom Navigation Back */}
      <div className="subpage-bottom-nav content-width">
        <button className="button button-outline" onClick={() => onNavigate('projects')}>
          <span>← {navLabels['projects'] || 'Жобалар бөліміне оралу'}</span>
        </button>
        <button className="button button-dark" onClick={() => onNavigate('projects-alley')}>
          <span>{navLabels['projects-alley'] || 'Күйшілер аллеясын қарау'} →</span>
        </button>
      </div>
    </div>
  );
}
