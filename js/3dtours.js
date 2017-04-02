/**
 * Created by peter on 22/03/2017.
 */

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

        // ajax data
        this.isUserAdmin = ajax_object.wp_az_user_role;
        appGlobals.firstSceneUrl = this.$humanWidget.attr('src');

        // Track changes
        this.changesMade = false;
        this.actionsChanged = false;

        // Human loaded
        this.human.on('human.ready', () => {

            //TODO: update/delete these functions
            console.log("Human is now ready for action");
            appGlobals['humanLoaded'] = true;
            this.updateCameraInfo();
            this.setInitialSceneState(this.human, (sceneState) => {
                this.sceneObjects = sceneState.objects;
            });
            this.registerCallbacks();
            this.setHumanUi();
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
        this.$previousAction = jQuery('#action-previous');
        this.$nextAction = jQuery('#action-next');
        this.$actionsDropdownContainer = jQuery('#actions-dropdown-container');
        this.$numActionsLabel = jQuery('#num-actions');
        this.$currentActionLabel = jQuery('#current-action');
        this.$clearActions = jQuery('#toolbar-clear-actions');
        this.$actionStatusBox = jQuery('#action-status-box');
        this.$takeSnapshot = jQuery('#action-snapshot');

        // Toolbar
        this.$toolbarReset = jQuery('#toolbar-reset');

        // save/add/delete notes
        this.$saveBtn = jQuery('#notes-save-btn');
        this.$addNewNotesSection = jQuery('#notes-add-new-btn');
        this.$deleteNoteBtn = jQuery('#notes-delete-btn');

        /***********************
         *  SCENE SELECTOR     *
         ***********************/

        this.$sceneSelectorOption = jQuery('.scene-selector-option');
        this.$sceneSelectorOption.on('click', (event) => { this.loadScene(jQuery(event.target)) });




        /*********************
         *      TIMELINE     *
         *********************/

        this.$notesTimelineContainer = jQuery('#notes-timeline');
        this.$editNote = jQuery('.edit-note');
        this.$noteToolsTimeline = jQuery('.note-actions');
        this.$noteTitleTimeline = jQuery('.note-title');

        // Modal alert dialog
        this.$modalAlert = jQuery('#wpaz-modal-alert');



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
        this.$nextAction.on('click', (event) => { this.navigateActions('next')});
        this.$previousAction.on('click', (event) => { this.navigateActions('previous')});
        this.$clearActions.on('click', () => { this.clearActions(appGlobals.currentNote.uid); });
        this.$takeSnapshot.on('click', () => {this.takeSnapshot()});

        // Toolbar
        this.$toolbarReset.on('click', event => { this.human.send("scene.restore", JSON.parse(appGlobals.currentNote.scene_state)); });

        // Save/Add new
        this.$saveBtn.on('click', (event) => { this.saveNotes(this.$noteTitle.val(), this.$noteText.val()); });
        this.$addNewNotesSection.on('click', (event) => { this.addNoteSection(); });
        this.$deleteNoteBtn.on('click', (event) => { this.deleteNote(); });

        // Timeline - DYNAMIC EVENT LISTENERS
        this.$notesTimelineContainer.on('click', '.note-title', (event) => { this.setActiveNote(jQuery(event.target).closest('div.note-item').attr('id'), true)});
        this.$notesTimelineContainer.on('click', '.edit-note', (event) => { console.log("edit Note"); this.editNote(jQuery(event.target).closest('div.note-item').attr('id')) });
        this.$notesTimelineContainer.on('click', '.delete-note', (event) => { console.log("delete Note"); this.deleteNote(jQuery(event.target).closest('div.note-item').attr('id')) });


        // Load notes data
        this.loadNotes();
        this.getItemTemplates();

        // set UI
        this.setAppUi();
    }

    // Class methods

    // INIT

    setHumanUi(){
        console.log("setHumanUi");
        let displayConfig;
        if(this.isUserAdmin){
            displayConfig = {
                audio: false,
                fullscreen: false,
                help: false,
                nav: true,
                center: true,
                zoomIn: true,
                zoomOut: true,
                info: false,
                share: false,
                tools: true,
                objectTree: true,
            };
        } else {
            displayConfig = {
                audio: false,
                fullscreen: false,
                help: false,
                nav: true,
                center: true,
                zoomIn: true,
                zoomOut: true,
                info: false,
                share: false,
                tools: false,
                objectTree: false,
            };
        }
        this.human.send('ui.setDisplay', displayConfig);
    }

    setAppUi(){

        if (this.isUserAdmin){

            // Admin UI
            this.$noteToolsTimeline.removeClass('hidden');

        } else {
            // User UI
            this.setScanner();
        }

        /*tinymce.init({
            selector: 'textarea',
            height: 500,
            menubar: false,
            plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table contextmenu paste code'
            ],
            toolbar: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
        });*/
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

    loadNotes(){
        console.log("loadNotes");
        
        let appObj = this;

        Utils.setNoteUpdateStatus("Loading notes data...");
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
                console.log("Notes loaded from server.");
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

                    // No stored notes - create brand new note
                    human.send('scene.capture', (sceneState) => {
                        let sceneStateStr = JSON.stringify(sceneState);
                        appGlobals.currentNote = new Note(1, "", "", sceneStateStr);

                        // save new note
                        appObj.saveNotes("", "", true);
                    });
                }

                // Create actions objects and update global data
                actionsArray.forEach(function(action){
                    console.log("adding action to array order: " + action.action_order);
                    if (appGlobals.actions[action.note_id]) {
                        appGlobals.actions[action.note_id].push(action);
                    } else {
                        appGlobals.actions[action.note_id] = [action];
                    }
                });

                // sort actions into order
                Object.keys(appGlobals.actions).forEach((noteId) => {
                    let actionsToSort = appGlobals.actions[noteId];
                    actionsToSort.sort(Utils.compare);
                });

                // load actions
                appObj.loadActions(appGlobals.currentNote.uid, appObj);

                // set current action to first
                if (appGlobals.actions[appGlobals.currentNote.uid]){
                    appObj.setCurrentAction(appGlobals.actions[appGlobals.currentNote.uid][0]);
                }

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

    saveNotes(title, note_content, doNotAppend, callback){

        console.log("title: " + title + " note_content: " + note_content);
        if (!this.isUserAdmin) return;
        Utils.setNoteUpdateStatus("Saving...");

        if (title == "" || title == null || title.length == 0) title = "No title";

        // update timeline UI
        let $updateNote = this.$notesTimelineContainer.find('#' + appGlobals.currentNote.uid);
        if (($updateNote).length !== 0) {
            // update note
            $updateNote.find('.note-title').text(title);
            $updateNote.find('.note-content').text(note_content);
        } else {
            // append new note
            if (!doNotAppend){
                let noteSectionHtml = appGlobals.templates.NOTE_SECTION;
                let $noteSection = jQuery(jQuery.parseHTML(noteSectionHtml));
                $noteSection.find('.note-item').attr('id', appGlobals.currentNote.uid);
                $noteSection.find('.note-title').html(title);
                $noteSection.find('.note-content').html(note_content);
                $noteSection.find('.note-actions').removeClass('hidden');
                let $imageContainer = $noteSection.find('.note-image');

                let originalBackgroundData;

                this.human.send("ui.getBackground", (backgroundData) => {
                    originalBackgroundData = backgroundData;
                });

                let backgroundColor = 'white';

                let backgroundData = { colors: [backgroundColor, backgroundColor] };

                this.human.send("ui.setBackground", backgroundData);

                this.human.send("ui.snapshot", {}, (imgSrc) => {
                    console.log("Snapshot captured.");
                    this.human.send("ui.setBackground", originalBackgroundData)
                    console.log(imgSrc);
                    jQuery("<img>", {
                        "src": imgSrc,
                        "width": "250px",
                        "height": "250px"})
                        .appendTo($imageContainer);

                    this.$notesTimelineContainer.append($noteSection);
                });

            }
        }

        let noteToSave = appGlobals.currentNote;
        let actions = appGlobals.actions[noteToSave.uid];
        noteToSave.setTitle(title);
        noteToSave.setNoteContent(note_content);

        // Check if changes made to actions, save variable
        let actionsChanged = this.actionsChanged;

        let data;

        if (appGlobals.humanLoaded) {
            this.human.send('scene.capture', (sceneState) => {
                this.currentSceneState = sceneState;

                noteToSave.setSceneState(JSON.stringify(sceneState));

                console.log("save current note: " + noteToSave.title + " sequence: " + noteToSave.sequence + " uid: " + noteToSave.uid + " note Content: " + noteToSave.note_content);

                //!* Data to make available via the $_POST variable
                data = {
                    action: 'save_notes',
                    wp_az_3d_tours_nonce: ajax_object.wp_az_3d_tours_nonce,
                    wp_az_post_id: ajax_object.wp_az_post_id,
                    wp_az_note_object: noteToSave,
                    wp_az_actions: actions,
                    wp_az_actions_changed: actionsChanged,

                };

                saveToDb(data);

            });
        } else {

            noteToSave.setSceneState(appGlobals.currentNote.scene_state);

            data = {
                action: 'save_notes',
                wp_az_3d_tours_nonce: ajax_object.wp_az_3d_tours_nonce,
                wp_az_post_id: ajax_object.wp_az_post_id,
                wp_az_note_object: noteToSave,
                wp_az_actions: actions,
                wp_az_actions_changed: actionsChanged,
            };

            saveToDb(data);
        }


        // reset tracking  variables
        this.actionsChanged = false;
        this.changesMade = false;

        function saveToDb (data) {

            console.log("saveToDb");

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
        }
    }

    deleteNote(uid){
        if (!this.isUserAdmin) { console.log("Nice try..."); return };
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

        // clear previous actions, load new actions, set current action
        this.clearActions();
        if (appGlobals.actions[note.uid]) {
            this.loadActions(note.uid, this);
            this.setCurrentAction(appGlobals.actions[note.uid][0]);
        }


        // scroll to top
        if (scrollToTop) {
            jQuery('html, body').animate({
                scrollTop: 0
            }, 500);
        }

        appGlobals.currentNote = note;

    }

    addNoteSection(){
        if (!this.isUserAdmin) {console.log("Nice try..."); return};

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

            // Set current action
            this.setCurrentAction(action);

            $actionItem.on('click', (event) => {
                event.preventDefault();

                switch(action.action_type){
                    case appGlobals.actionTypes.GENERAL:
                        this.doAction(action, this);
                        break;
                }

            })

        });

    }

    navigateActions(direction){
        console.log("Navigate actions: " + direction);

        let actions = appGlobals.actions[appGlobals.currentNote.uid];

        if (actions) {

            let numActions = actions.length;
            let currentActionOrder = parseInt(appGlobals.currentAction.action_order);

            if (direction === "next"){
                if (currentActionOrder < numActions){
                    this.doAction(actions[currentActionOrder], this);
                }  else {
                    console.log("Reached last action");
                    return;
                }
            } else {
                if (currentActionOrder > 1){
                    this.doAction(actions[currentActionOrder - 2], this);
                } else {
                    console.log("Reached first action");
                    return;
                }
            }

        }


    }

    setCurrentAction(action){
        console.log("setCurrentAction: " + JSON.stringify(action.action_order));
        appGlobals.currentAction = action;
        this.$currentActionLabel.text("Action " + action.action_order);
    }

    takeSnapshot(backgroundColor){

        let originalBackgroundData;

        this.human.send("ui.getBackground", (backgroundData) => {
            originalBackgroundData = backgroundData;
        });

        if (!backgroundColor) backgroundColor = 'white';

        let backgroundData = { colors: [backgroundColor, backgroundColor] };

        this.human.send("ui.setBackground", backgroundData);

        this.human.send("ui.snapshot", {
            openInTab: true
        }, (imgSrc) => {
            console.log("Snapshot captured.");
            this.human.send("ui.setBackground", originalBackgroundData)
        });
    }

    // DO ACTION METHODS
    doAction(action, appObj){
        console.log("doAction");
        switch(action.action_type){
            case appGlobals.actionTypes.GENERAL:
                
                appObj.human.send('camera.set', {
                    position: JSON.parse(action.scene_state).camera.eye,
                    target: JSON.parse(action.scene_state).camera.look,
                    up: JSON.parse(action.scene_state).camera.up,
                    animate: true
                }, () => {
                    appObj.human.send('scene.restore', JSON.parse(action.scene_state))
                });

                appObj.setCurrentAction(action);

                break;

            default:
                break;

        }

    }

    loadActions(noteUID, appObj){

        let actions = appGlobals.actions[noteUID];
        if (actions){
            actions.forEach((action) => {

                appObj.numActions++;
                appObj.$numActionsLabel.text(appObj.numActions + ' actions');

                let $actionItem = jQuery("<li id='" + action.uid + "' class='list-group-item'><a> Action " + action.action_order + "</a></li>");
                appObj.$actionsDropdownContainer.append($actionItem);

                $actionItem.on('click', (event) => {
                    event.preventDefault();
                    appObj.doAction(action, appObj);
                })
            })
        }

    }

    clearActions(noteUID) {
        this.numActions = 0;
        this.$numActionsLabel.text('0 actions');
        this.$currentActionLabel.text('Action 1');
        this.$actionsDropdownContainer.empty();
        if (noteUID) appGlobals.actions[appGlobals.currentNote.uid] = [];
    }

    // TIMELINE
    editNote(noteId){
        this.setActiveNote(noteId, true);
    }


    // Preset scenes
    loadScene($sceneOption) {

        console.log("loadScene");

        let region = $sceneOption.attr('data-region');
        let structure = $sceneOption.attr('data-structure');
        let sceneUrl = appGlobals.scenePresets[region][structure];
        if (sceneUrl != null && sceneUrl != "") {
            this.$humanWidget.attr('src', sceneUrl);
        } else {
            console.log("No scene for this option yet");
            return;
        }

        if (parseInt(appGlobals.currentNote.sequence) === 1 && sceneUrl !== appGlobals.firstSceneUrl){
            this.$modalAlert.find('.modal-title').text("First scene");
            this.$modalAlert.find('.modal-body').text("Do you want this scene to be displayed when the page first loads?");
            this.$modalAlert.find('#modal-btn-1').text("Yes").on('click', () => {
                console.log("set as first scene");
                appGlobals.firstSceneUrl = sceneUrl;
                this.$modalAlert.modal('hide');
                this.updateFirstSceneUrl();
            });
            this.$modalAlert.find('#modal-btn-2').text("No").on('click', () => {
                console.log("do not set as first scene");
                this.$modalAlert.modal('hide');
            });
            this.human = new HumanAPI("embedded-human");
            this.human.on('human.ready', () => {
                console.log("new scene loaded");
                this.setHumanUi();
                setTimeout(() => {
                    this.$modalAlert.modal('show');
                }, 500)

            });
        }
    }

    updateFirstSceneUrl() {
        console.log("updateFirstScene: " + appGlobals.firstSceneUrl);
        Utils.setNoteUpdateStatus("Saving first scene...");
        jQuery.ajax({
            url: ajax_object.wp_az_ajax_url,
            data: {
                action: 'update_first_scene_url',
                wp_az_3d_tours_nonce: ajax_object.wp_az_3d_tours_nonce,
                wp_az_note_id: appGlobals.currentNote.uid,
                wp_az_first_scene_url: appGlobals.firstSceneUrl
            },
            error: function() {
                console.log("Failed to save first scene URL");
            },
            success: function(data) {
                console.log("First scene url successfully updated. " + JSON.stringify(data));
                Utils.setNoteUpdateStatus(data.message, 3000);
            },
            type: 'POST'
        });
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




