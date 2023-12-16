
import constants from './uspto/constants';
import {extractHrefs} from './uspto/scraper'
import {fetchFiles} from './uspto/fetcher'

async function runUsptoWorkflow() {
  try {    
    console.log('Scraped URLs:', constants.downloadUrl);
    const usptoUrls = await extractHrefs(constants.downloadUrl, constants.cssSelector);
    const slicedusptoUrls = usptoUrls.slice(0,1);

    await fetchFiles(slicedusptoUrls, './data/');
    console.log('Downloaded files successfully.');


    console.log('Uspto workflow completed successfully!', usptoUrls);
  } catch (error: any) {
    console.error('Error in Uspto workflow:', error.message);
  }
}

runUsptoWorkflow();
