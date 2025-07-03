/* global WebImporter */
export default function parse(element, { document }) {
  // Find all immediate child divs
  const topDivs = Array.from(element.querySelectorAll(':scope > div'));

  let leftCol = null;
  let rightCol = null;

  // Identify left and right columns by inspecting their content
  for (const div of topDivs) {
    const text = div.textContent || '';
    if (!leftCol && /Graphic Designer|Commercial Photographer|Stylist/.test(text)) {
      // Find the deepest column container for left side
      leftCol = div.querySelector('.css-90m4i2') || div;
    }
    if (!rightCol && /Noble Finance|Managing my taxes|overwhelming/.test(text)) {
      // Look for testimonial container
      const testimonial = div.querySelector('.css-rt1aze') ? div.querySelector('.css-rt1aze').parentElement : div;
      rightCol = testimonial;
    }
  }
  // Fallbacks in case detection fails
  if (!leftCol && topDivs.length > 0) leftCol = topDivs[0];
  if (!rightCol && topDivs.length > 1) rightCol = topDivs[1];
  if (!leftCol) leftCol = document.createElement('div');
  if (!rightCol) rightCol = document.createElement('div');

  // Create a flex container to hold both columns (as a single cell)
  const flexContainer = document.createElement('div');
  flexContainer.style.display = 'flex';
  flexContainer.style.gap = '2em';
  flexContainer.append(leftCol, rightCol);

  const table = WebImporter.DOMUtils.createTable([
    ['Columns (columns5)'],
    [flexContainer]
  ], document);
  element.replaceWith(table);
}
