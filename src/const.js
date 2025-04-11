import { pointFuture, pointPast, pointPresent } from './utils';

export const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export const POINT_TYPE = ['taxi', 'bus', 'ship', 'train', 'flight', 'drive', 'check-in', 'sightseeing', 'restaurant'];
export const DATE_FORMAT = {
  'full-date': 'YYYY-MM-DD',
  'month-day': 'MMM DD',
  'hours-minutes': 'HH:mm',
  'full-date-and-time': 'YYYY-MM-DDTHH:MM',
  'full-date-and-time-slash': 'DD/MM/YYYY HH:mm',
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
