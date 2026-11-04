import React, { useState } from 'react';
import { ShieldCheck, UserCheck, LockKeyhole, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { loginEditor, registerEditor, verifySuperAdmin } from '../api';

export function AuthView({ onLoginSuccess, onExit }) {
  const [roleMode, setRoleMode] = useState('super');
  const [editorMode, setEditorMode] = useState('login');
  const [superToken, setSuperToken] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const handleSuperSubmit = (e) => {
    e.preventDefault();
    setError('');
    setNotice('');
    if (!superToken.trim()) {
      setError('Бас әкімшінің құпия кілтін енгізіңіз.');
      return;
    }
    if (verifySuperAdmin(superToken)) {
      onLoginSuccess({
        role: 'SUPER_ADMIN',
        fullName: 'Бас әкімші',
        token: superToken.trim(),
      });
    } else {
      setError('Құпия кілт қате. Қайта тексеріп көріңіз.');
    }
  };

  const handleEditorSubmit = (e) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (editorMode === 'login') {
      try {
        const account = loginEditor({ username, password });
        onLoginSuccess({
          role: 'EDITOR',
          id: account.id,
          fullName: account.fullName,
          username: account.username,
        });
      } catch (err) {
        setError(err.message);
      }
    } else {
      if (!fullName.trim() || !username.trim() || !password.trim()) {
        setError('Барлық өрістерді толтырыңыз.');
        return;
      }
      try {
        registerEditor({ fullName, username, password });
        setNotice('Өтінішіңіз сәтті қабылданды! Бас әкімші мақұлдағаннан кейін жүйеге кіре аласыз.');
        setEditorMode('login');
        setPassword('');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="brand">
          <span className="brand-mark">К</span>
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
            <button type="submit" className="button button-dark">Кіру</button>
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
                required
              />
            </label>

            <button type="submit" className="button button-dark">
              {editorMode === 'login' ? 'Кіру' : 'Тіркелуге өтініш беру'}
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
