/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import * as postService from './api/todos';
import cn from 'classnames';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [erorDelet, setErorDelet] = useState(false);
  const [todosError, setTodosError] = useState(false);
  const [addTodoError, setAddTodoError] = useState<boolean | string>(false);
  const [ErorUppdate, setErorUppdate] = useState(false);
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [erroAll, setErroAll] = useState(false);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('all');
  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  useEffect(() => {
    if (!erroAll) {
      return;
    }

    const timer = setTimeout(() => {
      setErroAll(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [erroAll]);
  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setTodosError(true);
        setErroAll(true);
      });
  }, []);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  function addTodo(newTitle: string) {
    postService
      .addTodo({
        title: newTitle,
        userId: USER_ID,
        completed: false,
      })
      .then(newTodo => {
        setTodos(currentPosts => [...currentPosts, newTodo]);
        setTitle('');
      })
      .catch(() => {
        if (title === '') {
          setAddTodoError('space');
        }

        setAddTodoError(true);
      })
      .finally(() => setLoadingTodoId(null));
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    addTodo(trimmedTitle);
  };

  const handleDobelChangeTitle = (todoId: number, dobelTitle: string) => {
    setEditingTodoId(todoId);
    setEditTitle(dobelTitle);
  };

  const handleChangeComplete = (todoId: number) => {
    setTodos(curentTodos =>
      curentTodos.map(todo =>
        todoId === todo.id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const handleChangeCompleteAll = () => {
    setTodos(currentTodos => {
      const allCompleted = currentTodos.every(todo => todo.completed);

      return currentTodos.map(todo => ({
        ...todo,
        completed: !allCompleted,
      }));
    });
  };

  function deletePost(todoId: number) {
    setLoadingTodoId(todoId);
    postService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => setErorDelet(true))
      .finally(() => setLoadingTodoId(null));
  }

  const removeElement = (todoId: number) => {
    deletePost(todoId);
  };

  const removeElementAllCompleted = () => {
    setLoadingTodoId(null);
    const completedTodos = todos.filter(todo => todo.completed);

    Promise.all(completedTodos.map(todo => postService.deleteTodo(todo.id)))
      .then(() => {
        setTodos(currntTodos => currntTodos.filter(todo => !todo.completed));
      })
      .finally(() => setLoadingTodoId(null));
  };

  useEffect(() => {
    let filtered = [...todos];

    if (category === 'active') {
      filtered = filtered.filter(todo => !todo.completed);
    }

    if (category === 'completed') {
      filtered = filtered.filter(todo => todo.completed);
    }

    setVisibleTodos(filtered);
  }, [category, todos]);

  const handleEditSubmit = (todoId: number) => {
    setLoadingTodoId(todoId);
    const trimmed = editTitle.trim();

    if (!trimmed) {
      return;
    }

    postService
      .updateTodo({
        id: todoId,
        title: trimmed,
        completed: false, // або взяти з todo
        userId: USER_ID,
      })
      .then(updated => {
        setTodos(current =>
          current.map(todo => (todo.id === updated.id ? updated : todo)),
        );

        setEditingTodoId(null);
        setEditTitle('');
      })
      .catch(() => {
        setErorUppdate(true);
        setErroAll(true);
      })
      .finally(() => setLoadingTodoId(null));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {todos.length > 0 && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: todos.every(todo => todo.completed),
              })}
              data-cy="ToggleAllButton"
              onClick={handleChangeCompleteAll}
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {/* This is a completed todo */}
          {visibleTodos.map(todo => (
            <div
              data-cy="Todo"
              className={cn('todo', {
                completed: todo.completed,
              })}
              key={todo.id}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                  onChange={() => handleChangeComplete(todo.id)}
                />
              </label>
              {editingTodoId === todo.id ? (
                <form
                  onSubmit={event => {
                    event.preventDefault();
                    handleEditSubmit(todo.id);
                  }}
                >
                  <input
                    data-cy="TodoTitleField"
                    type="text"
                    className="todo__title-field"
                    placeholder="Empty todo will be deleted"
                    value={editTitle}
                    onChange={event => setEditTitle(event.target.value)}
                    autoFocus
                  />
                </form>
              ) : (
                <span
                  data-cy="TodoTitle"
                  onDoubleClick={() =>
                    handleDobelChangeTitle(todo.id, todo.title)
                  }
                  className="todo__title"
                >
                  {todo.title}
                </span>
              )}

              {/* Remove button appears only on hover */}
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => removeElement(todo.id)}
              >
                ×
              </button>

              {/* overlay will cover the todo while it is being deleted or updated */}
              <div
                data-cy="TodoLoader"
                className={cn('modal overlay', {
                  'is-active': loadingTodoId === todo.id,
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count " data-cy="TodosCounter">
              {activeTodosCount} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={cn('filter__link', {
                  selected: category === 'all',
                })}
                data-cy="FilterLinkAll"
                onClick={() => setCategory('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className={cn('filter__link', {
                  selected: category === 'active',
                })}
                data-cy="FilterLinkActive"
                onClick={() => setCategory('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn('filter__link', {
                  selected: category === 'completed',
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setCategory('completed')}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={removeElementAllCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !erroAll,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErroAll(false)}
        />
        {/* show only one message at a time */}
        {todosError && <>Unable to load todos</>}
        {addTodoError === 'space' && (
          <>
            <br />
            Title should not be empty
          </>
        )}
        {addTodoError && (
          <>
            <br />
            Unable to add a todo
          </>
        )}
        {erorDelet && (
          <>
            <br />
            Unable to delete a todo
          </>
        )}
        {ErorUppdate && (
          <>
            <br />
            Unable to update a todo
          </>
        )}
      </div>
    </div>
  );
};
