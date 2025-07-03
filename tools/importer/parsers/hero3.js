/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header, as specified
  const headerRow = ['Hero (hero3)'];

  // 2. Find the image (background)
  // Use the first <img> in the entire block
  let img = element.querySelector('img') || '';

  // 3. Find the content container (title, subheading, badges, etc.)
  // The left content is always the deepest branch with multiple .textContents
  let contentArea = null;
  // Try to find all .textContents with direct <p> children
  const allTextContents = element.querySelectorAll('.textContents');
  if (allTextContents.length > 0) {
    // Find the set of consecutive .textContents at the top (usually 2: title and subtitle)
    // Use the first two .textContents that have a <p>
    let titleBlock = null;
    let subtitleBlock = null;
    let count = 0;
    for (let i = 0; i < allTextContents.length && count < 2; i++) {
      if (allTextContents[i].querySelector('p')) {
        if (count === 0) {
          titleBlock = allTextContents[i];
        } else if (count === 1) {
          subtitleBlock = allTextContents[i];
        }
        count++;
      }
    }

    // 4. Find the badges (if any)
    // Badges are in .css-szffps (look for .css-6adw30 inside)
    let badgesParent = element.querySelector('.css-szffps');
    let badgeBlocks = [];
    if (badgesParent) {
      badgeBlocks = Array.from(badgesParent.querySelectorAll('.css-6adw30 .textContents'));
    }

    // 5. Build content cell
    const cellFrag = document.createDocumentFragment();
    if (titleBlock) cellFrag.appendChild(titleBlock);
    if (subtitleBlock) cellFrag.appendChild(subtitleBlock);
    if (badgeBlocks.length) {
      // Wrap badges in a div for layout
      const badgeDiv = document.createElement('div');
      badgeBlocks.forEach(badge => badgeDiv.appendChild(badge));
      cellFrag.appendChild(badgeDiv);
    }
    contentArea = cellFrag;
  } else {
    // Fallback: no content found
    contentArea = '';
  }

  // 6. Compose rows for block table
  const rows = [
    headerRow,           // Header row
    [img],               // Image row
    [contentArea]        // Content row
  ];

  // 7. Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
