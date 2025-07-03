/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified in the example: single column
  const headerRow = ['Columns (columns12)'];

  // Extract columns as before
  // 1. Extract number (left column)
  let col1 = null;
  const leftNum = element.querySelector(':scope > div:first-child .textContents');
  if (leftNum) {
    col1 = leftNum;
  }

  // 2. Extract heading and supporting text (middle column)
  let col2 = null;
  const allTextContents = Array.from(element.querySelectorAll('.textContents'));
  let col2Blocks = [];
  if (allTextContents.length > 1) {
    col2Blocks = allTextContents.slice(1, 3).filter(tc => tc.textContent && tc.textContent.trim());
  }
  if (col2Blocks.length) {
    col2 = document.createElement('div');
    col2Blocks.forEach(tc => col2.appendChild(tc));
  }

  // 3. Extract image (right column)
  let col3 = null;
  const imgs = Array.from(element.querySelectorAll('img'));
  if (imgs.length) {
    col3 = imgs[0];
  }

  // Compose the columns row, keeping all three columns
  const columnsRow = [col1, col2, col3].map(cell => cell || document.createElement('div'));

  // Assemble the table with a single-cell header row
  const cells = [headerRow, columnsRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
