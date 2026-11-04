import React from 'react';
import { RiArrowRightLine } from 'react-icons/ri';
import { QRBlock } from './QRBlock';

export function SectionMotif({ slug }) {
  if (slug === 'heritage') {
    return <svg className="section-motif motif-wave-banner" viewBox="0 0 520 230" aria-hidden="true"><path d="M-20 165C45 165 45 45 110 45s65 120 130 120 65-120 130-120 65 120 170 120" /></svg>;
  }
  return null;
}

export function ContentBlock({ block, index, pageSlug }) {
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
        {block.link && <a className="underlined-link" href={block.link} target="_blank" rel="noreferrer">{block.linkLabel || 'Толығырақ'} <RiArrowRightLine size={14} /></a>}
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
