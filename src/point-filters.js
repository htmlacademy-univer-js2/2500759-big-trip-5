import dayjs from 'dayjs';

const pointPast = (point) => dayjs().isAfter(dayjs(point.dateTo));
const pointFuture = (point) => dayjs().isBefore(dayjs(point.dateFrom));
const pointPresent = (point) => dayjs().isAfter(dayjs(point.dateFrom)) && dayjs().isBefore(dayjs(point.dateTo));

export{pointPast, pointPresent, pointFuture};
