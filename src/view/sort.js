//Parents
import AbstractView from './abstract.js';

//Supporting const
import { SortType, State } from '../const.js';

///


const SortItems = [
  {
    type: SortType.DEFAULT,
    name: 'SORT BY DEFAULT',
  },
  {
    type: SortType.DATE_UP,
    name: 'SORT BY DATE up',
  },
  {
    type: SortType.DATE_DOWN,
    name: 'SORT BY DATE down',
  },
];


//Function

const isActiveClass = (currentSortType, itemSortType) => currentSortType === itemSortType ? 'board__sort-item--active' : '';

const isDisabled = (state) => {
  if (state === State.DEFAULT) {
    return '';
  }

  if (state === State.DISABLED) {
    return 'disabled';
  }
};


//Template

const createSortTemplate = (currentSortType, state) => {
  return `<div class="board__sort-list">${createSortItemListTemplate(currentSortType, state)}</div>`;
};

const createSortItemListTemplate = (currentSortType, state) => {
  return SortItems.map((itemSort) => createSortItemTemplate(itemSort, currentSortType, state)).join('');
};

const createSortItemTemplate = (itemSort, currentSortType, state) => {
  return `<a href="#" class="board__sort-item ${isActiveClass(currentSortType, itemSort.type)}" data-value="${itemSort.type}" ${isDisabled(state)}>${itemSort.name}</a>`;
};


export default class Sort extends AbstractView {
  constructor(currentSortType, state) {
    super();

    //Variable
    this._state = state;
    this._currentSortType = currentSortType;

    //Handler
    this._onClickSort = this._onClickSort.bind(this);

  }

  getTemplate() {
    return createSortTemplate(this._currentSortType, this._state);
  }


  //Handler

  setClickSortHandler(callback) {
    this._callback.clickSort = callback;
    this.getElement().addEventListener('click', this._onClickSort);
  }

  _onClickSort(evt) {
    evt.preventDefault();
    this._callback.clickSort(evt.target.dataset.value);
  }

}
