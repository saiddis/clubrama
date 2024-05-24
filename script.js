class Memorama {
    constructor(difficulty, cardsNumber, images) {
        this.flippedCards = [];
        this.matchedPairs = 0; 
        this.difficulty = difficulty;
        this.cardsNumber = cardsNumber;
        this.images = images;
        this.attempts = document.body.querySelector('.attempts').lastElementChild;
        this.level = document.body.querySelector('.level').lastElementChild;
        this.cardsGrid = document.createElement('div');
        this.main = document.querySelector('main');
        this.symbols = this.shuffle(this.images, this.cardsNumber);
    }

    shuffle(array, num) {
        let newArray = [...array];
        newArray.length = num;
        newArray.join(newArray);
        for (let i = newArray.length - 1; i > 0; i--) {
            const j  = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        
        newArray.forEach(item => this.createCards(item, this.cardsGrid));
        return newArray;
    }


    createCards(value, grid) {

        const card = document.createElement('div');
        card.classList.add('card');

        const cardContent = document.createElement('div');
        cardContent.classList.add('card-content');
        cardContent.innerHTML = `
        <div class="front">
        </div>
        <div class="back">
            <img src="${value}" alt="">
        </div>`;

        card.append(cardContent);
        card.onclick = () => {
            if (this.flippedCards.length < 2 &&
                !card.classList.contains('flipped')) {
    
                card.classList.add('flipped');
                this.flippedCards.push(card);
                if (this.flippedCards.length === 2) {
                    +this.attempts.textContent--;
                    this.checkMatch();
                }
            }
        };
        
        grid.append(card);
    }

    checkMatch() {
        const value1 = this.flippedCards[0].querySelector('img').attributes.src.textContent;
        const value2 = this.flippedCards[1].querySelector('img').attributes.src.textContent;

        if (value1 == value2) {
            this.matchedPairs++;
            this.flippedCards = [];
            if (this.matchedPairs == this.symbols.length) {
                setTimeout(() => {
                    this.newLevel();

                }, 500);
            } 

        } else {
            if (+this.attempts.textContent > 0) {
                setTimeout(() => {
                    this.flippedCards[0].classList.remove('flipped');
                    this.flippedCards[1].classList.remove('flipped');
                    this.flippedCards = [];
                }, 1000);
            } else {
                setTimeout(() => {
                    const cards = this.cardsGrid.childNodes;
                    cards.forEach((card) => {
                        card.attributes.onclick = null;
                    });
                    alert('Game over')
                }, 1000);
            } 
        }
    }

    newLevel() {
        this.cardsNumber++;
        +this.level.textContent++;
        this.cardsGrid.remove();
        const newLevel = new Memorama(this.difficulty, this.cardsNumber, this.images);
        +newLevel.attempts.textContent++;
        newLevel.initGame();
    }

    initGame() {
        if (this.difficulty.toLowerCase() == 'easy' ||
            this.difficulty.toLowerCase() == 'e') {
                this.attempts.textContent = 7;

        } else if (
            this.difficulty.toLowerCase() == 'medium' ||
            this.difficulty.toLowerCase() == 'm' ||
            !this.difficulty) {
                this.attempts.textContent = 5;

        } else {
            this.attempts.textContent = 3;

        }

        this.main.append(this.cardsGrid);
        this.cardsGrid.classList.add('cards-grid');
        this.cardsGrid.style.gridTemplateColumns = `repeat(${Math.floor(Math.sqrt(this.symbols.length))+2}, 1fr)`
        this.main.append(this.cardsGrid);
        this.symbols.forEach(symbol => this.createCards(symbol, this.cardsGrid));
    }
}

document.body.style.height = document.documentElement.clientHeight + 'px';

let game = new Memorama(prompt('Choose difficulty level: Easy, Medium, Hard'), 3, [
    "images/man-city.png",
    "images/real-madrid.png",
    "images/bayern.png",
    "images/dortmund.png",
    "images/barcelona.png",
    "images/milan.png",
    "images/inter.png"
]);
game.initGame();