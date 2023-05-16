//Parents
import AbstractView from './abstract.js';

//Supporting function
import { humanizeDate, DateFormat, isBeforeDate, getToday, MeasureDate } from '../utils/date.js';

///


//Function

const isRepeatingClass = (repeatingDays) => {
  if (Object.values(repeatingDays).some((day) => day)) {
    return ' card--repeat';
  }

  return '';
};

const isOverdueClass = (dueDate) => {
  if (isBeforeDate(dueDate, getToday(), MeasureDate.DAY)) {
    return ' card--deadline';
  }

  return '';
};


//Template

const createTaskTemplate = (taskData) => {
  const { color, description, due_date, repeating_days } = taskData;
  return `<article class="card card--${color}${isRepeatingClass(repeating_days)}${isOverdueClass(due_date)}">
  <div class="card__form">
    <div class="card__inner">
      <div class="card__color-bar">
        <svg class="card__color-bar-wave" width="100%" height="10">
          <use xlink:href="#wave"></use>
        </svg>
      </div>

      <div class="card__textarea-wrap">
        <p class="card__text">${description}</p>
      </div>

      <div class="card__settings">
        <div class="card__details">
          <div class="card__dates">
            <div class="card__date-deadline">
              <p class="card__input-deadline-wrap">
                <span class="card__date">${due_date ? humanizeDate(due_date, DateFormat.DAY_MONTH) : ''}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</article>`;
};


export default class Task extends AbstractView {
  constructor(taskData) {
    super();

    //Data
    this._taskData = taskData;

  }

  getTemplate() {
    return createTaskTemplate(this._taskData);
  }

}
