let clickedCounter = 0;
let matchCounter = 0;
let pickedCards = [];


function createHeader() {
    const headerElement = document.createElement('header');
    document.body.append(headerElement);

    const newGameButton = document.createElement('button');
    newGameButton.className = 'new-game';
    headerElement.append(newGameButton);
    const newGameSpanElement = document.createElement('span');
    newGameSpanElement.textContent = 'New Game';
    newGameButton.append(newGameSpanElement);


    const rankingTableButton = document.createElement('button');
    rankingTableButton.className = 'ranking-table';
    headerElement.append(rankingTableButton);
    const rankingTableSpanElement = document.createElement('span');
    rankingTableSpanElement.textContent = 'Ranking Table';
    rankingTableButton.append(rankingTableSpanElement);


    const counterElement = document.createElement('div');
    counterElement.className = 'counter';
    headerElement.append(counterElement);
    const clickCounterElement = document.createElement('span');
    clickCounterElement.className = 'click-counter';
    clickCounterElement.textContent = '0 steps';
    counterElement.append(clickCounterElement);
    const matchCounterElement = document.createElement('span');
    matchCounterElement.className = 'match-counter';
    matchCounterElement.textContent = '0 / 8 matches';
    counterElement.append(matchCounterElement);

    const langToggleButton = document.createElement('button');
    langToggleButton.className = 'lang-toggle';
    langToggleButton.textContent = 'EN/RU';
    headerElement.append(langToggleButton);

    return { 
        newGameButton, 
        rankingTableButton, 
        clickCounterElement, 
        matchCounterElement, 
        langToggleButton 
    };
}


function createBoard() {
    const mainElement = document.createElement('main');
    document.body.append(mainElement);

    const mainContainerElement = document.createElement('div');
    mainContainerElement.className = 'main-container';
    mainElement.append(mainContainerElement);

    return mainContainerElement;
}


function createVictoryModal() {
    const modalElement = document.createElement('div');
    modalElement.className = 'modal';
    modalElement.style.cssText = `
        display: none;  
        position: fixed; 
        top: 0; 
        left: 0; 
        width: 100%; 
        height: 100%;  
        background-color: rgba(0, 0, 0, 0.6); 
        justify-content: center;
        align-items: center;
        z-index: 9999;
        `;
    document.body.append(modalElement)

    const modalContentElement = document.createElement('div');
    modalContentElement.className = 'modal-content';
    modalContentElement.style.cssText = `
        background-color: #fff;
        text-align: center;
        position: relative;
        width: 80%;
        gap: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 20px;
        `;
    modalElement.append(modalContentElement);

    const titleModalElement = document.createElement('h2');
    titleModalElement.textContent = 'You won!';
    modalContentElement.append(titleModalElement);

    const modalClickCounterElement = document.createElement('span')
    modalClickCounterElement.className = 'modal-click-counter';
    modalContentElement.append(modalClickCounterElement);
    
    const modalNewGameButton = document.createElement('button');
    modalNewGameButton.className = 'modal-new-game';
    modalNewGameButton.textContent = 'new game';
    modalContentElement.append(modalNewGameButton);

    const closeModalButton = document.createElement('button');
    closeModalButton.className = 'close-btn';
    closeModalButton.textContent = 'Close';
    modalContentElement.append(closeModalButton)

    return { modalElement, modalContentElement, modalClickCounterElement, modalNewGameButton, closeModalButton }
}

function showVictoryModal() {
    modalClickCounterElement.textContent = `Steps: ${clickedCounter}`;
    modalElement.style.display = 'flex';
    document.body.classList.add('modal-open');
}

function closeVictoryModal(event) {
        modalElement.style.display = 'none';
        document.body.classList.remove('modal-open');
}

const LEADERBOARD_KEY = 'memory-game-leaderboard';

function loadLeaderboard() {
    return JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]');
}

function createLeaderboardModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `
        display: none; position: fixed; inset: 0;
        background: rgba(0,0,0,0.6);
        justify-content: center; align-items: center;
        z-index: 9999;
    `;
    document.body.append(modal);

    const content = document.createElement('div');
    content.className = 'modal-content';
    content.style.cssText = `
        background: #fff; padding: 24px;
        border-radius: 8px; text-align: center;
        min-width: 300px;
    `;
    modal.append(content);

    const title = document.createElement('h2');
    title.textContent = 'Ranking Table';
    content.append(title);

    const list = document.createElement('ol');
    list.className = 'leaderboard-list';
    content.append(list);

    const close = document.createElement('button');
    close.textContent = 'Close';
    content.append(close);

    return { modal, list, close };
}

function showLeaderboard(modal, list) {
    const entries = loadLeaderboard();
    list.innerHTML = '';

    if (entries.length === 0) {
        list.innerHTML = '<li class="empty">No results yet</li>';
    } else {
        entries.forEach(e => {
            const li = document.createElement('li');
            li.textContent = `${e.steps} steps — ${e.date}`;
            list.append(li);
        });
    }

    modal.style.display = 'flex';
    document.body.classList.add('modal-open');
}

function saveResult(steps) {
    const list = loadLeaderboard();

    const today = new Date().toISOString().slice(0, 10);
    if (list.some(e => e.steps === steps && e.date === today)) return;

    list.push({ steps, date: today });
    list.sort((a, b) => a.steps - b.steps);

    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(list.slice(0, 10)));
}

function generateCards(mainContainerElement) {
    mainContainerElement.textContent = '';
    pickedCards = [];

    const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
    const deck = [...numbers, ...numbers];

    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    deck.forEach((value, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.dataset.value = value;
        cardElement.dataset.index = index;

        const cardParagraphElement = document.createElement('p');
        cardParagraphElement.className = 'card-content';
        cardParagraphElement.textContent = value;
        cardElement.append(cardParagraphElement);

        mainContainerElement.append(cardElement);
    });
}


function setupCardPicking(mainContainerElement) {
    mainContainerElement.addEventListener('click', (event) => {
        const card = event.target.closest('.card');
        if (!card) return;
        if (card.classList.contains('active') || card.classList.contains('matched')) return;
        if (pickedCards.length === 2) return;

        card.classList.add('active');
        pickedCards.push(card);


        clickedCounter += 1;
        clickCounterElement.textContent = `${clickedCounter} steps`;

        if (pickedCards.length === 2) {
            const [first, second] = pickedCards;
            const isMatch = first.dataset.value === second.dataset.value;

            if (isMatch) {
                matchCounter += 1;
                matchCounterElement.textContent = `${matchCounter} / 8 matches`;
                first.classList.add('matched');
                second.classList.add('matched');
                pickedCards = [];

                if (matchCounter === 8) {
                    saveResult(clickedCounter);
                    showVictoryModal();
                }
            } else {
                setTimeout(() => {
                    first.classList.remove('active');
                    second.classList.remove('active');
                    pickedCards = [];
                }, 1500);
            }
        }
    });
}


function setupLanguageToggle(langToggleButton) {
    langToggleButton.addEventListener('click', () => {
        document.body.classList.toggle('en-mode');
    });
}

//  start a new game
function startNewGame() {
    closeVictoryModal();
    clickedCounter = 0;
    matchCounter = 0;
    clickCounterElement.textContent = '0 steps';
    matchCounterElement.textContent = '0 / 8 matches';
    generateCards(mainContainerElement);
}

//  create header
const { newGameButton, rankingTableButton, clickCounterElement, matchCounterElement, langToggleButton } = createHeader();
//  create board
const mainContainerElement = createBoard();
//  create victory modal
const { modalElement, modalContentElement, modalClickCounterElement, modalNewGameButton, closeModalButton } = createVictoryModal();
//  create leader modal
const { modal: leaderboardModal, list: leaderboardList, close: leaderboardClose,} = createLeaderboardModal();
//  activate lang change
setupLanguageToggle(langToggleButton);
//  activate card picking
setupCardPicking(mainContainerElement);
//  activate btns
newGameButton.addEventListener('click', startNewGame);
modalNewGameButton.addEventListener('click', startNewGame);
closeModalButton.addEventListener('click', closeVictoryModal);

// close options
modalElement.addEventListener('click', (event) => {
    if (event.target === modalElement) closeVictoryModal();
});
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modalElement.style.display === 'flex') {
        closeVictoryModal();
    }
});

rankingTableButton.addEventListener('click', () => showLeaderboard(leaderboardModal, leaderboardList));
leaderboardClose.addEventListener('click', () => {
    leaderboardModal.style.display = 'none';
    document.body.classList.remove('modal-open');
});
leaderboardModal.addEventListener('click', (e) => {
    if (e.target === leaderboardModal) {
        leaderboardModal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
});

// automatic start
generateCards(mainContainerElement);