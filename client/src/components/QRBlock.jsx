import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Copy, Check } from 'lucide-react';

export function QRBlock({ block }) {
  const [dataUrl, setDataUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (block.link && block.link.trim()) {
      import('qrcode')
        .then(({ default: QRCode }) => QRCode.toDataURL(block.link.trim(), {
          width: 256,
          margin: 2,
          color: { dark: '#1f1610', light: '#ffffff' },
        }))
        .then(setDataUrl)
        .catch(() => {});
    } else {
      setDataUrl('');
    }
  }, [block.link]);

  const handleCopy = () => {
    if (block.link) {
      navigator.clipboard.writeText(block.link).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="qr-block">
      <div className="qr-card-ornament" aria-hidden="true">❖ ── ◈ ── ❖</div>
      <div className="qr-image-container">
        {dataUrl ? (
          <img src={dataUrl} alt={block.title || 'QR Code'} />
        ) : (
          <div className="qr-placeholder">{block.link ? 'QR код дайындалуда…' : 'Сілтеме көрсетілмеген'}</div>
        )}
      </div>
      <figcaption>{block.title || 'Сілтеме QR-коды'}</figcaption>
      <p className="qr-hint">Телефон камерасымен сканерлеп, сілтемеге жылдам өтіңіз</p>
      {block.link && (
        <div className="qr-link-row">
          <a href={block.link} target="_blank" rel="noreferrer" className="qr-link-url">
            {block.link} <ArrowUpRight size={14} />
          </a>
          <button type="button" className="qr-copy-btn" onClick={handleCopy} aria-label={copied ? 'Көшірілді!' : 'Көшіру'}>
            {copied ? <Check size={13} /> : <Copy size={13} />}
            <span>{copied ? 'Көшірілді!' : 'Көшіру'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
