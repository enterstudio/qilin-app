import fs               from "fs";
import path             from "path";
import { dispatch }     from "../dispatchers/AppDispatcher";
import EditorConstants  from "../constants/EditorConstants";
import EditorStore      from "../stores/EditorStore";
import EmitterDecorator from "../decorators/EmitterDecorator";

@EmitterDecorator
class EditorActions {
    requestContentChange( content ) {
        dispatch( EditorConstants.EDITOR_CONTENT_CHANGE, { content } );
    }

    requestShortcut( shortcut ) {
        this.emitGlobalEvent( shortcut );
    }

    requestOpenFile() {
        this.emitGlobalEvent( EditorConstants.EDITOR_OPEN_FILE_REQUEST );
    }

    handleOpenFile( file ) {
        fs.readFile( file, "utf8", ( error, data ) => {
            if ( error ) {
                dispatch( EditorConstants.EDITOR_OPEN_FILE_FAILURE, {
                    path    : file,
                    content : null,
                    message : error,
                } );
            } else {
                dispatch( EditorConstants.EDITOR_OPEN_FILE_SUCCESS, {
                    path    : file,
                    content : data,
                    message : `File ${path.basename( file )} opened`,
                } );
            }
        } );
    }

    requestAutoSave() {
        fs.writeFile( EditorStore.path, EditorStore.content, error => {
            if ( error ) {
                dispatch( EditorConstants.EDITOR_AUTOSAVE_FILE_FAILURE, {
                    path    : EditorStore.path,
                    message : error,
                } );
            } else {
                dispatch( EditorConstants.EDITOR_AUTOSAVE_FILE_SUCCESS, {
                    path    : EditorStore.path,
                    message : "File auto-saved",
                } );
            }
        } );
    }

    requestSaveFile() {
        this.emitGlobalEvent( EditorConstants.EDITOR_SAVE_FILE_REQUEST );
    }

    handleSaveFile( file ) {
        fs.writeFile( file, EditorStore.content, error => {
            if ( error ) {
                dispatch( EditorConstants.EDITOR_SAVE_FILE_FAILURE, {
                    path    : file,
                    message : error,
                } );
            } else {
                dispatch( EditorConstants.EDITOR_SAVE_FILE_SUCCESS, {
                    path    : file,
                    message : `File saved as ${file}`,
                } );
            }
        } );
    }
}

export default new EditorActions();
