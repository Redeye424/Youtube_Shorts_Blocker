let ShortWatchedInARow = 0;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (!changeInfo.url) {
        return;
    }

    let url;

    try {
        url = new URL(changeInfo.url);
    } catch {
        return;
    }

    const isYouTubeDomain =
        url.hostname === 'youtube.com' ||
        url.hostname === 'www.youtube.com';

    if (!isYouTubeDomain) {
        return;
    }

    if (url.pathname.startsWith('/shorts/')) {
        ShortWatchedInARow++;
    } else {
        ShortWatchedInARow = 0;
    }

    if (ShortWatchedInARow >= 2) {
        ShortWatchedInARow = 0;

        chrome.tabs.update(tabId, {
            url: 'https://homework42.pythonanywhere.com/Youtube_Shorts_Blocker'
        });
    }
});