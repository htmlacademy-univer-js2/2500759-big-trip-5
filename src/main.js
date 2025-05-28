import MainPresenter from './presenter/main-presenter.js';
import EventsModel from './model/events-model.js';
import HeaderPresenter from './presenter/header-presenter.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import EventsApiService from './api-services/api-service.js';
import { AUTHORIZATION, END_POINT } from './const.js';

const contentContainer = document.querySelector('.trip-events');
const filterContainer = document.querySelector('.trip-controls__filters');
const headerContainer = document.querySelector('.trip-main');

const eventsApiService = new EventsApiService(END_POINT, AUTHORIZATION);

const offersModel = new OffersModel({eventsApiService});
const destinationsModel = new DestinationsModel({eventsApiService});
const eventsModel = new EventsModel({eventsApiService, offersModel, destinationsModel});
const filterModel = new FilterModel();

const mainPresenter = new MainPresenter(contentContainer, headerContainer, eventsModel, offersModel, destinationsModel, filterModel);
const headerPresenter = new HeaderPresenter(headerContainer, eventsModel, destinationsModel, offersModel);
const filterPresenter = new FilterPresenter(filterContainer, eventsModel, filterModel);

eventsModel.init();

mainPresenter.init();
headerPresenter.init();
filterPresenter.init();
