import React, { useState } from 'react';

import { TodoForm } from './TodoForm';
import { TodosList } from './TodosList';
import { useTodos } from './hooks';
import { TodoType } from './types';

const Todo: React.FC = () => {
  const [todos, setTodos] = useState<Array<TodoType>>([]);
  const { error, loading, handleAddTodo, handleComplete, handleRemove } = useTodos(setTodos);

  return (
    <div className="container">
      <TodoForm handleAddTodo={handleAddTodo}/>
      { loading && <div>Loading...</div> }
      { !loading && !error
        && <TodosList todos={todos} handleRemove={handleRemove} handleComplete={handleComplete}/> }
      { !loading && error && <div>Error: {error.message}</div> }
    </div>
  );
};

export default Todo;