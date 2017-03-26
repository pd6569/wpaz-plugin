/**
 * Created by peter on 25/03/2017.
 */

class Note {

    constructor (order, title, text, sceneStateStr) {

        this.id = "notes-" + order;
        this.order = order;
        this.title = title;
        this.text = text;
        this.sceneStateStr = sceneStateStr;

        // add notes to global notes object
        this.addNote(this);
    }

    getId(){
        return this.id;
    }

    getOrder(){
        return this.order;
    }

    getTitle(){
        return this.title;
    }

    getText(){
        return this.text;
    }

    getSceneStateStr(){
        return this.sceneStateStr;
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