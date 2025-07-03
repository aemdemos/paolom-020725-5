/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Hero (hero1)'];

  // Find the hero image (background/decorative image)
  // Search for the first <img> inside a .css-bs1zwr block
  let img = element.querySelector('.css-bs1zwr img');

  // Extract main content: title, subheading, CTA
  // We'll look for all direct .textContents descendants in "text column"
  // Find the column that contains the heading and text (usually .css-faprkr or similar)
  let textColumn = null;
  const possibleTextCols = element.querySelectorAll('.css-faprkr');
  if (possibleTextCols.length) {
    textColumn = possibleTextCols[0];
  } else {
    // fallback: find the first .textContents parent
    const firstText = element.querySelector('.textContents');
    if (firstText) textColumn = firstText.parentElement;
  }

  // Get all .textContents blocks in the text column (if available), otherwise from root
  let textBlocks = [];
  if (textColumn) {
    textBlocks = Array.from(textColumn.querySelectorAll('.textContents'));
  }
  if (!textBlocks.length) {
    textBlocks = Array.from(element.querySelectorAll('.textContents'));
  }

  // The first block is likely the title, the second possibly subheading
  // We'll preserve their order and structure

  // For CTA: look for the [role="link"] block (usually a styled div)
  let cta = element.querySelector('[role="link"], .css-i5hyzd');
  let ctaPara = null;
  if (cta) {
    // Try to find text inside CTA element
    const ctaTextElem = cta.querySelector('.textContents p');
    let ctaText = '';
    if (ctaTextElem) ctaText = ctaTextElem.textContent.trim();
    if (ctaText) {
      // Create an anchor (since original is a clickable div, best semantic match is <a href="#">)
      const btn = document.createElement('a');
      btn.textContent = ctaText;
      btn.href = '#';
      btn.setAttribute('style', 'display:inline-block;padding:0.5em 1.25em;background:#2e4f21;color:#fff;border-radius:2em;text-decoration:none;font-weight:500;');
      ctaPara = document.createElement('p');
      ctaPara.appendChild(btn);
    }
  }

  // Build the content cell for row 3
  // Include all textBlocks in order, plus CTA if present
  // Add <br> between blocks for visual separation as in screenshot
  const contentCell = [];
  for (let i = 0; i < textBlocks.length; i++) {
    if (i > 0) contentCell.push(document.createElement('br'));
    contentCell.push(textBlocks[i]);
  }
  if (ctaPara) {
    contentCell.push(document.createElement('br'));
    contentCell.push(ctaPara);
  }

  // Build the final table array
  // Row 1: header, Row 2: image, Row 3: content
  const rows = [
    headerRow,
    [img ? img : ''],
    [contentCell]
  ];

  // Create and replace with block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
