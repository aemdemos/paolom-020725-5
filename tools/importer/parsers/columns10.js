/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must be exactly as in the example, single cell
  const headerRow = ['Columns (columns10)'];

  // The leftmost child is the decorative number and should be ignored
  // The actual content is in the second child (text + image)
  const children = element.querySelectorAll(':scope > div');
  if (children.length < 2) {
    // fallback - not enough content for two columns, just skip
    return;
  }
  // The second child contains the actual columns
  const columnWrapper = children[1];
  // In this wrapper, find all direct children (should be two main columns: text, image)
  let colCandidates = columnWrapper.querySelectorAll(':scope > div');
  // Some wrappers may have extra divs, so let's search for the deepest two main columns
  // Heuristic: One contains .textContents, the other contains an img
  let textCol = null, imageCol = null;
  colCandidates.forEach(div => {
    if (!textCol && div.querySelector('.textContents')) {
      textCol = div;
    }
    if (!imageCol && div.querySelector('img')) {
      imageCol = div;
    }
  });

  // If not found, try one more nesting layer
  if (!textCol || !imageCol) {
    const nextLayerCandidates = columnWrapper.querySelectorAll(':scope > div > div');
    nextLayerCandidates.forEach(div => {
      if (!textCol && div.querySelector('.textContents')) {
        textCol = div;
      }
      if (!imageCol && div.querySelector('img')) {
        imageCol = div;
      }
    });
  }

  // Compose the left column cell: combine all textContents elements (for semantic robustness)
  let leftContent = document.createElement('div');
  if (textCol) {
    const textBlocks = textCol.querySelectorAll('.textContents');
    textBlocks.forEach(tc => leftContent.appendChild(tc));
  }
  // If no text found, leave empty

  // Compose the right column cell: just the first img
  let rightContent = '';
  if (imageCol) {
    const img = imageCol.querySelector('img');
    if (img) rightContent = img;
  }

  const row = [leftContent, rightContent];
  const table = WebImporter.DOMUtils.createTable([headerRow, row], document);
  element.replaceWith(table);
}
