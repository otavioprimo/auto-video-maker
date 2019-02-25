const readline = require('readline-sync');

start = () => {
  const content = {};

  content.searchTerm = askAndReturnSeachTerm();
  content.prefix = askAndReturnPrefix();

  function askAndReturnSeachTerm() {
    return readline.question('Type a Wikipedia search term: ');
  }

  function askAndReturnPrefix() {
    const prefixes = ['Who is', 'What is', 'The history of'];
    const selectedPrefixIndex = readline.keyInSelect(prefixes);
    const selectedPrefixTerm = prefixes[selectedPrefixIndex];


    return selectedPrefixTerm;
  }

  console.log(content);
}

start();