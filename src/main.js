import Presenter from './presenter/mainPresenter.js';
import DestinationModel from './model/destination-model.js';
import PointsModel from './model/point-model.js';
import OffersModel from './model/offer-model.js';
import FilterModel from './model/filter-model.js';
import { points} from './mock/points.js';
import { destinations } from './mock/destinations.js';
//import { offers } from './mock/offers.js';

const filterContainer = document.body.querySelector('.trip-controls__filters');
const eventsContainer = document.body.querySelector('.trip-events');

const filterModel = new FilterModel();
const pointsModel = new PointsModel(filterModel);
const destinationModel = new DestinationModel();
const offersModel = new OffersModel();
pointsModel.init(points);
destinationModel.init(destinations);

const presenter = new Presenter({eventsContainer, filterContainer, pointsModel, destinationModel, offersModel, filterModel});
presenter.init();
