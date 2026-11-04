import './NotFoundPage.css';

export function NotFoundPage({ onNavigate, t }) {
  return (
    <section className="not-found-page content-width" role="alert">
      <span className="block-kicker">404</span>
      <h1>{t.notFoundTitle}</h1>
      <p>{t.notFoundText}</p>
      <button className="button button-dark" onClick={() => onNavigate('home')}>
        <span>{t.backHome}</span>
      </button>
    </section>
  );
}
