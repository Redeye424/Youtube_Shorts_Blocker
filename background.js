const REDIRECT_URL = 'https://homework42.pythonanywhere.com/Youtube_Shorts_Blocker';
const REDIRECT_ORIGIN = 'https://homework42.pythonanywhere.com';
const REDIRECT_PATH = '/Youtube_Shorts_Blocker';
const shortsWatchedInARow = new Map();
let blockedByRedirect = false;

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
        blockedByRedirect = true;
        shortsWatchedInARow.delete(tabId);
        return;
    }

    const isYouTubeDomain =
        url.hostname === 'youtube.com' ||
        url.hostname === 'www.youtube.com' ||
        url.hostname === 'm.youtube.com';

    if (!isYouTubeDomain) {
        blockedByRedirect = false;
        shortsWatchedInARow.delete(tabId);
        return;
    }

    if (!url.pathname.startsWith('/shorts/')) {
        shortsWatchedInARow.delete(tabId);
        return;
    }

    if (blockedByRedirect) {
        chrome.tabs.update(tabId, { url: REDIRECT_URL });
        return;
    }

    const count = (shortsWatchedInARow.get(tabId) || 0) + 1;
    shortsWatchedInARow.set(tabId, count);
    console.log('Shorts watched:', count);

    if (count >= 2) {
        blockedByRedirect = true;
        shortsWatchedInARow.delete(tabId);
        chrome.tabs.update(tabId, { url: REDIRECT_URL });
    }
});

chrome.tabs.onRemoved.addListener((tabId) => {
    shortsWatchedInARow.delete(tabId);
});