//Supporting function
import { isBeforeDate, isSameDayDate, getToday, MeasureDate, getDifferenceDates } from '../utils/date.js';

//Supporting const
import { SortType, FilterType } from '../const.js';

////


export const sortTrips = {
  [SortType.DEFAULT]: (tasksData) => tasksData,

  [SortType.DATE_UP]: (tasksData) => tasksData.slice().sort((a, b) => {
    if (!a.due_date && !b.due_date) {
      return 0;
    }

    if (!a.due_date) {
      return 1;
    }

    if (!b.due_date) {
      return -1;
    }

    return getDifferenceDates(a.due_date, b.due_date, MeasureDate.SECOND);
  }),

  [SortType.DATE_DOWN]: (tasksData) => tasksData.slice().sort((a, b) => {
    if (!a.due_date && !b.due_date) {
      return 0;
    }

    if (!a.due_date) {
      return 1;
    }

    if (!b.due_date) {
      return -1;
    }


    return getDifferenceDates(b.due_date, a.due_date, MeasureDate.SECOND);
  }),
};

export const filterTrips = {
  [FilterType.ALL]: (tasksData) => tasksData,
  [FilterType.OVERDUE]: (tasksData) => tasksData.filter(({ due_date }) => isBeforeDate(due_date, getToday(), MeasureDate.DAY)),
  [FilterType.TODAY]: (tasksData) => tasksData.filter(({ due_date }) => isSameDayDate(due_date, getToday(), MeasureDate.DAY)),
  [FilterType.FAVORITES]: (tasksData) => tasksData.filter(({ is_favorite }) => is_favorite),
  [FilterType.REPEATING]: (tasksData) => tasksData.filter(({ repeating_days }) => Object.values(repeating_days).some((day) => day)),
  [FilterType.ARCHIVE]: (tasksData) => tasksData.filter(({ is_archived }) => is_archived),
};
