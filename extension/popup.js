var button = document.getElementById("loginButton");

button.addEventListener("click", function(e){
    e.preventDefault();

    const secret = "";
    const baseUrl = "https://api.openai.com/v1/completions";
    const model = 'text-davinci-003'; // see models and pick one to use
    const prompt = 'Give me a very clear and professional re-wording of the following paragraph: My food is too spicy!';
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
    
});