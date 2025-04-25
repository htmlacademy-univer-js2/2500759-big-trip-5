import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import objectSupport from 'dayjs/plugin/objectSupport';
import { SortTypes, FORM_INPUT_TIME_FORMAT } from './const';


dayjs.extend(utc);
dayjs.extend(objectSupport);

const formateDate = (date, format) => dayjs(date).utc().format(format);

const getDuration = (dateFrom, dateTo) => {
  const result = dayjs(dateTo).diff(dayjs(dateFrom), 'minute');

  if (result < 60) {
    return dayjs({minute: result}).format('mm[M]');
  } else if (result < 1440) {
    return dayjs({minute: result}).format('HH[H] mm[M]');
  } else {
    const minutes = result % 60;
    const days = Math.floor(result / (60 * 24));
    const hours = Math.floor(result / 60) - 24 * days;
    return `${days}D ${hours}H ${minutes}M`;
  }
};


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
  if(!date) {
    return null;
  }

  return dayjs(date).format(FORM_INPUT_TIME_FORMAT);
}

export {formateDate, getDuration, updateItem, isEscapeKey, sort, capitalize, toCamelCase, getFormTimeString};
