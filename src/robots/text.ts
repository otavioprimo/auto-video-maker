import * as algorithmia from 'algorithmia';
import * as SentenceBoundaryDetection from 'sbd';

import ora from 'ora';
import ContentSearch from "../models/content-search.interface";

const algorithmiaCredentials = require('../credentials/algorithmia.json');
const algorithmiaApiKey = algorithmiaCredentials.apiKey;

async function robot(content: ContentSearch) {
  await fetchContentFromWikipedia(content)
  await sanitizeContent(content)
  await breakContentIntoSentences(content)

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
}

export default robot;