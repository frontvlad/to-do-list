//Parents
import AbstractView from './abstract.js';

///


//Template

const createBoardContainerTemplate = () => {
  return '<section class="board container"></section>';
};


export default class BoardContainer extends AbstractView {

  getTemplate() {
    return createBoardContainerTemplate();
  }
}
