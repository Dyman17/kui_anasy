import React from 'react';
import { BrandMark } from './BrandMark';
import './Footer.css';

const FOOTER_LABELS = {
  kk: {
    blurb: 'Қазақтың ұлттық музыкалық мұрасын сақтау, зерттеу және келер ұрпаққа жеткізуге арналған цифрлық бастама.',
    sections: 'Бөлімдер',
  },
  ru: {
    blurb: 'Цифровая инициатива по сохранению, изучению и передаче будущим поколениям национального музыкального наследия казахов.',
    sections: 'Разделы',
  },
  en: {
    blurb: 'A digital initiative to preserve, study and pass on the national musical heritage of the Kazakh people.',
    sections: 'Sections',
  },
};

/** Site footer: brand + blurb, all section links (real anchors), bottom line with the admin entry. */
export function Footer({ navPages, navLabels, lang, hrefFor, onNavigate, t }) {
  const labels = FOOTER_LABELS[lang] || FOOTER_LABELS.kk;
  const sections = navPages.filter((page) => page.slug !== 'home');

  return (
    <footer className="page-footer">
      <div className="page-footer-inner content-width">
        <div className="page-footer-brand">
          <a
            className="brand"
            href={hrefFor('home')}
            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
          >
            <BrandMark />
            <span className="brand-copy"><strong>Күй анасы</strong></span>
          </a>
          <p>{labels.blurb}</p>
        </div>
        <nav className="page-footer-nav" aria-labelledby="page-footer-sections">
          <h2 id="page-footer-sections" className="page-footer-heading">{labels.sections}</h2>
          <ul>
            {sections.map((page) => (
              <li key={page.slug}>
                <a
                  href={hrefFor(page.slug)}
                  onClick={(e) => { e.preventDefault(); onNavigate(page.slug); }}
                >
                  {navLabels[page.slug] || page.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="page-footer-bottom content-width">
        <span>{t.footerCopy}</span>
        <span>{t.footerDesc}</span>
        <a href="#admin" className="page-footer-admin">{t.adminPanel}</a>
      </div>
    </footer>
  );
}
