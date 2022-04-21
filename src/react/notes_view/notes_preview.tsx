import React, { FC, useState, useRef, useEffect, Fragment } from "react";
import { Button, Divider } from "@arco-design/web-react";
import { handleEqualEdit, INote, INoteEdit } from ".";

interface INotesPreview {
  note: INote;
  handleNoteEdit: (activeIndex?: number) => void;
  handleDeleteNote: (id: number) => void;
  noteEditRef: React.MutableRefObject<INoteEdit>;
}

const NotesPreview: FC<INotesPreview> = (props) => {
  const { note, handleNoteEdit, handleDeleteNote, noteEditRef } = props;
  const [isDisabled, setIsDisabled] = useState(true);
  const refInput = useRef<HTMLInputElement>(null);

  const handleOnChange = (key: "title" | "body", value: string) => {
    noteEditRef.current[key] = value;
    setIsDisabled(handleEqualEdit(noteEditRef.current));
  };

  useEffect(() => {
    //update
    setIsDisabled(true);

    if (refInput.current) {
      refInput.current.focus();
    }
  }, [note?.updated]);

  return (
    <Fragment>
      {note && (
        <div className="notes__preview-view">
          <div className="notes__preview-header">
            <Button
              type="primary"
              status="success"
              className="notes__preview-button"
              onClick={() => handleNoteEdit()}
              disabled={isDisabled}
            >
              更新
            </Button>
            <Button
              type="primary"
              status="danger"
              onClick={() => handleDeleteNote(note.id)}
            >
              删除
            </Button>
          </div>
          <Divider orientation="left">{note.updated}</Divider>
          <div className="notes__preview" key={`${note.updated}-${note.id}`}>
            <input
              ref={refInput}
              className="notes__title"
              defaultValue={note.title ?? "新笔记..."}
              onChange={(event) => {
                handleOnChange("title", event.target.value);
              }}
              type="text"
              placeholder="新笔记..."
            />
            <textarea
              className="notes__body"
              defaultValue={note.body ?? "编辑笔记..."}
              onChange={(event) => {
                handleOnChange("body", event.target.value);
              }}
            ></textarea>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export { NotesPreview };
