/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single cell (one-column), as per requirement.
  const headerRow = ['Columns (columns11)'];

  // To find the two columns, get the main content region (element)
  // The left column contains the number and the text; right column contains the image

  // Find all .textContents in the root element, but only the first three are part of the left cell
  const textBlocks = Array.from(element.querySelectorAll('.textContents'));

  // Compose left cell: number, heading, description (as seen in screenshot/example)
  const leftCell = document.createElement('div');
  textBlocks.slice(0, 3).forEach(el => leftCell.appendChild(el));

  // Compose right cell: find the first <img> in the element
  const img = element.querySelector('img');
  const rightCell = img || '';

  // Table rows: first row is header (1 col), second row is columns (2 col)
  const cells = [
    headerRow,
    [leftCell, rightCell]
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
