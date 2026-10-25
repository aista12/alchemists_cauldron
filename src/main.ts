import alchemySigilUrl from './assets/alchemy-sigil.svg';
import './styles/main.css';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('The application root element was not found.');
}

app.innerHTML = `
  <div class="game-shell">
    <header class="topbar">
      <a class="wordmark" href="./" aria-label="Alchemist's Cauldron home">
        <img class="wordmark__sigil" src="${alchemySigilUrl}" alt="" />
        <span>Alchemist's Cauldron</span>
      </a>
      <nav class="topbar__nav" aria-label="Main navigation">
        <span>Field guide</span>
        <span>Potion journal</span>
      </nav>
    </header>

    <main class="welcome">
      <p class="welcome__eyebrow">A small world of wonder</p>
      <img class="welcome__sigil" src="${alchemySigilUrl}" alt="" />
      <h1>Every great potion starts with a little curiosity.</h1>
      <p class="welcome__description">
        Gather curious ingredients, follow your intuition, and see what the
        cauldron has in store.
      </p>
      <div class="welcome__status">
        <span class="welcome__status-mark" aria-hidden="true"></span>
        The laboratory is being prepared
      </div>
    </main>

    <footer class="footer">
      <span>ALCHEMY NOTES</span>
      <span>Let wonder lead the way</span>
    </footer>
  </div>
`;
