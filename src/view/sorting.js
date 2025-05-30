import { SortTypes } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

function createSortItemTemplate(sortType, checkedType) {
  return (
    `<div class="trip-sort__item  trip-sort__item--${sortType}">
      <input
        id="sort-${sortType}"
        class="trip-sort__input  visually-hidden"
        type="radio"
        name="trip-sort"
        value="sort-${sortType}"
        data-sort-type="${sortType}"
        ${sortType === checkedType ? 'checked' : ''}
        ${sortType === SortTypes.EVENT || sortType === SortTypes.OFFER ? 'disabled' : ''}>
      <label class="trip-sort__btn" for="sort-${sortType}">${sortType === SortTypes.OFFER ? 'Offers' : sortType}</label>
    </div>`
  );
}

function createSortingTemplate(checkedType) {
  return (`<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
            ${Object.values(SortTypes).map((item) => createSortItemTemplate(item, checkedType)).join('')}
          </form>`);
}

export default class SortingView extends AbstractView {
  #handleSortBtnClick = null;
  #currentSortType = null;

  constructor({onSortChange, currentSortType}) {
    super();
    this.#handleSortBtnClick = onSortChange;
    this.#currentSortType = currentSortType;

    this.element.addEventListener('click', this.#sortBtnClickHandler);
  }

  get template() {
    return createSortingTemplate(this.#currentSortType);
  }

  #sortBtnClickHandler = (evt) => {
    this.#handleSortBtnClick(evt);
  };
}
