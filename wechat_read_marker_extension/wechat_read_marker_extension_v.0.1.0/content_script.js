const EXTENSION_VERSION = chrome.runtime.getManifest().version;
const HEARTBEAT_INTERVAL_MS = 30000;
const START_RETRY_INTERVAL_MS = 5000;
const START_RETRY_MAX_MS = 10 * 60 * 1000;
const USER_ACTIVITY_RETRY_DEBOUNCE_MS = 1000;
const TITLE_KEY_LENGTH = 20;
const METADATA_WAIT_TIMEOUT_MS = 5000;
const METADATA_WAIT_INTERVAL_MS = 250;

let sessionId = null;
let sessionEnded = false;
let startSuppressed = false;
let startRetryTimer = null;
let startSuppressedAt = null;
let userActivityRetryTimer = null;
let startInFlight = false;
let activeStartedAt = Date.now();
let accumulatedActiveMs = 0;
let heartbeatTimer = null;
let maxScrollPercent = 0;

function titleKeyFor(title) {
  return String(title || '').slice(0, TITLE_KEY_LENGTH);
}

function cleanText(value) {
  return (value || '').replace(/\s+/g, ' ').trim();
}

function textFromSelector(selector) {
  const el = document.querySelector(selector);
  return el ? cleanText(el.textContent) : '';
}

function metaContent(selector) {
  const el = document.querySelector(selector);
  return el ? cleanText(el.content) : '';
}

function firstTextCandidate(candidates) {
  for (const candidate of candidates) {
    const value = cleanText(candidate.value);
    if (value) {
      return {
        value: value,
        source: candidate.source,
      };
    }
  }
  return {
    value: '',
    source: 'missing',
  };
}

function extractArticleMetadata() {
  const title = firstTextCandidate([
    { source: '#activity-name', value: textFromSelector('#activity-name') },
    { source: '.rich_media_title', value: textFromSelector('.rich_media_title') },
    { source: 'og:title', value: metaContent('meta[property="og:title"]') },
    { source: 'twitter:title', value: metaContent('meta[name="twitter:title"]') },
    { source: 'document.title', value: document.title },
  ]);
  const publisher = firstTextCandidate([
    { source: '#js_name', value: textFromSelector('#js_name') },
    { source: '#profileBt a', value: textFromSelector('#profileBt a') },
    { source: '.profile_nickname', value: textFromSelector('.profile_nickname') },
    { source: '.rich_media_meta_nickname', value: textFromSelector('.rich_media_meta_nickname') },
    { source: 'og:site_name', value: metaContent('meta[property="og:site_name"]') },
  ]);

  return {
    title_key: titleKeyFor(title.value),
    publisher: publisher.value,
    title_source: title.source,
    publisher_source: publisher.source,
    diagnostics: {
      title_len: title.value.length,
      publisher_len: publisher.value.length,
      title_source: title.source,
      publisher_source: publisher.source,
      has_activity_name: Boolean(document.querySelector('#activity-name')),
      has_js_name: Boolean(document.querySelector('#js_name')),
      has_content_container: Boolean(document.getElementById('js_content')),
      has_js_image_content: Boolean(document.querySelector('#js_image_content')),
      has_js_image_desc: Boolean(document.querySelector('#js_image_desc')),
    },
  };
}

function waitForArticleMetadata() {
  return new Promise((resolve) => {
    const startedAt = Date.now();
    let best = extractArticleMetadata();

    function poll() {
      const current = extractArticleMetadata();
      if (current.title_key.length >= best.title_key.length || current.publisher) {
        best = current;
      }
      if (current.title_key && current.publisher) {
        resolve(current);
        return;
      }
      if (Date.now() - startedAt >= METADATA_WAIT_TIMEOUT_MS) {
        resolve(best);
        return;
      }
      window.setTimeout(poll, METADATA_WAIT_INTERVAL_MS);
    }

    poll();
  });
}

function isWeChatArticlePage() {
  return location.pathname.startsWith('/s') || Boolean(extractArticleMetadata().title_key);
}

function getScrollPercent() {
  const doc = document.documentElement;
  const scrollable = Math.max(1, doc.scrollHeight - window.innerHeight);
  const percent = Math.round((window.scrollY / scrollable) * 100);
  maxScrollPercent = Math.max(maxScrollPercent, Math.min(100, Math.max(0, percent)));
  return maxScrollPercent;
}

function currentActiveMs() {
  if (activeStartedAt === null) {
    return accumulatedActiveMs;
  }
  return accumulatedActiveMs + Math.max(0, Date.now() - activeStartedAt);
}

function pauseActiveTimer() {
  if (activeStartedAt !== null) {
    accumulatedActiveMs = currentActiveMs();
    activeStartedAt = null;
  }
}

function resumeActiveTimer() {
  if (activeStartedAt === null) {
    activeStartedAt = Date.now();
  }
}

function resetActiveTimer() {
  accumulatedActiveMs = 0;
  activeStartedAt = Date.now();
}

function activeDurationSec() {
  return Math.max(0, Math.round(currentActiveMs() / 1000));
}

function post(endpoint, payload) {
  return chrome.runtime.sendMessage({
    type: 'read-marker-api',
    endpoint,
    payload,
  });
}

async function pingExtension() {
  await post('/extension/ping', { version: EXTENSION_VERSION });
}

async function startReading() {
  if (!isWeChatArticlePage() || sessionId || sessionEnded || startInFlight) {
    return;
  }
  startInFlight = true;
  try {
    await pingExtension();
    const metadata = await waitForArticleMetadata();
    if (!metadata.title_key) {
      console.warn('Read marker skipped start: missing title metadata');
      return;
    }
    const response = await post('/reading/start', {
      url: location.href,
      title_key: metadata.title_key,
      publisher: metadata.publisher,
    });
    if (response?.ok && response.data?.status === 'suppressed') {
      handleSuppressedStart();
      return;
    }
    if (response?.ok && response.data?.session_id) {
      sessionId = response.data.session_id;
      sessionEnded = false;
      startSuppressed = false;
      startSuppressedAt = null;
      clearStartRetryTimer();
      resetActiveTimer();
      if (document.hidden) {
        pauseActiveTimer();
      } else {
        resumeActiveTimer();
      }
    }
  } finally {
    startInFlight = false;
  }
}

function handleSuppressedStart() {
  if (!startSuppressed) {
    startSuppressedAt = Date.now();
  }
  startSuppressed = true;
  scheduleStartRetry();
}

function clearStartRetryTimer() {
  if (startRetryTimer) {
    clearTimeout(startRetryTimer);
    startRetryTimer = null;
  }
  if (userActivityRetryTimer) {
    clearTimeout(userActivityRetryTimer);
    userActivityRetryTimer = null;
  }
}

function scheduleStartRetry(delayMs = START_RETRY_INTERVAL_MS) {
  if (!startSuppressed || sessionId || sessionEnded) {
    return;
  }
  if (startRetryTimer) {
    clearTimeout(startRetryTimer);
  }
  startRetryTimer = window.setTimeout(() => {
    startRetryTimer = null;
    retrySuppressedStart().catch(() => {
      scheduleStartRetry();
    });
  }, delayMs);
}

async function retrySuppressedStart() {
  if (!startSuppressed || sessionId || sessionEnded || !isWeChatArticlePage()) {
    return;
  }
  if (startSuppressedAt && Date.now() - startSuppressedAt > START_RETRY_MAX_MS) {
    startSuppressed = false;
    startSuppressedAt = null;
    clearStartRetryTimer();
    return;
  }
  await startReading();
  if (startSuppressed && !sessionId) {
    scheduleStartRetry();
  }
}

function noteUserActivity() {
  if (!startSuppressed || sessionId || sessionEnded) {
    return;
  }
  if (userActivityRetryTimer) {
    clearTimeout(userActivityRetryTimer);
  }
  userActivityRetryTimer = window.setTimeout(() => {
    userActivityRetryTimer = null;
    retrySuppressedStart().catch(() => {});
  }, USER_ACTIVITY_RETRY_DEBOUNCE_MS);
}

async function sendHeartbeat(tabStatus = 'reading') {
  if (!sessionId) {
    return;
  }
  await pingExtension();
  await post('/reading/heartbeat', {
    session_id: sessionId,
    scroll_percent: getScrollPercent(),
    active_duration_sec: activeDurationSec(),
    tab_status: tabStatus,
  });
}

function endReading() {
  if (!sessionId || sessionEnded) {
    return;
  }
  pauseActiveTimer();
  const finishedSessionId = sessionId;
  sessionEnded = true;
  sessionId = null;
  post('/reading/end', {
    session_id: finishedSessionId,
    scroll_percent: getScrollPercent(),
    active_duration_sec: activeDurationSec(),
  }).catch(() => {});
}

if (location.hostname === 'mp.weixin.qq.com' && isWeChatArticlePage()) {
  startReading().catch(() => {});
  heartbeatTimer = setInterval(() => {
    if (!document.hidden) {
      sendHeartbeat('reading').catch(() => {});
    }
  }, HEARTBEAT_INTERVAL_MS);
  window.addEventListener('scroll', () => {
    getScrollPercent();
    noteUserActivity();
  }, { passive: true });
  window.addEventListener('mousemove', noteUserActivity, { passive: true });
  window.addEventListener('pointerdown', noteUserActivity, { passive: true });
  window.addEventListener('keydown', noteUserActivity);
  window.addEventListener('beforeunload', () => {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
    }
    clearStartRetryTimer();
    endReading();
  });
  window.addEventListener('pagehide', () => {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
    }
    clearStartRetryTimer();
    endReading();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      pauseActiveTimer();
      sendHeartbeat('background').catch(() => {});
    } else {
      resumeActiveTimer();
      noteUserActivity();
    }
  });
}
