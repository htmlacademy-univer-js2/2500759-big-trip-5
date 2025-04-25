import dayjs from 'dayjs';
import { SortTypes, DATE_FORMAT } from './const';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';


dayjs.extend(duration);
dayjs.extend(relativeTime);

const formateDate = (date, formatKey) => {
  if (!date) {
    return '';
  }
  const format = DATE_FORMAT[formatKey] || formatKey;
  return dayjs(date).format(format);
};
const calculateDuration = (start, end) => {
  if (!start || !end) {
    return '';
  }

  const diff = dayjs(end).diff(dayjs(start));
  const days = dayjs.duration(diff).days();
  const hours = dayjs.duration(diff).hours();
  const minutes = dayjs.duration(diff).minutes();

  if (days > 0) {
    return `${days}D ${hours}H ${minutes}M`;
  }
  if (hours > 0) {
    return `${hours}H ${minutes}M`;
  }
  return `${minutes}M`;
};

const getDuration = (dateFrom, dateTo) => calculateDuration(dateFrom, dateTo);


const updateItem = (items, update) => items.map((item) => item.id === update.id ? update : item);
const isEscapeKey = (evt) => evt.key === 'Escape';

const sort = {
  [SortTypes.DAY]: (points) => points.sort((a, b) => dayjs(a.dateFrom).diff(dayjs(b.dateFrom))),
  [SortTypes.PRICE]: (points) => points.sort((a, b) => b.price - a.price),
  [SortTypes.TIME]: (points) => points.sort((a, b) => dayjs(b.dateTo).diff(dayjs(b.dateFrom)) - dayjs(a.dateTo).diff(dayjs(a.dateFrom))
  )
};

function capitalize(string) {
  return string[0].toUpperCase() + string.slice(1);
}

const toCamelCase = (str) => str.replace(/([-_][a-z])/ig, ($1) => $1.toUpperCase().replace('-', '').replace('_', ''));

function getFormTimeString(date) {
  return formateDate(date, 'full-date-and-time-slash');
}

export {formateDate, calculateDuration, getDuration, updateItem, isEscapeKey, sort, capitalize, toCamelCase, getFormTimeString};
