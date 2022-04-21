import React, { FC } from "react";
import classNames from "classnames";
import { INote } from ".";

const MAX_BODY_LENGTH = 60;

interface INotesSideBar {
  current: number;
  handleNoteAdd: () => void;
  handleChangeCurrent: (index: number) => void;
  notes: INote[];
}

const NotesSidebar: FC<INotesSideBar> = (props) => {
  const { current, handleNoteAdd, handleChangeCurrent, notes } = props;

  return (
    <div className="notes__sidebar">
      <button className="notes__add" type="button" onClick={handleNoteAdd}>
        添加新的笔记 📒
      </button>
      <div className="notes__list">
        {notes?.map((item, index) => {
          const { id, title, body, updated } = item;
          return (
            <div
              onClick={() => handleChangeCurrent(index)}
              className={classNames("notes__list-item", {
                "notes__list-item--selected": index === current,
              })}
              data-note-id={id}
              key={id}
            >
              <div className="notes__small-title">{title}</div>
              <div className="notes__small-body">
                {body.substring(0, MAX_BODY_LENGTH)}
                {body.length > MAX_BODY_LENGTH ? "..." : ""}
              </div>
              <div className="notes__small-updated">
                {new Date(updated).toLocaleString(undefined, {
                  dateStyle: "full",
                  timeStyle: "short",
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { NotesSidebar };
