import * as prompts from 'prompts';

start();

async function start() {
  const content = await askAndReturnAnswers();
  console.log(content);
}

async function askAndReturnAnswers() {
  const questions: any = [
    {
      type: 'text',
      name: 'searchTerm',
      message: 'Type a Wikipedia search term:',
      validate: value => typeof value === 'string' ? value.trim() !== '' : false
    },
    {
      type: 'select',
      name: 'prefix',
      message: 'Choose one option:',
      choices: [
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
      ],
      validate: value => typeof value === 'string' ? value.trim() !== '' : false
    }
  ];

  return new Promise(async (resolve, reject) => {

    const promptOptions = {
      onCancel: () => reject(new Error('The user has stopped answer'))
    }

    const response = await prompts(questions, promptOptions);
    resolve(response);
  });
}