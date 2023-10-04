
const { createWriteStream } = require('fs');
const { SitemapStream } = require('sitemap');

const sitemap = new SitemapStream({ hostname: 'https:' });

const writeStream = createWriteStream('./public/sitemap.xml');

sitemap.pipe(writeStream);

sitemap.write({ url: '/', priority: 1 });
sitemap.write({ url: '/sign_in', priority: 1 });
sitemap.write({ url: '/sign_up', priority: 1 });
sitemap.write({ url: '/privacy', priority: 0.8 });
sitemap.write({ url: '/about', priority: 0.8 });
sitemap.write({ url: '/search', priority: 0.8 });
sitemap.write({ url: '/Terms-and-service', priority: 0.8 });
sitemap.write({ url: '/wishlist', priority: 0.5 });
sitemap.write({ url: '/mysession', priority: 0.8 });
sitemap.write({ url: '/settings', priority: 0.8 });
sitemap.write({ url: '/profession-signup', priority: 0.8 });
sitemap.write({ url: '/favourites', priority: 0.8 });

sitemap.end();