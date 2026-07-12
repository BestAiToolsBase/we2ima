const API_BASE = 'http://localhost:17301';

const ALLOWED_ENDPOINTS = new Set([
  '/extension/ping',
  '/reading/start',
  '/reading/heartbeat',
  '/reading/end',
]);

async function postToApi(endpoint, payload) {
  if (!ALLOWED_ENDPOINTS.has(endpoint)) {
    throw new Error(`Endpoint is not allowed: ${endpoint}`);
  }
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload || {}),
  });
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  return response.json();
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message) {
    return false;
  }

  if (message.type !== 'read-marker-api') {
    return false;
  }

  postToApi(message.endpoint, message.payload)
    .then((data) => sendResponse({ ok: true, data }))
    .catch((error) => sendResponse({ ok: false, error: String(error.message || error) }));
  return true;
});
