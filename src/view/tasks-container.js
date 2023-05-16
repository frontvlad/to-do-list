//Parents
import AbstractView from './abstract.js';

///


//Template

const createTasksContainerTemplate = () => {
  return '<div class="board__tasks"></div>';
};


export default class TasksContainer extends AbstractView {

  getTemplate() {
    return createTasksContainerTemplate();
  }
}
