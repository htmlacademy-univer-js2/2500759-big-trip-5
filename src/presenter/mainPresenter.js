import PointsList from '../view/pointsListView.js';
import { render } from '../framework/render.js';
import SortView from '../view/sortView.js';
import FilterPresenter from './filter-presenter.js';
import PointsPresenter from './points-presenter.js';
import { SortTypes } from '../const.js';
import dayjs from 'dayjs';
import PointPresenter from './point-presenter.js';

export default class Presenter {
  #eventsContainer = null;
  #filterContainer = null;
  #pointsModel = null;
  #destinationModel = null;
  #offersModel = null;
  #pointsPresenter = null;
  #filterModel = null;
  #sortType = SortTypes.DAY;
  #pointsListComponent = new PointsList();
  #destinations = [];

  constructor({eventsContainer, filterContainer, pointsModel, destinationModel, offersModel, filterModel}) {
    this.#eventsContainer = eventsContainer;
    this.#filterContainer = filterContainer;
    this.#pointsModel = pointsModel;
    this.#destinationModel = destinationModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;
  }

  init() {
    const points = this.#pointsModel.getPoints();
    this.#destinations = this.#destinationModel.getDestinations();
    this.#filterModel.addObserver(this.#handleFilterChange);
    this.points = this.#sortPoints(points);
    this.renderPage();

    const newEventButton = document.querySelector('.trip-main__event-add-btn');
    newEventButton.addEventListener('click', this.#handleNewEventButtonClick);
  }

  #handleNewEventButtonClick = () => {
    this.#filterModel.setFilter('everything');
    this.#sortType = SortTypes.DAY;
    this.#pointsPresenter.resetView();
    this.#renderNewPointForm();
  };

  #renderNewPointForm() {
    const defaultDestination = this.#destinations[0];
    const newPoint = {
      id: crypto.randomUUID(),
      type: 'taxi',
      dateFrom: new Date().toISOString(),
      dateTo: new Date().toISOString(),
      basePrice: 0,
      offers: [],
      isFavorite: false,
      destination: defaultDestination.id,
      activeDestination: defaultDestination,
      isNew: true,
    };
    const pointPresenter = new PointPresenter({
      pointListContainer: document.querySelector('.trip-events__list'),
      offersModel: this.#offersModel,
      destinations: this.#destinations,
      onDataChange: this.handleEventChange,
      onModeChange: this.#handleModeChange,
    });
    pointPresenter.init(newPoint);
    pointPresenter.setEditMode();
  }

  renderPage() {
    this.#renderSort();
    this.#renderFilter();
    render(this.#pointsListComponent, this.#eventsContainer);
    this.#renderPoints();
  }

  #renderSort() {
    const sortComponent = new SortView({
      onSortTypeChange: (sortType) => {
        this.#sortType = sortType;
        this.#updatePoints();
      }
    });
    render(sortComponent, this.#eventsContainer);
  }

  #handleSortChange = (sortType) => {
    if (this.#sortType === sortType) {
      return;
    }
    this.#sortType = sortType;
    this.points = this.#sortPoints(this.#pointsModel.getPoints());
    this.#clearPointsBoard();
    this.#renderPoints();
  };

  #updatePoints() {
    this.points = this.#sortPoints(this.#pointsModel.getPoints());
    this.#clearPointsBoard();
    this.#renderPoints();
  }

  #renderFilter() {
    const filterPresenter = new FilterPresenter({
      filterContainer: this.#filterContainer,
      filterModel: this.#filterModel,
      pointsModel: this.#pointsModel
    });
    filterPresenter.init();
  }

  #renderPoints() {
    this.#pointsPresenter = new PointsPresenter({
      pointsListView: this.#pointsListComponent,
      eventsContainer: this.#eventsContainer,
      destinationModel: this.#destinationModel,
      offersModel: this.#offersModel,
      pointsModel: this.#pointsModel,
      onDataChange: this.handleEventChange,
      onModeChange: this.#handleModeChange
    });
    this.#pointsPresenter.init();
  }

  handleEventChange = (updatedPoint) => {
    switch (updatedPoint.action) {
      case 'ADD':
        this.#pointsModel.addPoint(updatedPoint.point);
        break;
      case 'DELETE':
        this.#pointsModel.deletePoint(updatedPoint.point.id);
        break;
      case 'UPDATE':
        this.#pointsModel.updatePoint(updatedPoint.point);
        break;
    }
    this.#updatePoints();
  };

  #handleModeChange = () => {
    this.#pointsPresenter.resetView();
  };

  #clearPointsBoard() {
    this.#pointsPresenter.destroy();
  }

  #sortPoints(points) {
    const sortedPoints = [...points];
    switch (this.#sortType) {
      case SortTypes.PRICE:
        return sortedPoints.sort((a, b) => b.basePrice - a.basePrice);
      case SortTypes.TIME:
        return sortedPoints.sort((a, b) => {
          const durationA = dayjs(a.dateTo).diff(a.dateFrom);
          const durationB = dayjs(b.dateTo).diff(b.dateFrom);
          return durationB - durationA;
        });
      case SortTypes.DAY:
      default:
        return sortedPoints.sort((a, b) => dayjs(a.dateFrom).diff(b.dateFrom));
    }
  }

  #handleFilterChange = () => {
    this.#sortType = SortTypes.DAY;
    this.#updatePoints();
  };
}
