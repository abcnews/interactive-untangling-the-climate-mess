import App from './components/App/App.svelte';

const PROJECT_NAME: string = 'interactive-untangling-the-climate-mess';
const ROOT_SELECTOR = `#interactivemount`;
const root = document.querySelector(ROOT_SELECTOR);

console.log("Welcome to the interactive...")

if (root) {
  new App({
    target: root,
    props: {
      projectName: PROJECT_NAME
    }
  });
}

if (process.env.NODE_ENV === 'development') {
  console.debug(`[${PROJECT_NAME}] public path: ${__webpack_public_path__}`);
}
