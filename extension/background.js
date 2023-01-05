// chrome.notifications.create({title: "Title", message: "There is an time slot available", iconUrl: "icon.png", type: "basic"})
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      "id": "bpolite",
      "title": "Make it polite",
      "contexts": ["selection"],
    });
  });

chrome.contextMenus.onClicked.addListener((clickData) => {
    if (clickData.menuItemId == "bpolite" && clickData.selectionText) {
        console.log(clickData, clickData.selectionText);

        const secret = "";
        const baseUrl = "https://api.openai.com/v1/completions";
        const model = 'text-davinci-003';
        const prompt = `Give me a very clear and professional re-wording of the following paragraph: ${clickData.selectionText}`;
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
            res.choices.forEach(element => {
                console.log(element.text);
            });
            // chrome.notifications.create('NOTFICATION_ID', {
            //     type: 'basic',
            //     iconUrl: 'path',
            //     title: 'notification title',
            //     message: 'notification message',
            //     priority: 2
            // })
        });
    }
});