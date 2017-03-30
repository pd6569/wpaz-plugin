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
    },

    // scene presets - naming must match data attributes in layout file
    scenePresets: {
        head: {
            bone: "",
            muscle: "https://human.biodigital.com/widget?be=1mCV&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
            artery: "",
            vein: "",
            vessel: "",
            nerve: "",
            lymph: "",
            organ: "",
        },
        neck: {
            bone: "",
            muscle: "",
            artery: "",
            vein: "",
            vessel: "",
            nerve: "",
            lymph: "",
            organ: "",
        },
        thorax: {
            bone: "",
            muscle: "",
            artery: "",
            vein: "",
            vessel: "",
            nerve: "",
            lymph: "",
            organ: "",
        },
        back: {
            bone: "",
            muscle: "",
            artery: "",
            vein: "",
            vessel: "",
            nerve: "",
            lymph: "",
            organ: "",
        },
        abdomen: {
            bone: "",
            muscle: "",
            artery: "",
            vein: "",
            vessel: "",
            nerve: "",
            lymph: "",
            organ: "",
        },
        pelvis: {
            bone: "",
            muscle: "",
            artery: "",
            vein: "",
            vessel: "",
            nerve: "",
            lymph: "",
            organ: "",
        },
        upperLimb: {
            bone: "",
            muscle: "",
            artery: "",
            vein: "",
            vessel: "",
            nerve: "",
            lymph: "",
            organ: "",
        },
        lowerLimb: {
            bone: "",
            muscle: "",
            artery: "",
            vein: "",
            vessel: "",
            nerve: "",
            lymph: "",
            organ: "",
        },
        body: {
            bone: "",
            muscle: "",
            artery: "",
            vein: "",
            vessel: "",
            nerve: "",
            lymph: "",
            organ: "",
        }
    }



};