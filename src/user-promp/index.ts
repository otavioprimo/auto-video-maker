import * as prompts from 'prompts';
import * as clc from 'cli-color';

import Trend from '../models/trend.interface';
import ContentSearch from '../models/content-search.interface';

const prefixChoices = [
  {
    title: 'Who is',
    value: 'Who is'
  },
  {
    title: 'What is',
    value: 'What is'
  },
  {
    title: 'The history of',
    value: 'The history of'
  }
];

class Prompts {
  constructor () { }

  /**
 * @description Ask if the user would like to get Daily Google Trands,Search for a Keyword on Google Trends or Write something
 * @returns Promise<string>
 */
  public async askGoogleTrendsOrWrite(): Promise<string> {
    const question: any = {
      type: 'select',
      name: 'choice',
      message: clc.green('Would you like:'),
      choices: [
        {
          title: 'Get top daily Google Trends',
          value: 'googleTrends'
        },
        {
          title: 'Search by a topic on Google trends',
          value: 'gooogleTrendsCategory'
        },
        {
          title: 'Write by myself',
          value: 'write'
        },
      ],
      validate: value => typeof value === 'string' ? value.trim() !== '' : false
    };

    return new Promise(async (resolve, reject) => {
      const promptOptions = {
        onCancel: () => reject(new Error(clc.redBright('The user has stopped answer')))
      }

      const response = await prompts(question, promptOptions);
      resolve(response['choice']);
    });
  }

  /**
   * @description Ask which trend the user would like to choice
   * @param trends 
   * @returns Promise<ContentSearch>
   */
  public async askWhichGoogleTrendAndPrefix(trends: Trend[]): Promise<ContentSearch> {
    let choices: any[] = [];

    for (let el of trends) {
      let title = `${el.title}`;

      if (el.type)
        title += ` - Type: ${el.type}`;

      if (el.formattedTraffic)
        title += ` - Date: ${el.formattedTraffic}`;

      choices.push({
        title: title,
        value: el.title
      });
    }

    const question: any = [
      {
        type: 'select',
        name: 'searchTerm',
        message: clc.green('Which trend would you like to choice?'),
        choices: choices,
        validate: value => typeof value === 'string' ? value.trim() !== '' : false
      },
      {
        type: 'select',
        name: 'prefix',
        message: clc.green('Choose a prefix:'),
        choices: prefixChoices,
        validate: value => typeof value === 'string' ? value.trim() !== '' : false
      }
    ]

    return new Promise(async (resolve, reject) => {
      const promptOptions = {
        onCancel: () => reject(new Error(clc.redBright('The user has stopped answer')))
      }

      const response: ContentSearch = await prompts(question, promptOptions);
      resolve(response);
    });
  }

  /**
 * @description Ask to the user to get the prefix and search term
 * @returns Promise<ContentSearch>
 */
  public async  askSearchTermAndPrefix(): Promise<ContentSearch> {
    const questions: any = [
      {
        type: 'text',
        name: 'searchTerm',
        message: clc.green('Type a Wikipedia search term:'),
        validate: value => typeof value === 'string' ? value.trim() !== '' : false
      },
      {
        type: 'select',
        name: 'prefix',
        message: clc.green('Choose a prefix:'),
        choices: prefixChoices,
        validate: value => typeof value === 'string' ? value.trim() !== '' : false
      }
    ];

    return new Promise(async (resolve, reject) => {

      const promptOptions = {
        onCancel: () => reject(new Error(clc.redBright('The user has stopped answer')))
      }

      const response: ContentSearch = await prompts(questions, promptOptions);
      resolve(response);
    });
  }


  /**
 * @description Ask to write a category
 * @returns Promise<string>
 */
  public async askAndReturnCategory(): Promise<string> {
    const question: any = {
      type: 'text',
      name: 'category',
      message: clc.green('Type a topic to search on Google Trends:'),
      validate: value => typeof value === 'string' ? value.trim() !== '' : false
    };

    return new Promise(async (resolve, reject) => {
      const promptOptions = {
        onCancel: () => reject(new Error(clc.redBright('The user has stopped answer')))
      }

      const response: any = await prompts(question, promptOptions);
      resolve(response['category']);
    });
  }
}

export default new Prompts;