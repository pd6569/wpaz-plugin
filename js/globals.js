/**
 * Created by peter on 25/03/2017.
 */

let appGlobals = {

    // app data
    appRef: {},
    post_id: 0,
    notes: {},
    sequenceIndex: [],
    numNotes: 0,
    actions: {},
    firstSceneUrl: "",
    numSnapshots: 0,
    animateUpdate: false, // set to true when animating the human, e.g. if rotating camera etc.

    // user role constants
    userRoles: {
        ADMIN: 'administrator',
        S2_MEMBER_LEVEL1: 's2_member_level1',
        S2_MEMBER_LEVEL2: 's2_member_level2',
        SUBSCRIBER: 'subscriber'
    },

    // Context
    context: "", // 3D_BODY, NOTES_PAGE, NOTES_DASHBOARD
    contextType: {
        '3D_BODY': "3D_BODY",
        'NOTES_PAGE': "NOTES_PAGE",
        'NOTES_DASHBOARD': "NOTES_DASHBOARD",
    },

    // Tabs
    tabs: {
        NOTE_EDITOR: "NOTE_EDITOR",
        MY_NOTES: "MY_NOTES",
    },

    // Modules
    modules: {
        NOTE_EDITOR: "NOTE_EDITOR",
        MY_NOTES: "MY_NOTES",
        IMAGE_MODULE: "IMAGE_MODULE",
        ANNOTATE_MODULE: "ANNOTATE_MODULE"
    },

    currentTab: "",

    // Modules
    modulesLoaded: {}, // associative array module name => module object

    // Modes - enabled/disabled. Note: Module can be loaded, but mode can be disabled.
    mode: {
        'ANNOTATE': false,
        'EDIT_IMAGE': false,
    },

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
        GENERAL: 'general',
        IMAGE: 'image',
    },

    // Action options
    actionDataTypes: {
        ROTATE_CAMERA: 'rotateCamera',
        STATIC_IMAGE: 'staticImage',
    },

    // annotations
    annotations: [], // array of annotation objects representing currently visible annotations

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
    },

    ui: {
        btnSelected: '#337ab7'
    },

};