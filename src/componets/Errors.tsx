import React from 'react';
import cn from 'classnames';
import { TypeErroros } from '../types/Errors';
type Props = {
  erroAll: TypeErroros;
  setErroAll: React.Dispatch<React.SetStateAction<TypeErroros>>;
};

export const Errors: React.FC<Props> = ({ erroAll, setErroAll }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: erroAll === TypeErroros.Normal,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErroAll(TypeErroros.Normal)}
      />
      {/* show only one message at a time */}
      {erroAll === TypeErroros.NotFindTodosErrors && <>Unable to load todos</>}
      {erroAll === TypeErroros.AddTodoErrorSpace && (
        <>
          <br />
          Title should not be empty
        </>
      )}
      {erroAll === TypeErroros.AddTodoError && (
        <>
          <br />
          Unable to add a todo
        </>
      )}
      {erroAll === TypeErroros.ErorDelet && (
        <>
          <br />
          Unable to delete a todo
        </>
      )}
      {erroAll === TypeErroros.ErorUppdate && (
        <>
          <br />
          Unable to update a todo
        </>
      )}
    </div>
  );
};
