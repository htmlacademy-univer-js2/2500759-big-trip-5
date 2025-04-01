import CreateForm from '../view/createFormView.js';
import EditForm from '../view/editFormView.js';
import RoutePoint from '../view/routePointView.js';
import PointsList from '../view/pointsListView.js';
import { render, replace } from '../framework/render.js';
import Sort from '../view/sortView.js';
import EmptyPoints from '../view/emptyPointsListView.js';

export default class Presenter {
  createFormViewComponent = new CreateForm();
  pointsListViewComponent = new PointsList();

  constructor({container, pointsModel, destinationsModel, offersModel}) {
    this.container = container;
    this.pointsModel = pointsModel;
    this.destinationsModel = destinationsModel;
    this.offersModel = offersModel;
  }

  init() {
    const points = this.pointsModel.getPoints();
    const destinations = this.destinationsModel.getDestinations();
    const offers = this.offersModel.getOffers();
    if (points.length === 0) {
      render(new EmptyPoints(), this.container);
    } else {
      render(new Sort(), this.container);
      render(this.pointsListViewComponent, this.container);
      for (const point of points) {
        this.#renderPoint(point, destinations, offers);
      }
    }
  }

  #renderPoint(point, destinations, offers) {
    const onEscKeyDownClose = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceEditForm();
        document.removeEventListener('keydown', onEscKeyDownClose);
      }
    };

    const pointElement = new RoutePoint(point, destinations, offers, () => {
      replacePoint();
      document.addEventListener('keydown', onEscKeyDownClose);
    });
    const editFormElement = new EditForm(point, destinations, offers, () => {
      replaceEditForm();
      document.removeEventListener('keydown', onEscKeyDownClose);
    });

    function replacePoint() {
      replace(editFormElement, pointElement);
    }

    function replaceEditForm() {
      replace(pointElement, editFormElement);
    }

    render(pointElement, this.pointsListViewComponent.element);
  }
}
