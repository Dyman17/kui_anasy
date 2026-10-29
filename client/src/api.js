const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/$/, '');

export async function getPages() {
  const response = await fetch(`${API_URL}/api/pages`);
  if (!response.ok) {
    throw new Error('Сайт деректерін жүктеу мүмкін болмады. Сервердің қосулы екенін тексеріңіз.');
  }
  return response.json();
}

export async function savePage(page, token) {
  const response = await fetch(`${API_URL}/api/pages/${encodeURIComponent(page.slug)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Token': token,
    },
    body: JSON.stringify(page),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || 'Өзгерістерді сақтау мүмкін болмады.');
  }
  return result;
}

export async function createPage(page, token) {
  const response = await fetch(`${API_URL}/api/pages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Token': token,
    },
    body: JSON.stringify(page),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || 'Бөлімді жасау мүмкін болмады.');
  }
  return result;
}
