(() => {
  window.onload = (_event) => {
    document.addEventListener("select", async() => {
      const isEditable = isElementEditable(document.activeElement.nodeName.toLocaleLowerCase());

      chrome.runtime.sendMessage({
        isEditable
      });
    })
  };

  const isElementEditable = (nodeName) => {
    if (nodeName == 'p' || nodeName == 'div' || nodeName == 'body') return false; 
    else if ( nodeName == 'input' || nodeName == 'textarea') return true;
  }

  const replaceSelectionWithText = (text) => {
    const textarea = document.activeElement;
    const nodeNameString = document.activeElement.nodeName.toLocaleLowerCase();

    if (!isElementEditable(nodeNameString)) return;
    if (typeof textarea.selectionStart === 'number' && typeof textarea.selectionEnd === 'number') {
      var start = textarea.selectionStart;
      var end = textarea.selectionEnd;

      var before = textarea.value.slice(0, start);
      var after = textarea.value.slice(end);

      var text = before + text + after;
      textarea.value = text;
    }
  }

  chrome.runtime.onMessage.addListener((message, _sender, response) => {
    const { text } = message;
    replaceSelectionWithText(text);
    response();
  });
})();