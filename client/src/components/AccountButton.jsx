import React, { useEffect, useId, useRef, useState } from 'react';
import { RiUser3Line } from 'react-icons/ri';
import { ACCOUNT_LABELS } from './headerLabels';

/**
 * Medallion: user icon in a gold ring.
 * Logged out: opens the admin entry (#admin). Logged in: opens a small account menu.
 */
export function AccountButton({ lang, sessionUser, onSessionUserChange }) {
  const labels = ACCOUNT_LABELS[lang] || ACCOUNT_LABELS.kk;
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const wrapRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onPointer);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const name = sessionUser?.fullName || labels.superAdmin;

  return (
    <div className="account-dropdown-wrap" ref={wrapRef}>
      <button
        ref={buttonRef}
        type="button"
        className={`header-medallion-btn ${sessionUser ? 'logged-in' : ''}`}
        onClick={() => {
          if (sessionUser) setOpen((value) => !value);
          else window.location.hash = '#admin';
        }}
        aria-expanded={sessionUser ? open : undefined}
        aria-controls={sessionUser ? menuId : undefined}
        aria-label={sessionUser ? `${labels.profile}: ${name}` : labels.login}
        title={sessionUser ? name : labels.login}
      >
        <RiUser3Line size={20} aria-hidden="true" />
      </button>

      {sessionUser && open && (
        <div className="account-popover-menu" id={menuId}>
          <div className="popover-user-info">
            <strong>{name}</strong>
            <span className="popover-role">{sessionUser.role === 'SUPER_ADMIN' ? labels.superAdmin : labels.editor}</span>
          </div>
          <button
            type="button"
            className="popover-item"
            onClick={() => { setOpen(false); window.location.hash = '#admin'; }}
          >
            {labels.admin}
          </button>
          <button
            type="button"
            className="popover-item"
            onClick={() => { setOpen(false); onSessionUserChange(null); }}
          >
            {labels.logout}
          </button>
        </div>
      )}
    </div>
  );
}
