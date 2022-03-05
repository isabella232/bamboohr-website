import { formatDate, toClassName } from '../../scripts/scripts.js';

function applyClasses(styles, elements, prefix) {
  [...elements].forEach((row, i) => {
    row.classList.add(`${prefix}-${styles[i] || 'extra'}`);
  });
}

export default async function decorateArticleHeader($block, blockName) {
  applyClasses(['image', 'eyebrow', 'title', 'author-pub'], $block.children, blockName);
  applyClasses(['category', 'read-time'], $block.querySelector('.article-header-eyebrow').firstChild.children, blockName);
  applyClasses(['author', 'publication-date'], $block.querySelector('.article-header-author-pub').firstChild.children, blockName);

  // link author
  const $author = $block.querySelector(`.${blockName}-author`);
  const author = $author.textContent;
  const a = document.createElement('a');
  a.href = `/blog/author/${toClassName(author)}`;
  a.textContent = author;
  $author.textContent = '';
  $author.append(a);

  // format date
  const $pubdate = $block.querySelector(`.${blockName}-publication-date`);
  $pubdate.textContent = formatDate($pubdate.textContent);
}
