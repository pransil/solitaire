class Card {
    constructor(suit, rank) {
        this.suit = suit;
        this.rank = rank;
        this.faceUp = false;
        this.red = suit === 'hearts' || suit === 'diamonds';
    }

    toString() {
        const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        const suits = {
            hearts: '♥',
            diamonds: '♦',
            clubs: '♣',
            spades: '♠'
        };
        return `${ranks[this.rank - 1]}${suits[this.suit]}`;
    }
}

class SolitaireGame {
    constructor() {
        this.deck = [];
        this.waste = [];
        this.foundations = {
            hearts: [],
            diamonds: [],
            clubs: [],
            spades: []
        };
        this.tableau = [[], [], [], [], [], [], []];
        this.selectedCard = null;
        this.selectedPile = null;
        this.initializeGame();
    }

    initializeGame() {
        // Create deck
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        for (let suit of suits) {
            for (let rank = 1; rank <= 13; rank++) {
                this.deck.push(new Card(suit, rank));
            }
        }

        // Shuffle deck
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }

        // Deal cards to tableau
        for (let i = 0; i < 7; i++) {
            for (let j = i; j < 7; j++) {
                const card = this.deck.pop();
                card.faceUp = (j === i);
                this.tableau[j].push(card);
            }
        }
    }

    drawCard() {
        if (this.deck.length === 0) {
            this.deck = [...this.waste].reverse();
            this.waste = [];
            this.deck.forEach(card => card.faceUp = false);
        } else {
            const card = this.deck.pop();
            card.faceUp = true;
            this.waste.push(card);
        }
    }

    canMoveToFoundation(card, foundation) {
        // Log for debugging
        console.log(`Checking if ${card.toString()} can move to foundation with ${foundation.length} cards`);
        console.log(`Foundation top card: ${foundation.length > 0 ? foundation[foundation.length - 1].toString() : 'Empty'}`);
        
        // For empty foundation, only accept Ace
        if (foundation.length === 0) {
            console.log(`Foundation is empty, checking if ${card.toString()} is an Ace: ${card.rank === 1}`);
            return card.rank === 1;
        }
        
        // For non-empty foundation, check suit and sequence
        const topCard = foundation[foundation.length - 1];
        const isValid = card.suit === topCard.suit && card.rank === topCard.rank + 1;
        console.log(`Checking if ${card.toString()} can go on ${topCard.toString()}: ${isValid}`);
        return isValid;
    }

    canMoveToTableau(sourceCard, targetColumn) {
        if (targetColumn.length === 0) {
            return sourceCard.rank === 13; // King can be placed on empty column
        }
        const targetCard = targetColumn[targetColumn.length - 1];
        return targetCard.faceUp && sourceCard.red !== targetCard.red && sourceCard.rank === targetCard.rank - 1;
    }

    moveCard(fromPile, toPile, card) {
        const fromIndex = fromPile.indexOf(card);
        if (fromIndex !== -1) {
            // For foundation moves, only move the single card
            if (Object.values(this.foundations).includes(toPile)) {
                const cardToMove = fromPile.splice(fromIndex, 1)[0];
                toPile.push(cardToMove);
            } else {
                // For tableau moves, move the card and all cards below it
                const cardsToMove = fromPile.splice(fromIndex);
                toPile.push(...cardsToMove);
            }

            // Flip the new top card if needed
            if (fromPile.length > 0 && !fromPile[fromPile.length - 1].faceUp) {
                fromPile[fromPile.length - 1].faceUp = true;
            }
            return true;
        }
        return false;
    }

    checkWin() {
        return Object.values(this.foundations).every(foundation => 
            foundation.length === 13 && foundation[12].rank === 13
        );
    }
}

class GameUI {
    constructor() {
        this.game = new SolitaireGame();
        this.selectedCard = null;
        this.selectedPile = null;
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        document.getElementById('new-game').addEventListener('click', () => {
            this.game = new SolitaireGame();
            this.render();
        });

        document.querySelector('.stock-pile').addEventListener('click', () => {
            this.game.drawCard();
            this.render();
        });

        // Add click listeners for foundation piles (SIMPLIFIED FOR DEBUGGING)
        document.querySelectorAll('.foundation').forEach(foundation => {
            // Remove previous listener if any (safer during debugging)
            // Note: This is generally not ideal in production, but helps here.
            const newFoundation = foundation.cloneNode(true);
            foundation.parentNode.replaceChild(newFoundation, foundation);

            newFoundation.addEventListener('click', () => {
                const suit = newFoundation.dataset.suit;
                console.log(`--- Foundation ${suit} clicked! ---`);
                console.log(`   Selected Card at this moment: ${this.selectedCard ? this.selectedCard.toString() : 'None'}`);
                console.log(`   Selected Pile at this moment: ${this.selectedPile ? 'Exists' : 'None'}`);
                
                // Now, put back the original logic carefully
                if (this.selectedCard && this.selectedPile) { 
                    const foundationPile = this.game.foundations[suit];
                    const isLastCard = this.selectedPile[this.selectedPile.length - 1] === this.selectedCard;
                    const canMove = this.game.canMoveToFoundation(this.selectedCard, foundationPile);

                    console.log('   Checking logic:');
                    console.log('     Is Last Card in Pile:', isLastCard);
                    console.log('     Can Move (Rule Check): ', canMove);

                    if (isLastCard && canMove) {
                        console.log('     Executing move...');
                        this.game.moveCard(this.selectedPile, foundationPile, this.selectedCard);
                        this.render(); // Render only after successful move
                        this.clearSelection(); // Clear selection only after successful move
                    } else {
                        console.log('     Move conditions not met.');
                        this.clearSelection(); // Clear selection if move is invalid/impossible
                    }
                } else {
                     console.log('   Cannot attempt move: No card or pile selected.');
                     this.clearSelection(); // Clear selection just in case
                }
            });
        });

        // Add click listeners for tableau columns
        document.querySelectorAll('.column').forEach((column, index) => {
            column.addEventListener('click', (e) => {
                if (e.target.classList.contains('column')) {
                    if (this.selectedCard && this.selectedCard.rank === 13) {
                        const targetColumn = this.game.tableau[index];
                        if (targetColumn.length === 0) {
                            this.game.moveCard(this.selectedPile, targetColumn, this.selectedCard);
                            this.render();
                            this.clearSelection();
                        }
                    }
                }
            });
        });
    }

    createCardElement(card) {
        const div = document.createElement('div');
        div.className = `card ${card.red ? 'red' : 'black'} ${card.faceUp ? '' : 'face-down'}`;
        div.dataset.suit = card.suit;
        div.dataset.rank = card.rank;
        
        if (card.faceUp) {
            const rank = document.createElement('div');
            rank.className = 'rank';
            rank.textContent = card.toString().slice(0, -1);
            div.appendChild(rank);

            const suit = document.createElement('div');
            suit.className = 'suit';
            suit.textContent = card.toString().slice(-1);
            div.appendChild(suit);

            // Add click handler directly to the card element
            div.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleCardClick(card, div);
            });
        }

        return div;
    }

    handleCardClick(card, element) {
        if (!card.faceUp) {
            const column = this.findColumnForCard(card);
            if (column && column[column.length - 1] === card) {
                card.faceUp = true;
                this.render();
            }
            return;
        }

        console.log("Card clicked:", card.toString());
        
        // Check if the clicked card is in a foundation
        let foundationSuit = null;
        for (const [suit, pile] of Object.entries(this.game.foundations)) {
            if (pile.includes(card)) {
                foundationSuit = suit;
                console.log("Card is in foundation:", suit);
                break;
            }
        }

        if (foundationSuit && this.selectedCard) {
            // Clicking a foundation card with a card already selected - try to move to foundation
            console.log("Attempting to move selected card to foundation:", foundationSuit);
            console.log("Selected card:", this.selectedCard.toString());
            
            const foundationPile = this.game.foundations[foundationSuit];
            if (this.game.canMoveToFoundation(this.selectedCard, foundationPile)) {
                console.log("Move is valid, executing...");
                this.game.moveCard(this.selectedPile, foundationPile, this.selectedCard);
                this.render();
            } else {
                console.log("Move is invalid");
            }
            this.clearSelection();
            return;
        }
        
        if (!this.selectedCard) {
            // Check if the card is in the waste pile
            const isWasteCard = this.game.waste.includes(card);
            
            if (isWasteCard) {
                // For waste cards, just select the single card
                this.selectedCard = card;
                this.selectedPile = this.game.waste;
                element.classList.add('selected');
            } else {
                // For tableau cards, select the card and all valid cards below it
                const column = this.findColumnForCard(card);
                if (column) {
                    const startIndex = column.indexOf(card);
                    const cardsBelow = column.slice(startIndex);
                    
                    // Check if the sequence is valid
                    let isValidSequence = true;
                    for (let i = 0; i < cardsBelow.length - 1; i++) {
                        const currentCard = cardsBelow[i];
                        const nextCard = cardsBelow[i + 1];
                        if (currentCard.red === nextCard.red || currentCard.rank !== nextCard.rank + 1) {
                            isValidSequence = false;
                            break;
                        }
                    }
                    
                    if (isValidSequence) {
                        this.selectedCard = card;
                        this.selectedPile = column;
                        element.classList.add('selected');
                        
                        // Highlight all cards in the sequence
                        cardsBelow.forEach(c => {
                            const cardElement = document.querySelector(`[data-suit="${c.suit}"][data-rank="${c.rank}"]`);
                            if (cardElement) {
                                cardElement.classList.add('selected');
                            }
                        });
                    }
                }
            }
        } else {
            // Attempting to move cards TO ANOTHER TABLEAU COLUMN
            const targetColumn = this.findColumnForCard(card);
            
            if (targetColumn && targetColumn !== this.selectedPile) { // Ensure moving to a *different* column
                if (this.game.canMoveToTableau(this.selectedCard, targetColumn)) {
                    this.game.moveCard(this.selectedPile, targetColumn, this.selectedCard);
                    this.render();
                    // Successfully moved, so clear selection
                    this.clearSelection(); 
                    return; // Exit after successful move
                }
            } 
            
            // If the click wasn't a valid move to another column, 
            // or if clicking the same selected card/pile again, just clear the selection.
            this.clearSelection();
        }
    }

    findColumnForCard(card) {
        return this.game.tableau.find(column => column.includes(card));
    }

    findPileForCard(card) {
        // First check tableau columns
        const column = this.findColumnForCard(card);
        if (column) return column;

        // Then check waste pile
        if (this.game.waste.includes(card)) {
            return this.game.waste;
        }

        // Finally check foundations
        for (const [suit, foundation] of Object.entries(this.game.foundations)) {
            if (foundation.includes(card)) {
                return foundation;
            }
        }

        return null;
    }

    clearSelection() {
        this.selectedCard = null;
        this.selectedPile = null;
        document.querySelectorAll('.selected, .movable-to-foundation').forEach(el => {
            el.classList.remove('selected', 'movable-to-foundation');
        });
    }

    render() {
        // Clear all piles
        document.querySelectorAll('.stock-pile, .waste-pile, .foundation, .column')
            .forEach(el => el.innerHTML = '');

        // Render stock pile
        const stockPile = document.querySelector('.stock-pile');
        if (this.game.deck.length > 0) {
            const cardBack = document.createElement('div');
            cardBack.className = 'card face-down';
            stockPile.appendChild(cardBack);
        }

        // Render waste pile
        const wastePile = document.querySelector('.waste-pile');
        if (this.game.waste.length > 0) {
            const topCard = this.game.waste[this.game.waste.length - 1];
            wastePile.appendChild(this.createCardElement(topCard));
        }

        // Render foundations
        Object.entries(this.game.foundations).forEach(([suit, pile]) => {
            const foundation = document.querySelector(`.foundation[data-suit="${suit}"]`);
            
            // Create a "Move Here" button for each foundation
            const moveHereBtn = document.createElement('button');
            moveHereBtn.textContent = "Move Here";
            moveHereBtn.className = "move-here-btn";
            moveHereBtn.style.display = "none"; // Hide by default
            
            // Show button when a valid card is selected
            if (this.selectedCard && 
                this.selectedPile && 
                this.selectedPile[this.selectedPile.length - 1] === this.selectedCard && 
                this.game.canMoveToFoundation(this.selectedCard, pile)) {
                moveHereBtn.style.display = "block";
            }
            
            // Add click handler to the button
            moveHereBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent event from bubbling
                if (this.selectedCard && 
                    this.selectedPile && 
                    this.selectedPile[this.selectedPile.length - 1] === this.selectedCard && 
                    this.game.canMoveToFoundation(this.selectedCard, pile)) {
                    this.game.moveCard(this.selectedPile, pile, this.selectedCard);
                    this.render();
                    this.clearSelection();
                }
            });
            
            foundation.appendChild(moveHereBtn);
            
            // Render the top card if any
            if (pile.length > 0) {
                const topCard = pile[pile.length - 1];
                foundation.appendChild(this.createCardElement(topCard));
            }
        });

        // Render tableau
        this.game.tableau.forEach((column, index) => {
            const columnElement = document.querySelector(`.column[data-column="${index + 1}"]`);
            column.forEach(card => {
                columnElement.appendChild(this.createCardElement(card));
            });
        });
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    new GameUI();
}); 