import { render } from '../framework/render';
import EmptyPoints from '../view/emptyPointsListView';
import PointPresenter from './point-presenter';


export default class PointsPresenter {
  #points = [];
  #offers = [];
  #destinations = [];
  #filterModel = null;
  #pointsModel = null;
  #destinationModel = null;
  #offersModel = null;
  #pointsListView = null;
  #container = null;

  #pointPresenter = new Map();


  constructor({
    destinationModel,
    offersModel,
    pointsModel,
    pointsListView,
    eventsContainer,
    filterModel
  }) {
    this.#destinationModel = destinationModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#pointsListView = pointsListView;
    this.#container = eventsContainer;
    this.#filterModel = filterModel;
  }

  init(points = this.#pointsModel.getPoints()) {
    this.#points = [...points];
    this.#destinations = [...this.#destinationModel.destinations];
    this.#renderComponents();
  }

  #renderComponents() {
    this.#renderPointsList();
  }

  #handlePointChange = async (updatedPoint) => {
    try {
      switch (updatedPoint.action) {
        case 'DELETE': {
          await this.#pointsModel.deletePoint(updatedPoint.point.id);
          this.#pointPresenter.get(updatedPoint.point.id)?.destroy();
          this.#pointPresenter.delete(updatedPoint.point.id);
          break;
        }
        case 'ADD': {
          const newPoint = await this.#pointsModel.addPoint(updatedPoint.point);
          this.#renderPoint(newPoint);
          break;
        }
        case 'UPDATE': {
          await this.#pointsModel.updatePoint(updatedPoint.point);
          this.#pointPresenter.get(updatedPoint.point.id)?.init(updatedPoint.point);
          break;
        }
      }
    } catch {
      this.setAborting();
    }
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  setSaving() {
    this.#pointPresenter.forEach((presenter) => presenter.setSaving());
  }

  setAborting() {
    this.#pointPresenter.forEach((presenter) => presenter.setAborting());
  }

  #renderPointsList() {
    if (!this.#pointsListView?.element) {
      render(this.#pointsListView, this.#container);
    }

    const container = this.#pointsListView.element?.querySelector('.trip-events__list') || this.#pointsListView.element;

    if (!container) {
      return;
    }

    container.innerHTML = '';

    if (this.#points.length === 0) {
      render(new EmptyPoints(this.#filterModel.filter), container);
      return;
    }

    this.#points.forEach((point) => this.#renderPoint(point));
  }

  #clearPointsList() {
    const listElement = this.#pointsListView.element;
    while (listElement.firstChild) {
      listElement.removeChild(listElement.firstChild);
    }
  }

  #getListContainer() {
    const container = this.#pointsListView.element.querySelector('.trip-events__list');
    if (!container) {
      throw new Error('List container element is required');
    }
    return container;
  }

  #renderPoint(point) {
    const container = this.#pointsListView.element.querySelector('.trip-events__list') || this.#pointsListView.element;

    const pointPresenter = new PointPresenter({
      pointListContainer: container,
      offersModel: this.#offersModel,
      destinations: this.#destinations,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange,
    });
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  updatePoint(updatedPoint) {
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  }

  destroy() {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
    if (this.#pointsListView) {
      this.#pointsListView.element.remove();
    }
  }

  resetView() {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  }
}
