/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two main columns (image + text)
  // Traverse down until we find a container with two children (columns)
  function findColumnsContainer(el) {
    if (el.children.length === 2) return el;
    for (const child of el.children) {
      const candidate = findColumnsContainer(child);
      if (candidate) return candidate;
    }
    return null;
  }
  const columnsContainer = findColumnsContainer(element);
  if (!columnsContainer) return;
  const [col1, col2] = columnsContainer.children;

  // Identify which is image col and which is text col
  let imgCol, textCol;
  if (col1.querySelector('img')) {
    imgCol = col1;
    textCol = col2;
  } else {
    imgCol = col2;
    textCol = col1;
  }

  // Compose the content for the text cell: heading, description, badges, all direct from DOM
  const textContent = [];
  // Try to find heading/title (first <p> inside textCol)
  const heading = textCol.querySelector('p');
  if (heading) textContent.push(heading);
  // Description (next <p> after heading)
  const paragraphs = textCol.querySelectorAll('p');
  if (paragraphs.length > 1) {
    textContent.push(paragraphs[1]);
  }
  // Badges/labels (add the parent div of the badges row if present)
  const badgesParent = textCol.querySelector('.css-szffps');
  if (badgesParent) textContent.push(badgesParent);

  // Build the cells array as per requirements:
  // Header row: a single cell, i.e. array with one string
  // Content row: one array with two elements (the two columns)
  const cells = [
    ['Columns (columns4)'],
    [imgCol, textContent]
  ];

  // Use createTable as required
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(table);
}
