import PointsList from '../view/pointsListView.js';
import { render,remove } from '../framework/render.js';
import SortView from '../view/sortView.js';
import FilterPresenter from './filter-presenter.js';
import PointsPresenter from './points-presenter.js';
import { SortTypes, UserAction, UpdateType } from '../const.js';
import dayjs from 'dayjs';
import PointPresenter from './point-presenter.js';
import TripInfoPresenter from './trip-info-presenter.js';
import LoadingView from '../view/loading-view.js';

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
  #loadingComponent = null;
  #tripInfoPresenter = null;
  #tripMainContainer = null;

  constructor({eventsContainer, filterContainer, pointsModel, destinationModel, offersModel, filterModel, tripMainContainer,}) {
    this.#eventsContainer = eventsContainer;
    this.#filterContainer = filterContainer;
    this.#pointsModel = pointsModel;
    this.#destinationModel = destinationModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;
    this.#tripMainContainer = tripMainContainer;
  }

  init() {
    this.#renderLoading();

    Promise.all([
      this.#destinationModel.init(),
      this.#offersModel.init(),
      this.#pointsModel.init(),
    ])
      .then(() => {
        this.#removeLoading();
        this.#destinations = this.#destinationModel.destinations;
        this.#filterModel.addObserver(this.#handleFilterChange);
        this.points = this.#sortPoints(this.#pointsModel.getPoints());
        this.renderPage();
        this.#renderTripInfo();

        const newEventButton = document.querySelector('.trip-main__event-add-btn');
        if (newEventButton) {
          newEventButton.addEventListener('click', this.#handleNewEventButtonClick);
        }
      })
      .catch(() => {
        this.#removeLoading();
        this.#renderPoints();
      });
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
      onSortTypeChange: this.#handleSortChange
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
    let actionType;
    switch (updatedPoint.action) {
      case 'ADD':
        actionType = UserAction.ADD_POINT;
        break;
      case 'DELETE':
        actionType = UserAction.DELETE_POINT;
        break;
      case 'UPDATE':
        actionType = UserAction.UPDATE_POINT;
        break;
    }
    this.#handleViewAction(actionType, UpdateType.MINOR, updatedPoint.point);
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

  #renderLoading() {
    this.#loadingComponent = new LoadingView();
    render(this.#loadingComponent, this.#eventsContainer);
  }

  #removeLoading() {
    if (this.#loadingComponent) {
      remove(this.#loadingComponent);
    }
  }

  #renderTripInfo() {
    const tripInfoContainer = this.#tripMainContainer.querySelector('.trip-main');
    this.#tripInfoPresenter = new TripInfoPresenter(tripInfoContainer, {
      events: this.#pointsModel.points,
      destinations: this.#destinationModel.destinations,
    });
    this.#tripInfoPresenter.init();
  }

  async #handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsPresenter.setSaving();
        try {
          await this.#pointsModel.updatePoint(update);
          this.#updatePoints();
        } catch (err) {
          this.#pointsPresenter.setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#pointsPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(update);
          this.#updatePoints();
        } catch (err) {
          this.#pointsPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointsPresenter.setDeleting();
        try {
          await this.#pointsModel.deletePoint(update.id);
          this.#updatePoints();
        } catch (err) {
          this.#pointsPresenter.setAborting();
        }
        break;
    }
  }
}
