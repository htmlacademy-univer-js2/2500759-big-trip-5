import { FILTER_GENERATOR } from '../const';

const generateFilters = (points) => Object.entries(FILTER_GENERATOR).map(([filterType, filterValue]) => ({
  type: filterType,
  count: filterValue(points).length,
}));

export {generateFilters};
