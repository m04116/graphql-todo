import React from 'react';
import {loader} from "graphql.macro";
import {useQuery} from "@apollo/react-hooks";

import { TodoForm } from './TodoForm';
import { TodosList } from './TodosList';
import { useTodos } from './hooks';
import { GetAllTodos } from './types';

const getAllTodosSchema = loader('./Schemas/GetAllTodos.graphql');

const Todo: React.FC = () => {
  const { data = {getAllTodos: []}, loading, error } = (useQuery(getAllTodosSchema)) as GetAllTodos;
  const { handleAddTodo, handleComplete, handleRemove } = useTodos();

  return (
    <div className="container">
      <TodoForm handleAddTodo={handleAddTodo}/>
      { loading && <div>Loading...</div> }
      { !loading && !error
        && <TodosList todos={data.getAllTodos} handleRemove={handleRemove} handleComplete={handleComplete}/> }
      { !loading && error && <div>Error: {error.message}</div> }
    </div>
  );
};

export default Todo;