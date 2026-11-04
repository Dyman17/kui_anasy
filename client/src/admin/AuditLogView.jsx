import React, { useCallback, useEffect, useState } from 'react';
import { History, RefreshCw } from 'lucide-react';
import { getAuditLog } from '../api';
import './AuditLogView.css';

const PAGE_SIZE = 100;

const ACTION_LABELS = {
  'auth.login': 'Жүйеге кірді',
  'editor.register': 'Редактор тіркелуге өтініш берді',
  'editor.approve': 'Редакторға рұқсат берілді',
  'editor.delete': 'Редактор өшірілді',
  'page.create.publish': 'Бет жасалып, жарияланды',
  'page.create.submit': 'Жаңа бет қарауға жіберілді',
  'page.update.publish': 'Бет өңделіп, жарияланды',
  'page.update.submit': 'Өзгерістер қарауға жіберілді',
  'page.approve': 'Бет бекітілді',
  'page.bulk_approve': 'Пакеттік бекіту',
  'page.reject': 'Өзгерістер қабылданбады',
};

function describeChanges(details) {
  if (!details?.before || !details?.after) return '';
  const changes = [];
  if (details.before.title !== details.after.title) changes.push(`атауы: «${details.before.title}» → «${details.after.title}»`);
  if (details.before.description !== details.after.description) changes.push('сипаттамасы');
  if (details.before.parent_slug !== details.after.parent_slug) changes.push('бөлімі');
  const beforeBlocks = details.before.blocks || [];
  const afterBlocks = details.after.blocks || [];
  if (JSON.stringify(beforeBlocks) !== JSON.stringify(afterBlocks)) {
    changes.push(`модульдер (${beforeBlocks.length} → ${afterBlocks.length})`);
  }
  return changes.length ? `Өзгерген: ${changes.join(', ')}` : 'Мазмұн өзгермеді';
}

export function AuditLogView({ token, onApiError }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [target, setTarget] = useState('');

  const load = useCallback(async ({ append = false } = {}) => {
    setLoading(true);
    try {
      const before = append && entries.length ? entries[entries.length - 1].id : undefined;
      const rows = await getAuditLog(token, { before, target: target.trim() || undefined, limit: PAGE_SIZE });
      setEntries((current) => (append ? [...current, ...rows] : rows));
      setHasMore(rows.length === PAGE_SIZE);
    } catch (apiError) {
      onApiError(apiError);
    } finally {
      setLoading(false);
    }
  }, [token, target, entries, onApiError]);

  useEffect(() => {
    load();
    // Initial load only; filtering is applied by the form.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <main className="pages-manager">
      <div className="pages-manager-heading">
        <div>
          <span className="block-kicker">АУДИТ</span>
          <h1>Өзгерістер журналы</h1>
          <p>Кім, қашан және не өзгерткені туралы толық тарих. Жазбалар өшірілмейді.</p>
        </div>
      </div>

      <form
        className="audit-filter"
        onSubmit={(event) => {
          event.preventDefault();
          load();
        }}
      >
        <label>
          Бет сілтемесі бойынша сүзу
          <input value={target} onChange={(event) => setTarget(event.target.value)} placeholder="мысалы: people-kuyshi" />
        </label>
        <button type="submit" className="button button-outline" disabled={loading}>
          <RefreshCw size={15} /> Жаңарту
        </button>
      </form>

      {entries.length === 0 && !loading ? (
        <div className="pages-empty">
          <History size={34} />
          <h2>Жазбалар жоқ</h2>
        </div>
      ) : (
        <ol className="audit-list">
          {entries.map((entry) => (
            <li key={entry.id} className="audit-entry">
              <time dateTime={entry.at}>{new Date(entry.at).toLocaleString()}</time>
              <div className="audit-entry-body">
                <strong>{ACTION_LABELS[entry.action] || entry.action}</strong>
                <span className="audit-actor">
                  {entry.actor}
                  {entry.role === 'SUPER_ADMIN' ? ' · Бас әкімші' : entry.role === 'EDITOR' ? ' · Редактор' : ''}
                </span>
                {entry.target && <code>/{entry.target}</code>}
                {entry.summary && <p>{entry.summary}</p>}
                {entry.details?.before && <p className="audit-diff">{describeChanges(entry.details)}</p>}
              </div>
            </li>
          ))}
        </ol>
      )}

      {hasMore && (
        <button type="button" className="button button-outline audit-more" disabled={loading} onClick={() => load({ append: true })}>
          {loading ? 'Жүктелуде…' : 'Тағы жүктеу'}
        </button>
      )}
    </main>
  );
}
