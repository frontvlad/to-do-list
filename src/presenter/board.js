//View
import BoardContainerView from '../view/board-container.js';
import SortView from '../view/sort.js';
import TasksContainerView from '../view/tasks-container.js';
import ShowButtonView from '../view/show-button.js';

//Presenter
import TaskPresenter from './task.js';
import NewTaskPresenter from './new-task.js';

//Supporting const
import { State, SortType, TASK_COUNT_PER_STEP, ViewAction } from '../const.js';

//Supporting function
import { render, replace, remove } from '../utils/render.js';
import { sortTrips } from '../utils/filtering-sorting.js';

////


export default class Board {
  constructor(container, onViewUpdateData, onViewAction) {

    //Callback
    this._onViewUpdateData = onViewUpdateData;
    this._onViewAction = onViewAction;

    //Variable
    this._currentSortType = SortType.DEFAULT;
    this._renderedTaskCount = TASK_COUNT_PER_STEP;
    this._isOpenNewTask = false;

    //Container
    this._container = container;

    //Data
    this._tasksData = null;
    this._sortTasksData = null;

    //Components
    this._showButtonComponent = null;
    this._boardContainerComponent = null;
    this._sortComponent = null;
    this._tasksContainerComponent = null;
    this._taskPresenter = {};

    //Handler
    this._onClickSort = this._onClickSort.bind(this);
    this._onTypeViewChange = this._onTypeViewChange.bind(this);
    this._onClickShowButton = this._onClickShowButton.bind(this);
    this._onCloseNewTask = this._onCloseNewTask.bind(this);

  }

  init(tasksData) {
    this._tasksData = tasksData;
    this._sortTasksData = sortTrips[this._currentSortType](this._tasksData);
  }


  //Render

  renderBoard() {
    this._renderBoardContainer();
    this._renderSort();
    this._renderTasksContainer();
    this.renderTasks();
  }

  _renderBoardContainer() {
    const prevBoardContainerComponent = this._boardContainerComponent;

    if (prevBoardContainerComponent !== null) {
      return;
    }

    this._boardContainerComponent = new BoardContainerView();
    render(this._container, this._boardContainerComponent, 'beforeend');
  }

  _renderSort(state = State.DEFAULT) {
    const prevSortComponent = this._sortComponent;

    this._sortComponent = new SortView(this._currentSortType, state);
    this._sortComponent.setClickSortHandler(this._onClickSort);

    if (prevSortComponent === null) {
      render(this._boardContainerComponent, this._sortComponent, 'beforeend');
      return;
    }

    replace(this._sortComponent, prevSortComponent);
    remove(prevSortComponent);
  }

  _renderTasksContainer() {
    const prevTasksContainerComponent = this._tasksContainerComponent;

    if (prevTasksContainerComponent !== null) {
      return;
    }

    this._tasksContainerComponent = new TasksContainerView();
    render(this._boardContainerComponent, this._tasksContainerComponent, 'beforeend');
  }

  _renderShowButton() {
    if (this._showButtonComponent !== null) {
      this._showButtonComponent === null;
      remove(this._showButtonComponent);
    }

    this._showButtonComponent = new ShowButtonView();
    this._showButtonComponent.setClickShowButtonHandler(this._onClickShowButton);

    render(this._boardContainerComponent, this._showButtonComponent, 'beforeend');

  }

  renderTasks() {
    this._sortTasksData
      .slice(0, Math.min(this._tasksData.length, this._renderedTaskCount))
      .forEach((task) => {
        this._renderTask(task);
      });

    if (this._renderedTaskCount < this._tasksData.length) {
      this._renderShowButton();
      return;
    }

    this.removeShowButton();
  }

  _renderTask(taskData) {
    const newTask = new TaskPresenter(this._tasksContainerComponent, this._onViewUpdateData, this._onTypeViewChange);
    newTask.init(taskData, this._isOpenNewTask);
    newTask.renderTask();
    this._taskPresenter[taskData.id] = newTask;
  }

  renderNewTask() {
    this._newTaskPresenter = new NewTaskPresenter(this._tasksContainerComponent, this._onViewUpdateData, this._onCloseNewTask);
    this._newTaskPresenter.renderNewTask();
    this._renderedTaskCount -= 1;

    this._isOpenNewTask = true;

    this._onViewAction(ViewAction.OPEN_NEW_TASK);
  }


  //Update

  updateControl(update) {
    this._taskPresenter[update.id].init(update);
    this._taskPresenter[update.id].updateControl();
  }


  //Remove

  removeTasks() {
    Object
      .values(this._taskPresenter)
      .forEach((presenter) => presenter.removeTask());
    this._taskPresenter = {};
  }

  removeShowButton() {
    remove(this._showButtonComponent);
    this._showButtonComponent === null;
  }

  removeNewTask() {
    if (this._newTaskPresenter) {
      this._newTaskPresenter.removeNewTask();
      this._newTaskPresenter = null;
      this._renderedTaskCount += 1;

      this._isOpenNewTask = false;

      this._onViewAction(ViewAction.CLOSE_NEW_TASK);
    }
  }


  //Handler

  _onClickShowButton() {
    this._renderedTaskCount += TASK_COUNT_PER_STEP;
    this.removeTasks();
    this.renderTasks();
  }

  _onTypeViewChange() {
    if (this._newTaskPresenter) {
      this.removeNewTask();
      this.removeTasks();
      this.renderTasks();
      return;
    }

    Object
      .values(this._taskPresenter)
      .forEach((presenter) => {
        presenter.resetView();
      });
  }

  _onClickSort(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._sortTasksData = sortTrips[this._currentSortType](this._tasksData);

    this._renderSort();
    this.removeNewTask();
    this.removeTasks();
    this.renderTasks();
  }

  _onCloseNewTask() {
    if (this._newTaskPresenter) {
      this.removeNewTask();
      this.removeTasks();
      this.renderTasks();
    }
  }


  //State

  setStaetViewTask(taskId, state) {
    this._taskPresenter[taskId].setStateView(state);
  }

  setStaetNewViewTask(state) {
    this._newTaskPresenter.setStateView(state);
  }


  //Other

  resetTaskView(id) {
    this._taskPresenter[id].resetView();
  }

  resetRenderedTaskCount() {
    this._renderedTaskCount = TASK_COUNT_PER_STEP;
  }

}
