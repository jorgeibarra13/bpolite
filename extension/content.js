(() => {
  const replaceTextWithProcession = (procession) => {
    const selection = window.getSelection();

    if (selection.rangeCount) {
      range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(procession));
    }
  }

  chrome.runtime.onMessage.addListener((obj, _sender, response) => {
    const { procession } = obj;
    replaceTextWithProcession(procession);
    response();
  });
})();