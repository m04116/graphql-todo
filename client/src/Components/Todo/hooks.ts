import { useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { loader } from 'graphql.macro';

import { CashDataType, UseTodosType } from './types';

const getAllTodosSchema = loader('./Schemas/GetAllTodos.graphql');
const addTodoSchema = loader('./Schemas/AddTodo.graphql');
const updateTodoSchema = loader('./Schemas/UpdateTodo.graphql');
const removeTodoSchema = loader('./Schemas/RemoveTodo.graphql');

export const useTodos = (setTodos): UseTodosType => {
  const { data = {getAllTodos: []}, loading, error } = useQuery(getAllTodosSchema);
  const [ addTodo ] = useMutation(addTodoSchema);
  const [ checkTodo ] = useMutation(updateTodoSchema);
  const [ removeTodo ] = useMutation(removeTodoSchema);


  useEffect(() => {
    if (!loading && !error) {
      setTodos(data.getAllTodos);
    }
  }, [data.getAllTodos, loading, error, setTodos]);

  const handleAddTodo = (title: string) => {
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
        const data: CashDataType = proxy.readQuery({ query: getAllTodosSchema });
        setTodos([addTodo, ...data.getAllTodos]);
        proxy.writeQuery({ query: getAllTodosSchema, data: {
          getAllTodos: [addTodo, ...data.getAllTodos],
        }});
      }

    });
  };
  const handleComplete = (id: string) => () => {
    checkTodo({
      variables: { id },
      update: (proxy, { data: { updateTodo } }) => {
        setTodos(updateTodo);
        proxy.writeQuery({ query: getAllTodosSchema, data: {
            getAllTodos: updateTodo
        }});
      }
    })
  };
  const handleRemove = (id: string) => () => {
    removeTodo({
      variables: { id },
      update: (proxy, { data: { removeTodo } }) => {
        setTodos(removeTodo);
        proxy.writeQuery({ query: getAllTodosSchema, data: {
            getAllTodos: removeTodo
          }});
      }
    })
  };

  return {
    addTodo,
    error,
    loading,
    handleAddTodo,
    handleComplete,
    handleRemove,
  }
}