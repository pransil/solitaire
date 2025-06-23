# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This directory contains **Pat's Solitaire Game** - a web-based Solitaire card game built with vanilla HTML/CSS/JavaScript.

*Note: There are some extraneous podcast system files (`src/` folder, incorrect `README.md`) that appear to have been copied from the adjacent `../podcast/` directory and should be ignored.*

## Development Commands

```bash
# No build process required - open directly in browser
open index.html

# Or serve locally if needed
python -m http.server 8000
# Then visit http://localhost:8000
```

## Architecture

### Solitaire Game Architecture

- **Three-file structure**: `index.html`, `style.css`, `main.js`
- **Core Classes** in `main.js`:
  - `Card`: Represents individual playing cards with suit, rank, face-up/down state
  - `SolitaireGame`: Manages game state (deck, tableau, foundations, waste, moves)
  - `GameUI`: Handles DOM rendering and user event management
- **No external dependencies** - pure HTML/CSS/JavaScript

### Game Flow

1. **Initialization**: Deck creation, shuffling, and tableau dealing
2. **Rendering**: Dynamic DOM updates to reflect game state
3. **User Interaction**: Click-based card selection and movement
4. **Game Logic**: Klondike Solitaire rules enforcement and win condition checking

## Key Files

- `index.html`: Game UI structure with containers for stock, waste, foundation, and tableau piles
- `style.css`: Visual styling including card appearance and layout
- `main.js`: Complete game implementation with classes and event handling
- `ARCHITECTURE.md`: Detailed system design documentation

## Development Notes

- Uses event-driven architecture with clear separation of concerns
- Game state management is centralized in the `SolitaireGame` class
- UI updates are handled through the `GameUI` class methods
- Card movements validate against standard Klondike Solitaire rules
- Self-contained with no framework dependencies

## Notes for Modifying the Code

1. Before any code changes, read the project architecture and code files to understand the context.
2. For any changes, think about how to test to ensure that the change works and did not break anything. Write and run the tests, fixing any bugs that come up from running the tests.
3. When changes affect a data structure or a function return values, look through the code base to see where else that data structure is used or the function return value is used. Make sure the changes did not break this code. Write and run tests to ensure this. Fix any bugs that come from these tests.