/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header exactly as in the example
  const headerRow = ['Hero (hero14)'];

  // 2. Extract image (SVG logo as decorative image, first <img> in the structure)
  let imageEl = null;
  const allImgs = element.querySelectorAll('img');
  if (allImgs.length > 0) {
    imageEl = allImgs[0];
  }

  // 3. Extract the content cell: headline, subheading, CTA, footer
  // Find all text blocks
  const textBlocks = element.querySelectorAll('.textContents');
  // The first text block is headline + subheading
  let mainTextBlock = null;
  if (textBlocks.length > 0) {
    mainTextBlock = textBlocks[0];
  }

  // Find CTA: either a link ("Services"), or a visually distinct button-text ("Book An Appointment")
  let ctaLink = null;
  let ctaText = null;

  // Look for a link (CTA)
  for (const tb of textBlocks) {
    const link = tb.querySelector('a');
    if (link && link.textContent.trim() !== '') {
      ctaLink = link;
      break;
    }
  }
  // Look for "Book An Appointment" as a call-to-action styled <p>
  let bookText = null;
  for (const tb of textBlocks) {
    const p = tb.querySelector('p');
    if (p && p.textContent.trim().toLowerCase().includes('book an appointment')) {
      bookText = p;
      break;
    }
  }

  // Compose content cell: use the existing elements
  const contentParts = [];
  if (mainTextBlock) {
    // Reference its children (paragraphs)
    Array.from(mainTextBlock.children).forEach(child => contentParts.push(child));
  }
  if (ctaLink && !contentParts.includes(ctaLink)) contentParts.push(ctaLink);
  if (bookText && !contentParts.includes(bookText)) contentParts.push(bookText);

  // Add the bottom copyright note if present (as in the source HTML)
  let copyrightBlock = null;
  for (const tb of textBlocks) {
    const p = tb.querySelector('p');
    if (p && /^© \d{4}/.test(p.textContent.trim())) {
      copyrightBlock = tb;
      break;
    }
  }
  if (copyrightBlock) {
    // Only add if it's not already included
    if (!contentParts.includes(copyrightBlock)) {
      contentParts.push(copyrightBlock);
    }
  }

  // If nothing found, at least add empty string to retain cell
  const contentCell = contentParts.length ? contentParts : [''];

  // 4. Compose the cells for the block table
  const cells = [
    headerRow,
    [imageEl ? imageEl : ''],
    [contentCell]
  ];

  // 5. Create and replace the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
