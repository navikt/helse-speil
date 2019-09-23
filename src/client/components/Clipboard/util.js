export const copyContentsToClipboard = node => {
    node.contentEditable = true;
    const range = document.createRange();
    range.selectNodeContents(node);

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    const didCopy = document.execCommand('copy');
    selection.removeAllRanges();
    node.contentEditable = false;
    return didCopy;
};
