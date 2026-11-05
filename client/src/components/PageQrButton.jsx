import React, { useEffect, useId, useRef, useState } from 'react';
import { RiQrCodeLine, RiCloseLine } from 'react-icons/ri';

const LABELS = {
  kk: { open: 'Осы беттің QR-коды', title: 'Осы беттің QR-коды', hint: 'Телефон камерасымен сканерлеңіз', download: 'PNG жүктеу', close: 'Жабу', loading: 'Жүктелуде…', error: 'QR-код жасалмады' },
  ru: { open: 'QR-код этой страницы', title: 'QR-код этой страницы', hint: 'Отсканируйте камерой телефона', download: 'Скачать PNG', close: 'Закрыть', loading: 'Загрузка…', error: 'Не удалось создать QR-код' },
  en: { open: 'QR code for this page', title: 'QR code for this page', hint: 'Scan with your phone camera', download: 'Download PNG', close: 'Close', loading: 'Loading…', error: 'Could not create the QR code' },
};

const QR_COLORS = { dark: '#0B1C15', light: '#F2EBDD' }; // forest-deep on parchment, 14.9:1

/**
 * Shows a QR code for the page currently open and lets the visitor save it as a printable PNG.
 * variant "icon": header icon button + anchored popover (desktop).
 * variant "row": full-width text button + centred dialog (mobile menu).
 * The `qrcode` library is loaded only when the popover is opened.
 */
export function PageQrButton({ lang = 'kk', variant = 'icon' }) {
  const labels = LABELS[lang] || LABELS.kk;
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState('');
  const [printable, setPrintable] = useState('');
  const [failed, setFailed] = useState(false);
  const popoverId = useId();
  const wrapRef = useRef(null);
  const buttonRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;
    const url = window.location.href;
    setFailed(false);
    setPreview('');
    setPrintable('');
    import('qrcode')
      .then(({ default: QRCode }) => Promise.all([
        QRCode.toDataURL(url, { width: 360, margin: 4, color: QR_COLORS }),
        QRCode.toDataURL(url, { width: 1024, margin: 4, color: QR_COLORS }),
      ]))
      .then(([small, large]) => { if (!cancelled) { setPreview(small); setPrintable(large); } })
      .catch(() => { if (!cancelled) setFailed(true); });
    closeRef.current?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation(); // capture phase: closes only the popover, not the menu behind it
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointer = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onHash = () => setOpen(false);
    window.addEventListener('keydown', onKey, true);
    document.addEventListener('mousedown', onPointer);
    window.addEventListener('hashchange', onHash);
    return () => {
      cancelled = true;
      window.removeEventListener('keydown', onKey, true);
      document.removeEventListener('mousedown', onPointer);
      window.removeEventListener('hashchange', onHash);
    };
  }, [open]);

  const fileName = () => {
    const slug = window.location.hash.replace(/^#\/?/, '').replace(/[^\w-]+/g, '-').replace(/^-+|-+$/g, '');
    return `kui-anasy-${slug || 'home'}-qr.png`;
  };

  const ready = preview && !failed;

  return (
    <div className={`page-qr-wrap page-qr-${variant}`} ref={wrapRef}>
      <button
        ref={buttonRef}
        type="button"
        className={variant === 'row' ? 'page-qr-row-btn' : `header-icon-btn ${open ? 'active' : ''}`}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={open ? popoverId : undefined}
        aria-label={variant === 'row' ? undefined : labels.open}
        title={variant === 'row' ? undefined : labels.open}
      >
        {variant === 'row' ? labels.open : <RiQrCodeLine size={20} aria-hidden="true" />}
      </button>

      {open && (
        <div className="page-qr-popover" id={popoverId} role="dialog" aria-label={labels.title}>
          <button ref={closeRef} type="button" className="page-qr-close" onClick={() => { setOpen(false); buttonRef.current?.focus(); }} aria-label={labels.close}>
            <RiCloseLine size={20} aria-hidden="true" />
          </button>
          <strong className="page-qr-title">
            {labels.title.split(/(QR-\S+)/).map((part, i) => (/^QR-/.test(part) ? <span key={i} className="nowrap">{part}</span> : part))}
          </strong>
          <div className="page-qr-image">
            {ready
              ? <img src={preview} alt={labels.title} width="180" height="180" />
              : <span>{failed ? labels.error : labels.loading}</span>}
          </div>
          <p className="page-qr-hint">{labels.hint}</p>
          {ready && printable && (
            <a className="page-qr-download" href={printable} download={fileName()}>{labels.download}</a>
          )}
        </div>
      )}
    </div>
  );
}
