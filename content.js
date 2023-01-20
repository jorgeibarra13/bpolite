let rootDiv;
let originalActiveElement;
let l, r;

const placeHolder = '[Making the selected text more polite...]';

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
      activeElement.value = originalActiveElement;
      // replace using active element
      var start = l;
      var end = r;

      var before = activeElement.value.slice(0, start);
      var after = activeElement.value.slice(end);

      var text = before + text + after;
      activeElement.value = text;
    } else {
      // replace using value selection (gmail)
      const node = document.getSelection()?.focusNode;
  
      if (!node) return;
      var start = l;
      var end = r;
  
      var before = originalActiveElement.slice(0, start);
      var after = originalActiveElement.slice(end);
  
      var text = before + text + after;
      node.textContent = text;
    }
  }

  const showLoader = () => {
    const activeElement = document.activeElement;

    if (activeElement.value && (typeof activeElement.selectionStart === 'number' && typeof activeElement.selectionEnd === 'number')) {
      originalActiveElement = activeElement.value;
      l = activeElement.selectionStart;
      r = activeElement.selectionEnd;

      activeElement.value = placeHolder;
    } else {
      const selection = document.getSelection();
      const node = selection.focusNode;

      originalActiveElement = node.textContent;
      l = selection.focusOffset;
      r = selection.anchorOffset;
      node.textContent = placeHolder;
    }

    if (l > r) {
      let tmp = r;
      r = l;
      l = tmp;
    }
  }

  chrome.runtime.onMessage.addListener((message, _sender, response) => {
    const { text, requestStarted  } = message;
    requestStarted && showLoader();
    text && replaceSelectionWithText(text);
    response();
  });
})();