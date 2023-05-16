//Api
import Api from '../api.js';

//Model
import TaskModel from '../model.js';

//View
import AddNewTaskButtonView from '../view/new-task-button.js';
import FilterView from '../view/filter.js';

//Presenter
import BoardPresenter from './board.js';

//Supporting const
import { UpdateType, UserAction, State, FilterType, TypeView, ViewAction, AUTHORIZATION, LINK_DATA } from '../const.js';

//Supporting function
import { render, replace, remove } from '../utils/render.js';
import { compare } from '../utils/lodash.js';
import { filterTrips } from '../utils/filtering-sorting.js';

////


export default class App {
  constructor() {

    //Variable
    this._currentFilterType = FilterType.ALL;
    this._isLoading = true;

    //Container
    this._mainContainer = document.querySelector('.main');
    this._mainControlContainer = this._mainContainer.querySelector('.main__control');

    //Data
    this._tasksData = null;
    this._filteredTasksData = null;
    this._sortedTasksData = null;

    //Components
    this._addNewTaskButtonComponent = null;
    this._filterComponent = null;

    //Handler
    this._onChangeFilter = this._onChangeFilter.bind(this);
    this._onClickAddNewTaskButton = this._onClickAddNewTaskButton.bind(this);

    this._onViewAction = this._onViewAction.bind(this);

    this._onTaskModelEvent = this._onTaskModelEvent.bind(this);
    this._onViewUpdateData = this._onViewUpdateData.bind(this);

    //Api
    this._taskApi = null;

    //Model
    this._taskModel = null;

    //Function
    this._createTaskModels();

    //Presenter
    this._boardPresenter = new BoardPresenter(this._mainContainer, this._onViewUpdateData, this._onViewAction);

  }

  //Render

  renderApp() {
    if (this._isLoading) {
      this._renderAddNewTaskButton(State.DISABLED);
      this._renderFilter(State.DISABLED);
      return;
    }

    this._renderAddNewTaskButton();
    this._renderFilter();
    this._boardPresenter.init(this._filteredTasksData);
    this._boardPresenter.renderBoard();
  }

  _renderAddNewTaskButton(state = State.DEFAULT) {
    const prevAddNewTaskButtonComponent = this._addNewTaskButtonComponent;

    this._addNewTaskButtonComponent = new AddNewTaskButtonView(state);
    this._addNewTaskButtonComponent.setClickAddNewTaskButtonHandler(this._onClickAddNewTaskButton);

    if (prevAddNewTaskButtonComponent === null) {
      render(this._mainControlContainer, this._addNewTaskButtonComponent, 'beforeend');
      return;
    }

    replace(this._addNewTaskButtonComponent, prevAddNewTaskButtonComponent);
    remove(prevAddNewTaskButtonComponent);
  }

  _renderFilter(state = State.DEFAULT) {
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(this._tasksData, this._currentFilterType, state);
    this._filterComponent.setChangeFilterHandler(this._onChangeFilter);

    if (prevFilterComponent === null) {
      render(this._mainContainer, this._filterComponent, 'beforeend');
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }


  //Handler

  _onClickAddNewTaskButton() {
    this._boardPresenter.renderNewTask();
    this._boardPresenter.removeTasks();
    this._boardPresenter.renderTasks();
  }

  _onChangeFilter(filterType) {
    if (this._currentFilterType === filterType) {
      return;
    }

    this._currentFilterType = filterType;
    this._filteredTasksData = filterTrips[this._currentFilterType](this._tasksData);

    this._boardPresenter.removeNewTask();
    this._boardPresenter.resetRenderedTaskCount();
    this._boardPresenter.init(this._filteredTasksData);
    this._boardPresenter.removeTasks();
    this._boardPresenter.renderTasks();
  }


  //Model

  _createTaskModels() {
    this._taskApi = new Api(LINK_DATA, AUTHORIZATION);
    this._taskModel = new TaskModel();
    this._taskModel.addObserver(this._onTaskModelEvent);
    this._taskApi.getData()
      .then((response) => {
        this._taskModel.setData(response, UpdateType.INIT);
      })
      .catch(() => {
        this._taskModel.setData([], UpdateType.INIT);
      });
  }

  _onTaskModelEvent(updateType, update) {
    this._tasksData = this._getTasksData();
    this._filteredTasksData = filterTrips[this._currentFilterType](this._tasksData);

    switch (updateType) {

      case UpdateType.INIT:
        this._isLoading = false;
        this.renderApp();
        break;

      case UpdateType.PATCH:
        this._renderFilter();
        this._boardPresenter.init(this._filteredTasksData);
        this._boardPresenter.updateControl(update);
        break;

      case UpdateType.MINOR:
        this._renderFilter();
        this._boardPresenter.init(this._filteredTasksData);
        this._boardPresenter.removeTasks();
        this._boardPresenter.renderTasks();
        break;

      case UpdateType.MAJOR:
        this._renderFilter();
        this._boardPresenter.removeNewTask();
        this._boardPresenter.init(this._filteredTasksData);
        this._boardPresenter.removeTasks();
        this._boardPresenter.renderTasks();
        break;
    }
  }


  //Callback

  _onViewUpdateData(update, actionType, typeView) {

    switch (actionType) {

      case UserAction.ADD:
        this._boardPresenter.setStaetNewViewTask(State.SAVING);
        this._taskApi.addData(update)
          .then((response) => {
            this._taskModel.addData(response, UpdateType.MAJOR);
          })
          .catch(() => {
            this._boardPresenter.setStaetNewViewTask(State.ABORTING);
          });
        break;

      case UserAction.DELETE:
        this._boardPresenter.setStaetViewTask(update.id, State.DELETING);
        this._taskApi.deleteData(update.id)
          .then(() => {
            this._taskModel.deleteData(update.id, UpdateType.MINOR);
          })
          .catch(() => {
            this._boardPresenter.setStaetViewTask(update.id, State.ABORTING);
          });
        break;

      case UserAction.UPDATE:
        const currentTaskData = this._tasksData.find(({ id }) => id === update.id);

        if (compare(update, currentTaskData)) {
          this._boardPresenter.resetTaskView(update.id);
          return;
        }

        this._boardPresenter.setStaetViewTask(update.id, State.SAVING);
        this._taskApi.updateData(update)
          .then((response) => {
            if (typeView === TypeView.DEFAULT && this._isRerenderBoard(update, currentTaskData)) {
              this._taskModel.updateData(response, UpdateType.PATCH);
              return;
            }

            this._taskModel.updateData(response, UpdateType.MINOR);
          })

          .catch(() => {
            this._boardPresenter.setStaetViewTask(update.id, State.ABORTING);
          });
        break;
    }
  }

  _onViewAction(viewAction) {
    switch (viewAction) {
      case ViewAction.OPEN_NEW_TASK:
        this._renderAddNewTaskButton(State.DISABLED);
        break;

      case ViewAction.CLOSE_NEW_TASK:
        this._renderAddNewTaskButton(State.DEFAULT);
        break;
    }
  }


  //Get

  _getTasksData() {
    return this._taskModel.getData();
  }


  //Other

  _isRerenderBoard(update, currentData) {
    if (this._currentFilterType === FilterType.ARCHIVE && update.is_archived !== currentData.is_archived) {
      return false;
    }

    if (this._currentFilterType === FilterType.FAVORITES && update.is_favorite !== currentData.is_favorite) {
      return false;
    }

    return true;
  }
}
