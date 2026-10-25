import { mountGameScreen } from './ui/game-screen';
import './styles/main.css';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('The application root element was not found.');
}

mountGameScreen(app);
