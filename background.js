async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

// global variable should probably be a class property
let isContentEditable = false;

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "bpolite",
    title: "Make it polite",
    contexts: ["selection"],
    enabled: true,
  });
});

chrome.runtime.onMessage.addListener((obj, _sender, response) => {
  const { isEditable } = obj;
  isContentEditable = isEditable;
  response();
});

chrome.contextMenus.onClicked.addListener(async (clickData) => {
  const message = clickData?.selectionText;

  if (isContentEditable && clickData.menuItemId == "bpolite" && message) {
    const tab = await getCurrentTab();
    const baseUrl = "https://bpolite-backend.vercel.app/api/transform-text";
    const body = { message };

    chrome.contextMenus.update("bpolite", {
      enabled: false,
      title: "Make it polite (please wait...)",
    });

    fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    })
    .then(res => {
      if (res.status !== 200) {
        const error = new Error(JSON.stringify(res));
        throw error;
      }
      return res.json();
    })
    .then(res => {
      chrome.tabs.sendMessage(tab?.id,
        {
          text: res?.transformed_text
        }
      );
      chrome.contextMenus.update("bpolite", {
        title: "Make it polite",
        enabled: true,
      });
    })
    .catch((error) => {
      console.error(`Error message:${error.statusText}. Code:${error.status}. Error:${error}`);
    });
  }
});