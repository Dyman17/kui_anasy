import React from 'react';
import { RiArrowRightLine } from 'react-icons/ri';
import { ContentBlock, SectionMotif } from '../components/ContentBlock';
import { Callout } from '../components/Callout';
import { PARENT_SECTIONS } from '../constants';

export function StandardPage({ page, onNavigate, allPages = [], isEditor = false, t, navLabels }) {
  const relevantBlocks = page.blocks || [];
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

        {subpages.length > 0 && (
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
                  <span className="subpage-read-link">{t.readMore} <RiArrowRightLine size={14} /></span>
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
