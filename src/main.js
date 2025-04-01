import Presenter from '../src/presenter/mainPresenter.js';
import { render } from './framework/render.js';
import Filter from './view/filterView.js';
import PointsModel from './model/point-model.js';
import DestinationModel from './model/destination-model.js';
import OffersModel from './model/offer-model.js';
import { generateFilters } from './mock/filters.js';

const filtersContainer = document.body.querySelector('.trip-controls__filters');
const eventsContainer = document.body.querySelector('.trip-events');

const pointsModel = new PointsModel();
const destinationsModel = new DestinationModel();
const offersModel = new OffersModel();

pointsModel.init();
destinationsModel.init();
offersModel.init();

const filters = generateFilters(pointsModel.getPoints());

render(new Filter({filters}), filtersContainer);

const boardPresenter = new Presenter({container: eventsContainer, pointsModel, destinationsModel, offersModel});

boardPresenter.init();
