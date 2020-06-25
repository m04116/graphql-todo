import React, { useState } from 'react';

import { HandleAddTodo } from '../types';

type Props = {
  handleAddTodo: HandleAddTodo;
}

export const TodoForm: React.FC<Props> = ({ handleAddTodo }) => {
  const [title, setTitle] = useState('');

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => setTitle(target.value);
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (title) {
      handleAddTodo(title);
      setTitle('');
    }
  };

  return (
    <form
      className="input-field px1 mt2"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        name="title"
        placeholder="Enter todo here..."
        onChange={handleChange}
        value={title}
      />
    </form>
  );
};