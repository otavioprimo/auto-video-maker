const prompts = require('prompts')

start = async () => {
  const content = await askAndReturnAnswers();

  console.log(content);

  function askAndReturnAnswers() {
    const questions = [
      {
        type: 'text',
        name: 'searchTerm',
        message: 'Type a Wikipedia search term:',
        validate: value => typeof value === 'string' ? value.trim() !== '' : false,
      },
      {
        type: 'select',
        name: 'prefix',
        message: 'Choose one option:',
        choices: ['Who is', 'What is', 'The history of'],
        validate: value => typeof value === 'string' ? value.trim() !== '' : false,
      }
    ];

    return new Promise(async (resolve, reject) => {
      const promptOptions = {
        onCancel: () => reject(new Error('The user has stopped answer'))
      }

      const response = await prompts(questions, promptOptions)
      resolve(response)
    });
  }
}

start();