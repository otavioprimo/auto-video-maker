import * as fs from 'fs';
import ContentSearch from '../models/content-search.interface';
const contentFilePath = './content.json';

function save(content: ContentSearch) {
  const contentString = JSON.stringify(content);
  return fs.writeFileSync(contentFilePath, contentString);
}

function load(): ContentSearch {
  const fileBuffer = fs.readFileSync(contentFilePath, 'utf-8');
  const contentJson = JSON.parse(fileBuffer);
  return contentJson;
}

export default {
  save,
  load
}