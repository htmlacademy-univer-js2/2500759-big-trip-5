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

  init() {
    this.#points = [...this.#pointsModel.getPoints()];
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
    render(this.#pointsListView, this.#container);

    if (this.#points.length === 0) {
      render(new EmptyPoints(this.#filterModel.filter), this.#container);
      return;
    }

    for (let i = 0; i < this.#points.length; i++) {
      this.#renderPoint(this.#points[i]);
    }
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: document.querySelector('.trip-events__list'),
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
