/**
 * Minimal content script that marks the page so printmd.app
 * can detect the extension is installed.
 * Runs at document_start for earliest possible detection.
 */
document.documentElement.setAttribute('data-printmd-extension', '');
