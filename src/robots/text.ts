import * as algorithmia from 'algorithmia';
import * as SentenceBoundaryDetection from 'sbd';

import ora from 'ora';
import ContentSearch from "../models/content-search.interface";
import state from './state';

const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey;
const watsonApikey = require("../credentials/watson-nlu.json").apikey;

const NaturalLanguageUnderstandingV1 = require("watson-developer-cloud/natural-language-understanding/v1");

const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey: watsonApikey,
  version: '2018-04-05',
  url: 'https://gateway.watsonplatform.net/natural-language-understanding/api'
});

async function robot() {
  const content: ContentSearch = state.load();

  await fetchContentFromWikipedia(content)
  await sanitizeContent(content)
  await breakContentIntoSentences(content)
  await limitMaximumSentences(content);
  await fetchkeywordsOfAllSentences(content);

  state.save(content);

  async function fetchContentFromWikipedia(content: ContentSearch) {
    const spinner = ora({ color: 'cyan', text: `Fetchind wikipedia content about ${content.searchTerm}`, }).start();

    const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey);
    const wikipediaAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2');
    const wikipediaResponse = await wikipediaAlgorithm.pipe(content.searchTerm);
    spinner.succeed();
    const wikipediaContent = wikipediaResponse.get();

    content.sourceContentOriginal = wikipediaContent.content;
    content.sourceContentSanitized = wikipediaContent.content;
  }

  function sanitizeContent(content: ContentSearch) {
    const withoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(content.sourceContentOriginal);
    const withoutDatesInParentheses = removeDatesInParentheses(withoutBlankLinesAndMarkdown);

    content.sourceContentSanitized = withoutDatesInParentheses;

    function removeBlankLinesAndMarkdown(text: string): string {
      const allLines = text.split('\n');

      const withoutBlankLinesAndMarkdown = allLines.filter((line) => {
        if (line.trim().length === 0 || line.trim().startsWith('=')) {
          return false;
        }

        return true;
      });

      return withoutBlankLinesAndMarkdown.join(' ');
    }

    function removeDatesInParentheses(text: string) {
      return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g, ' ')
    }
  }

  function breakContentIntoSentences(content: ContentSearch) {
    content.sentences = [];

    const sentences = SentenceBoundaryDetection.sentences(content.sourceContentSanitized);
    sentences.forEach((sentence) => {
      content.sentences.push({
        text: sentence,
        keywords: [],
        images: []
      })
    })
  }

  function limitMaximumSentences(content: ContentSearch) {
    content.sentences = content.sentences.slice(0, 7);
  }

  async function fetchkeywordsOfAllSentences(content: ContentSearch) {
    const spinner = ora({ color: 'cyan', text: `Fetchind keywords from watson` }).start();
    for (const sentence of content.sentences) {
      sentence.keywords = await fetchWatsonAdnReturnKeyWords(sentence.text);
    }
    spinner.succeed();
  }

  async function fetchWatsonAdnReturnKeyWords(sentence: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      nlu.analyze({
        text: sentence,
        features: {
          keywords: {}
        }
      }, (error, response) => {
        if (error)
          throw error;

        const keywords = response.keywords.map((keyword) => {
          return keyword.text;
        });

        resolve(keywords);
      });
    });
  }

}

export default robot;