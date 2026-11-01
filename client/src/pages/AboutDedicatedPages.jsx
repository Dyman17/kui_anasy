import React from 'react';
import {
  PiSparkleDuotone,
  PiShieldCheckDuotone,
  PiUserDuotone,
  PiCertificateDuotone,
  PiBookOpenDuotone,
  PiFileTextDuotone,
  PiCheckCircleDuotone,
  PiBuildingsDuotone,
} from 'react-icons/pi';

export function LeadershipPage({ onNavigate, lang = 'kk', t, navLabels = {} }) {
  return (
    <div className="dedicated-subpage about-subpage">
      <section className="page-banner page-banner-about">
        <div className="page-banner-image">
          <img src="/images/tolegen-kuanyshev-founder.jpg" alt="Қор басшылығы" />
        </div>
        <div className="content-width page-banner-inner">
          <span className="block-kicker banner-parent-kicker">{navLabels['about'] || 'Қор туралы'}</span>
          <h1>Қор басшылығы мен ғылыми кеңес</h1>
          <p>«Күй анасы» жеке қорының құрылтайшылары, қамқоршылар кеңесі мен академиялық ғылыми сарапшылар құрамы.</p>

          <div className="breadcrumb">
            <button onClick={() => onNavigate('home')}>{t.backHome || 'Басты бет'}</button>
            <span>/</span>
            <button onClick={() => onNavigate('about')}>{navLabels['about'] || 'Қор туралы'}</button>
            <span>/</span>
            <span>Басшылық</span>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="subpage-section content-width">
        <div className="leader-feature-card">
          <div className="leader-photo-wrap">
            <img src="/images/tolegen-kuanyshev-founder.jpg" alt="Төлеген Қуанышев" />
            <span className="leader-badge">Қор құрылтайшысы</span>
          </div>
          <div className="leader-bio-wrap">
            <span className="block-kicker">ЖОБА ЖЕТЕКШІСІ МЕН ИДЕЯ АВТОРЫ</span>
            <h2>Қуанышев Төлеген Шағытбайұлы</h2>
            <p className="leader-quote">
              «Қазақтың күйі — ұлттың тілі жетпеген жерде сөйлейтін қасиетті құдіреті. Біздің басты парызымыз — бабалардан қалған осы сарқылмас мұраны цифрландырып, болашақ ұрпақтың кәдесіне жарату».
            </p>
            <p>
              Мәдениет жанашыры, қоғам қайраткері. Астана қаласындағы «Күйшілер аллеясы» мемориалдық кешенінің бой көтеруіне, Дина Нұрпейісованың 160 жылдық монументінің орнатылуына және қазақ музыкасының үш томдық іргелі антологиясының жарық көруіне тікелей мұрындық болған.
            </p>
          </div>
        </div>
      </section>

      {/* Scientific Council */}
      <section className="subpage-section content-width">
        <div className="subpage-section-header">
          <span className="block-kicker">АКАДЕМИЯЛЫҚ САРАПТАМА</span>
          <h2>Ғылыми-сараптамалық кеңес</h2>
          <p>Антологияның академиялық дәлдігі мен күйлердің түпнұсқа сақталуын қамтамасыз ететін жетекші ғалымдар мен өнертанушылар:</p>
        </div>

        <div className="council-grid">
          <div className="council-card">
            <div className="council-avatar"><PiUserDuotone size={36} /></div>
            <h4>Өнертану және этномузыка сарапшылары</h4>
            <span className="council-role">Құрманғазы атындағы Қазақ ұлттық консерваториясының профессорлық құрамы</span>
            <p>Күйлердің дыбыстық шежіресін, өңірлік мектептердің қағыс ерекшеліктерін сараптау және түсініктеме беру.</p>
          </div>
          <div className="council-card">
            <div className="council-avatar"><PiCertificateDuotone size={36} /></div>
            <h4>Мұрағаттану және фольклор ғалымдары</h4>
            <span className="council-role">М.О. Әуезов атындағы Әдебиет және өнер институты</span>
            <p>Тарихи күй аңыздарының қолжазба нұсқалары мен сирек фонограммаларды зерттеу, канондық мәтіндерді бекіту.</p>
          </div>
          <div className="council-card">
            <div className="council-avatar"><PiBookOpenDuotone size={36} /></div>
            <h4>Ноталық редакция және цифрлық канон</h4>
            <span className="council-role">Қазақ ұлттық өнер университетінің домбыра кафедрасы</span>
            <p>101 күйдің екі дауысты классикалық партитураларын заманауи халықаралық цифрлық форматтарға көшіру.</p>
          </div>
        </div>
      </section>

      {/* Bottom Nav */}
      <div className="subpage-bottom-nav content-width">
        <button className="button button-outline" onClick={() => onNavigate('about')}>
          <span>← {navLabels['about'] || 'Қор туралы бөліміне оралу'}</span>
        </button>
      </div>
    </div>
  );
}

export function CharterPage({ onNavigate, lang = 'kk', t, navLabels = {} }) {
  return (
    <div className="dedicated-subpage about-subpage">
      <section className="page-banner page-banner-about">
        <div className="page-banner-image">
          <img src="/images/dina-monument.jpg" alt="Қор Жарғысы" />
        </div>
        <div className="content-width page-banner-inner">
          <span className="block-kicker banner-parent-kicker">{navLabels['about'] || 'Қор туралы'}</span>
          <h1>Қордың құрылымы мен жарғылық міндеттері</h1>
          <p>«Күй анасы» жеке қорының заңды мәртебесі, қоғамдық мақсаттары және қызметінің негізгі бағыттары.</p>

          <div className="breadcrumb">
            <button onClick={() => onNavigate('home')}>{t.backHome || 'Басты бет'}</button>
            <span>/</span>
            <button onClick={() => onNavigate('about')}>{navLabels['about'] || 'Қор туралы'}</button>
            <span>/</span>
            <span>Жарғы</span>
          </div>
        </div>
      </section>

      <section className="subpage-section content-width">
        <div className="charter-cards-grid">
          <div className="charter-card">
            <div className="charter-icon"><PiShieldCheckDuotone size={28} /></div>
            <h3>Заңды мәртебесі мен миссиясы</h3>
            <p>
              «Күй анасы» қоры — коммерциялық емес, жалпыұлттық мәдени-ағартушылық мақсатта құрылған қоғамдық ұйым. Басты миссиясы — қазақ халқының дәстүрлі музыка мұрасын сақтау, жүйелеу және әлемдік кеңістікке насихаттау.
            </p>
          </div>

          <div className="charter-card">
            <div className="charter-icon"><PiBuildingsDuotone size={28} /></div>
            <h3>Мәдени нысандарды дамыту</h3>
            <p>
              Астана қаласындағы «Күйшілер аллеясын» күтіп-ұстау, мемориалдық кешен аумағында тұрақты мәдени шаралар, шеберлік сыныптары мен концерттер ұйымдастыру.
            </p>
          </div>

          <div className="charter-card">
            <div className="charter-icon"><PiBookOpenDuotone size={28} /></div>
            <h3>Академиялық баспа және цифрландыру</h3>
            <p>
              Үш томдық музыкалық антологияны, ноталық жинақтарды, ғылыми монографияларды шығару және Ұлы даланың аудиомұрағаттарын цифрлық портал арқылы тегін қолжетімді ету.
            </p>
          </div>

          <div className="charter-card">
            <div className="charter-icon"><PiCheckCircleDuotone size={28} /></div>
            <h3>«Мұрагерлер» жастар үйірмесіне қолдау</h3>
            <p>
              Өскелең ұрпақты ұлттық өнерге баулу мақсатында жас күйшілерге, жыршылар мен дәстүрлі әншілерге арнайы шәкіртақылар тағайындау, тегін курстар ұйымдастыру.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Nav */}
      <div className="subpage-bottom-nav content-width">
        <button className="button button-outline" onClick={() => onNavigate('about')}>
          <span>← {navLabels['about'] || 'Қор туралы бөліміне оралу'}</span>
        </button>
      </div>
    </div>
  );
}
