import { resolve } from 'url';

const patentProviderUrl: string = "https://bulkdata.uspto.gov/data/patent/";
const applicationPatentsPath: string = "application/redbook/fulltext/2006/";
const cssSelector: string = "table tr td"
const constants = {
  patentProviderUrl,
  applicationPatentsPath,
  cssSelector,
  downloadUrl: resolve(patentProviderUrl, applicationPatentsPath)
};

export default constants;
