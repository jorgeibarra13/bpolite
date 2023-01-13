(() => {
  document.addEventListener("mouseup", async(e) => {
    const isEditable = isElementEditable(document.activeElement);

    chrome.runtime.sendMessage({
      isEditable,
    });
  });

  const isElementEditable = (activeElement) => {
    const nodeName = activeElement?.nodeName?.toLocaleLowerCase();
    if (activeElement.isEditable || activeElement.contentEditable == 'true' || nodeName == 'input' || nodeName == 'textarea') return true;
    else if (nodeName == 'p' || nodeName == 'div' || nodeName == 'body') return false; 
  }

  const replaceSelectionWithText = (text) => {
    const activeElement = document.activeElement;
    if (activeElement.value && (typeof activeElement.selectionStart === 'number' && typeof activeElement.selectionEnd === 'number')) {
      // replace using active element
      var start = activeElement.selectionStart;
      var end = activeElement.selectionEnd;

      var before = activeElement.value.slice(0, start);
      var after = activeElement.value.slice(end);

      var text = before + text + after;
      activeElement.value = text;
    } else {
      // replace using value selection
      const selection = document.getSelection();
      const node = selection.focusNode;
  
      if (!node) return;
      var start = selection.focusOffset;
      var end = selection.anchorOffset;
  
      var before = node.textContent.slice(0, start);
      var after = node.textContent.slice(end);
  
      var text = before + text + after;
      node.textContent = text;
    }
  }

  chrome.runtime.onMessage.addListener((message, _sender, response) => {
    const { text } = message;
    replaceSelectionWithText(text);
    response();
  });
})();