let ShortWatchedInARow = 0;
let LastShortURL = "";

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
        url.hostname === "youtube.com" ||
        url.hostname === "www.youtube.com";

    if (!isYouTubeDomain) {
        return;
    }

    // User entered a YouTube Short
    if (url.pathname.startsWith("/shorts/")) {

        // Don't count the same Short multiple times
        if (changeInfo.url === LastShortURL) {
            return;
        }

        LastShortURL = changeInfo.url;
        ShortWatchedInARow++;

        console.log("Shorts watched in a row:", ShortWatchedInARow);

        // After 2 Shorts
        if (ShortWatchedInARow >= 2) {
            ShortWatchedInARow = 0;
            LastShortURL = "";

            chrome.tabs.update(tabId, {
                url: "https://homework42.pythonanywhere.com/Youtube_Shorts_Blocker"
            });
        }

    } else {
        // They left Shorts, so reset the streak
        ShortWatchedInARow = 0;
        LastShortURL = "";
    }
});