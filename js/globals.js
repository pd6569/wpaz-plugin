/**
 * Created by peter on 25/03/2017.
 */

let appGlobals = {

    // app data
    post_id: 0,
    notes: {},
    sequenceIndex: [],
    numNotes: 0,
    actions: {},
    firstSceneUrl: "",
    context: "", // 3D_BODY, NOTES_PAGE, NOTES_DASHBOARD

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
            all: "https://human.biodigital.com/widget?be=1mHr&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
            bone: "https://human.biodigital.com/widget?be=1mHv&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
            muscle: "https://human.biodigital.com/widget?be=1mCV&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
            artery: "https://human.biodigital.com/widget?be=1mI8&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
            vein: "https://human.biodigital.com/widget?be=1mI5&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
            vessel: "https://human.biodigital.com/widget?be=1mI3&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
            nerve: "https://human.biodigital.com/widget?be=1mHz&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
            lymph: "https://human.biodigital.com/widget?be=1mID&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
            organ: "https://human.biodigital.com/widget?be=1mII&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
        },
        neck: {
            all: "",
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
            all: "",
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
            all: "",
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
            all: "",
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
            all: "",
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
            all: "",
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
            all: "",
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
            all: "",
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