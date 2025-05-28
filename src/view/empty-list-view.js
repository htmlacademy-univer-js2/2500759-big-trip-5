import AbstractView from '../framework/view/abstract-view';

function createEmptyListTemplate(text) {
  return (
    `<p class="trip-events__msg">${text}</p>`
  );
}

export default class EmptyListView extends AbstractView {
  #text = '';

  constructor({text}) {
    super();

    this.#text = text;
  }

  get template() {
    return createEmptyListTemplate(this.#text);
  }
}
