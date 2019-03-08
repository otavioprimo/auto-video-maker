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
    case 'write':
      writeSearch();
      break;
    default:
      break;
  }
}

async function getGoogleTrends() {
  let trends: Trend[] = await googleTrends.getHotTrends();
  let content = await userPromp.askWhichGoogleTrendAndPrefix(trends);

  console.log(content);
}

async function writeSearch() {
  const content = await userPromp.askSearchTermAndPrefix();
  console.log(content);
}



