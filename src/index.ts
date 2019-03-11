import googleTrends from './google-trends';
import userPromp from './user-promp';

import Trend from './models/trend.interface';

start();

async function start() {
  const typeOfSearch = await userPromp.askGoogleTrendsOrWrite();

  switch (typeOfSearch) {
    case 'googleTrends':
      getGoogleTrends();
      break;
    case 'gooogleTrendsCategory':
      getGoogleTrendsByCategory();
      break;
    case 'write':
      writeSearch();
      break;
    default:
      break;
  }
}

async function getGoogleTrends() {
  let trends: Trend[] = await googleTrends.getDailyTrends();
  let content = await userPromp.askWhichGoogleTrendAndPrefix(trends);

  console.log(content);
}

async function writeSearch() {
  const content = await userPromp.askSearchTermAndPrefix();
  console.log(content);
}

async function getGoogleTrendsByCategory() {
  let searchCategory = await userPromp.askAndReturnCategory();
  let trends: Trend[] = await googleTrends.getTrendsBySearchTerm(searchCategory);
  let content = await userPromp.askWhichGoogleTrendAndPrefix(trends);

  console.log(content);
}


