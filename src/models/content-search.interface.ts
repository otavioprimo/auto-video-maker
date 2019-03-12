export default interface ContentSearch {
  searchTerm?: string;
  prefix?: string;
  sourceContentOriginal?: string;
  sourceContentSanitized?: string;
  sentences?: Sentence[];
}


interface Sentence {
  text?: string,
  keywords?: string[],
  images?: string[]
}