import AbstractView from '../framework/view/abstract-view';
import { SortTypes } from '../const';

function createSortItemTemplate(sortType, currentSortType) {
  return (
    `<div class="trip-sort__item  trip-sort__item--${sortType}">
      <input
        id="sort-${sortType}"
        class="trip-sort__input  visually-hidden"
        type="radio"
        name="trip-sort"
        value="sort-${sortType}"
        data-sort-type="${sortType}"
        ${sortType === currentSortType ? 'checked' : ''}
        ${sortType === SortTypes.EVENT || sortType === SortTypes.OFFER ? 'disabled' : ''}>
      <label class="trip-sort__btn" for="sort-${sortType}">${sortType.charAt(0).toUpperCase() + sortType.slice(1)}</label>
    </div>`
  );
}

function createSortingTemplate(currentSortType) {
  const sortTypes = Object.values(SortTypes);
  return `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortTypes.map((type) => createSortItemTemplate(type, currentSortType)).join('')}
    </form>
  `;
}

export default class SortView extends AbstractView {
  #currentSortType = SortTypes.DAY;
  #handleSortTypeChange = null;

  constructor({ onSortTypeChange }) {
    super();
    this.#handleSortTypeChange = onSortTypeChange;
    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortingTemplate(this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName === 'INPUT') {
      this.#handleSortTypeChange(evt.target.dataset.sortType);
    }
  };
}
