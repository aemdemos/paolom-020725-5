/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header as specified
  const headerRow = ['Hero (hero13)'];

  // 2. Extract the main Hero image (background image/decorative)
  // The image is deeply nested; let's get the first <img> descendant
  const imageEl = element.querySelector('img');
  const imageRow = [imageEl ? imageEl : ''];

  // 3. Extract the main text: headline, and CTA button (if exists)
  // Text (headline) is in a .textContents with a <p>
  let textContentEl = null;
  const textBlocks = Array.from(element.querySelectorAll('.textContents'));
  // Find the first .textContents with a <p> child, not inside a button
  for (const tb of textBlocks) {
    if (tb.querySelector('p')) {
      textContentEl = tb;
      break;
    }
  }

  // Find the CTA button (role="link")
  let ctaButton = null;
  const btn = element.querySelector('[role="link"]');
  if (btn) ctaButton = btn;

  // Compose the third row cell
  // If both exist, add both, else only available ones
  const textCell = [];
  if (textContentEl) textCell.push(textContentEl);
  if (ctaButton) textCell.push(ctaButton);
  // If neither exists, push empty string so the table always has 3 rows
  if (textCell.length === 0) textCell.push('');
  const textRow = [textCell];

  // Compose the block table
  const cells = [
    headerRow,
    imageRow,
    textRow,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
