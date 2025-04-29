import { render } from '../framework/render';
import EmptyPoints from '../view/emptyPointsListView';
import PointPresenter from './point-presenter';


export default class PointsPresenter {
  #points = [];
  #offers = [];
  #destinations = [];

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
    eventsContainer
  }) {
    this.#destinationModel = destinationModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#pointsListView = pointsListView;
    this.#container = eventsContainer;
  }

  init() {
    this.#points = [...this.#pointsModel.getPoints()];
    this.#destinations = [...this.#destinationModel.getDestinations()];
    this.#renderComponents();
  }

  #renderComponents() {
    this.#renderPointsList();
  }

  #handlePointChange = (updatedPoint) => {
    this.#pointsModel.updatePoint(updatedPoint.point);
    if (updatedPoint.action === 'DELETE') {
      this.#pointPresenter.get(updatedPoint.point.id).destroy();
      this.#pointPresenter.delete(updatedPoint.point.id);
    } else {
      this.#pointPresenter.get(updatedPoint.point.id).init(updatedPoint.point);
    }
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderPointsList() {
    render(this.#pointsListView, this.#container);

    if (this.#points.length === 0) {
      render(new EmptyPoints(), this.#container);
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
  }
}
