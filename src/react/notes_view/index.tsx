import React, {
  Fragment,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { Modal } from "@arco-design/web-react";
import NotesAPI from "./api";
import { NotesPreview } from "./notes_preview";
import { NotesSidebar } from "./notes_sidebar";

export interface INote {
  body: string;
  id: number;
  title: string;
  updated: number;
}
export interface INoteEdit {
  title: string;
  body: string;
  defaultTitle: string;
  defaultBody: string;
}

export const handleEqualEdit = (noteEdit: INoteEdit) => {
  const { title, body, defaultBody, defaultTitle } = noteEdit;
  return title === defaultTitle && body === defaultBody;
};

const useNotesView = () => {
  const noteEditRef = useRef<INoteEdit>({
    title: "",
    body: "",
    defaultTitle: "",
    defaultBody: "",
  });

  const handleInitNoteEditRef = useCallback((title: string, body: string) => {
    noteEditRef.current.title = title;
    noteEditRef.current.body = body;
    noteEditRef.current.defaultTitle = title;
    noteEditRef.current.defaultBody = body;
  }, []);

  const [notes, setNotes] = useState<INote[]>(() => NotesAPI.getAllNotes());

  const handleRefresh = (activeId?: number) => {
    const newNote: INote[] = NotesAPI.getAllNotes();
    if (activeId) {
      const newIndex = newNote.findIndex((item) => item.id === activeId);
      setCurrent(newIndex !== -1 ? newIndex : 0);
    } else {
      setCurrent(0);
    }
    setNotes(newNote);
  };

  const handleIsShowModal = (
    title: string,
    callback: () => void,
    onOkCallback: () => void
  ) => {
    if (!handleEqualEdit(noteEditRef.current)) {
      Modal.confirm({
        title: title,
        onCancel: () => {
          callback && callback();
        },
        onOk: () => {
          onOkCallback && onOkCallback();
        },
      });
    } else {
      callback && callback();
    }
  };

  const handleNoteAdd = () => {
    const noteAddCallBack = () => {
      const newNote = {
        title: "新建笔记",
        body: "开始记录...",
      };
      NotesAPI.saveNote(newNote);
      handleRefresh();
    };
    handleIsShowModal("是否保存当前笔记后再新增笔记", noteAddCallBack, () => {
      handleNoteEdit();
      requestAnimationFrame(noteAddCallBack);
    });
  };

  const handleNoteEdit = (activeId?: number) => {
    const id = notes[current].id;
    NotesAPI.saveNote({
      id,
      title: noteEditRef.current.title,
      body: noteEditRef.current.body,
    });
    handleRefresh(activeId);
  };
  const handleDeleteNote = (id: number) => {
    Modal.confirm({
      title: "是否删除当前笔记",
      onOk: () => {
        NotesAPI.deleteNote(id);
        handleRefresh();
      },
    });
  };

  const [current, setCurrent] = useState(0);
  const handleChangeCurrent = (index: number) => {
    handleIsShowModal(
      "是否保存当前笔记后再切换笔记",
      () => setCurrent(index),
      () => {
        const note = notes[index];
        const id = note.id;
        handleNoteEdit(id);
      }
    );
  };

  const note = useMemo(() => {
    const note = notes[current];
    handleInitNoteEditRef(note?.title, note?.body);
    return note;
  }, [current, notes, handleInitNoteEditRef]);


  return {
    current,
    handleChangeCurrent,
    handleNoteAdd,
    handleNoteEdit,
    handleDeleteNote,
    notes,
    note,
    noteEditRef,
  };
};
const NotesView = () => {
  const {
    current,
    handleChangeCurrent,
    handleNoteAdd,
    handleNoteEdit,
    handleDeleteNote,
    notes,
    note,
    noteEditRef,
  } = useNotesView();
  return (
    <Fragment>
      <NotesSidebar
        current={current}
        handleChangeCurrent={handleChangeCurrent}
        handleNoteAdd={handleNoteAdd}
        notes={notes}
      />
      <NotesPreview
        note={note}
        handleNoteEdit={handleNoteEdit}
        handleDeleteNote={handleDeleteNote}
        noteEditRef={noteEditRef}
      />
    </Fragment>
  );
};

export { NotesView };

export default NotesView;
