import Presenter from './presenter/mainPresenter.js';
import DestinationModel from './model/destination-model.js';
import PointsModel from './model/point-model.js';
import OffersModel from './model/offer-model.js';

const filterContainer = document.body.querySelector('.trip-controls__filters');
const eventsContainer = document.body.querySelector('.trip-events');

const pointsModel = new PointsModel();
const destinationModel = new DestinationModel();
const offersModel = new OffersModel();
pointsModel.init();
destinationModel.init();
offersModel.init();

const presenter = new Presenter({eventsContainer, filterContainer, pointsModel, destinationModel, offersModel});
presenter.init();
