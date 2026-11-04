import React from 'react';

export function Callout({ onNavigate, t }) {
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
