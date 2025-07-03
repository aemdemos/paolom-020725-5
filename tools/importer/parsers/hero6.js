/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match the block name exactly
  const headerRow = ['Hero (hero6)'];

  // There is no background image in the provided HTML, so second row is empty
  const backgroundRow = [''];

  // The content: get all textContents blocks (each contains a <p> with the text)
  // The desired result is all text content together in one cell, preserving their order
  // Use direct children of the top-level container (descend through nested divs to <p>s)
  const topInner = element.querySelector(':scope > div');
  let textPs = [];
  if (topInner) {
    // There may be multiple children; each is a text block
    const subChildren = topInner.querySelectorAll(':scope > div');
    subChildren.forEach((sub) => {
      const p = sub.querySelector('p');
      if (p) textPs.push(p);
    });
  }
  // If the above doesn't yield, fallback to searching for all direct <p>s in block
  if (textPs.length === 0) {
    const fallbackPs = element.querySelectorAll('p');
    fallbackPs.forEach((p) => textPs.push(p));
  }
  // Compose a wrapper div for all text content, referencing DOM nodes (not clones)
  let contentCell;
  if (textPs.length > 0) {
    const wrapper = document.createElement('div');
    textPs.forEach((el) => {
      wrapper.appendChild(el);
    });
    contentCell = wrapper;
  } else {
    contentCell = '';
  }

  const contentRow = [contentCell];

  // Compose table structure
  const cells = [
    headerRow,
    backgroundRow,
    contentRow
  ];

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
