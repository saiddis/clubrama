class Memorama {
    constructor(startingAttempts = 6, cardsNumber = 3, images = [
        "images/man-city.png",
        "images/real-madrid.png",
        "images/bayern.png",
        "images/dortmund.png",
        "images/barcelona.png",
        "images/milan.png",
        "images/inter.png",
        "images/liverpool.png",
        "images/arsenal.png",
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
        this.flipCards = this.flipCards.bind(this);
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
        grid.append(card);
    }

    newLevel() {
        this.level.textContent++;
        this.cardsNumber += 3;
        this.startingAttempts += 6;
        document.documentElement.style.setProperty('--cards-size', `${+this.cardsSize.slice(0, 3) - 15}px`);
        this.cardsGrid.remove();
        const newLevel = new Memorama(this.startingAttempts, this.cardsNumber);
        newLevel.cardsGrid.style.gridTemplateColumns = `repeat(${this.level.textContent * 2}, 1fr)`;
        newLevel.initGame();
    }

    flipCards(card) {
        if (this.flippedCards.length < 2 &&
            !card.classList.contains('flipped')) {

            card.classList.add('flipped');
            this.flippedCards.push(card);
            if (this.flippedCards.length == 2) {
                +this.attempts.textContent--;   
                this.checkMatch();   
            }
        }
    }

    checkMatch() {
        const value1 = this.flippedCards[0].querySelector('img').attributes.src.textContent;
        const value2 = this.flippedCards[1].querySelector('img').attributes.src.textContent;
        
        if (value1 == value2) {
            this.matchedPairs++;
            this.flippedCards = [];
            if (this.matchedPairs == this.cardsNumber) {

                if (this.level.textContent == 3) {
                    setTimeout(() => {
                        this.showMessage(true);
                    }, 1000);
                    
                } else {
                    setTimeout(() => {
                        this.newLevel();
                    }, 1000);
                }
            } else if (this.matchedPairs != this.cardsNumber &&
                this.attempts.textContent == 0) {
                    setTimeout(() => {
                        this.cardsGrid.onclick = '';
                        this.showMessage(false);
                    }, 1000);
            }
            
        } else {
            if (+this.attempts.textContent == 0) {
                setTimeout(() => {
                    this.cardsGrid.onclick = '';
                    this.showMessage(false);
                }, 1000);
            } else {
                setTimeout(() => {
                    this.flippedCards[0].classList.remove('flipped');
                    this.flippedCards[1].classList.remove('flipped');
                    this.flippedCards = [];
                }, 1000);
            }
        }
    }

    showMessage(result) {
        const cover = document.createElement('div');
        cover.style.position = 'absolute';
        cover.style.width = document.documentElement.clientWidth + 'px';
        cover.style.height = document.documentElement.clientHeight + 'px';
        cover.style.backgroundColor = 'black';
        cover.style.opacity = '0.3';

        const message = document.createElement('h1');
        message.style.position = 'absolute';
        message.style.fontSize = '124px';
        message.style.letterSpacing = '18px';

        document.body.append(cover, message);

        if (result) {
            message.style.color = '#ffd60a';
            message.textContent = `You won :)`;
        } else {
            message.style.color = '#e63946';
            message.textContent = 'Game over';
        }

        cover.style.top = 0 + 'px';
        cover.style.left = 0 + 'px';

        message.style.left = document.documentElement.clientWidth / 2 - message.offsetWidth / 2 + 'px';
        message.style.top = document.documentElement.clientHeight / 2 - message.offsetHeight / 2 + 'px';
    }

    initGame() {
        this.main.append(this.cardsGrid);
        this.cardsGrid.classList.add('cards-grid');
        this.main.append(this.cardsGrid);
        this.cardsGrid.onclick = (event) => {
            let card = event.target.closest('.card');
            if (!card) return;

            this.flipCards(card);     
        };
    }
}

document.body.style.height = document.documentElement.clientHeight + 'px';
document.ondragstart = function() {
    return false;
}

let game = new Memorama();
game.initGame();