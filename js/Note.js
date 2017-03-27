/**
 * Created by peter on 25/03/2017.
 */

class Note {

    constructor (sequence, title, note_content, scene_state) {

        this.id = "notes-" + sequence;
        this.sequence = sequence;
        this.title = title;
        this.note_content = note_content;
        this.scene_state = scene_state;

        // add notes to global notes object
        this.addNote(this);
    }

    getId(){
        return this.id;
    }

    getSequence(){
        return this.sequence;
    }

    getTitle(){
        return this.title;
    }

    getNoteContent(){
        return this.note_content;
    }

    getSceneState(){
        return this.scene_state;
    }

    addNote(noteObject) {
        let id = this.id;
        appGlobals.notes[id] = noteObject;
    }

    removeNote(id){
        if (appGlobals.notes[id]) {
            delete appGlobals.notes[id];
        } else {
            console.log("removeNote failed. Could not delete note with id: " + id);
        }
    }
}