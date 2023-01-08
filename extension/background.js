chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    "id": "bpolite",
    "title": "Make it polite",
    "contexts": ["selection"],
  });
});

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

chrome.contextMenus.onClicked.addListener(async (clickData) => {
  if (clickData.menuItemId == "bpolite" && clickData.selectionText) {
    const tab = await getCurrentTab();
      const secret = "";
      const baseUrl = "https://api.openai.com/v1/completions";
      const model = 'text-ada-001';
      const prompt = `Give me a single, clear and professional re-wording of the following paragraph: ${clickData.selectionText}`;
      const body = {
          model: model,
          prompt: prompt,
          max_tokens: 250,
          temperature: 0
      }
  
      fetch(baseUrl, {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${secret}`,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
      })
      .then(response => response.json())
      .then(res => {
        chrome.tabs.sendMessage(tab.id,
          {
            // need some optional chaining in here 
            procession: res.choices[0].text
          }
        );
      });
  }
});