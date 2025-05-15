import Presenter from './presenter/mainPresenter.js';
import DestinationModel from './model/destination-model.js';
import PointsModel from './model/point-model.js';
import OffersModel from './model/offer-model.js';
import FilterModel from './model/filter-model.js';
import ApiService from './api-services/api-service.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';

const AUTHORIZATION = 'Basic ahsfsdfsdfs43242';
const END_POINT = 'https://21.objects.htmlacademy.pro/big-trip';

const filterContainer = document.body.querySelector('.trip-controls__filters');
const eventsContainer = document.body.querySelector('.trip-events');
const tripMainContainer = document.body.querySelector('.trip-main');

const apiService = new ApiService(END_POINT, AUTHORIZATION);
const filterModel = new FilterModel();
const pointsModel = new PointsModel(filterModel, apiService);
const destinationModel = new DestinationModel(apiService);
const offersModel = new OffersModel(apiService);


const presenter = new Presenter({
  eventsContainer,
  filterContainer,
  tripMainContainer,
  pointsModel,
  destinationModel,
  offersModel,
  filterModel,
  apiService,
});

const tripInfoPresenter = new TripInfoPresenter({
  container: tripMainContainer,
  pointsModel: pointsModel,
  destinationsModel: destinationModel,
});

Promise.all([
  destinationModel.init(),
  offersModel.init(),
  pointsModel.init(),
])
  .then(() => {
    tripInfoPresenter.init();
    presenter.init();
  })
  .catch(() => {
    tripInfoPresenter.init();
    presenter.init();
  });
