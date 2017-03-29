/**
 * Created by peter on 22/03/2017.
 */

//TODO: on first load actions do not load

class AnatomyTour {

    constructor() {
        console.log("anatomy tours loaded");

        let self = this;

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

        // user
        this.isUserAdmin = ajax_object.wp_az_user_role;

        // Track changes
        this.changesMade = false;
        this.actionsChanged = false;

        // Human loaded
        this.human.on('human.ready', () => {
            console.log("Human is now ready for action");

            appGlobals['humanLoaded'] = true;
            this.updateCameraInfo();
            this.setInitialSceneState(this.human, (sceneState) => {
                this.sceneObjects = sceneState.objects;
            });
            this.registerCallbacks();
        });

        // DOM

        /**********************
         *    NOTE CONTAINER  *
         **********************/

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
        this.$savingStatus = jQuery('.update-status');

        // actions
        this.$addAction = jQuery('#action-add');
        this.$actionsDropdownContainer = jQuery('#actions-dropdown-container');
        this.$numActionsLabel = jQuery('#num-actions');
        this.$clearActions = jQuery('#toolbar-clear-actions');
        this.$actionStatusBox = jQuery('#action-status-box');

        // Toolbar
        this.$toolbarReset = jQuery('#toolbar-reset');

        // save/add/delete notes
        this.$saveBtn = jQuery('#notes-save-btn');
        this.$addNewNotesSection = jQuery('#notes-add-new-btn');
        this.$deleteNoteBtn = jQuery('#notes-delete-btn');


        /*********************
         *      TIMELINE     *
         *********************/

        this.$notesTimelineContainer = jQuery('#notes-timeline');
        this.$editNote = jQuery('.edit-note');
        this.$noteToolsTimeline = jQuery('.note-actions');
        this.$noteTitleTimeline = jQuery('.note-title');

        /*******************************
         *  set DOM Event listeners    *
         *******************************/

        // Note container
        this.$noteNavLeft.on('click', () => { this.navigateNotes('left'); });
        this.$noteNavRight.on('click', () => { this.navigateNotes('right'); });
        this.$noteTitle.on("change keyup paste", () => { this.changesMade = true; });
        this.$noteText.on("change keyup paste", () => { this.changesMade = true; });

        // Actions
        this.$addAction.on('click', (event) => { this.addAction(); });
        this.$clearActions.on('click', () => { this.clearActions(appGlobals.currentNote.uid); });

        // Toolbar
        this.$toolbarReset.on('click', event => { this.human.send("scene.restore", JSON.parse(appGlobals.currentNote.scene_state)); });

        // Save/Add new
        this.$saveBtn.on('click', (event) => { this.saveNotes(this.$noteTitle.val(), this.$noteText.val()); });
        this.$addNewNotesSection.on('click', (event) => { this.addNoteSection(); });
        this.$deleteNoteBtn.on('click', (event) => { this.deleteNote(); });

        // Timeline - DYNAMIC EVENT LISTENERS
        this.$notesTimelineContainer.on('click', '.edit-note', (event) => { console.log("edit Note"); this.editNote(jQuery(event.target).closest('div.note-item').attr('id')) });
        this.$notesTimelineContainer.on('click', '.note-title', (event) => { this.setActiveNote(jQuery(event.target).closest('div.note-item').attr('id'), true)});



        // Load notes data
        this.loadNotes();
        this.getItemTemplates();

        // Anatomy scanner
        if(!this.isUserAdmin) {
            this.setScanner();
        } else {
            this.setAdminUi();
        }
    }

    // Class methods



    setAdminUi(){
        this.$noteToolsTimeline.removeClass('hidden');
    }

    // INIT
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

    loadNotes(){
        console.log("loadNotes");

        Utils.setNoteUpdateStatus("Loading notes data...");
        let human = this.human;
        let setInitialSceneState = this.setInitialSceneState;
        let loadActions = this.loadActions;

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
                console.log("Notes loaded from server." + JSON.stringify(data));
                let notesArray = data.notes;
                let actionsArray = data.actions;

                // Create notes objects and update global data
                if (notesArray.length > 0){
                    let numNotes = 0;
                    notesArray.forEach(function(note){
                        numNotes++;
                        console.log("note uid: " + note.uid);
                        let addNote = new Note(note.sequence, note.title, note.note_content, note.scene_state, note.uid);
                        if (addNote.sequence == 1) appGlobals.currentNote = addNote;
                    });

                    console.log("appGlobals notes object created. currentNote: " + appGlobals.currentNote.title + " total number of notes " + appGlobals.numNotes + " uid: " + appGlobals.currentNote.uid);
                    if (appGlobals.humanLoaded == true) setInitialSceneState(human, null);

                } else {
                    human.send('scene.capture', (sceneState) => {
                        let sceneStateStr = JSON.stringify(sceneState);
                        appGlobals.currentNote = new Note(1, "", "", sceneStateStr);
                        console.log("no notes to load. New note created.");
                    });
                }

                // Create actions objects and update global data
                actionsArray.forEach(function(action){
                    if (appGlobals.actions[action.note_id]) {
                        appGlobals.actions[action.note_id].push(action);
                    } else {
                        appGlobals.actions[action.note_id] = [action];
                    }
                });

                appGlobals.notesLoaded = true;

                Utils.setNoteUpdateStatus("Notes data load complete.", 3000);
            },
            type: 'GET'
        });
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

    // NOTE NAVIGATION
    navigateNotes(direction){

        let noteSeq = parseInt(appGlobals.currentNote.sequence);

        console.log("Navigate: " + direction + "current seq: " + noteSeq);

        direction == 'right' ? noteSeq++ : noteSeq--;

        Object.keys(appGlobals.notes).forEach((noteId) => {
            if (appGlobals.notes[noteId].sequence == noteSeq) {
                this.setActiveNote(noteId, false);
            }
        })
    }

    // NOTE EDITOR

    saveNotes(title, note_content, callback){
        Utils.setNoteUpdateStatus("Saving...");

        // update timeline UI
        let $updateNote = this.$notesTimelineContainer.find('#' + appGlobals.currentNote.uid);
        if (($updateNote).length !== 0) {
            // update note
            $updateNote.find('.note-title').text(title);
            $updateNote.find('.note-content').text(note_content);
        } else {
            // append new note
            let noteSectionHtml = appGlobals.templates.NOTE_SECTION;
            let $noteSection = jQuery(jQuery.parseHTML(noteSectionHtml));
            $noteSection.find('.note-item').attr('id', appGlobals.currentNote.uid);
            $noteSection.find('.note-title').html(title);
            $noteSection.find('.note-content').html(note_content);
            $noteSection.find('.note-actions').removeClass('hidden');

            this.$notesTimelineContainer.append($noteSection);
        }

        let noteToSave = appGlobals.currentNote;
        let actions = appGlobals.actions[noteToSave.uid];
        noteToSave.setTitle(title);
        noteToSave.setNoteContent(note_content);

        // Check if changes made to actions, save variable
        let actionsChanged = this.actionsChanged;

        this.human.send('scene.capture', (sceneState) => {
            this.currentSceneState = sceneState;

            noteToSave.setSceneState(JSON.stringify(sceneState));

            console.log("save current note: " + noteToSave.title + " sequence: " + noteToSave.sequence + " uid: " + noteToSave.uid + " note Content: " + noteToSave.note_content);

            //!* Data to make available via the $_POST variable
            let data = {
                action: 'save_notes',
                wp_az_3d_tours_nonce: ajax_object.wp_az_3d_tours_nonce,
                wp_az_post_id: ajax_object.wp_az_post_id,
                wp_az_note_object: noteToSave,
                wp_az_actions: actions,
                wp_az_actions_changed: actionsChanged,

            };

            //!* Process the AJAX POST request
            jQuery.post(ajax_object.wp_az_ajax_url, data, response => {
                if (response.status == 'success') {
                    // Show success message, then fade out the button after 2 seconds
                    console.log("Noted saved! " + JSON.stringify(response));
                    Utils.setNoteUpdateStatus("Notes saved.", 3000);

                    // execute callback function
                    if(callback) callback();
                } else {
                    // Re-enable the button and revert to original text
                    console.log("Failed. " + JSON.stringify(response));
                    Utils.setNoteUpdateStatus("Saving notes failed.", 3000);

                }
            });

        });

        // reset tracking  variables
        this.actionsChanged = false;
        this.changesMade = false;
    }

    deleteNote(uid){
        console.log("delete Note");

        Utils.setNoteUpdateStatus("Deleting...");

        let noteToDelete;

        if (!uid){
            noteToDelete = appGlobals.currentNote;
        } else {
            noteToDelete = appGlobals.notes[uid];
        }
        let noteToDeleteSequence = parseInt(noteToDelete.sequence);

        // update data
        Note.removeNote(noteToDelete.uid);

        // set active note as previous note upon deletion
        let index;
        let activeNoteUID;
        console.log("noteToDeleteSeq: " + noteToDeleteSequence);
        if (noteToDeleteSequence === 1) {
            if (appGlobals.sequenceIndex.length > 0) {
                activeNoteUID = appGlobals.sequenceIndex[0][0];
            } else {
                let note = new Note(1, "", "", "");
                activeNoteUID = note.getUid();
            }
        } else {
            index = noteToDeleteSequence - 2;
            activeNoteUID = appGlobals.sequenceIndex[index][0];
        }

        // set current note as previous
        appGlobals.currentNote = appGlobals.notes[activeNoteUID];

        // display previous note
        this.setActiveNote(activeNoteUID);

        // remove from timeline
        let $noteToDelete = jQuery('#' + noteToDelete.uid);
        $noteToDelete.fadeOut(() => {
            //remove DOM element
            $noteToDelete.remove();
        });

        // ajax call to delete note from database AND resequence other notes
        jQuery.ajax({
            url: ajax_object.wp_az_ajax_url,
            data: {
                action: 'delete_note',
                wp_az_3d_tours_nonce: ajax_object.wp_az_3d_tours_nonce,
                wp_az_post_id: ajax_object.wp_az_post_id,
                wp_az_note_uid: noteToDelete.uid,
                wp_az_sequence_index: appGlobals.sequenceIndex
            },
            error: function() {
                console.log("Failed to delete note");
                Utils.setNoteUpdateStatus("Failed to delete note.", 3000);
            },
            success: function(data) {
                console.log("Note deleted: " + JSON.stringify(data));
                Utils.setNoteUpdateStatus("Note deleted.", 3000);
            },
            type: 'POST'
        });

    }

    setActiveNote(uid, scrollToTop){
        let note = appGlobals.notes[uid];

        // get title/content
        let $title = jQuery('.notes-title');
        let $content = jQuery('.notes-text');

        // save current note first if changes made
        if (this.isUserAdmin && this.changesMade == true || this.actionsChanged) {
            this.saveNotes($title.val(), $content.val());
        }

        // reset tracking variables
        this.changesMade = false;
        this.actionsChanged = false;

        // update note properties
        jQuery('#current-note-label').text('Note ' + note.sequence);
        jQuery('#total-notes-label').text(appGlobals.numNotes + ' notes');

        // update title and content
        if (this.isUserAdmin) {
            $title.val(note.title);
            $content.val(note.note_content);
        } else {
            $title.text(note.title);
            $content.text(note.note_content);
        }

        // load scene
        if (note.scene_state != null && note.scene_state != "" && note.scene_state.length > 0){
            this.human.send("scene.restore", JSON.parse(note.scene_state));
        }

        // clear previous actions, load new actions
        this.clearActions();
        if (appGlobals.actions[note.uid]) this.loadActions(note.uid);


        // scroll to top
        if (scrollToTop) {
            jQuery('html, body').animate({
                scrollTop: 0
            }, 500);
        }

        appGlobals.currentNote = note;
    }

    addNoteSection(){

        // save current notes first
        this.saveNotes(this.$noteTitle.val(), this.$noteText.val());

        this.$noteTitle.val("");
        this.$noteText.val("");

        let sequence = (parseInt(appGlobals.numNotes) + 1);
        let addNote = new Note(sequence, "", "", "");

        this.$currentNoteLabel.text("Note " + addNote.sequence);
        this.$numNotesLabel.text(appGlobals.numNotes + " notes");

        // clear actions
        this.clearActions();

        this.human.send('scene.capture', (sceneState) => {
            addNote.setSceneState(JSON.stringify(sceneState));
            appGlobals.currentNote = addNote;
        });
    }

    // ACTIONS
    addAction() {
        /*this.numActions++;
        this.$numActionsLabel.text(this.numActions + ' actions');

        let actionId = "action-" + this.numActions;
        let $actionItem = jQuery("<li id='" + actionId + "' class='list-group-item'><a> Action " + this.numActions + "</a></li>")

        this.$actionsDropdownContainer.append($actionItem);

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

        });*/

        this.numActions++;
        this.actionsChanged = true;
        this.$numActionsLabel.text(this.numActions + ' actions');

        // create action, add to array
        let noteId = appGlobals.currentNote.uid;
        let action = new Action(noteId, this.numActions, appGlobals.actionTypes.GENERAL);
        if(appGlobals.actions[noteId]) {
            appGlobals.actions[noteId].push(action);
        } else {
            appGlobals.actions[noteId] = [action];
        }

        let $actionItem = jQuery("<li id='" + action.uid + "' class='list-group-item'><a> Action " + this.numActions + "</a></li>");

        this.$actionsDropdownContainer.append($actionItem);

        // create new generic action
        this.getSceneState((sceneState) => {
            action.setSceneState(JSON.stringify(sceneState));
            console.log("Scene state saved as action");
            Utils.updateActionStatusBox("Action added to this note set.");

            $actionItem.on('click', (event) => {
                event.preventDefault();

                this.human.send('camera.set', {
                    position: sceneState.camera.eye,
                    target: sceneState.camera.look,
                    up: sceneState.camera.up,
                    animate: true
                }, () => {
                    this.human.send('scene.restore', sceneState)
                });

            })

        });

    }

    loadActions(noteUID){
        let actions = appGlobals.actions[noteUID];
        actions.forEach((action) => {

            this.numActions++;
            this.$numActionsLabel.text(this.numActions + ' actions');

            let $actionItem = jQuery("<li id='" + action.uid + "' class='list-group-item'><a> Action " + action.action_order + "</a></li>");
            this.$actionsDropdownContainer.append($actionItem);

            $actionItem.on('click', (event) => {
                event.preventDefault();
                let sceneState = JSON.parse(action.scene_state);
                this.human.send('camera.set', {
                    position: sceneState.camera.eye,
                    target: sceneState.camera.look,
                    up: sceneState.camera.up,
                    animate: true
                }, () => {
                    this.human.send('scene.restore', sceneState)
                });
            })
        })
    }

    clearActions(noteUID) {
        this.numActions = 0;
        this.$numActionsLabel.text('0 actions');
        this.$actionsDropdownContainer.empty();
        if (noteUID) appGlobals.actions[appGlobals.currentNote.uid] = [];
    }

    // TIMELINE
    editNote(noteId){
        this.setActiveNote(noteId, true);
    }


    // BIODIGITAL API FUNCTIONS
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

    updateCameraInfo() {
        console.log("updateCameraInfo");

        // set initial variables
        this.human.send("camera.info", (camera) => {
            this.cameraInfo = camera;
        })
    }

}

jQuery(document).ready(function() {
    new AnatomyTour();
});




