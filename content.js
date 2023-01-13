

(() => {

  document.activeElement.addEventListener("select", async(e) => {
    if (!e.target.value) return;
    const isEditable = isElementEditable(document.activeElement);

    chrome.runtime.sendMessage({
      isEditable,
    });
  });

  const isElementEditable = (activeElement) => {
    const nodeName = activeElement?.nodeName?.toLocaleLowerCase();
    if (nodeName == 'p' || nodeName == 'div' || nodeName == 'body') return false; 
    else if (activeElement.isEditable || nodeName == 'input' || nodeName == 'textarea') return true;
  }

  const replaceSelectionWithText = (text) => {
    const activeElement = document.activeElement;

    if (!isElementEditable(activeElement)) return;
    if (typeof activeElement.selectionStart === 'number' && typeof activeElement.selectionEnd === 'number') {
      var start = activeElement.selectionStart;
      var end = activeElement.selectionEnd;

      var before = activeElement.value.slice(0, start);
      var after = activeElement.value.slice(end);

      var text = before + text + after;
      activeElement.value = text;
    }
  }

  chrome.runtime.onMessage.addListener((message, _sender, response) => {
    const { text } = message;
    replaceSelectionWithText(text);
    response();
  });
})();