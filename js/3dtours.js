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
        this.cameraInfo = {};
        this.currentSceneState = {};
        this.sceneInfo = {};
        this.sceneObjects = {};

        // actions variables
        this.numActions = 0;
        this.storedActions = [];

        // templates
        this.itemTemplates = {};

        // user
        this.isUserAdmin = ajax_object.wp_az_user_role;

        this.human.on('human.ready', () => {
            console.log("Human is now ready for action");
            appGlobals['humanLoaded'] = true;
            this.updateCameraInfo();
            this.setToolbarListeners();
            this.setInitialSceneState(this.human, (sceneState) => {
                this.sceneObjects = sceneState.objects;
            });
            this.registerCallbacks();
        });

        // DOM

        /* edit notes */

        // note top navigation
        this.$noteNavLeft = jQuery('#note-nav-left');
        this.$noteNavRight = jQuery('#note-nav-right');

        // note properties
        this.$currentNoteLabel = jQuery('#current-note-label');
        this.$numNotesLabel = jQuery('#total-notes-label');

        // edit note container
        this.$editNoteContainer = jQuery('#wpaz-notes-container');
        this.$postTitle = jQuery('.post-title');
        this.$noteSequenceNum = jQuery('.notes-sequence');
        this.$noteSequenceNum.text("1");
        this.$noteTitle = jQuery('.notes-title');
        this.$noteText = jQuery('.notes-text');
        this.$savingStatus = jQuery('.saving-status');

        // actions
        this.$addAction = jQuery('#action-add');
        this.$actionsDropdownContainer = jQuery('#actions-dropdown-container');
        this.$numActionsLabel = jQuery('#num-actions');
        this.$clearActions = jQuery('#toolbar-clear-actions');
        this.$actionStatusBox = jQuery('#action-status-box');

        // save/add notes
        this.$saveBtn = jQuery('#notes-save-btn');
        this.$addNewNotesSection = jQuery('#notes-add-new-btn');


        /* timeline */
        this.$notesTimelineContainer = jQuery('#notes-timeline');
        this.$editNote = jQuery('.edit-note');

        // Track changes
        this.changesMade = false;

        // DOM Event listeners
        this.$noteTitle.on("change keyup paste", () => {
            this.changesMade = true;
            console.log("title changed. Changes made: " + this.changesMade);
        });
        this.$noteText.on("change keyup paste", () => {
            this.changesMade = true;
            console.log("content changed. Changes made: " + this.changesMade);
        });

        this.$noteNavLeft.on('click', () => {
            this.navigateNotes('left');
        });

        this.$noteNavRight.on('click', () => {
            this.navigateNotes('right');
        });

        let setActiveNote = this.setActiveNote;

        this.$editNote.on('click', function (event) {
            event.preventDefault();
            let $noteItem = jQuery(this).closest('div.note-item');
            let id = $noteItem.attr('id');
            console.log("edit note. id: " + id);
            setActiveNote(id, true);
        });

        this.$addNewNotesSection.on('click', (event) => {
            event.preventDefault();
            console.log("addNewNotes");

            // get current notes info
            let id = appGlobals.currentNote.id;
            let title = this.$noteTitle.val();
            let note_content = this.$noteText.val();

            this.saveNotes(title, note_content);

            this.addNotesSection();

        });

        this.$saveBtn.on('click', (event) => {
            event.preventDefault();
            console.log("Save notes.");

            // get notes data
            let title = this.$noteTitle.val();
            let note_content = this.$noteText.val();

            this.saveNotes(title, note_content);


        });

        this.$addAction.on('click', (event) => {

            this.numActions++;
            this.$numActionsLabel.text(this.numActions + ' actions');

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

        this.$clearActions.on('click', () => {
            this.numActions = 0;
            this.$numActionsLabel.text('0 actions');
            this.$actionsDropdownContainer.empty();
        });

        // Load notes data
        this.loadNotes();
        this.getItemTemplates();

        if(!this.isUserAdmin) {
            this.setScanner();
        }
    }

    setActiveNote(id, scrollToTop){
        let note = appGlobals.notes[id];

        // get title/content
        let $title = jQuery('.notes-title');
        let $content = jQuery('.notes-text');

        // save current note first if changes made
        if (this.isUserAdmin && this.changesMade == true) {
            console.log("set active note. changes made, save note");
            this.saveNotes($title.val(), $content.val());
        } else {
            console.log("set active note. user not admin or no changes made")
        }

        // update note properties
        jQuery('#current-note-label').text('Note ' + note.sequence);

        // update title and content
        if (this.isUserAdmin) {
            $title.val(note.title);
            $content.val(note.note_content);
        } else {
            $title.text(note.title);
            $content.text(note.note_content);
        }

        // load scene
        this.human.send("scene.restore", JSON.parse(note.scene_state));

        // reset variables
        this.changesMade = false;

        // scroll to top
        if (scrollToTop) {
            jQuery('html, body').animate({
                scrollTop: 0
            }, 500);
        }

        appGlobals.currentNote = note;
    }

    navigateNotes(direction){
       console.log("Navigate: " + direction);

       let nextNote;
       let noteSeq = parseInt(appGlobals.currentNote.sequence);

        direction == 'right' ? noteSeq++ : noteSeq--;

        Object.keys(appGlobals.notes).forEach((noteId) => {
            if (appGlobals.notes[noteId].sequence == noteSeq) {
                this.setActiveNote(noteId);
            }
        })
    }

    getItemTemplates(){

        let $notesTimelineContainer = this.$notesTimelineContainer;

        jQuery.ajax({
            url: ajax_object.wp_az_ajax_url,
            data: {
                action: 'send_item_templates',
                wp_az_3d_tours_nonce: ajax_object.wp_az_3d_tours_nonce,
            },
            error: function() {
                console.log("Failed to get item templates");
            },
            success: function(data) {
                appGlobals.templates.NOTE_SECTION = (data.templates['NOTE_SECTION']);
            },
            type: 'GET'
        });
    }

    addNotesSection(){
        this.$noteTitle.val("");
        this.$noteText.val("");

        let sequence = (parseInt(appGlobals.numNotes) + 1);
        let addNote = new Note(sequence, "", "", "");

        this.$currentNoteLabel.text("Note " + addNote.sequence);
        this.$numNotesLabel.text(appGlobals.numNotes + " notes");

        this.human.send('scene.capture', (sceneState) => {
            addNote.setSceneState(JSON.stringify(sceneState));
            appGlobals.currentNote = addNote;
        });
    }

    loadNotes(){
        console.log("loadNotes");
        let human = this.human;
        let setInitialSceneState = this.setInitialSceneState;

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
                console.log("Notes loaded from server. human loaded: " + appGlobals['humanLoaded']);
                let notesArray = data.notes;
                if (notesArray.length > 0){
                    let numNotes = 0;
                    notesArray.forEach(function(note){
                        numNotes++;
                        let addNote = new Note(note.sequence, note.title, note.note_content, note.scene_state);
                        if (numNotes == 1) appGlobals.currentNote = addNote;
                    });

                    console.log("appGlobals notes object created. currentNote: " + appGlobals.currentNote.title + " total number of notes " + appGlobals.numNotes);
                    if (appGlobals.humanLoaded == true) setInitialSceneState(human, null);

                } else {
                    human.send('scene.capture', (sceneState) => {
                        let sceneStateStr = JSON.stringify(sceneState);
                        appGlobals.currentNote = new Note(1, "", "", sceneStateStr);
                        console.log("no notes to load. New note created.");
                    });
                }
                appGlobals.notesLoaded = true;
            },
            type: 'GET'
        });
    }

    loadSingleNote(noteSequenceNumber) {

        /*console.log("loadSingleNote: " + noteSequenceNumber);

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
                    this.$noteTitle.val(noteToLoad.title);
                    this.$noteText.val(noteToLoad.note_content);
                    this.currentNote = noteToLoad;
                })
            } else {
                console.log("Failed to load note, or no note" + JSON.stringify(response));
            }
        });*/

    }

    saveNotes(title, note_content, callback){
        Utils.setSavingStatus("Saving...");

        // update timeline UI
        let $updateNote = this.$notesTimelineContainer.find('#' + appGlobals.currentNote.id);
        if (($updateNote).length !== 0) {
            // update note
            $updateNote.find('.note-title').text(title);
            $updateNote.find('.note-content').text(note_content);
        } else {
            // append new note
            let noteSectionHtml = appGlobals.templates.NOTE_SECTION;
            let $noteSection = jQuery(jQuery.parseHTML(noteSectionHtml));
            $noteSection.find('.note-item').attr('id', 'pwnage');
            $noteSection.find('.note-title').html(title);
            $noteSection.find('.note-content').html(note_content);

            this.$notesTimelineContainer.append($noteSection);
        }

        let noteToSave = new Note(appGlobals.currentNote.sequence, title, note_content, null, true);
        console.log("noteToSave: " + noteToSave.title + " seq: " + noteToSave.sequence + " globals count: " + appGlobals.numNotes);

        this.human.send('scene.capture', (sceneState) => {
            this.currentSceneState = sceneState;

            // update current note properties
            /*appGlobals.currentNote.setNoteContent(note_content);
            appGlobals.currentNote.setTitle(title);
            appGlobals.currentNote.setSceneState(JSON.stringify(sceneState));*/

            noteToSave.setSceneState(JSON.stringify(sceneState));

            console.log("save current note: " + noteToSave.title + " sequence: " + noteToSave.sequence);

            //!* Data to make available via the $_POST variable
            let data = {
                action: 'save_notes',
                wp_az_3d_tours_nonce: ajax_object.wp_az_3d_tours_nonce,
                wp_az_post_id: ajax_object.wp_az_post_id,
                wp_az_note_object: noteToSave
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

    setInitialSceneState(human, callback){
        console.log("setInitialSceneState. currentNote: " + appGlobals.currentNote.title);

        if (Object.keys(appGlobals.currentNote).length !== 0){
            console.log("setInitialSceneState restore previous scene state");
            let scene_state = JSON.parse(appGlobals.currentNote['scene_state']);
            human.send("scene.restore", scene_state);

            if (callback) callback(scene_state);
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
            console.log("reset scene.");
            this.human.send("scene.restore", JSON.parse(appGlobals.currentNote.scene_state));
        })

    }
}

jQuery(document).ready(function() {
    new AnatomyTour();
});




