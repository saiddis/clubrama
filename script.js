class Memorama {
    constructor(startingAttempts = 5, cardsNumber = 2, images = [
        "images/man-city.png",
        "images/real-madrid.png",
        "images/bayern.png",
        "images/dortmund.png",
        "images/barcelona.png",
        "images/milan.png",
        "images/inter.png",
        "images/liverpool.png",
        "images/arsenal.png",
        "images/man-united.png"
    ]) {
        this.flippedCards = [];
        this.matchedPairs = 0; 
        this.cardsNumber = cardsNumber;
        this.images = images;
        this.startingAttempts = startingAttempts;
        this.attempts = document.body.querySelector('.attempts').lastElementChild;
        this.attempts.innerHTML = this.startingAttempts;
        this.level = document.body.querySelector('.level').lastElementChild;
        this.cardsGrid = document.createElement('div');
        this.main = document.querySelector('main');
        this.symbols = this.shuffle(this.images, this.cardsNumber);
        this.cardsSize = getComputedStyle(document.documentElement).getPropertyValue('--cards-size');
    }

    shuffle(array, num) {
        let newArray = array.slice(0, num);
        newArray = newArray.concat(newArray);
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
            if (this.matchedPairs == this.cardsNumber) {
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

        this.level.textContent++;
        this.cardsNumber += 2;
        this.startingAttempts += 2;
        document.documentElement.style.setProperty('--cards-size', `${+this.cardsSize.slice(0, 3) - 40}px`);
        this.cardsGrid.remove();
        const newLevel = new Memorama(this.startingAttempts, this.cardsNumber);
        newLevel.initGame();
    }

    initGame() {
        this.main.append(this.cardsGrid);
        this.cardsGrid.classList.add('cards-grid');
        this.cardsGrid.style.gridTemplateColumns = `repeat(${Math.floor(Math.sqrt(this.symbols.length))}, 1fr)`
        this.main.append(this.cardsGrid);

    }
}

document.body.style.height = document.documentElement.clientHeight + 'px';

let game = new Memorama();
game.initGame();