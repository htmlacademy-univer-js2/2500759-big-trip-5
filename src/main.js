import { MainPresenter } from '../src/presenter/mainPresenter.js';

const siteMainElement = document.querySelector('.main');
const boardPresenter = new MainPresenter({container: siteMainElement});

boardPresenter.init();
