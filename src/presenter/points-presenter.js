import { render } from '../framework/render';
import EmptyPoints from '../view/emptyPointsListView';
import PointPresenter from './point-presenter';
import { updateItem } from '../utils';


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
    this.#points = [...this.#pointsModel.points];
    this.#offers = [...this.#offersModel.offers];
    this.#destinations = [...this.#destinationModel.destinations];

    this.#renderComponents();
  }

  #renderComponents() {
    this.#renderPointsList();
  }

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
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
      offers: this.#offers,
      destinations: this.#destinations,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange,
    });
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  destroy() {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  }
}
