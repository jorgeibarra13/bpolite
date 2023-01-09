(() => {
  const replaceTextWithProcession = (procession) => {
    const textarea = document.activeElement;
    const nodeName = document.activeElement.nodeName.toLocaleLowerCase();

    if (nodeName.includes('input') || nodeName.includes('textarea')) {
      if(typeof textarea.selectionStart === 'number' && typeof textarea.selectionEnd === 'number') {
        // All browsers except IE
        var start = textarea.selectionStart;
        var end = textarea.selectionEnd;

        var before = textarea.value.slice(0, start);
        var after = textarea.value.slice(end);

        var text = before + procession + after;
        textarea.value = text;
      }
    } else {
      const selection = window.getSelection();

      if (selection.rangeCount) {
        range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(procession));
      }
    }
  }

  chrome.runtime.onMessage.addListener((obj, _sender, response) => {
    const { procession } = obj;
    replaceTextWithProcession(procession);
    response();
  });
})();