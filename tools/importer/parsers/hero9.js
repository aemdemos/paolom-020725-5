/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header
  const headerRow = ['Hero (hero9)'];

  // 2. Background/image row
  // Find first <img> in the element (background/hero visual)
  let img = element.querySelector('img');
  let imageRow = [''];
  if (img) {
    imageRow = [img];
  }

  // 3. Content row: collect headline, subheading, cta (in order)
  // New approach: get all immediate text blocks in order
  // Most text blocks use class 'textContents', so select them in order of appearance
  const textBlocks = Array.from(element.querySelectorAll('[class*="textContents"]'));
  // The button/'connect with our experts' is in a div[role=link], get its text
  let ctaLink = null;
  const ctaDiv = element.querySelector('div[role="link"]');
  if (ctaDiv) {
    // Sometimes the actual text is a textContents inside
    let ctaTextContainer = ctaDiv.querySelector('[class*="textContents"]');
    if (!ctaTextContainer) ctaTextContainer = ctaDiv;
    // Create a real <a> element for CTA for semantic meaning
    ctaLink = document.createElement('a');
    ctaLink.textContent = ctaTextContainer.textContent.trim();
    // If the CTA is actually a link, copy href, otherwise leave as '#'
    ctaLink.href = '#';
    // Optionally transfer ARIA role and tabindex
    if (ctaDiv.hasAttribute('role')) ctaLink.setAttribute('role', ctaDiv.getAttribute('role'));
    if (ctaDiv.hasAttribute('tabindex')) ctaLink.setAttribute('tabindex', ctaDiv.getAttribute('tabindex'));
  }

  // Build the content cell in order: heading, subheading, [CTA]
  // For the hero, the heading is usually the first text block, subheading second, CTA last
  const contentElements = [];
  if (textBlocks.length > 0) contentElements.push(textBlocks[0]);
  if (textBlocks.length > 1) contentElements.push(textBlocks[1]);
  if (ctaLink) contentElements.push(ctaLink);

  // Compose content row as a single cell
  const contentRow = [contentElements];

  // Build table and replace
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow
  ], document);
  element.replaceWith(table);
}
