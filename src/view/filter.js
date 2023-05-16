//Parents
import AbstractView from './abstract.js';

//Supporting const
import { FilterType, State } from '../const.js';

//Supporting function
import { filterTrips } from '../utils/filtering-sorting.js';

////


//Function

const getFilterItems = (tasksData) => {
  return [
    {
      type: FilterType.ALL,
      name: 'All',
      count: filterTrips[FilterType.ALL](tasksData).length,
    },
    {
      type: FilterType.OVERDUE,
      name: 'Overdue',
      count: filterTrips[FilterType.OVERDUE](tasksData).length,
    },
    {
      type: FilterType.TODAY,
      name: 'Today',
      count: filterTrips[FilterType.TODAY](tasksData).length,
    },
    {
      type: FilterType.FAVORITES,
      name: 'Favorites',
      count: filterTrips[FilterType.FAVORITES](tasksData).length,
    },
    {
      type: FilterType.REPEATING,
      name: 'Repeating',
      count: filterTrips[FilterType.REPEATING](tasksData).length,
    },
    {
      type: FilterType.ARCHIVE,
      name: 'Archive',
      count: filterTrips[FilterType.ARCHIVE](tasksData).length,
    },
  ];
};

const isChecked = (currentFilterType, itemFilterType) => currentFilterType === itemFilterType ? 'checked' : '';

const isDisabled = (state) => {
  if (state === State.DEFAULT) {
    return '';
  }

  if (state === State.DISABLED) {
    return 'disabled';
  }
};


//Template

const createFilterTemplate = (tasksData, currentFilterType, state) => {
  if (!tasksData) {
    tasksData = [];
  }
  return `<section class="main__filter filter container">${createFilterItemListTemplate(tasksData, currentFilterType, state)}</section>`;
};

const createFilterItemListTemplate = (tasksData, currentFilterType, state) => {
  return getFilterItems(tasksData).map((item) => createFilterItemTemplate(item, currentFilterType, state)).join('');
};

const createFilterItemTemplate = (filterItem, currentFilterType, state) => {
  return `<input type="radio" value="${filterItem.type}" id="filter__${filterItem.type}" class="filter__input visually-hidden" name="filter" ${isDisabled(state)} ${isChecked(currentFilterType, filterItem.type)}/>
  <label for="filter__${filterItem.type}" class="filter__label">${filterItem.name} <span class="filter__${filterItem.type}-count">${filterItem.count}</span></label>`;
};


export default class Filter extends AbstractView {
  constructor(tasksData, currentFilterType, state) {
    super();

    //Variable
    this._state = state;
    this._currentFilterType = currentFilterType;

    //Data
    this._tasksData = tasksData;

    //Handler
    this._onChangeFilter = this._onChangeFilter.bind(this);

  }

  getTemplate() {
    return createFilterTemplate(this._tasksData, this._currentFilterType, this._state);
  }

  //Handler

  setChangeFilterHandler(callback) {
    this._callback.changeFilter = callback;
    this.getElement().addEventListener('change', this._onChangeFilter);
  }

  _onChangeFilter(evt) {
    evt.preventDefault();
    this._callback.changeFilter(evt.target.value);
  }

}
