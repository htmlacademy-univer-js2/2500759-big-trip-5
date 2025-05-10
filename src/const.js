import { pointPast, pointFuture, pointPresent } from './point-filters';

export const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

export const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export const FORM_INPUT_TIME_FORMAT = 'DD/MM/YY HH:mm';
export const POINT_TYPE = ['taxi', 'bus', 'ship', 'train', 'flight', 'drive', 'check-in', 'sightseeing', 'restaurant'];
export const DATE_FORMAT = {
  'full-date': 'YYYY-MM-DD',
  'month-day': 'MMM DD',
  'hours-minutes': 'HH:mm',
  'full-date-and-time': 'YYYY-MM-DDTHH:mm',
  'full-date-and-time-slash': 'DD/MM/YYYY HH:mm',
  'flatpickr': 'd/m/y H:i',
  'duration': 'HH[H] mm[M]'
};

export const FILTER_TYPES = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

export const FILTER_GENERATOR = {
  [FILTER_TYPES.EVERYTHING]: (points) => [...points],
  [FILTER_TYPES.PAST]: (points) => points.filter((point) => pointPast(point)),
  [FILTER_TYPES.PRESENT]: (points) => points.filter((point) => pointPresent(point)),
  [FILTER_TYPES.FUTURE]: (points) => points.filter((point) => pointFuture(point)),
};

export const SortTypes = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer'
};

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const ApiMethod = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export const ContentType = {
  JSON: 'application/json',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};
