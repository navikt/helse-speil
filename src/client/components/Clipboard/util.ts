export const copyContentsToClipboard = (node: HTMLElement | undefined, textTransform: (s: string) => string) => {
    let didCopy = false;

    if (node) {
        node.contentEditable = 'true';
        const tempTextContents = node.innerText;
        node.innerText = textTransform(node.innerText);
        const range = document.createRange();
        range.selectNodeContents(node);

        const selection = window.getSelection();

        if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);

            didCopy = document.execCommand('copy');
            selection.removeAllRanges();
        }
        node.innerText = tempTextContents;
        node.contentEditable = 'false';
    }

    return didCopy;
};
