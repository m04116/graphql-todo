import { useCallback } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { loader } from 'graphql.macro';

import { AllTodosType, UseTodosType } from './types';

const getAllTodosSchema = loader('./Schemas/GetAllTodos.graphql');
const addTodoSchema = loader('./Schemas/AddTodo.graphql');
const updateTodoSchema = loader('./Schemas/UpdateTodo.graphql');
const removeTodoSchema = loader('./Schemas/RemoveTodo.graphql');

export const useTodos = (): UseTodosType => {
  const [ addTodo ] = useMutation(addTodoSchema);
  const [ checkTodo ] = useMutation(updateTodoSchema);
  const [ removeTodo ] = useMutation(removeTodoSchema);

  const handleAddTodo = useCallback((title: string) => {
    addTodo({
      variables: { todo: { title }},
      optimisticResponse: {
        __typename: 'Mutation',
        addTodo: {
          __typename: 'Todo',
          id: Date.now(), // just for correct render, on server 'id' will be replaced
          title,
          completed: false
        }
      },

      update: (proxy, { data: { addTodo } }) => {
        const data: AllTodosType = proxy.readQuery({ query: getAllTodosSchema });
        proxy.writeQuery({ query: getAllTodosSchema, data: {
          getAllTodos: [addTodo, ...data.getAllTodos],
        }});
      }

    });
  }, []);
  const handleComplete = useCallback((id: string) => () => {
    checkTodo({
      variables: { id },
      update: (proxy, { data: { updateTodo } }) => {
        proxy.writeQuery({ query: getAllTodosSchema, data: {
            getAllTodos: updateTodo
        }});
      }
    })
  }, []);
  const handleRemove = useCallback((id: string) => () => {
    removeTodo({
      variables: { id },
      update: (proxy, { data: { removeTodo } }) => {
        proxy.writeQuery({ query: getAllTodosSchema, data: {
            getAllTodos: removeTodo
          }});
      }
    })
  }, []);

  return {
    addTodo,
    handleAddTodo,
    handleComplete,
    handleRemove,
  }
}