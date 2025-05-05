import AbstractView from '../framework/view/abstract-view';

function createFilterItem(filter, currentFilterType) {
  const {type, count} = filter;
  return (
    `
    <div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}"
      ${count === 0 && type !== 'everything' ? 'disabled' : ''}
      ${type === currentFilterType ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-${type}">${type.charAt(0).toUpperCase() + type.slice(1)}</label>
    </div>
    `
  );
}

function createFilterTemplate(filters, currentFilterType) {
  const filtersTemplate = filters.map((filter) => createFilterItem(filter, currentFilterType)).join('');

  return `<form class="trip-filters" action="#" method="get">
            ${filtersTemplate}
            <button class="visually-hidden" type="submit">Accept filter</button>
          </form>`;
}

export default class Filter extends AbstractView {
  #filters;
  #currentFilterType;
  #handleFilterTypeChange;

  constructor({filters, currentFilterType, onFilterTypeChange}) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilterType);
  }

  #filterTypeChangeHandler = (evt) => {
    if (evt.target.tagName === 'INPUT') {
      this.#handleFilterTypeChange(evt.target.value);
    }
  };
}
