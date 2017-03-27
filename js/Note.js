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
        this.addNote();
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

    setTitle(title){
        this.title = title;
        console.log("title updated");
    }

    getNoteContent(){
        return this.note_content;
    }

    setNoteContent(note_content){
        this.note_content = note_content;
        console.log("note_content updated");
    }

    getSceneState(){
        return this.scene_state;
    }

    setSceneState(sceneState){
        this.scene_state = sceneState;
        console.log("scene_state updated");
    }

    addNote() {
        appGlobals.notes[this.id] = this;
        console.log("new note added to global notes: " + JSON.stringify(this.title));
    }

    removeNote(id){
        if (appGlobals.notes[id]) {
            delete appGlobals.notes[id];
        } else {
            console.log("removeNote failed. Could not delete note with id: " + id);
        }
    }

    // update notes collection
    updateNotes(){
        appGlobals.notes[this.sequence] = this;
        console.log("notes updated. new content: " + appGlobals.notes[this.sequence]);
    }
}