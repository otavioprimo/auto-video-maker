import userPromp from '../user-promp';
import googleTrends from '../google-trends';
import state from './state';

import ContentSearch from '../models/content-search.interface';
import GoogleTrendsConstants from '../constants/googleTrends';
import Trend from '../models/trend.interface';

async function robot() {
  const typeOfSearch = await userPromp.askGoogleTrendsOrWrite();
  let content: ContentSearch;

  switch (typeOfSearch) {
    case GoogleTrendsConstants.GOOGLE_TRENDS_DAILY:
      content = await getGoogleTrends();
      break;
    case GoogleTrendsConstants.GOOGLE_TRENDS_CATEGORY:
      content = await getGoogleTrendsByCategory();
      break;
    case GoogleTrendsConstants.WRITE:
      content = await writeSearch();
      break;
    default:
      break;
  }

  state.save(content);

  console.log(JSON.stringify(content, null, 4));
}

async function getGoogleTrends(): Promise<ContentSearch> {
  let trends: Trend[] = await googleTrends.getDailyTrends();
  let content = await userPromp.askWhichGoogleTrendAndPrefix(trends);

  return content;
}

async function writeSearch(): Promise<ContentSearch> {
  const content = await userPromp.askSearchTermAndPrefix();

  return content;
}

async function getGoogleTrendsByCategory(): Promise<ContentSearch> {
  let searchCategory = await userPromp.askAndReturnCategory();
  let trends: Trend[] = await googleTrends.getTrendsBySearchTerm(searchCategory);
  let content = await userPromp.askWhichGoogleTrendAndPrefix(trends);

  return content;
}

export default robot;