
---

## Main Components

### 1. `index.html`
- Defines the static structure of the game UI.
- Contains containers for the stock pile, waste pile, foundation piles, and tableau columns.
- Loads `style.css` and `main.js`.

### 2. `style.css`
- Styles the game board, cards, buttons, and layout.
- Handles visual feedback (e.g., highlighting selected cards).

### 3. `main.js`
- Implements all game logic and user interaction.
- Main classes:
  - **Card**: Represents a single playing card (suit, rank, color, face-up/face-down).
  - **SolitaireGame**: Manages the state of the game (deck, tableau, foundations, waste, moves).
  - **GameUI**: Handles rendering the game state to the DOM and managing user events (clicks, moves, new game).
- Uses event listeners to respond to user actions (card moves, new game, etc.).
- Updates the DOM dynamically to reflect the current game state.

---

## Game Flow

1. **Initialization**
   - `main.js` creates a new `SolitaireGame` and `GameUI` instance on page load.
   - The deck is shuffled and cards are dealt to the tableau.

2. **Rendering**
   - The `GameUI` class renders the current state of the game to the HTML elements.
   - Cards are displayed in the tableau, waste, and foundation piles.

3. **User Interaction**
   - Users interact by clicking cards, piles, or the “New Game” button.
   - Event listeners in `main.js` handle these actions, update the game state, and re-render the UI.

4. **Game Logic**
   - All Solitaire rules (valid moves, foundation building, tableau stacking, etc.) are enforced in `main.js`.
   - The game checks for win conditions after each move.

---

## Extensibility

- The architecture is modular: UI, game logic, and data structures are separated.
- New features (e.g., scoring, undo, animations) can be added by extending the relevant classes and updating the UI.

---

## No External Dependencies

- The project uses only standard web technologies (HTML, CSS, JS).
- No frameworks or libraries are required.

---

## Summary

This architecture ensures a clear separation of concerns, making the project easy to understand, maintain, and extend.
