import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

export function ConstructorQRPreview({ link }) {
  const [dataUrl, setDataUrl] = useState('');
  useEffect(() => {
    if (link) {
      QRCode.toDataURL(link, { width: 120, margin: 1 }).then(setDataUrl).catch(() => {});
    }
  }, [link]);
  if (!dataUrl) return null;
  return (
    <>
      <img src={dataUrl} alt="QR Preview" />
      <div className="constructor-qr-preview-info">
        <strong>QR дайын!</strong>
        <p>Бұл QR-код мақала ішінде сақталып, оқырмандарға көрсетіледі.</p>
      </div>
    </>
  );
}
