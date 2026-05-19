import React from 'react';
import cn from 'classnames';
type Props = {
  erroAll: boolean;
  setErroAll: React.Dispatch<React.SetStateAction<boolean>>;
  todosError: boolean;
  addTodoError: boolean | string;
  erorDelet: boolean;
  ErorUppdate: boolean;
};

export const Errors: React.FC<Props> = ({
  erroAll,
  setErroAll,
  todosError,
  addTodoError,
  erorDelet,
  ErorUppdate,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !erroAll,
      })}
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
  );
};
