//Parents
import Observer from './utils/observer.js';

////

export default class Tasks extends Observer {
  constructor() {
    super();

    this._tasks = [];
  }

  setData(tasks, updateType) {
    this._tasks = tasks.slice();
    this._notify(updateType);
  }

  getData() {
    return this._tasks;
  }

  updateData(update, updateType) {
    const index = this._tasks.findIndex((task) => task.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this._tasks = [
      ...this._tasks.slice(0, index),
      update,
      ...this._tasks.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addData(update, updateType) {
    this._tasks = [
      update,
      ...this._tasks,
    ];

    this._notify(updateType, update);
  }

  deleteData(updateId, updateType) {
    const index = this._tasks.findIndex((task) => task.id === updateId);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting tasks');
    }

    this._tasks = [
      ...this._tasks.slice(0, index),
      ...this._tasks.slice(index + 1),
    ];
    this._notify(updateType);
  }

}
