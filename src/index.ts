import textRobot from './robots/text';
import inputRobot from './robots/input';
import stateRobot from './robots/state';
const robots = {
  input: inputRobot,
  text: textRobot,
  state: stateRobot
}

start();

async function start() {
  try {
    await robots.input();
    await robots.text();
    const content = robots.state.load();
    console.dir(content, { depth: null });
  } catch (err) {
    console.log(err);
  }
}


