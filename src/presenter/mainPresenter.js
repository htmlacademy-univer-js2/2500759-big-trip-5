import PointsList from '../view/pointsListView.js';
import { render } from '../framework/render.js';
import Sort from '../view/sortView.js';
import { generateFilters } from '../mock/filters.js';
import Filter from '../view/filterView.js';
import { updateItem } from '../utils.js';
import PointsPresenter from './points-presenter.js';

export default class Presenter {
  #eventsContainer = null;
  #filterContainer = null;
  #pointsModel = null;
  #destinationModel = null;
  #offersModel = null;
  #pointsPresenter = null;
  #pointsListComponent = new PointsList();

  constructor({eventsContainer, filterContainer, pointsModel, destinationModel, offersModel}) {
    this.#eventsContainer = eventsContainer;
    this.#filterContainer = filterContainer;
    this.#pointsModel = pointsModel;
    this.#destinationModel = destinationModel;
    this.#offersModel = offersModel;
  }

  init() {
    this.points = this.#pointsModel.getPoints();
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
    render(new Sort(), this.#eventsContainer);
  }

  #renderFilter() {
    const filters = generateFilters(this.points);
    render(new Filter({filters}), this.#filterContainer);
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
}
