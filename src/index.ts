import * as clc from 'cli-color';
import googleTrends from './google-trends';
import userPromp from './user-promp';

import Trend from './models/trend.interface';
import textRobot from './robots/text';
import ContentSearch from './models/content-search.interface';
import GoogleTrendsConstants from './constants/googleTrends';

const robots = {
  text: textRobot
}

start();

async function start() {
  try {
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

    await robots.text(content);
    console.log(JSON.stringify(content, null, 4));
  } catch (error) {
    console.log(clc.red(error));
  }
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


