import AbstractView from '../framework/view/abstract-view';

function createNewEventBtnTemplate() {
  return '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';
}


export default class NewEventBtnView extends AbstractView {
  #handleBtnClick = null;

  constructor({onBtnClick}) {
    super();
    this.#handleBtnClick = onBtnClick;

    this.element.addEventListener('click', this.#buttonClickHandler);
  }

  get template() {
    return createNewEventBtnTemplate();
  }

  #buttonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleBtnClick();
  };

}
