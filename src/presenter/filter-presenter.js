import FilterView from '../view/filters.js';
import { remove, render } from '../framework/render.js';
import { UpdateType } from '../const.js';

export default class FilterPresenter {
  #eventsModel = null;
  #filterModel = null;
  #filterContainer = null;
  #filterComponent = null;

  constructor(filterContainer, eventsModel, filterModel) {
    this.#filterContainer = filterContainer;
    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;

    this.#eventsModel.addObserver(this.#handleEventsChange);
    this.#filterModel.addObserver(this.#handleEventsChange);
  }

  get events() {
    return this.#eventsModel.events;
  }

  init() {
    this.#renderFilters();
  }

  #renderFilters() {
    if (this.#filterComponent) {
      remove(this.#filterComponent);
    }
    this.#filterComponent = new FilterView({
      points: this.events,
      currentFilter: this.#filterModel.filter,
      onFilterChange: this.#handleFilterChange,
    });
    render(this.#filterComponent, this.#filterContainer);
  }

  #handleFilterChange = (filterType) => {
    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };

  #handleEventsChange = () => {
    this.#renderFilters();
  };
}
