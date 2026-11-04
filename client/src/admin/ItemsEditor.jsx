import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export function ItemsEditor({ block, onItemChange, onItemsChange }) {
  const items = block.items || [];
  const fields = block.type === 'stats'
    ? [['value', 'Мәні'], ['label', 'Атауы']]
    : block.type === 'cards'
      ? [['title', 'Карточка атауы'], ['meta', 'Қысқа белгі'], ['description', 'Түсіндірме']]
      : [['text', 'Тізім тармағы']];
  const emptyItem = Object.fromEntries(fields.map(([key]) => [key, '']));
  return (
    <div className="items-editor">
      <div className="items-editor-heading"><strong>{block.type === 'stats' ? 'Көрсеткіштер' : block.type === 'cards' ? 'Карточкалар' : 'Тізім тармақтары'}</strong><span>{items.length}</span></div>
      {items.map((item, index) => (
        <div className="item-edit-row" key={`${block.id}-${index}`}>
          <div className="item-edit-fields">{fields.map(([key, label]) => <label key={key}>{label}{key === 'description' || block.type === 'list' ? <textarea rows={2} value={item[key] || ''} onChange={(event) => onItemChange(index, key, event.target.value)} /> : <input value={item[key] || ''} onChange={(event) => onItemChange(index, key, event.target.value)} />}</label>)}</div>
          <button type="button" className="item-remove" onClick={() => onItemsChange(items.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Өшіру: ${index + 1}`}><Trash2 size={15} /></button>
        </div>
      ))}
      <button type="button" className="item-add-button" onClick={() => onItemsChange([...items, emptyItem])}><Plus size={15} /> Тағы қосу</button>
    </div>
  );
}

function toSlug(value) {
  const transliteration = {
    а: 'a', ә: 'a', б: 'b', в: 'v', г: 'g', ғ: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh', з: 'z', и: 'i', й: 'y',
    к: 'k', қ: 'q', л: 'l', м: 'm', н: 'n', ң: 'ng', о: 'o', ө: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u',
    ұ: 'u', ү: 'u', ф: 'f', х: 'kh', һ: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ъ: '', ы: 'y', і: 'i',
    ь: '', э: 'e', ю: 'yu', я: 'ya',
  };
  return value
    .toLocaleLowerCase()
    .replace(/[а-яёәғқңөұүһі]/g, (char) => transliteration[char] || char)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
