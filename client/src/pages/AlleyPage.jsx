import React, { useState } from 'react';
import {
  PiSparkleDuotone,
  PiMapPinDuotone,
  PiCompassDuotone,
  PiQrCodeDuotone,
  PiMusicNotesDuotone,
  PiBookOpenDuotone,
  PiBuildingsDuotone,
  PiClockDuotone,
  PiBusDuotone,
} from 'react-icons/pi';
import { RiArrowRightLine, RiCheckLine } from 'react-icons/ri';

const CONTENT = {
  kk: {
    kicker: 'СӘУЛЕТТІК МЕМОРИАЛДЫҚ КЕШЕН · АСТАНА',
    title: 'Күйшілер аллеясы',
    lead: 'Елорда төріндегі қазақтың күйшілік өнеріне арналған бірегей сәулеттік мәдени кеңістік. Мұнда ғасырлар бойы ұлт рухын асқақтатқан 101 ұлы күйшінің есімі мәңгілікке қашалып жазылған.',
    zonesTitle: 'Аллеяның басты сәулеттік аймақтары',
    zonesKicker: 'КЕШЕН ҚҰРЫЛЫМЫ',
    zones: [
      {
        title: 'Салтанатты бас қақпа (Арка)',
        desc: 'Күйші Дина көшесі жағынан аллеяға кіреберісте бой көтерген биік қақпа. Ұлттық қошқармүйіз бен сынық мүйіз өрнектерімен көмкерілген заманауи сәулет туындысы.',
        img: '/images/alley-arch-main.jpg',
      },
      {
        title: '101 Күйші стелалары',
        desc: 'Қазақтың төкпе және шертпе дәстүрлерін насихаттаған 101 дәулескер күйшінің өмірбаяны мен басты туындылары қашалған мәрмәр-гранит стелалар кешені.',
        img: '/images/stele-kuyshi-side-a.jpg',
      },
      {
        title: 'Дина Нұрпейісованың монументі',
        desc: 'Аллеяның орталық алаңында орнатылған қола монумент. Күй анасының қолына домбыра ұстаған шабытты бейнесі сомдалған рухани орталық.',
        img: '/images/dina-monument.jpg',
      },
      {
        title: 'Амфитеатр және демалыс аймағы',
        desc: 'Жазғы маусымда ашық аспан астында концерттер, шеберлік сыныптары мен поэзия кештері өтетін күмбезді беседкалар мен демалыс орындары.',
        img: '/images/alley-gazebo.jpg',
      },
    ],
    stelesTitle: 'Стелалардағы күйшілер каноны (өңірлер бойынша)',
    stelesKicker: 'ИНТЕРАКТИВТІ КАТАЛОГ',
    stelesSchools: [
      { id: 'west', name: 'Батыс Қазақстан (Төкпе мектебі)' },
      { id: 'arka', name: 'Арқа және Шығыс (Шертпе мектебі)' },
      { id: 'south', name: 'Қаратау және Сыр бойы' },
      { id: 'jetysu', name: 'Жетісу және Алтай дәстүрі' },
    ],
    kuyshisBySchool: {
      west: [
        { name: 'Құрманғазы Сағырбайұлы', dates: '1818–1896', kuis: '«Сарыарқа», «Адай», «Серпер», «Кісен ашқан»' },
        { name: 'Дина Нұрпейісова', dates: '1861–1955', kuis: '«Бұлбұл», «16 жыл», «Әсемқоңыр», «Тойбастар»' },
        { name: 'Дәулеткерей Шығайұлы', dates: '1820–1887', kuis: '«Жігер», «Қоңыр», «Көркем ханым», «Бұлбұл»' },
        { name: 'Сейтек Оразалыұлы', dates: '1861–1933', kuis: '«Заман-ай», «Тойбастар», «Арман»' },
        { name: 'Мәмен Ерғалиұлы', dates: '1868–1931', kuis: '«Он алтыншы жыл», «Қайғылы қара»' },
        { name: 'Қали Жантілеуов', dates: '1902–1970', kuis: '«Құрманғазы күйлерінің түпнұсқа антологиясы»' },
      ],
      arka: [
        { name: 'Тәттімбет Қазанғапұлы', dates: '1815–1862', kuis: '«Саржайлау», «Сылқылдақ», «Былқылдақ», «Көкейкесті»' },
        { name: 'Тоқа Шоңманұлы', dates: '1830–1904', kuis: '«Тоқаның Саржайлауы», «Бозторы»' },
        { name: 'Қыздарбек Төлеубайұлы', dates: '1850–1922', kuis: '«Қосбасар», «Қыздарбек шертпесі»' },
        { name: 'Әбікен Хасенов', dates: '1892–1958', kuis: '«Қоңыр», «Тәттімбет дәстүрі»' },
        { name: 'Мағауия Хамзин', dates: '1927–2000', kuis: '«Қосбасар», «Жайлау», «Шахта күйі»' },
      ],
      south: [
        { name: 'Қазанғап Тілепбергенұлы', dates: '1854–1921', kuis: '«Ақжелең», «Көкіл», «Ноғайлы босқыны»' },
        { name: 'Сүгір Әлиұлы', dates: '1882–1961', kuis: '«Аққу», «Бозінген», «Шалқыма», «Майда қоңыр»' },
        { name: 'Ықылас Дүкенұлы', dates: '1843–1916', kuis: '«Жезкиік», «Қазан», «Қасқыр», «Аққу» (қобыз)' },
        { name: 'Жаппас Қаламбаев', dates: '1909–1970', kuis: '«Қаратау шертпесі мен қобыз сарындары»' },
      ],
      jetysu: [
        { name: 'Байсерке Қылышұлы', dates: '1841–1906', kuis: '«Байсерке», «Ат жорғалау»' },
        { name: 'Қожеке Назарұлы', dates: '1823–1881', kuis: '«Мұңлық», «Құрбымның тойында», «Жиренше»' },
        { name: 'Әшім Дүңшіұлы', dates: '1870–1940', kuis: '«Әшімнің төкпесі», «Көңіл ашар»' },
        { name: 'Мұрат Әбуғазы', dates: '1973 ж.т.', kuis: '«Жетісу және Шығыс күйлерінің антологиясы»' },
      ],
    },
    guideTitle: 'Келушілерге пайдалы ақпарат',
    guideKicker: 'ОРЫН ЖӘНЕ ҚАТЫНАУ',
    guideItems: [
      { icon: <PiMapPinDuotone size={24} />, title: 'Мекен-жайы', desc: 'Астана қаласы, Алматы/Сарыарқа ауданы, Күйші Дина көшесі бойында (Тәуелсіздік даңғылы мен Жұмабаев көшесі аралығы).' },
      { icon: <PiClockDuotone size={24} />, title: 'Кіру уақыты', desc: 'Аллея ашық қоғамдық мәдени кеңістік болып табылады. Тәулік бойы (24/7) барша тұрғындар мен қала қонақтарына тегін ашық.' },
      { icon: <PiBusDuotone size={24} />, title: 'Қоғамдық көлік', desc: '№3, №14, №21, №32, №40 автобус бағдарламалары арқылы «Күйші Дина көшесі» немесе «Күйшілер аллеясы» аялдамасы.' },
      { icon: <PiQrCodeDuotone size={24} />, title: 'Интерактивті QR-гид', desc: 'Әр стелада орналасқан QR-кодты сканерлеп, күйдің аудиожазбасы мен тарихын тікелей смартфоннан тыңдауға болады.' },
    ],
  },
  ru: {
    kicker: 'АРХИТЕКТУРНЫЙ МЕМОРИАЛЬНЫЙ КОМПЛЕКС · АСТАНА',
    title: 'Аллея Кюйши в Астане',
    lead: 'Уникальное архитектурное и культурное пространство в сердце столицы, посвященное традиционному казахскому искусству кюя. Здесь увековечены имена 101 великого степного композитора.',
    zonesTitle: 'Ключевые архитектурные зоны аллеи',
    zonesKicker: 'СТРУКТУРА КОМПЛЕКСА',
    zones: [
      {
        title: 'Торжественная входная арка',
        desc: 'Величественная арка со стороны улицы Куйши Дина. Архитектурное сооружение с национальными орнаментами кошкар-муйиз.',
        img: '/images/alley-arch-main.jpg',
      },
      {
        title: 'Стелы 101 Кюйши',
        desc: 'Комплекс гранитных стел, где высечены биографии и главные произведения 101 признанного композитора школ төкпе и шертпе.',
        img: '/images/stele-kuyshi-side-a.jpg',
      },
      {
        title: 'Монумент Дине Нурпеисовой',
        desc: 'Центральный бронзовый монумент на площади аллеи, изображающий «Күй анасы» за виртуозной игрой на домбре.',
        img: '/images/dina-monument.jpg',
      },
      {
        title: 'Амфитеатр и парковая зона',
        desc: 'Зона отдыха с купольными беседками, где в теплое время года проходят живые концерты, лекции и мастер-классы.',
        img: '/images/alley-gazebo.jpg',
      },
    ],
    stelesTitle: 'Канон мастеров на стелах (по регионам)',
    stelesKicker: 'ИНТЕРАКТИВНЫЙ КАТАЛОГ',
    stelesSchools: [
      { id: 'west', name: 'Западный Казахстан (Школа төкпе)' },
      { id: 'arka', name: 'Сарыарка и Восток (Школа шертпе)' },
      { id: 'south', name: 'Каратау и Сырдарья' },
      { id: 'jetysu', name: 'Жетысу и Алтай' },
    ],
    kuyshisBySchool: {
      west: [
        { name: 'Курмангазы Сагырбайулы', dates: '1818–1896', kuis: '«Сарыарка», «Адай», «Серпер», «Кисен ашкан»' },
        { name: 'Дина Нурпеисова', dates: '1861–1955', kuis: '«Булбул», «16 жыл», «Асемконыр», «Тойбастар»' },
        { name: 'Даулеткерей Шыгайулы', dates: '1820–1887', kuis: '«Жигер», «Коныр», «Коркем ханым»' },
        { name: 'Сейтек Оразалыулы', dates: '1861–1933', kuis: '«Заман-ай», «Тойбастар», «Арман»' },
        { name: 'Мамен Ергалиулы', dates: '1868–1931', kuis: '«Он алтыншы жыл», «Кайгылы кара»' },
      ],
      arka: [
        { name: 'Таттимбет Казангапулы', dates: '1815–1862', kuis: '«Саржайлау», «Сылкылдак», «Кокейкести»' },
        { name: 'Тока Шонманулы', dates: '1830–1904', kuis: '«Саржайлау Токи», «Бозторы»' },
        { name: 'Абикен Хасенов', dates: '1892–1958', kuis: '«Коныр», наследие Таттимбета' },
        { name: 'Магауия Хамзин', dates: '1927–2000', kuis: '«Косбасар», «Жайлау»' },
      ],
      south: [
        { name: 'Казангап Тлепбергенулы', dates: '1854–1921', kuis: '«Акжелен», «Кокил», «Ногайлы боскыны»' },
        { name: 'Сугир Алиулы', dates: '1882–1961', kuis: '«Акку», «Бозинген», «Шалкыма»' },
        { name: 'Ыкылас Дукенулы', dates: '1843–1916', kuis: '«Жезкиик», «Казан», «Каскыр» (кобыз)' },
      ],
      jetysu: [
        { name: 'Байсерке Кылышулы', dates: '1841–1906', kuis: '«Байсерке», «Ат жоргалау»' },
        { name: 'Кожеке Назарулы', dates: '1823–1881', kuis: '«Мунлык», «Жиренше»' },
      ],
    },
    guideTitle: 'Информация для посетителей',
    guideKicker: 'КАК ДОБРАТЬСЯ',
    guideItems: [
      { icon: <PiMapPinDuotone size={24} />, title: 'Адрес', desc: 'г. Астана, ул. Кюйши Дина (между проспектом Тауелсиздик и ул. Жумабаева).' },
      { icon: <PiClockDuotone size={24} />, title: 'Время работы', desc: 'Открытое общественное пространство, вход круглосуточный (24/7) и бесплатный.' },
      { icon: <PiBusDuotone size={24} />, title: 'Автобусы', desc: 'Маршруты №3, 14, 21, 32, 40 до остановки «Улица Куйши Дина».' },
      { icon: <PiQrCodeDuotone size={24} />, title: 'QR-аудиогид', desc: 'Каждая стела снабжена QR-кодом для прослушивания кюев прямо на смартфоне.' },
    ],
  },
  en: {
    kicker: 'MEMORIAL ARCHITECTURAL COMPLEX · ASTANA',
    title: 'Kuyshiler Alley in Astana',
    lead: 'A unique cultural landscape in Astana honoring the ancient art of the Kazakh kui. Commemorating the names and heritage of 101 prominent steppe composers.',
    zonesTitle: 'Key Architectural Landmarks',
    zonesKicker: 'COMPLEX ZONING',
    zones: [
      {
        title: 'Ceremonial Gate (Arch)',
        desc: 'The landmark arch entrance on Kuyshi Dina street decorated with authentic national ornamental reliefs.',
        img: '/images/alley-arch-main.jpg',
      },
      {
        title: 'Steles of 101 Kuyshis',
        desc: 'Granite monuments engraved with biographies and notable kuis of 101 masters of Tokpe and Shertpe traditions.',
        img: '/images/stele-kuyshi-side-a.jpg',
      },
      {
        title: 'Monument to Dina Nurpeissova',
        desc: 'The centerpiece bronze monument immortalizing Dina with her dombra in a moment of intense inspiration.',
        img: '/images/dina-monument.jpg',
      },
      {
        title: 'Amphitheater & Recreation',
        desc: 'Community pavilions and open-air seating for summer masterclasses, live performances, and lectures.',
        img: '/images/alley-gazebo.jpg',
      },
    ],
    stelesTitle: 'Stele Master Canon (By Regions)',
    stelesKicker: 'INTERACTIVE CATALOG',
    stelesSchools: [
      { id: 'west', name: 'Western Kazakhstan (Tokpe)' },
      { id: 'arka', name: 'Saryarka & East (Shertpe)' },
      { id: 'south', name: 'Karatau & Syr Darya' },
      { id: 'jetysu', name: 'Jetysu & Altai' },
    ],
    kuyshisBySchool: {
      west: [
        { name: 'Kurmangazy Sagyrbayuly', dates: '1818–1896', kuis: '"Saryarka", "Aday", "Serper", "Kisen Ashkan"' },
        { name: 'Dina Nurpeissova', dates: '1861–1955', kuis: '"Bulbul", "16 Zhyl", "Asemkonyr", "Toybastar"' },
        { name: 'Dauletkerei Shygayuly', dates: '1820–1887', kuis: '"Zhiger", "Konyr", "Korkem Khanym"' },
      ],
      arka: [
        { name: 'Tattimbet Qazangapuly', dates: '1815–1862', kuis: '"Saryzhaylau", "Sylkyldaq", "Kokeikesti"' },
        { name: 'Abiken Khasenov', dates: '1892–1958', kuis: '"Konyr", Tattimbet tradition' },
      ],
      south: [
        { name: 'Qazangap Tlepbergenuly', dates: '1854–1921', kuis: '"Aqzhelen", "Kokil", "Nogayly Boskyny"' },
        { name: 'Sugir Aliuly', dates: '1882–1961', kuis: '"Aqqu", "Bozingen", "Shalqyma"' },
        { name: 'Ykylas Dukenuly', dates: '1843–1916', kuis: '"Zhezkiik", "Qazan", "Qasqyr" (kobyz)' },
      ],
      jetysu: [
        { name: 'Bayserke Qylyshuly', dates: '1841–1906', kuis: '"Bayserke", "At Zhorgalau"' },
      ],
    },
    guideTitle: 'Visitor Information',
    guideKicker: 'DIRECTIONS & ACCESS',
    guideItems: [
      { icon: <PiMapPinDuotone size={24} />, title: 'Address', desc: 'Astana, Kuyshi Dina street (between Tauelsizdik Ave and Zhumabayev St).' },
      { icon: <PiClockDuotone size={24} />, title: 'Hours', desc: 'Open 24/7 as an accessible public memorial park. Admission is free.' },
      { icon: <PiBusDuotone size={24} />, title: 'Public Transit', desc: 'Bus routes #3, #14, #21, #32, #40 to "Kuyshi Dina street".' },
      { icon: <PiQrCodeDuotone size={24} />, title: 'QR Audio Tour', desc: 'Every stele includes a QR code linking to authentic high-fidelity audio recordings.' },
    ],
  },
};

export default function AlleyPage({ onNavigate, lang = 'kk', t, navLabels = {} }) {
  const c = CONTENT[lang] || CONTENT.kk;
  const [activeSchool, setActiveSchool] = useState('west');

  return (
    <div className="dedicated-subpage alley-subpage">
      {/* 1. Page Banner */}
      <section className="page-banner page-banner-projects">
        <div className="page-banner-image">
          <img src="/images/alley-arch-main.jpg" alt="Күйшілер аллеясы" />
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

      {/* 2. Architectural Zones Showcase */}
      <section className="subpage-section content-width">
        <div className="subpage-section-header">
          <span className="block-kicker">{c.zonesKicker}</span>
          <h2>{c.zonesTitle}</h2>
        </div>

        <div className="alley-zones-grid">
          {c.zones.map((zone, idx) => (
            <div key={idx} className="alley-zone-card">
              <div className="alley-zone-img">
                <img src={zone.img} alt={zone.title} />
              </div>
              <div className="alley-zone-body">
                <h3>{zone.title}</h3>
                <p>{zone.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. 101 Kuyshis Stele Explorer */}
      <section className="subpage-section content-width">
        <div className="subpage-section-header">
          <span className="block-kicker">{c.stelesKicker}</span>
          <h2>{c.stelesTitle}</h2>
        </div>

        <div className="stele-school-tabs">
          {c.stelesSchools.map((s) => (
            <button
              key={s.id}
              className={`school-tab-btn ${activeSchool === s.id ? 'active' : ''}`}
              onClick={() => setActiveSchool(s.id)}
            >
              <span>{s.name}</span>
            </button>
          ))}
        </div>

        <div className="stele-kuyshis-grid">
          {(c.kuyshisBySchool[activeSchool] || []).map((k, idx) => (
            <div key={idx} className="stele-kuyshi-card">
              <div className="stele-badge">Стела №0{idx + 1}</div>
              <h4>{k.name}</h4>
              <span className="stele-dates">{k.dates}</span>
              <p className="stele-kuis">
                <strong>{lang === 'kk' ? 'Таңдаулы күйлері:' : 'Главные кюи:'}</strong> {k.kuis}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Visitor Guide */}
      <section className="subpage-section content-width">
        <div className="subpage-section-header">
          <span className="block-kicker">{c.guideKicker}</span>
          <h2>{c.guideTitle}</h2>
        </div>

        <div className="guide-grid">
          {c.guideItems.map((g, idx) => (
            <div key={idx} className="guide-card">
              <div className="guide-icon">{g.icon}</div>
              <h4>{g.title}</h4>
              <p>{g.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Nav */}
      <div className="subpage-bottom-nav content-width">
        <button className="button button-outline" onClick={() => onNavigate('projects')}>
          <span>← {navLabels['projects'] || 'Жобаларға оралу'}</span>
        </button>
        <button className="button button-dark" onClick={() => onNavigate('projects-monument')}>
          <span>{navLabels['projects-monument'] || 'Дина монументін көру'} →</span>
        </button>
      </div>
    </div>
  );
}
