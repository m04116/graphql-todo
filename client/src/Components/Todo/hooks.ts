import { useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { loader } from 'graphql.macro';

import { UseTodosType } from './types';

const getAllTodosSchema = loader('./Schemas/GetAllTodos.graphql');
const addTodoSchema = loader('./Schemas/AddTodo.graphql');
const updateTodoSchema = loader('./Schemas/UpdateTodo.graphql');
const removeTodoSchema = loader('./Schemas/RemoveTodo.graphql');

export const useTodos = (setTodos): UseTodosType => {
  const { data, loading, error } = useQuery(getAllTodosSchema);
  const [ addTodo, { data: allTodos } ] = useMutation(addTodoSchema);
  const [ checkTodo, { data: updatedTodos } ] = useMutation(updateTodoSchema);
  const [ removeTodo, { data: filteredTodos } ] = useMutation(removeTodoSchema);

  useEffect(() => {
    if (!loading && !error) {
      setTodos(data.getAllTodos);
    }
  }, [data, loading, error, setTodos]);

  useEffect(() => {
    if (allTodos) {
      setTodos(allTodos.addTodo)
    };
  }, [allTodos, setTodos]);

  useEffect(() => {
    if (updatedTodos) {
      setTodos(updatedTodos.updateTodo)
    };
  }, [updatedTodos, setTodos]);

  useEffect(() => {
    if (filteredTodos) {
      setTodos(filteredTodos.removeTodo)
    };
  }, [filteredTodos, setTodos]);

  const handleAddTodo = (title: string) => addTodo({ variables: { todo: { title }} });
  const handleComplete = (id: string) => () => checkTodo({ variables: { id } });
  const handleRemove = (id: string) => () => removeTodo({ variables: { id } });

  return {
    addTodo,
    error,
    loading,
    handleAddTodo,
    handleComplete,
    handleRemove,
  }
}

