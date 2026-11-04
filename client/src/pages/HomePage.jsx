import React from 'react';
import {
  PiCrownDuotone,
  PiGraduationCapDuotone,
  PiPaletteDuotone,
  PiSparkleDuotone,
  PiStudentDuotone,
  PiMusicNotesPlusDuotone,
  PiChalkboardTeacherDuotone,
  PiCompassDuotone,
} from 'react-icons/pi';
import {
  RiCompass3Line,
  RiInformationLine,
  RiBookmarkLine,
  RiArrowRightUpLine,
  RiArrowRightLine,
} from 'react-icons/ri';
import { TextWithTooltips, Tooltip } from '../components/ReferenceTooltip';
import { HeroImageRotator } from '../components/HeroImageRotator';
import { PROJECT_LEADERS, MURAGERLER_FEATURES } from '../constants';

export function HomePage({ page, onNavigate, t, navLabels, lang = 'kk' }) {
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
            <button className="button button-dark" onClick={() => onNavigate('people')}>{t.peopleBtn} <PiUsersDuotone size={18} /></button>
            <button className="text-button" onClick={() => onNavigate('heritage')}>{t.heritageBtn} <PiWaveformDuotone size={18} /></button>
          </div>
        </div>

        <HeroImageRotator lang={lang} />
      </section>

      {/* Дина Нұрпейісова блогы */}
      {feature && (
        <section className="featured-person">
          <figure className="featured-person-image">
            <img src="/images/dina-monument.jpg" alt="Дина Нұрпейісова ескерткіші" />
            <figcaption>
              <Tooltip text="2021 ж. Астана қаласы, Күйшілер аллеясы · Сәулетшісі: Жалын Бауыржан">
                <span style={{ cursor: 'help' }}>Дина Нұрпейісова ескерткіші · Астана ⓘ</span>
              </Tooltip>
            </figcaption>
          </figure>

          <div className="featured-person-copy">
            <span className="hero-kicker">ТҰЛҒА · {feature.eyebrow || '1861 — 1955'}</span>
            <h2>{feature.title}</h2>
            <p><TextWithTooltips text={feature.body} /></p>
            <Tooltip text="321+ тұлғаның толық антологиясы мен өмірбаянына өту">
              <button className="underlined-link" onClick={() => onNavigate('people')}>
                Тұлғалар каталогы <RiCompass3Line size={16} />
              </button>
            </Tooltip>
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
            <p><TextWithTooltips text={intro.body} /></p>
            <Tooltip text="«Күй анасы» қоры, ғылыми кеңесі мен жоба бастамашылары">
              <button className="underlined-link" onClick={() => onNavigate('about')}>
                {t.aboutFund} <RiInformationLine size={16} />
              </button>
            </Tooltip>
          </div>

          <figure className="intro-artwork">
            <img src="/images/dombra-player-illustration.png" alt="Домбырашының көркем бейнесі" loading="lazy" />
            <figcaption>
              <Tooltip text="Қазақтың дәстүрлі домбырашылық өнерінің символдық көркем бейнесі">
                <span style={{ cursor: 'help' }}>КӨРКЕМ БЕЙНЕ · АТРИБУЦИЯ ЖОҚ ⓘ</span>
              </Tooltip>
            </figcaption>
          </figure>
          <span className="intro-pattern" aria-hidden="true" />
        </section>
      )}

      {latest && (
        <section className="discover-section content-width">
          <div className="section-topline">
            <h2>{latest.title}</h2>
            <Tooltip text="3 томдық академиялық басылымдар мен күй партитуралары">
              <button className="underlined-link" onClick={() => onNavigate('library')}>
                {t.libraryBtn} <RiBookmarkLine size={16} />
              </button>
            </Tooltip>
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
                <RiArrowRightUpLine size={22} />
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
                <span className="leader-pill-badge">
                  {leader.id === 'tolegen-kuanyshev' && <PiCrownDuotone size={13} style={{ marginRight: 6, verticalAlign: '-1px' }} />}
                  {leader.id === 'erzat-zhetibayev' && <PiGraduationCapDuotone size={13} style={{ marginRight: 6, verticalAlign: '-1px' }} />}
                  {leader.id === 'zhalyn-bauyrzhan' && <PiPaletteDuotone size={13} style={{ marginRight: 6, verticalAlign: '-1px' }} />}
                  <span>{leader.badge}</span>
                </span>
                <h3 className="leader-name">{leader.name}</h3>
                <p className="leader-specialty">{leader.role}</p>
                <p className="leader-bio">{leader.bio}</p>

                {leader.highlights && leader.highlights.length > 0 && (
                  <div className="leader-highlights">
                    {leader.highlights.map((item, idx) => (
                      <div key={idx} className="leader-highlight-item">
                        <span className="leader-highlight-bullet" aria-hidden="true">✦</span>
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
      <section className="muragerler-section">
        <div className="muragerler-card">
          <div className="muragerler-header">
            <span className="muragerler-slogan-pill">
              <PiSparkleDuotone size={16} className="muragerler-slogan-icon" />
              <span>{t.muragerlerSlogan || '«Мұраны сақта, жаңғырт, дамыт!»'}</span>
            </span>
            <span className="block-kicker">{t.muragerlerKicker || 'ЖАСТАР БАСТАМАСЫ · МӘДЕНИ САБАҚТАСТЫҚ'}</span>
            <h2 className="muragerler-title">{t.muragerlerTitle || '«Мұрагерлер» жастар үйірмесі'}</h2>
            <p className="muragerler-desc">{t.muragerlerDesc || '«Күй анасы» жеке қоры жанындағы өскелең ұрпақты ұлттық музыка өнеріне баулу және жас дарындарды жан-жақты қолдау бастамасы.'}</p>
            <button
              className="muragerler-cta-btn"
              onClick={() => onNavigate('projects-muragerler')}
            >
              <span>{t.muragerlerBtn || 'Үйірме туралы толық білу'}</span>
              <RiArrowRightLine size={18} />
            </button>
          </div>

          <div className="muragerler-features-grid">
            {(MURAGERLER_FEATURES[lang] || MURAGERLER_FEATURES.kk).map((feature, idx) => (
              <div key={idx} className="muragerler-feature-box">
                <div className="muragerler-feature-icon-orb">
                  {idx === 0 && <PiStudentDuotone size={23} />}
                  {idx === 1 && <PiMusicNotesPlusDuotone size={23} />}
                  {idx === 2 && <PiChalkboardTeacherDuotone size={23} />}
                  {idx === 3 && <PiCompassDuotone size={23} />}
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
