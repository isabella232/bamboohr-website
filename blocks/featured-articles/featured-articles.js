import { lookupArticles, createOptimizedPicture, toClassName } from '../../scripts/scripts.js';

function createCard(article) {
  const title = article.title.split(' - ')[0];
  const card = document.createElement('div');
  card.className = 'featured-articles-card';
  const pictureString = createOptimizedPicture(
    article.image,
    article.imageAlt,
    false, [{ width: 750 }],
  ).outerHTML;
  card.innerHTML = `<div class="featured-articles-card-header category-color-${toClassName(article.category)}">
    <span class="featured-articles-card-category">${article.category}</span> 
    <span class="featured-articles-card-readtime">${article.readTime || ''}</span>
    </div>
    ${pictureString}
    <div class="featured-articles-card-body">
    <h3>${title}</h3>
    <p>${article.description}</p>
    <p><a href="${article.path}">Read Now</a></p>
    </div>`;
  return (card);
}

export default async function decorate(block) {
  const rows = [...block.children];
  const contents = [];
  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    const [content, category] = [...row.children].map((e, j) => (j ? e.textContent : e));
    if (content.textContent.includes('://')) {
      // handle straight link
      const { pathname } = new URL(content.querySelector('a').href);
      // eslint-disable-next-line no-await-in-loop
      const articles = await lookupArticles([pathname]);
      if (articles.length) {
        const [article] = articles;
        if (category) article.category = category;
        const card = createCard(article);
        contents.push(card.outerHTML);
      }
    } else {
      contents.push(`<div class="featured-articles-card">${content.outerHTML}</div>`);
    }
  }
  const html = `
    <div class="featured-articles-row featured-articles-hero">${contents[0]}</div>
    <div class="featured-articles-row">
      <div class="featured-articles-col">${contents[1]}${contents[2]}</div>
      <div class="featured-articles-col">${contents[3]}${contents[4]}</div>
    </div>
    <div class="featured-articles-row">
    <div class="featured-articles-col">${contents[5]}${contents[6]}${contents[8]}${contents[9]}</div>
    <div class="featured-articles-col featured-articles-large">${contents[7]}</div>
    `;
  block.innerHTML = html;
}
