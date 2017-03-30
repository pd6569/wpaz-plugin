/**
 * Created by peter on 25/03/2017.
 */

let appGlobals = {

    // data
    notes: {},
    sequenceIndex: [],
    numNotes: 0,
    actions: {},

    // templates
    templates: {
        NOTE_SECTION: {},
    },

    // current note object (being edited or viewed in right hand panel)
    currentNote: {},

    // load status
    notesLoaded: false,
    humanLoaded: false,

    // actions
    actions: {}, // note uid : array of ordered actions
    currentAction: {},
    actionTypes: {
        GENERAL: 'general'
    }

};