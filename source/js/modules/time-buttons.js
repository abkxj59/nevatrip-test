const cards = document.querySelectorAll('.card');
const BUTTONS_PER_STRING = 4;

const initTimeButtons = () => {
  cards.forEach((card) => {
    let timeItems = card.querySelectorAll('.card__time-item');
    let moreItem = card.querySelector('.card__time-item--more');
    let moreButton = moreItem.querySelector('button');

    if (timeItems.length > BUTTONS_PER_STRING + 1) {
      for (let i = BUTTONS_PER_STRING - 1; i < timeItems.length; i++) {
        timeItems[i].classList.add('card__time-item--hidden');
      }
      moreItem.classList.remove('card__time-item--hidden');
    }

    moreButton.addEventListener('click', () => {
      for (let i = BUTTONS_PER_STRING; i < timeItems.length; i++) {
        timeItems[i].classList.remove('card__time-item--hidden');
      }
      moreItem.classList.add('card__time-item--hidden');
    });
  });
};

export {initTimeButtons};
