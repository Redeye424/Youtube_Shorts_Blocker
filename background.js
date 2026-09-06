let ShortWatchedInARow = 0;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (!changeInfo.url) {
        return;
    }

    const url = new URL(changeInfo.url);

    const isYouTubeDomain =
        url.hostname === 'youtube.com' ||
        url.hostname === 'www.youtube.com';

    if (!isYouTubeDomain) {
        return;
    }

    if (url.pathname.startsWith('/shorts/')) {
        ShortWatchedInARow++;

        console.log("Shorts watched:", ShortWatchedInARow);
    }

    if (ShortWatchedInARow >= 2) {
        ShortWatchedInARow = 0;

        chrome.tabs.update(tabId, {
            url: 'https://takeabreakbutton.com/break/koi-pond/'
        });
    }
});