import React from 'react';
import cx from 'classnames';

import { HandleComplete, HandleHelper, TodoType} from '../types';

import './styles.scss'

type Props = {
  handleComplete: HandleComplete;
  handleRemove: HandleHelper;
  todos: Array<TodoType>;
}

export const TodosList: React.FC<Props> = ({ handleComplete, handleRemove, todos }): JSX.Element => {
  const renderTodosList = todos.map(todo => (
    <li key={todo.id} className={cx("todo-item", "px1", {completed: todo.completed})}>
      <label className="px1">
        <input type="checkbox" checked={todo.completed} onChange={handleComplete(todo)}/>
        <span>{todo.title}</span>
      </label>
      <i className="material-icons red-text" onClick={handleRemove(todo.id)}>delete</i>
    </li>
  ))
  return (
    <ul>
      { renderTodosList }
    </ul>
  )

}