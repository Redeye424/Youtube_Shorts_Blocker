const REDIRECT_URL = 'https://homework42.pythonanywhere.com/Youtube_Shorts_Blocker';
const REDIRECT_ORIGIN = 'https://homework42.pythonanywhere.com';
const REDIRECT_PATH = '/Youtube_Shorts_Blocker';
const tabStates = new Map();

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (!changeInfo.url) {
        return;
    }

    let url;
    try {
        url = new URL(changeInfo.url);
    } catch {
        return;
    }

    if (
        url.origin === REDIRECT_ORIGIN &&
        url.pathname.replace(/\/+$/, '') === REDIRECT_PATH
    ) {
        tabStates.set(tabId, { shortsWatchedInARow: 0, blocked: true });
        return;
    }

    const isYouTubeDomain =
        url.hostname === 'youtube.com' ||
        url.hostname === 'www.youtube.com' ||
        url.hostname === 'm.youtube.com';

    if (!isYouTubeDomain) {
        tabStates.set(tabId, { shortsWatchedInARow: 0, blocked: false });
        return;
    }

    if (!url.pathname.startsWith('/shorts/')) {
        const state = tabStates.get(tabId);
        if (state) {
            state.shortsWatchedInARow = 0;
        }
        return;
    }

    const state = tabStates.get(tabId) || {
        shortsWatchedInARow: 0,
        blocked: false
    };

    if (state.blocked) {
        chrome.tabs.update(tabId, { url: REDIRECT_URL });
        return;
    }

    state.shortsWatchedInARow++;
    console.log('Shorts watched:', state.shortsWatchedInARow);
    tabStates.set(tabId, state);

    if (state.shortsWatchedInARow >= 2) {
        state.shortsWatchedInARow = 0;
        state.blocked = true;
        chrome.tabs.update(tabId, { url: REDIRECT_URL });
    }
});

chrome.tabs.onRemoved.addListener((tabId) => {
    tabStates.delete(tabId);
});