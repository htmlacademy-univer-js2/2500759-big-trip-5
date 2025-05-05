export const points = [
  {
    id: 1,
    basePrice: 1000,
    dateFrom: '2015-04-10T22:00:00.000Z',
    dateTo: '2015-04-10T23:30:00.000Z',
    destination: 1,
    isFavorite: false,
    offers: [1, 2],
    type: 'taxi'
  },
  {
    id: 2,
    basePrice: 777,
    dateFrom: '2020-05-01T10:30:00.000Z',
    dateTo: '2020-05-02T11:22:13.375Z',
    destination: 2,
    isFavorite: true,
    offers: [1],
    type: 'flight'
  },
  {
    id: 3,
    basePrice: 15000,
    dateFrom: '2025-01-10T22:30:00.000Z',
    dateTo: '2025-01-10T22:43:13.375Z',
    destination: 3,
    isFavorite: false,
    offers: [],
    type: 'check-in'
  },
  {
    id: 4,
    basePrice: 500,
    dateFrom: new Date(Date.now() - 3600000).toISOString(),
    dateTo: new Date(Date.now() + 3600000).toISOString(),
    destination: 1,
    isFavorite: false,
    offers: [],
    type: 'bus'
  },
  {
    id: 5,
    basePrice: 56000,
    dateFrom: '2025-08-10T22:30:00.000Z',
    dateTo: '2025-08-10T22:43:13.375Z',
    destination: 3,
    isFavorite: false,
    offers: [],
    type: 'taxi'
  },
];
