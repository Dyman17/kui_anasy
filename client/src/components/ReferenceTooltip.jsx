import React, { useState, useRef, useEffect } from 'react';

/**
 * Modern floating balloon tooltip (like in the user screenshot: white/light bubble,
 * dark sharp text, rounded corners, centered bottom pointer triangle / arrow).
 *
 * Props:
 * - text: string (the short hint, e.g. "Қор туралы толық ақпарат алу")
 * - position: 'top' | 'bottom' (default 'top')
 * - children: ReactNode (trigger element, button, caption, etc.)
 */
export function Tooltip({ text, position = 'top', children, className = '' }) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);

  const show = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const left = rect.left + rect.width / 2;
      const top = position === 'bottom' ? rect.bottom + 8 : rect.top - 8;
      setCoords({ top, left });
    }
    setVisible(true);
  };

  const hide = () => setVisible(false);

  return (
    <span
      ref={triggerRef}
      className={`app-tooltip-trigger ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      style={{ display: 'inline-flex', alignItems: 'center' }}
    >
      {children}
      {visible && text && (
        <span
          className={`app-tooltip-balloon app-tooltip-${position}`}
          style={{
            position: 'fixed',
            top: coords.top,
            left: coords.left,
            transform: position === 'bottom' ? 'translate(-50%, 0)' : 'translate(-50%, -100%)',
          }}
          role="tooltip"
        >
          {text}
          <span className="app-tooltip-arrow" aria-hidden="true" />
        </span>
      )}
    </span>
  );
}

/**
 * Historical references dictionary for figures / keywords.
 */
export const HISTORICAL_REFERENCES = {
  'Құрманғазы': {
    name: 'Құрманғазы Сағырбайұлы',
    dates: '1818 — 1896',
    role: 'Күй атасы · Ұлы күйші-композитор',
    bio: 'Қазақтың төкпе күй өнерінің ұлы классигі, азаттық рухының жаршысы. Оның «Сарыарқа», «Адай», «Серпер», «Кісен ашқан» сияқты өлмес туындылары ұлттық дәулескерлік мектептің діңгегі болып қаланды. Дина Нұрпейісованың ұстазы әрі рухани жетекшісі.',
  },
  'Құрманғазының': {
    name: 'Құрманғазы Сағырбайұлы',
    dates: '1818 — 1896',
    role: 'Күй атасы · Ұлы күйші-композитор',
    bio: 'Қазақтың төкпе күй өнерінің ұлы классигі, азаттық рухының жаршысы. Оның «Сарыарқа», «Адай», «Серпер», «Кісен ашқан» сияқты өлмес туындылары ұлттық дәулескерлік мектептің діңгегі болып қаланды. Дина Нұрпейісованың ұстазы әрі рухани жетекшісі.',
  },
  'Төлеген Қуанышев': {
    name: 'Қуанышев Төлеген Шағытбайұлы',
    dates: '1949 ж.т.',
    role: 'Профессор · Қор құрылтайшысы',
    bio: 'Педагогика ғылымдарының кандидаты, профессор, қоғам қайраткері. «Күй анасы» жеке қорының құрылтайшысы, Астанадағы Күйшілер аллеясы мен Дина Нұрпейісова монументі идеясының авторы әрі бастамашысы.',
  },
  'профессор Төлеген Қуанышев': {
    name: 'Қуанышев Төлеген Шағытбайұлы',
    dates: '1949 ж.т.',
    role: 'Профессор · Қор құрылтайшысы',
    bio: 'Педагогика ғылымдарының кандидаты, профессор, қоғам қайраткері. «Күй анасы» жеке қорының құрылтайшысы, Астанадағы Күйшілер аллеясы мен Дина Нұрпейісова монументі идеясының авторы әрі бастамашысы.',
  },
  'Жалын Бауыржан': {
    name: 'Жалын Бауыржан',
    dates: 'Қазіргі заман өнері',
    role: 'Мүсінші · Монументалист суретші',
    bio: 'Кәсіби қазақстандық мүсінші, монументалист. 2021 жылы елордадағы Күйшілер аллеясында бой көтерген «Күй анасы — Дина» қола монументінің басты сәулетші-авторы.',
  },
  'мүсінші: Жалын Бауыржан': {
    name: 'Жалын Бауыржан',
    dates: 'Қазіргі заман өнері',
    role: 'Мүсінші · Монументалист суретші',
    bio: 'Кәсіби қазақстандық мүсінші, монументалист. 2021 жылы елордадағы Күйшілер аллеясында бой көтерген «Күй анасы — Дина» қола монументінің басты сәулетші-авторы.',
  },
  'Болатбек Еркебайұлы': {
    name: 'Болатбек Еркебайұлы',
    dates: 'Қазіргі заман шебері',
    role: 'Мүсінші · Қосымша автор',
    bio: 'Елордадағы Дина Нұрпейісова қола ескерткішінің авторлық ұжымының мүшесі, ұлттық монументалды өнердің көрнекті шебері.',
  },
  'Аманжол Бекенұлы': {
    name: 'Аманжол Бекенұлы',
    dates: 'Қазіргі заман шебері',
    role: 'Мүсінші · Сәулетші-автор',
    bio: 'Астанадағы Күйшілер аллеясы кешеніндегі Дина ескерткіші мен архитектуралық композицияның бірлескен авторы.',
  },
  'Дәулеткерей': {
    name: 'Дәулеткерей Шығайұлы',
    dates: '1820 — 1887',
    role: 'Төре күйлерінің классигі',
    bio: 'Қазақтың аса көрнекті күйші-композиторы, төре күйлерінің негізін салушы. Оның «Жігер», «Бұлбұл», «Қоңыр», «Салық өлген» сияқты нәзік лирикалық және терең философиялық күйлері ұлттық музыканың інжу-маржаны саналады.',
  },
  'Тәттімбет': {
    name: 'Тәттімбет Қазанғапұлы',
    dates: '1815 — 1862',
    role: 'Шертпе күй тарланы',
    bio: 'Сарыарқа шертпе күй мектебінің негізін салушы, даңқты күйші-сазгер. «Саржайлау», «Сылқылдақ», «Былқылдақ», «Көкейкесті» сияқты туындылары арқылы қазақ күйіне психологиялық тереңдік пен нәзік иірім сыйлаған.',
  },
  'Қазанғап': {
    name: 'Қазанғап Тілепбергенұлы',
    dates: '1854 — 1921',
    role: 'Арал-Қазалы күй дәстүрінің көшбасшысы',
    bio: '«Ақжелең» күйлер топтамасының авторы, өзіндік орындаушылық мәнері қалыптасқан дәулескер күйші. Оның мұрасындағы 62 «Ақжелең» адамның жан дүниесі мен сезім күйлерін шебер жеткізеді.',
  },
  'Сүгір': {
    name: 'Сүгір Әлиұлы',
    dates: '1882 — 1961',
    role: 'Қаратау шертпе дәстүрінің шебері',
    bio: 'Қаратау өңірінде шертпе күйді қобыз сарынымен ұштастырып, жаңа бояу қосқан дәулескер композитор. «Аққу», «Бозінген», «Шалқыма» күйлері ұлттық классиканың төрінен орын алады.',
  },
  'Қали Жантілеуов': {
    name: 'Қали Жантілеуов',
    dates: '1902 — 1970',
    role: 'Қазақ КСР халық әртісі',
    bio: 'Дина Нұрпейісова мен Құрманғазы мектебінің белгілі өкілі, домбырашы-ұстаз. Құрманғазы күйлерінің классикалық нұсқаларын нотаға түсіріп, бүгінгі ұрпаққа жеткізген майталман орындаушы.',
  },
};

/**
 * TextWithTooltips component:
 * Highlights key terms and names, displaying the bubble tooltip on hover.
 */
export function TextWithTooltips({ text }) {
  if (!text || typeof text !== 'string') return text;

  const sortedKeys = Object.keys(HISTORICAL_REFERENCES).sort((a, b) => b.length - a.length);
  const pattern = new RegExp(`(${sortedKeys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');

  const parts = text.split(pattern);

  return (
    <>
      {parts.map((part, i) => {
        const ref = HISTORICAL_REFERENCES[part];
        if (!ref) return part;
        return <NameReferenceTooltip key={i} keyword={part} data={ref} />;
      })}
    </>
  );
}

export function NameReferenceTooltip({ keyword, data }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);

  const showTooltip = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top - 8,
        left: Math.min(Math.max(16, rect.left + rect.width / 2), window.innerWidth - 320),
      });
    }
    setIsOpen(true);
  };

  const hideTooltip = () => setIsOpen(false);

  return (
    <span
      ref={triggerRef}
      className="name-reference-trigger"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onClick={() => setIsOpen(!isOpen)}
      role="button"
      tabIndex={0}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {keyword}
      <span className="name-reference-dot" aria-hidden="true" />
      {isOpen && (
        <span
          className="name-reference-card"
          style={{
            position: 'fixed',
            top: coords.top,
            left: coords.left,
            transform: 'translate(-50%, -100%)',
          }}
          role="tooltip"
        >
          <span className="ref-card-header">
            <strong className="ref-card-name">{data.name}</strong>
            <span className="ref-card-dates">{data.dates}</span>
          </span>
          <span className="ref-card-role">{data.role}</span>
          <span className="ref-card-bio">{data.bio}</span>
          <span className="ref-card-tip">«Күй анасы» қысқаша тарихи анықтамалығы</span>
        </span>
      )}
    </span>
  );
}
