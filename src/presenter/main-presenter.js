import SortingView from '../view/sorting.js';
import EventsListView from '../view/points-list.js';
import EmptyListView from '../view/empty-list-view.js';
import LoadingView from '../view/loading-view.js';
import FailedLoadView from '../view/failed-load-view.js';
import PointPresenter from './point-presenter.js';
import NewEventBtnView from '../view/new-event-btn-view.js';
import NewPointPresenter from './new-point-presenter.js';
import { filter, sort, isEscapeKey } from '../utils.js';
import { FilterTypes, NoEventsTexts, SortTypes, TimeLimit, UpdateType, UserAction } from '../const.js';
import { RenderPosition, remove, render } from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

export default class MainPresenter {
  #eventListComponent = new EventsListView();
  #noEventsComponent = null;
  #sortComponent = null;
  #addBtnComponent = null;
  #loadingComponent = new LoadingView();
  #failedLoadComponent = new FailedLoadView();
  #listContainer = null;
  #btnContainer = null;
  #eventsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filterModel = null;
  #currentSortType = SortTypes.DAY;
  #pointPresenters = new Map();
  #isLoading = true;
  #isAddingNewEvent = false;
  #newPointPresenter = null;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor(listContainer, buttonContainer, eventsModel, offersModel, destinationsModel, filterModel) {
    this.#listContainer = listContainer;
    this.#btnContainer = buttonContainer;
    this.#eventsModel = eventsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;

    this.#eventsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get events() {
    const filteredEvents = filter[this.#filterModel.filter](this.#eventsModel.events);
    sort[this.#currentSortType](filteredEvents);
    return filteredEvents;
  }

  get offers() {
    return this.#offersModel.offers;
  }

  get destinations() {
    return this.#destinationsModel.destinations;
  }

  init() {
    this.#renderFullPointsBoard();
  }

  #renderAddBtnComponent() {
    this.#addBtnComponent = new NewEventBtnView({onBtnClick: this.#handleAddPointBtnClick});
    render(this.#addBtnComponent, this.#btnContainer);
  }

  #renderSortList() {
    this.#sortComponent = new SortingView({onSortChange: this.#handleSortChange, currentSortType: this.#currentSortType});
    render(this.#sortComponent, this.#listContainer, RenderPosition.AFTERBEGIN);
  }

  #renderFullPointsBoard({resetSortType = false} = {}) {
    render(this.#eventListComponent, this.#listContainer);
    if (this.#isLoading) {
      render(this.#loadingComponent, this.#listContainer);
      return;
    }
    if (this.events.length === 0) {
      this.#renderNoEventsComponent();
      return;
    }
    if (resetSortType) {
      this.#currentSortType = SortTypes.DAY;
    }
    this.#renderSortList();
    this.#renderPoints();
  }

  #renderPoints() {
    for (let i = 0; i < this.events.length; i++) {
      this.#renderPoint(this.events[i]);
    }
  }

  #renderNoEventsComponent() {
    this.#noEventsComponent = new EmptyListView({text: NoEventsTexts[this.#filterModel.filter]});
    render(this.#noEventsComponent, this.#listContainer);
  }

  #renderErrorComponent() {
    render(this.#failedLoadComponent, this.#listContainer);
  }

  #clearFullBoard() {
    remove(this.#noEventsComponent);
    remove(this.#loadingComponent);
    remove(this.#failedLoadComponent);
    remove(this.#sortComponent);
    if (!this.#isAddingNewEvent && this.#newPointPresenter) {
      this.#newPointPresenter.destroy();
    }
    this.#clearPointsBoard();
  }

  #clearPointsBoard() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointsContainer: this.#eventListComponent.element,
      offers: this.offers,
      destinations: this.destinations,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
      newPointFormComponent: this.#newPointPresenter
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#eventsModel.updateEvent(updateType, update);
        } catch(error) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_EVENT:
        this.#newPointPresenter.setSaving();
        this.#isAddingNewEvent = false;
        try {
          await this.#eventsModel.addEvent(updateType, update);
        } catch(error) {
          this.#newPointPresenter.setAborting();
          this.#isAddingNewEvent = true;
        }
        break;
      case UserAction.DELETE_EVENT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#eventsModel.deleteEvent(updateType, update);
        } catch(error) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearFullBoard();
        this.#renderFullPointsBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearFullBoard();
        this.#renderFullPointsBoard({resetSortType: true});
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderFullPointsBoard();
        this.#renderAddBtnComponent();
        break;
      case UpdateType.ERROR:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderErrorComponent();
    }
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetFormView());
  };

  #handleSortChange = (evt) => {
    if (evt.target.closest('input')) {
      if (this.#currentSortType === evt.target.dataset.sortType) {
        return;
      }
      this.#currentSortType = evt.target.dataset.sortType;
      this.#clearPointsBoard();
      this.#renderPoints();
    }
  };

  #handleAddPointBtnClick = () => {
    this.#isAddingNewEvent = true;
    this.#newPointPresenter = new NewPointPresenter({
      container: this.#eventListComponent.element,
      offers: this.offers,
      destinations: this.destinations,
      onDataChange: this.#handleViewAction,
      onResetForm: this.#handleNewEventFormClose
    });
    this.#currentSortType = SortTypes.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterTypes.EVERYTHING);
    this.#handleModeChange();
    this.#newPointPresenter.init();
    this.#addBtnComponent.element.disabled = true;
    document.addEventListener('keydown', this.#escapeKeydownHandler);
    remove(this.#noEventsComponent);
  };

  #escapeKeydownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#newPointPresenter.destroy();
      document.removeEventListener('keydown', this.#escapeKeydownHandler);
    }
  };

  #handleNewEventFormClose = () => {
    this.#addBtnComponent.element.disabled = false;
    document.removeEventListener('keydown', this.#escapeKeydownHandler);
    this.#isAddingNewEvent = false;
    if (this.events.length === 0) {
      this.#renderNoEventsComponent();
    }
  };
}
