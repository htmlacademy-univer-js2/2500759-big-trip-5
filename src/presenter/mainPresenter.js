import CreateForm from '../view/createFormView.js';
import EditForm from '../view/editFormView.js';
import RoutePoint from '../view/routePointView.js';
import { render } from '../render.js';
import PointsList from '../view/pointsListView.js';

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
    render(this.pointsListViewComponent, this.container);
    render(new EditForm(points[0], destinations, offers), this.pointsListViewComponent.getElement());
    for (const point of points) {
      render(new RoutePoint(point, destinations, offers), this.pointsListViewComponent.getElement());

    }
  }
}
