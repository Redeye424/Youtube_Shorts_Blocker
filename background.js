let ShortWatchedInARow = 0;
let ComingFromRedirect = false;

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
        ComingFromRedirect = false;
    }

    if (url === 'https://homework42.pythonanywhere.com/Youtube_Shorts_Blocker') {
        ComingFromRedirect = true;
    }

    if (url.pathname.startsWith('/shorts/')) {
        if (ComingFromRedirect) {
            chrome.tabs.update(tabId, {
                url: 'https://homework42.pythonanywhere.com/Youtube_Shorts_Blocker'
            });
            return;
        }
        ShortWatchedInARow++;

        console.log("Shorts watched:", ShortWatchedInARow);
    }
    if (ShortWatchedInARow >= 2) {
        ShortWatchedInARow = 0;
        ComingFromRedirect = true;
        chrome.tabs.update(tabId, {
            url: 'https://homework42.pythonanywhere.com/Youtube_Shorts_Blocker'
        });
    }
});