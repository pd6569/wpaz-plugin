/**
 * Created by peter on 25/03/2017.
 */

"use strict";

export default {

        // app data
        appRef: {},
        post_id: 0,
        notes: {},
        sequenceIndex: [], // Note sequence, array of arrays. [[noteUid, sequence]]
        numNotes: 0,
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

        // Alert Modal
        modalActive: false,

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
            ANNOTATE_MODULE: "ANNOTATE_MODULE",
            PRESENTATION_MODULE: "PRESENTATION_MODULE"
        },

        currentTab: "",

        // Modules
        modulesLoaded: {}, // associative array module name => module object

        // Modes - enabled/disabled. Note: Module can be loaded, but mode can be disabled.
        mode: {
            'ANNOTATE': false,
            'EDIT_IMAGE': false,
            'PRESENTATION': false,
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

        // Server requests
        serverRequests: {
            'savingImage': false,
            'savingNote': false
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
                all: "https://human.biodigital.com/widget?be=1shn&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                bone: "https://human.biodigital.com/widget?be=1sha&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                muscle: "https://human.biodigital.com/widget?be=1shd&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                artery: "https://human.biodigital.com/widget?be=1siG&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                vein: "https://human.biodigital.com/widget?be=1siL&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                vessel: "https://human.biodigital.com/widget?be=1si2&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                nerve: "https://human.biodigital.com/widget?be=1siO&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                lymph: "https://human.biodigital.com/widget?be=1siR&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                organ: "https://human.biodigital.com/widget?be=1siX&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
            },
            thorax: {
                all: "https://human.biodigital.com/widget?be=1tOy&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                bone: "https://human.biodigital.com/widget?be=1tOu&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                muscle: "https://human.biodigital.com/widget?be=1tP5&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                artery: "https://human.biodigital.com/widget?be=1tPC&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                vein: "https://human.biodigital.com/widget?be=1tPH&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                vessel: "https://human.biodigital.com/widget?be=1tP7&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                nerve: "https://human.biodigital.com/widget?be=1tPK&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                lymph: "https://human.biodigital.com/widget?be=1tPP&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                organ: "https://human.biodigital.com/widget?be=1tP1&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
            },

            back: {
                all: "https://human.biodigital.com/widget?be=1tPZ&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                bone: "https://human.biodigital.com/widget?be=1tPS&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                muscle: "https://human.biodigital.com/widget?be=1tPW&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                artery: "",
                vein: "",
                vessel: "",
                nerve: "https://human.biodigital.com/widget?be=1tPd&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
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
                all: "https://human.biodigital.com/widget?be=1tPo&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                bone: "https://human.biodigital.com/widget?be=1tPh&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                muscle: "https://human.biodigital.com/widget?be=1tPk&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                artery: "https://human.biodigital.com/widget?be=1tPx&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                vein: "https://human.biodigital.com/widget?be=1tPu&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                vessel: "https://human.biodigital.com/widget?be=1tPr&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                nerve: "https://human.biodigital.com/widget?be=1tQ0&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                lymph: "https://human.biodigital.com/widget?be=1tQ3&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                organ: "",
            },
            lowerLimb: {
                all: "https://human.biodigital.com/widget?be=1tQE&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                bone: "https://human.biodigital.com/widget?be=1tQ7&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                muscle: "https://human.biodigital.com/widget?be=1tQA&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                artery: "https://human.biodigital.com/widget?be=1tQK&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                vein: "https://human.biodigital.com/widget?be=1tQO&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                vessel: "https://human.biodigital.com/widget?be=1tQH&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                nerve: "https://human.biodigital.com/widget?be=1tQR&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                lymph: "https://human.biodigital.com/widget?be=1tQU&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                organ: "",
            },
            body: {
                all: "https://human.biodigital.com/widget?be=1tQX&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                bone: "https://human.biodigital.com/widget?be=1tQa&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                muscle: "https://human.biodigital.com/widget?be=1tQd&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                artery: "https://human.biodigital.com/widget?be=1tQl&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                vein: "https://human.biodigital.com/widget?be=1tQo&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                vessel: "https://human.biodigital.com/widget?be=1tQi&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                nerve: "https://human.biodigital.com/widget?be=1tQs&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                lymph: "https://human.biodigital.com/widget?be=1tQv&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
                organ: "https://human.biodigital.com/widget?be=1tQy&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7",
            }
        },

        ui: {
            btnSelected: '#337ab7'
        },

    }


