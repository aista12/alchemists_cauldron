const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('The application root element was not found.');
}

const heading = document.createElement('h1');
heading.textContent = "Alchemist's Cauldron";

const message = document.createElement('p');
message.textContent = 'Project setup is ready. Game features will be added in later stories.';

app.replaceChildren(heading, message);
