import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import objectSupport from 'dayjs/plugin/objectSupport';

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

const pointPast = (point) => dayjs().isAfter(dayjs(point.dateTo));
const pointFuture = (point) => dayjs().isBefore(dayjs(point.dateFrom));
const pointPresent = (point) => dayjs().isAfter(dayjs(point.dateFrom)) && dayjs().isBefore(dayjs(point.dateTo));

const updateItem = (items, update) => items.map((item) => item.id === update.id ? update : item);
const isEscapeKey = (evt) => evt.key === 'Escape';

export {formateDate, getDuration, pointFuture, pointPast, pointPresent, updateItem, isEscapeKey};
