import axios from 'axios';
import * as cheerio from 'cheerio';

async function extractHrefs(url: string, cssSelector: string): Promise<string[]> {
  try {
    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);

    const hrefs: string[] = [];
    $(cssSelector).each((i, elem) => {
      const anchor = $(elem).find('a');
      const href = anchor.attr('href');
      if (href && href.endsWith('.zip')) {
        hrefs.push(`${url}${href}`);
      }
    });

    return hrefs;
  } catch (error: any) {
    console.error('Error:', error.message);
    throw error;
  }
}

export { extractHrefs };
