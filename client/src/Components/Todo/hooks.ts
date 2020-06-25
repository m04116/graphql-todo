import { useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { loader } from 'graphql.macro';

import { CashDataType, TodoType, UseTodosType } from './types';

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
      // console.log('--updatedTodos.updateTodo--', updatedTodos.updateTodo);
      setTodos(prevState => {
        // console.log('----', prevState);
        return [...updatedTodos.updateTodo];
      })
    };
  }, [updatedTodos, setTodos]);

  useEffect(() => {
    if (filteredTodos) {
      setTodos(filteredTodos.removeTodo)
    };
  }, [filteredTodos, setTodos]);

  // const handleAddTodo = (title: string) => addTodo({ variables: { todo: { title }} });
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
        proxy.writeQuery({ query: addTodoSchema, data: {
          addTodo: [addTodo, ...data.getAllTodos]
        }});
      }

    });
  };
  const handleComplete = (todo: TodoType) => () => {
    const { id, title, completed } = todo;
    checkTodo({
      variables: { id },
      optimisticResponse: {
        __typename: 'Mutation',
        updateTodo: {
          __typename: 'Todo',
          id,
          title,
          completed: !completed
        }
      },
      update: (proxy, { data: { updateTodo } }) => {
        const data: CashDataType = proxy.readQuery({ query: getAllTodosSchema });
        // const todo = data.getAllTodos.find(({ id }) => id === updateTodo.id);
        // console.log('--update todo--', todo);
        proxy.writeQuery({ query: addTodoSchema, data: {
          addTodo: [...updateTodo]
        }});
      }
    })
  };
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



// import { useEffect, useRef } from 'react';
// import { useMutation, useQuery } from '@apollo/react-hooks';
// import { loader } from 'graphql.macro';
//
// import { CashDataType, UseTodosType } from './types';
//
// const getAllTodosSchema = loader('./Schemas/GetAllTodos.graphql');
// const addTodoSchema = loader('./Schemas/AddTodo.graphql');
// const updateTodoSchema = loader('./Schemas/UpdateTodo.graphql');
// const removeTodoSchema = loader('./Schemas/RemoveTodo.graphql');
//
// export const useTodos = (dispatch): UseTodosType => {
//   // const savedSetTodos = useRef();
//   // useEffect(() => {
//   //   savedSetTodos.current = setTodos;
//   // });
//   const { data, loading, error } = useQuery(getAllTodosSchema);
//   const [ addTodo, { data: allTodos } ] = useMutation(addTodoSchema);
//   const [ checkTodo, { data: updatedTodos } ] = useMutation(updateTodoSchema);
//   const [ removeTodo, { data: filteredTodos } ] = useMutation(removeTodoSchema);
//
//
//
//   useEffect(() => {
//     if (data && !loading && !error) {
//       dispatch({ type: 'ADD_TODO', payload: data.getAllTodos });
//     }
//   }, [data, loading, error]);
//
//
//   useEffect(() => {
//     if (allTodos) {
//       dispatch({ type: 'ADD_TODO', payload: allTodos.addTodo });
//       // console.log('--add--');
//       // @ts-ignore
//       // savedSetTodos.current(prevState => {
//       //   console.log('---prev-', prevState);
//       //   return allTodos.addTodo;
//       // })
//     };
//   }, [allTodos]);
//
//   useEffect(() => {
//     // console.log('--updatedTodos--');
//     if (updatedTodos) {
//       dispatch({ type: 'UPDATE_TODO', payload: updatedTodos.updateTodo });
//       // @ts-ignore
//       // savedSetTodos.current(todos => {
//       //   const todo = todos.find(({ id }) => id === updatedTodos.updateTodo.id)
//       //   todo.completed = updatedTodos.updateTodo.completed
//       //   // console.log('--todos--', todos);
//       //   // console.log('--data--', data);
//       //   return todos;
//       // })
//     };
//   }, [updatedTodos]);
//
//   useEffect(() => {
//     // console.log('--filteredTodos--');
//     if (filteredTodos) {
//       // @ts-ignore
//       savedSetTodos.current(filteredTodos.removeTodo)
//     };
//   }, [filteredTodos]);
//
//   const handleAddTodo = (title: string) => {
//     addTodo({
//       variables: { todo: { title }},
//       // optimisticResponse: {
//       //   __typename: 'Mutation',
//       //   addTodo: {
//       //     __typename: 'Todo',
//       //     id: 'Date.now()', // just for correct render, on server 'id' will be replaced
//       //     title,
//       //     completed: false
//       //   }
//       // },
//       //
//       // update: (proxy, { data: { addTodo } }) => {
//       //   const data: CashDataType = proxy.readQuery({ query: getAllTodosSchema });
//       //   proxy.writeQuery({ query: addTodoSchema, data: {
//       //     addTodo: [...data.getAllTodos, addTodo]
//       //   }});
//       // }
//
//     });
//   };
//
//   const handleRemove = (todoId: string) => () => {
//     removeTodo({
//       variables: { id: todoId },
//
//       // update: (proxy, { data: { removeTodo } }) => {
//       //   const data: CashDataType = proxy.readQuery({ query: getAllTodosSchema });
//       //   const updatedTodos = data.getAllTodos.filter(({ id }) => todoId!== removeTodo.id);
//       //   proxy.writeQuery({ query: addTodoSchema, data: {
//       //     addTodo: [...updatedTodos]
//       //   }});
//       // }
//
//     })
//   };
//
//   const handleComplete = (todo) => () => {
//     const { id, title, completed } = todo;
//     checkTodo({
//       variables: {id},
//       // optimisticResponse: {
//       //   __typename: 'Mutation',
//       //   updateTodo: {
//       //     __typename: 'Todo',
//       //     id,
//       //     title,
//       //     completed: !completed
//       //   }
//       // },
//
//       // update: (proxy, { data: { updateTodo } }) => {
//       //   const data: CashDataType = proxy.readQuery({ query: getAllTodosSchema });
//       //   // console.log('----', data.getAllTodos, updateTodo);
//       //   const todo = data.getAllTodos.find(({ id }) => id === updateTodo.id);
//       //   console.log('--updateTodo.id--', updateTodo);
//       //   console.log('--todo--', todo);
//       //   proxy.writeQuery({ query: addTodoSchema, data: {
//       //     addTodo: [...data.getAllTodos, updateTodo]
//       //   }});
//       // }
//
//     })
//   };
//
//   return {
//     addTodo,
//     error,
//     loading,
//     handleAddTodo,
//     handleRemove,
//     handleComplete
//   }
// }
//
//
//
