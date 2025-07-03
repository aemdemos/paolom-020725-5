/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as in the example
  const rows = [['Cards']];

  // Each card is a direct child <div> of the root element
  const cardWrappers = element.querySelectorAll(':scope > div');
  cardWrappers.forEach(cardWrapper => {
    // Card content area: typically the second child <div>
    const cardContent = cardWrapper.children[1];
    if (!cardContent) return;

    // Image/Icon: first <img> descendant in cardContent, or empty string if not found
    const img = cardContent.querySelector('img') || '';

    // Collect all non-image direct child <div>s (contain text)
    const contentDivs = Array.from(cardContent.children).filter(div => !div.querySelector('img'));
    // Gather all text content blocks in order
    let textNodes = [];
    contentDivs.forEach(div => {
      // For each text container div, grab all childNodes (to keep elements and text nodes)
      div.childNodes.forEach(node => {
        // Only add non-empty nodes
        if (node.nodeType === Node.ELEMENT_NODE && node.textContent.trim()) {
          textNodes.push(node);
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          // Wrap text node in a <span> for DOMUtils compatibility
          const span = document.createElement('span');
          span.textContent = node.textContent;
          textNodes.push(span);
        }
      });
    });
    // Fallback: use innerText if somehow nothing was found
    if (textNodes.length === 0 && cardContent.innerText.trim()) {
      const span = document.createElement('span');
      span.textContent = cardContent.innerText.trim();
      textNodes = [span];
    }
    // Add the card row: image/icon, then block of text content
    rows.push([
      img,
      textNodes.length === 1 ? textNodes[0] : textNodes
    ]);
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
