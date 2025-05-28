import AbstractView from '../framework/view/abstract-view.js';
import { filter } from '../utils.js';

function createFilterItemTemplate(filterInfo, currentFilter) {
  const {type, count} = filterInfo;
  return (
    `<div class="trip-filters__filter">
      <input id="filter-${type}"
            class="trip-filters__filter-input  visually-hidden"
            type="radio"
            name="trip-filter"
            value="${type}"
            ${type === currentFilter ? 'checked' : ''}
            ${count === 0 ? 'disabled' : ''}>
      <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
    </div>`
  );
}

function createFilterTemplate(filters, currentFilter) {
  return (
    `<form class="trip-filters" action="#" method="get">
      ${filters.map((item) => createFilterItemTemplate(item, currentFilter)).join('')}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}

export default class FiltersView extends AbstractView {
  #points = null;
  #currentFilter = null;
  #handleFilterChange = null;

  constructor({points, currentFilter, onFilterChange}) {
    super();
    this.#points = points;
    this.#currentFilter = currentFilter;
    this.#handleFilterChange = onFilterChange;

    this.element.addEventListener('change', this.#changeFilterHandler);
  }

  get template() {
    return createFilterTemplate(this.#generateFilters(), this.#currentFilter);
  }

  #generateFilters() {
    return Object.entries(filter).map(
      ([filterType, filterPoints]) => ({
        type: filterType,
        count: filterPoints(this.#points).length,
      }),
    );
  }

  #changeFilterHandler = (evt) => {
    this.#handleFilterChange(evt.target.value);
  };
}
