/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches the block name and variant
  const headerRow = ['Columns (columns15)'];

  // The deeply nested structure has a main columns container
  // We want to extract the two visual columns: left (text) and right (image)
  // Let's find the two column containers by traversing down to the node that has exactly two children
  let columnsContainer = element;
  let found = false;
  // Traverse up to 8 levels deep
  for (let i = 0; i < 8 && !found; i++) {
    // Find the first child that has exactly two children
    let next = null;
    for (const child of columnsContainer.children) {
      if (child.children && child.children.length === 2) {
        next = child;
        found = true;
        break;
      }
    }
    if (next) {
      columnsContainer = next;
    } else if (columnsContainer.children.length === 1) {
      columnsContainer = columnsContainer.children[0];
    }
  }
  // Now columnsContainer should be the container with two columns as children
  let col1 = null, col2 = null;
  if (columnsContainer && columnsContainer.children && columnsContainer.children.length === 2) {
    col1 = columnsContainer.children[0];
    col2 = columnsContainer.children[1];
  } else {
    // fallback: take first two child divs at any level
    const divs = element.querySelectorAll('div');
    if (divs.length >= 2) {
      col1 = divs[0];
      col2 = divs[1];
    }
  }

  // If either col is missing, fill with empty div to preserve columns structure
  if (!col1) {
    col1 = document.createElement('div');
  }
  if (!col2) {
    col2 = document.createElement('div');
  }

  // Table structure: header, then one row with two columns
  const cells = [headerRow, [col1, col2]];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the table
  element.replaceWith(table);
}
