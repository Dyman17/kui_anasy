import React, { useState } from 'react';
import { ShieldCheck, UserCheck, LockKeyhole, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { API_ENABLED, loginEditor, loginSuperAdmin, registerEditor } from '../api';
import { BrandMark } from '../components/BrandMark';

export function AuthView({ onLoginSuccess, onExit }) {
  const [roleMode, setRoleMode] = useState('super');
  const [editorMode, setEditorMode] = useState('login');
  const [superToken, setSuperToken] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(API_ENABLED ? '' : 'Сервер (API) қосылмаған. Әкімші панеліне кіру үшін VITE_API_URL баптауы қажет.');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSuperSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');
    if (!superToken.trim()) {
      setError('Бас әкімшінің құпия кілтін енгізіңіз.');
      return;
    }
    setBusy(true);
    try {
      onLoginSuccess(await loginSuperAdmin(superToken));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleEditorSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (editorMode === 'register') {
      if (!fullName.trim() || !username.trim() || !password) {
        setError('Барлық өрістерді толтырыңыз.');
        return;
      }
      if (password.length < 8) {
        setError('Құпиясөз кемінде 8 таңба болуы керек.');
        return;
      }
    }

    setBusy(true);
    try {
      if (editorMode === 'login') {
        onLoginSuccess(await loginEditor({ username, password }));
      } else {
        await registerEditor({ fullName, username, password });
        setNotice('Өтінішіңіз сәтті қабылданды! Бас әкімші мақұлдағаннан кейін жүйеге кіре аласыз.');
        setEditorMode('login');
        setPassword('');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="brand">
          <BrandMark />
          <span className="brand-copy"><strong>Күй анасы</strong><small>КОНСТРУКТОРҒА КІРУ</small></span>
        </div>
        <button className="admin-exit" onClick={onExit} style={{ marginLeft: 'auto' }}>
          <ArrowLeft size={16} /> Сайтқа қайту
        </button>
      </header>

      <div className="auth-box">
        <h2 className="auth-box-title">Басқару жүйесі</h2>
        <p>Энциклопедия мазмұнын өңдеу немесе жаңа парақшалар енгізу үшін жүйеге кіріңіз.</p>

        <div className="auth-role-tabs">
          <button className={roleMode === 'super' ? 'active' : ''} onClick={() => { setRoleMode('super'); setError(''); setNotice(''); }}>
            <ShieldCheck size={16} /> Бас әкімші
          </button>
          <button className={roleMode === 'editor' ? 'active' : ''} onClick={() => { setRoleMode('editor'); setError(''); setNotice(''); }}>
            <UserCheck size={16} /> Редактор / Әкімші
          </button>
        </div>

        {error && <div className="editor-alert error-alert" style={{ marginBottom: '14px' }}>{error}</div>}
        {notice && <div className="editor-alert success-alert" style={{ marginBottom: '14px' }}><Check size={16} /> {notice}</div>}

        {roleMode === 'super' ? (
          <form className="auth-form" onSubmit={handleSuperSubmit}>
            <label>
              Бас әкімшінің құпия кілті (Master Secret Key)
              <input
                type="password"
                value={superToken}
                onChange={(e) => setSuperToken(e.target.value)}
                placeholder="Құпия кілтті енгізіңіз..."
                autoFocus
              />
            </label>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--muted)' }}>
              Бас әкімші құпия кілті қауіпсіздік параметрлерінде (Environment variable) сақталады. Барлық өкілеттікке ие.
            </p>
            <button type="submit" className="button button-dark" disabled={busy || !API_ENABLED}>{busy ? 'Тексерілуде…' : 'Кіру'}</button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleEditorSubmit}>
            {editorMode === 'register' && (
              <label>
                Аты-жөніңіз (ФИО)
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Мысалы: Айдос Смағұлов"
                  required
                />
              </label>
            )}
            <label>
              Логин
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="aidos"
                autoComplete="username"
                required
              />
            </label>
            <label>
              Құпиясөз
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={editorMode === 'login' ? 'current-password' : 'new-password'}
                minLength={editorMode === 'register' ? 8 : undefined}
                required
              />
            </label>

            <button type="submit" className="button button-dark" disabled={busy || !API_ENABLED}>
              {busy ? 'Тексерілуде…' : editorMode === 'login' ? 'Кіру' : 'Тіркелуге өтініш беру'}
            </button>

            <div className="auth-switch-mode">
              {editorMode === 'login' ? (
                <>Аккаунтыңыз жоқ па? <button type="button" onClick={() => { setEditorMode('register'); setError(''); }}>Тіркелу</button></>
              ) : (
                <>Бұрын тіркелгенсіз бе? <button type="button" onClick={() => { setEditorMode('login'); setError(''); }}>Кіру</button></>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
