import Presenter from '../src/presenter/mainPresenter.js';
import { render, RenderPosition } from './framework/render.js';
import Sort from './view/sortView.js';
import Filter from './view/filterView.js';
import TripInfo from './view/infoView.js';
import PointsModel from './model/point-model.js';
import DestinationModel from './model/destination-model.js';
import OffersModel from './model/offer-model.js';

const filtersContainer = document.body.querySelector('.trip-controls__filters');
const eventsContainer = document.body.querySelector('.trip-events');
const tripMainContainer = document.body.querySelector('.trip-main');

const pointsModel = new PointsModel();
const destinationsModel = new DestinationModel();
const offersModel = new OffersModel();

pointsModel.init();
destinationsModel.init();
offersModel.init();

render(new TripInfo(), tripMainContainer, RenderPosition.AFTERBEGIN);
render(new Filter(), filtersContainer);
render(new Sort(), eventsContainer);

const boardPresenter = new Presenter({container: eventsContainer, pointsModel, destinationsModel, offersModel});

boardPresenter.init();
