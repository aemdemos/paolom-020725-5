/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row for the block table, must match exactly as given
  const headerRow = ['Hero (hero2)'];

  // 2. Extract the prominent image (first <img> found in the element tree)
  const img = element.querySelector('img');
  // Defensive: If no image, use null (cell must be present)
  const imgCell = img || '';

  // 3. Gather main text content: Title, Subheading, Description, CTAs
  // We'll use a broad strategy: find top-level text containers with text
  // The structure is: Title (first textContents), Description (second), then one or more CTAs (third+)
  const textContents = Array.from(element.querySelectorAll('.textContents'));
  const contentEls = [];

  // Title (often first textContents)
  if (textContents[0]) {
    contentEls.push(textContents[0]);
  }
  // Description (second textContents)
  if (textContents[1]) {
    contentEls.push(textContents[1]);
  }
  // CTAs (any further textContents, e.g. 1099 taxes, Dependents, Trust Taxes)
  for (let i = 2; i < textContents.length; i++) {
    contentEls.push(textContents[i]);
  }

  // If no content was found, cell must still exist (empty string as fallback)
  const contentCell = contentEls.length > 0 ? contentEls : '';

  // 4. Compose the table structure per spec (1 column, 3 rows, with exact header and all content)
  const cells = [
    headerRow,
    [imgCell],
    [contentCell],
  ];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // 5. Replace the original element with the new table
  element.replaceWith(blockTable);
}
