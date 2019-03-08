import * as googleTrends from 'google-trends-api';
import * as clc from 'cli-color';

import Trend from '../models/trend.interface';

class GoogleTrends {
  constructor () { }

  public getHotTrends(): Promise<Trend[]> {
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
}

export default new GoogleTrends();