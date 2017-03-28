/**
 * Created by peter on 25/03/2017.
 */

class Note {

    constructor (sequence, title, note_content, scene_state, doNotAdd) {



        this.id = "note-" + sequence;
        this.sequence = sequence;
        this.title = title;
        this.note_content = note_content;
        this.scene_state = scene_state;

        console.log("new note created. id: " + this.id);

        // add notes to global notes object
        if (!doNotAdd) {
            appGlobals.numNotes = parseInt(appGlobals.numNotes) + 1;
            this.addNote();
        }
    }

    getId(){
        return this.id;
    }

    getSequence(){
        return this.sequence;
    }

    setSequence(sequence){
        this.sequence = sequence;
    }

    getTitle(){
        return this.title;
    }

    setTitle(title){
        this.title = title;
        this.updateNotes();
        console.log("title updated");
    }

    getNoteContent(){
        return this.note_content;
    }

    setNoteContent(note_content){
        this.note_content = note_content;
        this.updateNotes();
        console.log("note_content updated");
    }

    getSceneState(){
        return this.scene_state;
    }

    setSceneState(sceneState){
        this.scene_state = sceneState;
        this.updateNotes();
        console.log("scene_state updated");
    }

    addNote() {
        appGlobals.notes[this.id] = this;
        console.log("new note added to global notes: " + JSON.stringify(this.title));
    }

    removeNote(id){
        if (appGlobals.notes[id]) {
            delete appGlobals.notes[id];
            appGlobals.numNotes = parseInt(appGlobals.numNotes) - 1;
        } else {
            console.log("removeNote failed. Could not delete note with id: " + id);
        }
    }

    // update notes collection
    updateNotes(){
        appGlobals.notes[this.id] = this;
        console.log("appGlobal.notes updated. id: " + this.id);
    }
}