import { render, replace, remove } from '../framework/render.js';
import Filter from '../view/filterView.js';

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
        type: 'everything',
        count: points.length,
        isDisabled: points.length === 0
      },
      {
        type: 'future',
        count: points.filter((p) => new Date(p.dateFrom) > now).length,
        isDisabled: points.filter((p) => new Date(p.dateFrom) > now).length === 0
      },
      {
        type: 'present',
        count: points.filter((point) => new Date(point.dateFrom) <= now && new Date(point.dateTo) >= now).length,
        isDisabled: points.filter((p) => new Date(p.dateFrom) <= now && new Date(p.dateTo) >= now).length === 0
      },
      {
        type: 'past',
        count: points.filter((point) => new Date(point.dateTo) < now).length,
        isDisabled: points.filter((p) => new Date(p.dateTo) < now).length === 0
      }
    ];
  }

  #handleFilterTypeChange = (filterType) => {
    this.#filterModel.setFilter(filterType);
  };
}
