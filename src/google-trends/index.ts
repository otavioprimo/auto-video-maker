import * as googleTrends from 'google-trends-api';
import * as clc from 'cli-color';

import Trend from '../models/trend.interface';

class GoogleTrends {
  constructor () { }

  public getDailyTrends(): Promise<Trend[]> {
    let trends: Trend[] = [];

    let trendsSettings = {
      trendDate: new Date(),
      geo: 'BR',
      hl: "pt-BR"
    }
    return new Promise(async (resolve, reject) => {
      try {
        let response: any = await googleTrends.dailyTrends(trendsSettings);
        let parsedResponse = JSON.parse(response)['default']['trendingSearchesDays'][0];

        let formattedDate = parsedResponse['formattedDate'];
        let hotTrends = parsedResponse['trendingSearches'];

        console.log(clc.green(`\n\nGetting results from ${formattedDate}`));

        for (let el of hotTrends) {
          let trend: Trend = {
            title: el.title.query,
            formattedTraffic: el.formattedTraffic
          }

          trends.push(trend);
        }

        resolve(trends);
      } catch (err) {
        reject(err);
      }
    });
  }

  public getTrendsByCategory(searchTerm): Promise<Trend[]> {
    let trends: Trend[] = [];
    let today = new Date();
    let thisWeek = new Date();

    thisWeek.setDate(today.getDate() - 7); //Get trends of the past 7 days

    let trendsSettings = {
      keyword: searchTerm,
      geo: 'BR',
      hl: 'pt-BR',
      startTime: thisWeek,
      endTime: today
    }

    return new Promise(async (resolve, reject) => {
      try {
        let response: any = await googleTrends.relatedTopics(trendsSettings);
        let parsedResponse = JSON.parse(response)['default']['rankedList'][0]['rankedKeyword'];

        for (let el of parsedResponse) {; 
          let trend: Trend = {
            title: el.topic.title,
            type: el.topic.type
          }

          trends.push(trend);
        }
        
        resolve(trends);
      } catch (err) {
        reject(err);
      }
    });
  }
}

export default new GoogleTrends();