/**
 * Created by peter on 22/03/2017.
 */

class AnatomyTour {

    constructor() {
        console.log("anatomy tours loaded");

        // get BioDigital Human
        this.human = new HumanAPI("embedded-human");
        this.$humanWidget = jQuery('#embedded-human');

        // 3d model variables
        this.humanLoaded = false;
        this.cameraInfo = {};
        this.currentSceneState = {};
        this.resetSceneState = {};
        this.sceneInfo = {};
        this.sceneObjects = {};

        // notes variables
        this.notes = {};
        this.currentNote = {};
        this.sceneStateString = "";
        this.currentNotesSequence = 1;
        this.numNotes = 0;

        // actions varibles
        this.numActions = 0;
        this.storedActions = [];

        // templates
        this.itemTemplates = {};

        // user
        this.isUserAdmin = ajax_object.wp_az_user_role;

        this.human.on('human.ready', () => {
            console.log("Human is now ready for action");
            this.humanLoaded = true;
            this.updateCameraInfo();
            this.setToolbarListeners();
            this.setInitialSceneState((sceneState) => {
                this.sceneObjects = sceneState.objects;
            });
            this.registerCallbacks();
        });

        // DOM

        /* edit notes */
        this.$notesContainer = jQuery('#wpaz-notes-container');
        this.$postTitle = jQuery('.post-title');
        this.$noteSequenceNum = jQuery('.notes-sequence');
        this.$noteSequenceNum.text("1");
        this.$notesTitle = jQuery('.notes-title');
        this.$notesText = jQuery('.notes-text');
        this.$actionStatusBox = jQuery('#action-status-box');
        this.$savingStatus = jQuery('.saving-status');
        this.$addAction = jQuery('#action-add');
        this.$saveBtn = jQuery('#notes-save-btn');
        this.$addNewNotesSection = jQuery('#notes-add-new-btn');
        this.$actionsDropdownContainer = jQuery('#actions-dropdown-container');

        /* timeline */
        this.$editNote = jQuery('.edit-note');


        // DOM Event listeners

        let self = this;

        this.$editNote.on('click', function(event){
            event.preventDefault();
            let $noteItem = jQuery(this).closest('div.note-item');
            let sequence = $noteItem.attr('sequence');
            let title = $noteItem.find('.note-title').text();
            let note_content = $noteItem.find('.note-content').text();
            console.log("edit note. sequence: " + sequence + " title: " + title);

            self.loadSingleNote(sequence);
        });

        this.$addNewNotesSection.on('click', (event) => {
            event.preventDefault();
            console.log("addNewNotes");
            this.saveNotes(() => {
                this.addNotesSection();
            });

        });

        this.$saveBtn.on('click', (event) => {
            event.preventDefault();
            console.log("Save notes");
            this.saveNotes();


        });

        this.$addAction.on('click', (event) => {

            this.numActions++;

            /*let actionId = "action-" + this.numActions;
            let $actionItem = jQuery("<li id='" + actionId + "' class='list-group-item'><a>" + this.numActions + ". Updated Camera Position</a></li>")

            event.preventDefault();
            this.$actionsDropdownContainer.append($actionItem);

            // create new camera action
            let action = new Action(this.numActions, 'camera', this.cameraInfo);
            this.storedActions.push(action);
            console.log("action stored: " + JSON.stringify(action));

            $actionItem.on('click', (event) => {
                this.human.send('camera.set', {
                    position: action.data.position,
                    up: action.data.up,
                    animate: true
                })
            })*/


            let actionId = "action-" + this.numActions;
            let $actionItem = jQuery("<li id='" + actionId + "' class='list-group-item'><a> Action " + this.numActions + "</a></li>")

            event.preventDefault();
            this.$actionsDropdownContainer.append($actionItem);

            /*// create new camera action
            let action = new Action(this.numActions, 'camera', this.cameraInfo);
            this.storedActions.push(action);
            console.log("action stored: " + JSON.stringify(action));

            $actionItem.on('click', (event) => {
                this.human.send('camera.set', {
                    position: action.data.position,
                    up: action.data.up,
                    animate: true
                })
            })
            */

            // create new generic action
            this.getSceneState((sceneState) => {
                let genAction = new Action(this.numActions, 'general', sceneState);
                console.log("Scene state saved as action");
                Utils.updateActionStatusBox("Action added to this note set.");

                $actionItem.on('click', (event) => {
                    event.preventDefault();

                    this.human.send('camera.set', {
                        position: genAction.data.camera.eye,
                        target: genAction.data.camera.look,
                        up: genAction.data.camera.up,
                        animate: true
                    }, () => {
                        this.human.send('scene.restore', sceneState)
                    });



                })

            });


        });

        // Load notes data
        this.loadNotes();

        if(!this.isUserAdmin) {
            this.setScanner();
        }

        this.itemTemplates = ajax_object.wp_az_item_templates;
        console.log("item templates: " + JSON.stringify(this.itemTemplates));
        jQuery('#notes-timeline').append(this.itemTemplates['NOTE_SECTION']);
    }

    addNotesSection(){

        this.numNotes++;
        this.currentNotesSequence = this.numNotes;

        let note = new Note(this.currentNotesSequence, "", "", "");

        this.$notesTitle.val("");
        this.$notesText.val("");

    }

    loadNotes(){
        console.log("loadNotes");
        jQuery.ajax({
            url: ajax_object.wp_az_ajax_url,
            data: {
                action: 'load_notes',
                wp_az_3d_tours_nonce: ajax_object.wp_az_3d_tours_nonce,
                wp_az_post_id: ajax_object.wp_az_post_id,
            },
            error: function() {
                console.log("Failed to load notes");
            },
            success: function(data) {
                console.log("Notes loaded: " + JSON.stringify(data));
            },
            type: 'GET'
        });
    }

    loadSingleNote(noteSequenceNumber) {

        console.log("loadSingleNote: " + noteSequenceNumber);

        let data = {
            action: 'load_single_note',
            wp_az_3d_tours_nonce: ajax_object.wp_az_3d_tours_nonce,
            wp_az_post_id: ajax_object.wp_az_post_id,
            wp_az_sequence: noteSequenceNumber
        };

        //!* Process the AJAX POST request
        jQuery.get(ajax_object.wp_az_ajax_url, data, response => {
            if (response.status == 'success' && response.notes != null && response.scene_state != null) {
                let noteToLoad = new Note(response.notes.sequence, response.notes.title, response.notes.note_content, response.scene_state);
                console.log("Noted loaded: " + noteToLoad.title + " sequence: " + noteToLoad.sequence);
                this.saveNotes(() => {
                    console.log("save notes and then set title: " + noteToLoad.title);
                    this.$noteSequenceNum.text(noteToLoad.sequence);
                    this.$notesTitle.val(noteToLoad.title);
                    this.$notesText.val(noteToLoad.note_content);
                    this.currentNote = noteToLoad;
                })
            } else {
                console.log("Failed to load note, or no note" + JSON.stringify(response));
            }
        });

    }

    /*loadNotes(){

        this.numNotes++;

        let data = {
            action: 'load_notes',
            wp_az_3d_tours_nonce: ajax_object.wp_az_3d_tours_nonce,
            wp_az_post_id: ajax_object.wp_az_post_id,
        };

        //!* Process the AJAX POST request
        jQuery.get(ajax_object.wp_az_ajax_url, data, response => {
            if (response.status == 'success' && response.notes != null && response.scene_state != null) {
                let note = new Note(response.notes.sequence, response.notes.title, response.notes.note_content, response.scene_state);
            } else {
                console.log("Failed to load notes, or no notes available" + JSON.stringify(response));
            }
        });

    }*/

    saveNotes(callback){
        Utils.setSavingStatus("Saving...");

        this.human.send('scene.capture', (sceneState) => {
            this.currentSceneState = sceneState;

            let note = {};
            let title = this.$notesTitle.val();
            let note_content = this.$notesText.val();
            let sequence = this.currentNotesSequence;
            let scene_state = JSON.stringify(this.currentSceneState);

            // create new notes object if does not already exist
            if (Object.keys(this.currentNote).length == 0 || this.currentNote == null) {
                let note = new Note(sequence, title, note_content, scene_state);
                this.currentNote = note;
            } else {
                this.currentNote.setNoteContent(note_content);
                this.currentNote.setTitle(title);
                note = this.currentNote;
            }

            //!* Data to make available via the $_POST variable
            let data = {
                action: 'save_notes',
                wp_az_3d_tours_nonce: ajax_object.wp_az_3d_tours_nonce,
                wp_az_post_id: ajax_object.wp_az_post_id,
                wp_az_note_object: note
            };

            //!* Process the AJAX POST request
            jQuery.post(ajax_object.wp_az_ajax_url, data, response => {
                if (response.status == 'success') {
                    // Show success message, then fade out the button after 2 seconds
                    console.log("Noted saved! " + JSON.stringify(response));
                    Utils.setSavingStatus("Notes saved.", 3000);

                    // execute callback function
                    if(callback) callback();
                } else {
                    // Re-enable the button and revert to original text
                    console.log("Failed. " + JSON.stringify(response));
                    Utils.setSavingStatus("Saving notes failed.", 3000);

                }
            });

        });
    }

    getCameraInfoFromSceneState(sceneState) {
        return sceneState.eye;
    }

    getObjectsFromSceneState(sceneState) {
        return sceneState.objects;
    }

    registerCallbacks() {

        this.human.on("camera.updated", (cameraInfo) => {
            this.cameraInfo = cameraInfo;
        });
    }

    getSceneInfo (callback) {
        console.log("getSceneInfo");
        this.human.send('scene.info', (sceneInfo) => {
            callback(sceneInfo);
            return sceneInfo;
        })
    }

    getSceneState(callback){

        this.human.send('scene.capture', (sceneState) => {
            callback(sceneState);
            return sceneState;
        })
    }

    setInitialSceneState(callback){
        console.log("setInitialSceneState");
        if (this.sceneStateString.length > 0){
            console.log("setInitialSceneState restore previous scene state");
            let sceneState = JSON.parse(this.sceneStateString);
            this.human.send("scene.restore", sceneState);

            // save scene as reset point
            this.resetSceneState = sceneState;
            callback(sceneState);
        } else {
            console.log("setInitialSceneState no previous state to restore, set reset point");
            this.human.send('scene.capture', (sceneState) => {
               this.resetSceneState = sceneState;
                callback(sceneState);
            });

        }
    }

    setScanner(){
        //ignores 'left', 'right', and 'bones of the' when searching for matching anatomy objects.
        let toStrip = /^left\s|right\s|bones\sof\sthe\s/i;

        this.$humanWidget.scanner({toStrip: toStrip, formatData: {
            prefix: function(dataId) {
                return '<a class="anatomy-object" data-id="' + dataId + '">'
            },
            suffix: "</a>"
        }});
    }

    /*loadNotes(){

        Utils.showLoading(jQuery('#wpaz-notes'));

        let data = {
            action: 'load_notes',
            wp_az_post_id: ajax_object.wp_az_post_id,
            wp_az_notes_order: this.currentNotesSequence
        };

        //!* Process the AJAX GET request
        jQuery.get(ajax_object.wp_az_ajax_url, data, response => {
            Utils.hideLoading();
            this.$notesContainer.removeClass('hidden');
            if (response.status == 'success') {
                // Show success message, then fade out the button after 2 seconds
                console.log("loadNotes success!");
                this.notes = response.notes;
                response.scene_state != null ? this.sceneStateString = response.scene_state : this.sceneStateString = "";

                if (response.notes){

                    this.$postTitle.text(response.notes.notes_title);

                    if (this.humanLoaded) {
                        console.log("human already loaded, set scene state");
                        this.setInitialSceneState((sceneState) => {
                            this.sceneObjects = sceneState.objects;
                        });
                    }

                    if (this.isUserAdmin) {
                        this.$notesTitle.val(response.notes.notes_title);
                        this.$notesText.text(response.notes.notes_text);
                    } else {
                        this.$notesTitle.text(response.notes.notes_title);
                        this.$notesText.empty().append(response.notes.notes_text);

                        //ignores 'left', 'right', and 'bones of the' when searching for matching anatomy objects.
                        let toStrip = /^left\s|right\s|bones\sof\sthe\s/i;

                        this.$humanWidget.scanner({toStrip: toStrip, formatData: {
                            prefix: function(dataId) {
                                return '<a class="anatomy-object" data-id="' + dataId + '">'
                            },
                            suffix: "</a>"
                        }});
                    }
                }


            } else {
                // Re-enable the button and revert to original text
                console.log("Failed. " + JSON.stringify(response));
            }
        });
    }*/

    updateCameraInfo() {
        console.log("updateCameraInfo");

        // set initial variables
        this.human.send("camera.info", (camera) => {
            this.cameraInfo = camera;
        })
    }

    setToolbarListeners() {

        // get DOM elements
        console.log("setToolbarListeners");

        let $toolbarReset = jQuery('#toolbar-reset');

        $toolbarReset.on('click', event => {
            console.log("reset scene");
            this.human.send("scene.restore", this.resetSceneState);
        })

    }
}

jQuery(document).ready(function() {
    new AnatomyTour();
});




