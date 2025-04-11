import PointsList from '../view/pointsListView.js';
import { render } from '../framework/render.js';
import Sort from '../view/sortView.js';
//import { generateFilters } from '../mock/filters.js';
import Filter from '../view/filterView.js';
import { updateItem } from '../utils.js';
import PointsPresenter from './points-presenter.js';
import { SortTypes } from '../const.js';
import dayjs from 'dayjs';

export default class Presenter {
  #eventsContainer = null;
  #filterContainer = null;
  #pointsModel = null;
  #destinationModel = null;
  #offersModel = null;
  #pointsPresenter = null;
  #sortType = SortTypes.DAY;
  #pointsListComponent = new PointsList();

  constructor({eventsContainer, filterContainer, pointsModel, destinationModel, offersModel}) {
    this.#eventsContainer = eventsContainer;
    this.#filterContainer = filterContainer;
    this.#pointsModel = pointsModel;
    this.#destinationModel = destinationModel;
    this.#offersModel = offersModel;
  }

  init() {
    this.points = this.#sortPoints(this.#pointsModel.getPoints());
    this.destinations = this.#destinationModel.getDestinations();
    this.offers = this.#offersModel.getOffers();
    this.renderPage();
  }

  renderPage() {
    this.#renderSort();
    this.#renderFilter();
    render(this.#pointsListComponent, this.#eventsContainer);
    this.#renderPoint();
  }

  #renderSort() {
    render(new Sort({onSortChange: this.#handleSortChange}), this.#eventsContainer);
  }

  #renderFilter() {
    render(new Filter({points: this.eventsList}), this.#filterContainer);
  }

  #renderPoint() {
    this.#pointsPresenter = new PointsPresenter({
      pointsModel: this.#pointsModel,
      destinationModel: this.#destinationModel,
      offersModel: this.#offersModel,
      pointsListView: this.#pointsListComponent,
      eventsContainer: this.#eventsContainer
    });
    this.#pointsPresenter.init();
  }

  handleEventChange = (updatedPoint) => {
    this.points = updateItem(this.points);
    this.#pointsPresenter.updatedPoint(updatedPoint);
  };

  #clearPointsBoard() {
    this.#pointsPresenter.destroy();
  }

  #handleSortChange = (evt) => {
    if (evt.target.closest('input')) {
      if (this.#sortType === evt.target.dataset.sortType) {
        return;
      }
      this.#sortType = evt.target.dataset.sortType;
      this.points = this.#sortPoints(this.#pointsModel.getPoints());
      this.#clearPointsBoard();
      this.#renderPoint();
    }
  };

  #sortPoints(points) {
    switch (this.#sortType) {
      case SortTypes.PRICE:
        return [...points].sort((a, b) => b.basePrice - a.basePrice);
      case SortTypes.TIME:
        return [...points].sort((a, b) => dayjs(b.dateTo).diff(b.dateFrom) - dayjs(a.dateTo).diff(a.dateFrom));
      case SortTypes.DAY:
      default:
        return [...points].sort((a, b) => dayjs(a.dateFrom).diff(b.dateFrom));
    }
  }
}
