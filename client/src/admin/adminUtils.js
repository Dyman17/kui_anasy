export function toSlug(value) {
  if (!value) return '';
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

export function moveBlock(draft, updateDraft, index, direction) {
  const blocks = [...draft.blocks];
  const [block] = blocks.splice(index, 1);
  blocks.splice(index + direction, 0, block);
  updateDraft('blocks', blocks);
}

export function createEmptyPage(position) {
  return {
    slug: '',
    title: '',
    description: '',
    position,
    parent_slug: 'people',
    lang: 'kk',
    status: 'pending',
    change_summary: '',
    blocks: [],
  };
}

export function createBlock(type) {
  const defaults = {
    heading: { title: 'Жаңа бөлім', body: '' },
    feature: { eyebrow: '', title: 'Ерекше тақырып', body: '' },
    quote: { title: 'Дереккөз', body: 'Дәйексөз мәтіні' },
    image: { title: '', body: 'Суретке түсіндірме', link: '' },
    list: { title: 'Тізім', body: '', items: [{ text: 'Жаңа тармақ' }] },
    stats: { title: 'Сандар', body: '', items: [{ value: '0', label: 'Көрсеткіш' }] },
    cards: { title: 'Карточкалар', body: '', items: [{ title: 'Карточка атауы', meta: 'Санат', description: 'Қысқаша түсіндірме' }] },
    callout: { eyebrow: 'НАЗАР АУДАРЫҢЫЗ', title: 'Екпінді блок', body: '', link: '', linkLabel: 'Толығырақ' },
    qr: { title: 'Сілтемені QR арқылы ашыңыз', body: '', link: '' },
  };
  return { id: crypto.randomUUID(), type, ...(defaults[type] || { title: '', body: '' }) };
}
