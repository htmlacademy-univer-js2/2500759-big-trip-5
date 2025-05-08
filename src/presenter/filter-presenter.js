import { render, replace, remove } from '../framework/render.js';
import Filter from '../view/filterView.js';
import { FILTER_TYPES } from '../const.js';
//const filterContainer = document.querySelector('.trip-controls__filters');

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #pointsModel = null;
  #filterComponent = null;

  constructor({filterContainer, filterModel, pointsModel}) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;
  }

  init() {
    const filters = this.#getFilters();
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new Filter({
      filters,
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #getFilters() {
    const points = this.#pointsModel.getPoints();
    const now = new Date();

    return [
      {
        type: FILTER_TYPES.EVERYTHING,
        count: points.length,
        isDisabled: false
      },
      {
        type: FILTER_TYPES.FUTURE,
        count: points.filter((point) => new Date(point.dateFrom) > now).length,
        isDisabled: points.filter((point) => new Date(point.dateFrom) > now).length === 0
      },
      {
        type: FILTER_TYPES.PRESENT,
        count: points.filter((point) => new Date(point.dateFrom) <= now && new Date(point.dateTo) >= now
        ).length,
        isDisabled: points.filter((point) => new Date(point.dateFrom) <= now && new Date(point.dateTo) >= now
        ).length === 0
      },
      {
        type: FILTER_TYPES.PAST,
        count: points.filter((point) => new Date(point.dateTo) < now).length,
        isDisabled: points.filter((point) => new Date(point.dateTo) < now).length === 0
      }
    ];
  }

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }
    this.#filterModel.setFilter(filterType);
  };
}
