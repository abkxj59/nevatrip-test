const ONE_WAY_PRICE = 700;
const BOTH_WAY_PRICE = 1200;
const FORWARD_ROUTE = 'из A в B';
const BACKWARD_ROUTE = 'из B в A';
const ROUND_ROUTE = 'из A в B и обратно в A';
const ONE_WAY_DURATION = 50;

const FORWARD_TIMES = [
  new Date(Date.UTC(2021, 7, 21, 15)),
  new Date(Date.UTC(2021, 7, 21, 15, 30)),
  new Date(Date.UTC(2021, 7, 21, 15, 45)),
  new Date(Date.UTC(2021, 7, 21, 16)),
  new Date(Date.UTC(2021, 7, 21, 16, 15)),
  new Date(Date.UTC(2021, 7, 21, 18))
];

const BACKWARD_TIMES = [
  new Date(Date.UTC(2021, 7, 21, 15, 30)),
  new Date(Date.UTC(2021, 7, 21, 15, 45)),
  new Date(Date.UTC(2021, 7, 21, 16)),
  new Date(Date.UTC(2021, 7, 21, 16, 15)),
  new Date(Date.UTC(2021, 7, 21, 16, 35)),
  new Date(Date.UTC(2021, 7, 21, 18, 50)),
  new Date(Date.UTC(2021, 7, 21, 18, 55))
];

const form = document.querySelector('.form');
const routeInput = form.querySelector('#route');
const forwardTimeField = form.querySelector('.form__field--time-forward');
const forwardTimeSelect = form.querySelector('#time-forward');
const backwardTimeField = form.querySelector('.form__field--time-backward');
const backwardTimeSelect = form.querySelector('#time-backward');
const numField = form.querySelector('.form__field--num');
const numInput = form.querySelector('#num');

const addTimeOption = (time, select, route) => {
  let timeOption = document.createElement('option');
  timeOption.dataset.time = time;
  timeOption.value = time.toLocaleTimeString().slice(0, 5) + '(' + route + ')';
  timeOption.textContent = time.toLocaleTimeString().slice(0, 5) + '(' + route + ')';
  select.appendChild(timeOption);
};

const fillSelect = (array, select, route) => {
  array.forEach((time) => {
    addTimeOption(time, select, route);
  });
};

const emptySelect = (select) => {
  for (let i = select.children.length - 1; i >= 0; i--) {
    select.children[i].remove();
  }
};

const getTime = (select) => {
  for (let i = 0; i < select.children.length; i++) {
    if (select.value === select.children[i].value) {
      return new Date(select.children[i].dataset.time);
    }
  }
  return 'not find';
};

const getCruise = () => {
  let totalCost = ONE_WAY_PRICE * numInput.value;
  let totalDuration = ONE_WAY_DURATION;
  let forwardTime = getTime(forwardTimeSelect);
  let arrivalTime = getTime(forwardTimeSelect);
  if (routeInput.value === ROUND_ROUTE) {
    totalCost = BOTH_WAY_PRICE * numInput.value;
    arrivalTime = getTime(backwardTimeSelect);
  }
  if (routeInput.value === BACKWARD_ROUTE) {
    forwardTime = getTime(backwardTimeSelect);
    arrivalTime = getTime(backwardTimeSelect);
  }
  arrivalTime.setMinutes(arrivalTime.getMinutes() + ONE_WAY_DURATION);
  totalDuration = (arrivalTime - forwardTime) / 60000;

  const cruise = {
    route: routeInput.value,
    number: numInput.value,
    cost: totalCost,
    duration: totalDuration,
    forwardTime: forwardTime.toLocaleTimeString().slice(0, 5),
    arrivalTime: arrivalTime.toLocaleTimeString().slice(0, 5),
  };
  return cruise;
};

const plural = (string, number) => {
  if (number % 10 === 1 && number % 100 !== 11) {
    return string;
  } else if (number % 10 >= 2 && number % 10 <= 4 && (number % 100 < 10 || number % 100 >= 20)) {
    return string + 'а';
  } else {
    return string + 'ов';
  }
};

const getDurationExpression = (minutes) => {
  if (minutes > 59) {
    let durationHours = Math.floor(minutes / 60);
    let durationMinutes = minutes % 60;
    return durationHours + plural(' час', durationHours) + ' ' + durationMinutes;
  }
  return minutes;
};

const getMessage = (cruise) => {
  const message = document.createElement('p');
  message.classList.add('form__message');
  let ticketString = plural('билет', cruise.number);
  let durationExpression = getDurationExpression(cruise.duration);

  message.textContent = 'Вы выбрали ' + cruise.number + ' ' + ticketString + ' по маршруту ' + cruise.route + ' стоимостью ' + cruise.cost + ' р.\nЭто путешествие займет у вас ' + durationExpression + ' минут.\nТеплоход отправляется в ' + cruise.forwardTime + ', а прибудет в ' + cruise.arrivalTime + '.';
  return message;
};

const clearMessage = () => {
  if (form.querySelector('.form__message') !== null) {
    form.querySelector('.form__message').remove();
  }
};

const initForm = () => {
  if (form !== null) {
    routeInput.selectedIndex = -1;
    forwardTimeField.hidden = true;
    backwardTimeField.hidden = true;
    numField.hidden = true;
    numInput.onfocus = () => {
      numInput.value = '';
    };
    routeInput.oninput = () => {
      emptySelect(forwardTimeSelect);
      emptySelect(backwardTimeSelect);
      numField.hidden = true;
      numInput.value = '';
      clearMessage();
      switch (routeInput.value) {
        case FORWARD_ROUTE:
          forwardTimeField.hidden = false;
          backwardTimeField.hidden = true;
          fillSelect(FORWARD_TIMES, forwardTimeSelect, FORWARD_ROUTE);
          forwardTimeSelect.selectedIndex = -1;
          forwardTimeSelect.oninput = () => {
            numField.hidden = false;
            clearMessage();
          };
          break;
        case BACKWARD_ROUTE:
          forwardTimeField.hidden = true;
          backwardTimeField.hidden = false;
          fillSelect(BACKWARD_TIMES, backwardTimeSelect, BACKWARD_ROUTE);
          backwardTimeSelect.selectedIndex = -1;
          backwardTimeSelect.oninput = () => {
            numField.hidden = false;
            clearMessage();
          };
          break;
        case ROUND_ROUTE:
          forwardTimeField.hidden = false;
          backwardTimeField.hidden = true;
          fillSelect(FORWARD_TIMES, forwardTimeSelect, FORWARD_ROUTE);
          forwardTimeSelect.selectedIndex = -1;
          forwardTimeSelect.oninput = () => {
            clearMessage();
            let arrivalTime = getTime(forwardTimeSelect);
            arrivalTime.setMinutes(arrivalTime.getMinutes() + ONE_WAY_DURATION);
            let avaliableBackwardTimes = [];
            BACKWARD_TIMES.forEach((backwardTime) => {
              if (backwardTime > arrivalTime) {
                avaliableBackwardTimes.push(backwardTime);
              }
            });
            emptySelect(backwardTimeSelect);
            fillSelect(avaliableBackwardTimes, backwardTimeSelect, BACKWARD_ROUTE);
            backwardTimeSelect.selectedIndex = -1;
            backwardTimeField.hidden = false;
            backwardTimeSelect.oninput = () => {
              numField.hidden = false;
              clearMessage();
            };
          };
          break;
      }
    };
    form.onsubmit = (evt) => {
      evt.preventDefault();
      clearMessage();
      const cruise = getCruise();
      const message = getMessage(cruise);
      form.appendChild(message);
    };
  }
};

export {initForm};
