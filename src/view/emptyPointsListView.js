import AbstractView from '../framework/view/abstract-view';

function createEmptyPointList(FILTER_TYPES = 'everything') {
  let message = 'Click New Event to create your first point';
  switch (FILTER_TYPES) {
    case 'past':
      message = 'There are no past events now';
      break;
    case 'present':
      message = 'There are no present events now';
      break;
    case 'future':
      message = 'There are no future events now';
      break;
  }
  return `<section class="trip-events">
            <h2 class="visually-hidden">Trip events</h2>
            <p class="trip-events__msg">${message}</p>
          </section>`;
}

export default class EmptyPoints extends AbstractView {
  #FILTER_TYPES;

  constructor(FILTER_TYPES = 'everything') {
    super();
    this.#FILTER_TYPES = FILTER_TYPES;
  }

  get template() {
    return createEmptyPointList(this.#FILTER_TYPES);
  }
}
