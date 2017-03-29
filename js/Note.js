/**
 * Created by peter on 25/03/2017.
 */

class Note {

    constructor (sequence, title, note_content, scene_state, uid) {



        this.uid = uid || Utils.generateUID();
        this.sequence = sequence;
        this.title = title;
        this.note_content = note_content;
        this.scene_state = scene_state;

        console.log("new note created. uid: " + this.uid);

        // add notes to global notes object

        appGlobals.numNotes = parseInt(appGlobals.numNotes) + 1;
        this.addNote();
        this.updateSequenceIndex();

    }

    getUid(){
        return this.uid;
    }

    setUid(uid){
        this.uid = uid;
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
        appGlobals.notes[this.uid] = this;
        console.log("new note added to global notes: " + JSON.stringify(this.title));
    }


    // update notes collection
    updateNotes(){
        appGlobals.notes[this.uid] = this;
        console.log("appGlobal.notes updated. uid: " + this.uid);
    }

    // Sequence index
    updateSequenceIndex(){
        appGlobals.sequenceIndex.push([this.uid, this.sequence])
    }

    /* STATIC FUNCTIONS */

    static removeNote(uid){
        if (appGlobals.notes[uid]) {
            console.log("delete note: " + appGlobals.notes[uid].uid + " sequence: " + appGlobals.notes[uid].sequence);
            delete appGlobals.notes[uid];
            appGlobals.numNotes = parseInt(appGlobals.numNotes) - 1;

            // Update sequence index
            let indexRemove;
            for (let i = 0; i < appGlobals.sequenceIndex.length ; i++){
                if (appGlobals.sequenceIndex[i][0] === uid){
                    indexRemove = i;
                    break;
                }
            }
            appGlobals.sequenceIndex.splice(indexRemove, 1);

            // Reset sequences for notes
            for (let i = 0; i < appGlobals.sequenceIndex.length; i++) {
                let newSequence = i + 1;
                appGlobals.sequenceIndex[i][1] = newSequence;
            }

            // Update object with new sequence
            appGlobals.sequenceIndex.forEach((note) => {
                let uid = note[0];
                let sequence = note[1];
                appGlobals.notes[uid].sequence = sequence;
            });

            console.log("Note deleted. Num notes: " + appGlobals.numNotes);
        } else {
            console.log("removeNote failed. Could not delete note with uid: " + uid);
        }
    }

}