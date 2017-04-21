/**
 * Created by peter on 22/03/2017.
 */

class AnatomyNotes {

    constructor() {
        console.log("anatomy notes loaded");

        appGlobals.appRef = this;

        // get BioDigital Human
        this.human = new HumanAPI("embedded-human");
        this.$humanWidget = jQuery('#embedded-human');
        this.$iframeContainer = jQuery('#iframe-container');

        // 3d model variables
        this.cameraInfo = {};
        this.currentSceneState = {};
        this.sceneInfo = {};
        this.sceneObjects = {};

        // actions variables
        this.numActions = 0;
        this.storedActions = [];

        // ajax data
        this.userRole = ajax_object.wp_az_user_role;
        this.userIsEditor = ajax_object.wp_az_user_can_edit;
        appGlobals.context = ajax_object.wp_az_context;
        appGlobals.post_id = ajax_object.wp_az_post_id;
        appGlobals.firstSceneUrl = this.$humanWidget.attr('src');

        // Track changes
        this.changesMade = false;
        this.actionsChanged = false;

        // Track saves
        this.firstSave = true;

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

            /***********************************
             *          CANVAS OVERLAY         *
             ***********************************/

                // Create canvas overlay
            let height = this.$humanWidget.height();
            let width = this.$humanWidget.width();

            let $canvasHtml = jQuery(
                "<canvas id='myCanvas' width='" + width + "' height='" + height + "'>" +
                "</canvas>");

            $canvasHtml.appendTo(this.$iframeContainer);
            this.canvas = document.getElementById('myCanvas');
            this.canvasCtx = this.canvas.getContext('2d');

            this.canvas.addEventListener('click', (event) => {
                let canvasX = event.offsetX;
                let canvasY = event.offsetY;

                this.human.send('scene.pick', {
                    x: canvasX,
                    y: canvasY,
                }, (pickInfo) => {
                    console.log("Picked: ", pickInfo);

                    let objectId = pickInfo.objectId;
                    let pos3d = [];
                    pos3d['x'] = pickInfo.position.x;
                    pos3d['y'] = pickInfo.position.y;
                    pos3d['z'] = pickInfo.position.z;

                    let posObj = pickInfo.position;

                    console.log("position: ", pickInfo.position);

                    this.human.send('annotations.create', {
                        title: "",
                        description: "",
                        objectId: pickInfo.objectId,
                        position: [pickInfo.position.x, pickInfo.position.y, pickInfo.position.z]
                    }, (newAnnotation) => {
                        console.log("New annotation created: " + JSON.stringify(newAnnotation));
                        newAnnotation.isNewAnnotation = true; // if cancel clicked on modal, annotation will be deleted
                        this.showModal('annotations', newAnnotation);

                        /*Utils.resetModal();
                        Utils.showModal({
                            title: "Add annotation",
                            body: ""
                        });

                        this.$modalAnnotations.removeClass('hidden');

                        this.$modalBtn1.on('click', () => {
                            this.$modalAlert.modal('hide');
                            Utils.resetModal();
                            this.human.send("annotations.destroy", newAnnotation.annotationId);
                        });

                        this.$modalBtn2.on('click', () => {
                            let title = this.$annotationsTitle.val();
                            let desc = this.$annotationsDescription.val();
                            this.human.send("annotations.update", {
                                annotationId: newAnnotation.annotationId,
                                title: title,
                                description: desc
                            });
                            this.$modalAlert.modal('hide');
                            Utils.resetModal();
                        })*/

                    })
                });
            });

            this.$canvas = jQuery('#myCanvas');
            this.$canvas.hide();

            // resize the canvas to fill browser window dynamically
            jQuery(window).on('resize', () => {
                console.log("resize canvas");
                this.canvas.width = this.$humanWidget.width();
                this.canvas.height = this.$humanWidget.height();
            });


            /******** END CANVAS OVERLAY ********/
        });


        // DOM

        /***********************
         *      MAIN TOOLBAR   *
         ***********************/
        this.$mainToolbar = jQuery('#wpaz-main-toolbar');
        this.$mainToolbarActiveNotes = jQuery('#toolbar-active-note');
        this.$mainToolbarMyNotes = jQuery('#toolbar-my-notes');
        this.$mainToolbarCreateNew = jQuery('#toolbar-create-new');

        /*************************
         *      MODEL CONTAINER  *
         *************************/
        this.$modelContainer = jQuery('#wpaz-model-container');
        this.$modeInfo = jQuery('#wpaz-mode-info');

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
        this.$postTitle = jQuery('#post-title');
        this.$noteSequenceNum = jQuery('.notes-sequence');
        this.$noteSequenceNum.text("1");
        this.$noteTitle = jQuery('.notes-title');
        this.$noteText = jQuery('.notes-text');
        this.$savingStatus = jQuery('.update-status');

        // Linked scenes
        this.$textLinkedToScene = jQuery('.linked-scene');

        // actions
        this.$addAction = jQuery('#action-add');
        this.$previousAction = jQuery('#action-previous');
        this.$nextAction = jQuery('#action-next');
        this.$actionsDropdownContainer = jQuery('#actions-dropdown-container');
        this.$numActionsLabel = jQuery('#num-actions');
        this.$currentActionLabel = jQuery('#current-action');
        this.$clearActions = jQuery('#toolbar-clear-actions');
        this.$actionStatusBox = jQuery('#action-status-box');
        this.$takeSnapshot = jQuery('.take-snapshot');

        // Annotations
        this.$annotationsDropdownContainer = jQuery('#annotations-dropdown-container');
        this.$numAnnotationsLabel = jQuery('#num-annotations');

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
        this.$sceneSelectImageBtn = jQuery('#scene-selector-image');
        this.$toggleCanvas = jQuery('#scene-selector-canvas-toggle');


        /*********************
         *      TIMELINE     *
         *********************/

        this.$notesTimelineContainer = jQuery('#notes-timeline');
        this.$editNote = jQuery('.edit-note');
        this.$noteToolsTimeline = jQuery('.note-actions');
        this.$noteTitleTimeline = jQuery('.note-title');
        this.$noteImages = jQuery('.note-images');

        // Note image toolbar
        this.toolbarOptions = {
            content: '#toolbar-options',
            position: 'top',
            style: 'dark',
            event: 'hover',
        };

        /************************
         *  Modal alert dialog  *
         ************************/

        this.$modalAlert = jQuery('#wpaz-modal-alert');
        this.$modalTitle = this.$modalAlert.find('.modal-title');
        this.$modalBody = this.$modalAlert.find('.modal-body');
        this.$modalImageProps = this.$modalAlert.find('.modal-image-properties');
        this.$modalAnnotations = this.$modalAlert.find('.modal-annotations');
        this.$modalError = this.$modalAlert.find('.modal-error p');
        this.$modalBtn1 = this.$modalAlert.find('#modal-btn-1');
        this.$modalBtn2 = this.$modalAlert.find('#modal-btn-2');

        // Image Properties
        this.$imgTitle = jQuery('.modal-image-properties .image-title');
        this.$imgDesc = jQuery('.modal-image-properties .image-description');
        this.$imgCaption = jQuery('.modal-image-properties .image-caption');
        this.$imgAlt = jQuery('.modal-image-properties .image-alt');

        // Annotations
        this.$annotationsTitle = this.$modalAnnotations.find('.annotation-title');
        this.$annotationsDescription = this.$modalAnnotations.find('.annotation-description');

        /*******************************
         *  set DOM Event listeners    *
         *******************************/

        // Main Toolbar
        this.$mainToolbarActiveNotes.on('click', () => { console.log("active notes")});
        this.$mainToolbarMyNotes.on('click', () => { console.log("my notes")});
        this.$mainToolbarCreateNew.on('click', () => {
            console.log("create new");
            Utils.resetModal();
            Utils.showModal({
                title: "Create New Notes",
                body: "<input id='create-new-note-set' type='text' class='form-control' placeholder='Enter title' value=''>",
            });
            this.$modalBtn1.on('click', () => { this.$modalAlert.modal('hide')});
            this.$modalBtn2.on('click', () => {
                console.log("create new note set somehow...");
                let newTitle = jQuery('#create-new-note-set').val();
                this.clearActiveNotes();
                this.$postTitle.text(newTitle);
                this.$mainToolbarActiveNotes.find('a').text(newTitle);
                this.$modalAlert.modal('hide');


                // CREATE NEW POST IN DB
                this.createPostInDb(newTitle);

            })
        });

        // Scene selector
        this.$sceneSelectorOption.on('click', (event) => { this.loadScene(jQuery(event.target)) });
        this.$sceneSelectImageBtn.on('click', (event) => {this.loadImage()});
        this.$toggleCanvas.on('click', (event) => {
            this.$canvas.toggle();
            appGlobals.mode.ANNOTATE = !appGlobals.mode.ANNOTATE;
            if (appGlobals.mode.ANNOTATE) {
                this.$toggleCanvas.css("background-color", "#337ab7");
                this.$modeInfo
                    .removeClass('hidden')
                    .show()
                    .text("ANNOTATE MODE");
            } else {
                this.$toggleCanvas.css("background-color", "");
                this.$modeInfo.hide();
            }

        });



        // Note container
        this.$postTitle.on('click', () => { this.editPostTitle(); });
        this.$noteNavLeft.on('click', () => { this.navigateNotes('left'); });
        this.$noteNavRight.on('click', () => { this.navigateNotes('right'); });
        this.$noteTitle.on("change keyup paste", () => { this.changesMade = true; });

        // tinyMCE Note Editor
        jQuery(document).on( 'tinymce-editor-init', ( event, editor ) => {

            console.log("tinyMCE ready");

            //TODO: CHANGE $noteEditor to noteEditor - it is not a jquery element!
            this.$noteEditor = editor;

            this.$noteEditor.on('KeyUp', (e) => {
                console.log("KeyUp");
                this.changesMade = true;
            });

        });


        // Actions
        this.$addAction.on('click', (event) => { this.addAction(); });
        this.$nextAction.on('click', (event) => { this.navigateActions('next')});
        this.$previousAction.on('click', (event) => { this.navigateActions('previous')});
        this.$clearActions.on('click', () => { this.clearActions(appGlobals.currentNote.uid); });
        this.$takeSnapshot.on('click', (event) => { this.takeSnapshot(jQuery(event.currentTarget).attr('data-ratio')); });

        // Toolbar
        this.$toolbarReset.on('click', event => { this.human.send("scene.restore", JSON.parse(appGlobals.currentNote.scene_state)); });

        // Save/Add new
        this.$saveBtn.on('click', (event) => { this.saveNotes(this.$noteTitle.val(), this.$noteEditor.getContent()); });
        this.$addNewNotesSection.on('click', (event) => { this.addNoteSection(); });
        this.$deleteNoteBtn.on('click', (event) => { this.deleteNote(); });

        // Timeline - DYNAMIC EVENT LISTENERS
        this.$notesTimelineContainer.on('click', '.note-title', (event) => { this.setActiveNote(jQuery(event.target).closest('div.note-item').attr('id'), true)});
        this.$notesTimelineContainer.on('click', '.edit-note', (event) => { console.log("edit Note"); this.editNote(jQuery(event.target).closest('div.note-item').attr('id')) });
        this.$notesTimelineContainer.on('click', '.delete-note', (event) => { console.log("delete Note"); this.deleteNote(jQuery(event.target).closest('div.note-item').attr('id')) });

        // Text Linked Scenes
        this.$editNoteContainer.on('click', '.linked-scene', (event) => {
            console.log("linked scene, action id: " + jQuery(event.target).attr('data-action-id'));
            this.doActionById(jQuery(event.target).attr('data-action-id'));
        });
        this.$textLinkedToScene.on('click', (event) => {
            this.doActionById(jQuery(event.target).attr('data-action-id'));
        });

        // load notes
        this.loadNotes();
        this.getItemTemplates();

        // set UI
        this.setAppUi();
    }

    /****************************
     *      CLASS METHODS       *
     ****************************/


    /****
     *
     * @param modalType Select modal type: 'annotations',
     * @param data Data object associated with modal. Annotations modal takes annotation object.
     */
    showModal(modalType, data){

        Utils.resetModal();

        switch (modalType){

            case 'annotations':
                console.log("show annotations modal: " + JSON.stringify(data));
                Utils.showModal({
                    title: "Edit Annotation",
                    body: ""
                });

                this.$modalAnnotations.removeClass('hidden');

                this.$annotationsTitle.val(data.title);
                this.$annotationsDescription.val(data.description);

                this.$modalBtn1.on('click', () => {
                    this.$modalAlert.modal('hide');
                    Utils.resetModal();
                    if (data.isNewAnnotation) {
                        this.human.send("annotations.destroy", data.annotationId);
                    }
                });

                this.$modalBtn2.on('click', () => {
                    let title = this.$annotationsTitle.val();
                    let desc = this.$annotationsDescription.val();
                    this.human.send("annotations.update", {
                        annotationId: data.annotationId,
                        title: title,
                        description: desc
                    });
                    this.$modalAlert.modal('hide');
                    Utils.resetModal();

                    // reload annotations container
                    this.loadAnnotations();
                });

                let $deleteBtn = jQuery('#annotations-delete-btn');

                $deleteBtn.off(); // detach previous listeners
                $deleteBtn.on('click', () => {
                    console.log("delete annotation");
                    this.human.send('annotations.destroy', data.annotationId, () => {
                        console.log("destroy annotation: " + data.annotationId);
                        this.loadAnnotations(); // reload annotations dropdown
                    });
                    this.$modalAlert.modal('hide');
                    Utils.resetModal();
                });

                break;
        }
    }

    createPostInDb(title, callback){

        let data = {
            title: title,
            status: 'publish',
            excerpt: 'Notes for ' + title
        };

        let url;

        if (this.userRole === appGlobals.userRoles.ADMIN){
            url = ajax_object.wp_az_root + 'wp/v2/3d-notes'
        } else {
            url = ajax_object.wp_az_root + 'wp/v2/user-notes'
        }

        jQuery.ajax({
            method: 'POST',
            url: url,
            data: data,
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-WP-Nonce', ajax_object.wp_az_nonce);
            },
            success: function(response) {
                console.log("success: " + JSON.stringify(response));

                appGlobals.post_id = response.id;

                if (callback) callback();

            },
            error: function(response) {
                console.log("failed: " + JSON.stringify(response));
            }
        })

    }

    clearActiveNotes(){
        console.log("clearActiveNotes");

        // save notes first
        this.saveNotes(this.$noteTitle.val(), this.$noteEditor.getContent());

        // Delete all data
        Utils.resetAppState();

        //TODO: Save scene state to note
        appGlobals.currentNote = new Note(1, "", "", "");

        this.setActiveNote(appGlobals.currentNote.uid, true);

        // clear UI
        this.$postTitle.text("");
        this.$notesTimelineContainer.empty();

    }

    /**
     *
     * @param $image jquery object/objects (representing the image[s]) to attach toolbar button click listeners
     */
    setImgToolbarListeners($image) {

        $image.on('toolbarItemClick', (event, buttonClicked) => {

            let imgId = jQuery(event.target).closest('div').attr('id');
            switch(buttonClicked.id){
                case 'toolbar-edit-image':
                    console.log("edit image id: " + imgId);
                    break;
                case 'toolbar-delete-image':
                    this.deleteImage(imgId);
                    break;
            }
        });

    }

    deleteImage(imgId){

        let url = ajax_object.wp_az_root + 'wp/v2/media/' + imgId;

        Utils.showLoading();

        jQuery.ajax({
            method: 'DELETE',
            url: url,
            data: {
                force: true,
            },
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-WP-Nonce', ajax_object.wp_az_nonce);
            },
            success: function(response) {
                console.log("successfully deleted image: " + JSON.stringify(response));
                jQuery('#' + imgId).fadeOut();
                Utils.hideLoading();

            },
            error: function(response) {
                console.log("failed to delete image: " + JSON.stringify(response));
            }
        })

    }

    // INIT

    setHumanUi(){
        console.log("setHumanUi");
        let displayConfig;
        if(this.userIsEditor){
            displayConfig = {
                audio: false,
                fullscreen: false,
                help: false,
                nav: true,
                center: true,
                zoomIn: true,
                zoomOut: true,
                info: false,
                share: true,
                tools: true,
                objectTree: true,
                annotations: true,
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

        if (this.userIsEditor){

            // Admin UI

            // Enable toolbar editing for images
            this.$noteImages.toolbar(this.toolbarOptions);
            this.setImgToolbarListeners(this.$noteImages);

        } else {
            // User UI

        }

        // Enable light box
        jQuery('.swipebox').swipebox();

    }

    getItemTemplates(){

        let $notesTimelineContainer = this.$notesTimelineContainer;

        jQuery.ajax({
            url: ajax_object.wp_az_ajax_url,
            data: {
                action: 'send_item_templates',
                wp_az_3d_notes_nonce: ajax_object.wp_az_3d_notes_nonce,
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
        console.log("loadNotes. Context: " + appGlobals.context);
        
        let appObj = this;
        let human = this.human;
        let setInitialSceneState = this.setInitialSceneState;

        if (appGlobals.context === appGlobals.contextType.NOTES_DASHBOARD){
            createNewNote();
            return;
        }

        Utils.setNoteUpdateStatus("Loading notes data...");

        jQuery.ajax({
            url: ajax_object.wp_az_ajax_url,
            data: {
                action: 'load_notes',
                wp_az_3d_notes_nonce: ajax_object.wp_az_3d_notes_nonce,
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
                    console.log("no stored notes, new note created");

                    createNewNote(true);
                    /*appGlobals.currentNote = new Note(1, "", "", "");

                    human.send('scene.capture', (sceneState) => {
                        console.log("scene state captured for new note");
                        let sceneStateStr = JSON.stringify(sceneState);
                        appGlobals.currentNote.setSceneState(sceneStateStr);

                        // save new note
                        appObj.saveNotes("", "", true);
                    });*/
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

        function createNewNote(save){
            console.log("createNewNote");
            appGlobals.currentNote = new Note(1, "", "", "");

            human.send('scene.capture', (sceneState) => {
                console.log("scene state captured for new note");
                let sceneStateStr = JSON.stringify(sceneState);
                appGlobals.currentNote.setSceneState(sceneStateStr);

                // save new note
                if (save) appObj.saveNotes("", "", true);
            });
        }
    }

    /*setScanner(){
        //ignores 'left', 'right', and 'bones of the' when searching for matching anatomy objects.
        let toStrip = /^left\s|right\s|bones\sof\sthe\s/i;

        this.$humanWidget.scanner({toStrip: toStrip, formatData: {
            prefix: function(dataId) {
                return '<a class="anatomy-object" data-id="' + dataId + '">'
            },
            suffix: "</a>"
        }});
    }*/

    /****
     *  Load annotations for a specific action into the note editor
     *
     * @param action - Action object for which to load annotations.
     */
    loadAnnotations() {

        console.log("loadAnnotations");

        // clear previous annotations
        this.$annotationsDropdownContainer.empty();
        let numAnnotations = 0;

        this.human.send("annotations.info", (annotations) => {
            console.log("annotations", annotations);
            for (let annotationId in annotations){
                numAnnotations++;
                let annotation = annotations[annotationId];
                this.addAnnotationToContainer(annotation);

                console.log("load annotation: " + annotation.annotationId);
            }

            // Update num annotations label
            this.$numAnnotationsLabel.text(numAnnotations + " annotations");

        });
    }

    addAnnotationToContainer(annotation) {
        console.log("addAnnotationToContainer");
        let $annotationItem = jQuery(
            "<li id='" + annotation.annotationId + "' class='list-group-item'>" +
            "<a href='#'>" + annotation.title + "</a>" +
            "</li>");
        this.$annotationsDropdownContainer.append($annotationItem);
        $annotationItem.on('click', () => {
            this.showModal('annotations', annotation);
        })
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
    editPostTitle() {
        console.log("editPostTitle");
        let newTitle;
        Utils.resetModal();
        Utils.showModal({
            title: "Edit title",
            body:
            "<input id='edit-post-title' type='text' class='form-control' placeholder='Enter title' value='" + this.$postTitle.text() + "'>",
        });
        this.$modalBtn1.on('click', () => {
            this.$modalAlert.modal('hide');
        });
        this.$modalBtn2.on('click', () => {
            newTitle = jQuery('#edit-post-title').val();
            this.$modalAlert.modal('hide');
            this.$postTitle.text(newTitle);
            this.$mainToolbarActiveNotes.find('a').text(newTitle);

            Utils.setNoteUpdateStatus("Saving post title...");

            if (appGlobals.context === appGlobals.contextType.NOTES_DASHBOARD && this.firstSave){
                console.log("context is dashboard and notes have not yet been saved");
                this.createPostInDb(newTitle, () => {
                    this.firstSave = false;
                    this.updatePostTitle(newTitle)
                });
                return;
            }

            // Update post title in Db
            this.updatePostTitle(newTitle);
            /*jQuery.ajax({
                url: ajax_object.wp_az_ajax_url,
                data: {
                    action: 'update_post_title',
                    wp_az_3d_notes_nonce: ajax_object.wp_az_3d_notes_nonce,
                    wp_az_post_id: appGlobals.post_id,
                    wp_az_new_post_title: newTitle
                },
                error: function() {
                    console.log("Failed to update title");
                    Utils.setNoteUpdateStatus("Failed to update title", 3000);
                },
                success: function(data) {
                    console.log("Note deleted: " + JSON.stringify(data));
                    Utils.setNoteUpdateStatus("Title updated", 3000);
                },
                type: 'POST'
            });*/
        });
    }

    updatePostTitle(title){
        console.log("updatePostTitle");
        // Update post title in Db
        jQuery.ajax({
            url: ajax_object.wp_az_ajax_url,
            data: {
                action: 'update_post_title',
                wp_az_3d_notes_nonce: ajax_object.wp_az_3d_notes_nonce,
                wp_az_post_id: appGlobals.post_id,
                wp_az_new_post_title: title
            },
            error: function() {
                console.log("Failed to update title");
                Utils.setNoteUpdateStatus("Failed to update title", 3000);
            },
            success: function(data) {
                console.log("Note deleted: " + JSON.stringify(data));
                Utils.setNoteUpdateStatus("Title updated", 3000);
            },
            type: 'POST'
        });
    }

    saveNotes(title, note_content, doNotAppend, callback){

        console.log("saveNotes: " + note_content);

        if (!this.userIsEditor) return;

        Utils.setNoteUpdateStatus("Saving...");

        if (appGlobals.context === appGlobals.contextType.NOTES_DASHBOARD && this.firstSave){
            console.log("context is dashboard and notes have not yet been saved");
            this.createPostInDb("New Notes", () => {
                this.firstSave = false;
                this.saveNotes(this.$noteTitle.val(), this.$noteEditor.getContent());
            });
            return;
        }

        if (title == "" || title == null || title.length == 0) title = "No title";

        // update timeline UI
        let $updateNote = this.$notesTimelineContainer.find('#' + appGlobals.currentNote.uid);
        if (($updateNote).length !== 0) {
            // update note
            $updateNote.find('.note-title').text(title);
            $updateNote.find('.note-content').html(note_content);
        } else {
            // append new note
            if (!doNotAppend){
                console.log("Append note");
                let noteSectionHtml = appGlobals.templates.NOTE_SECTION;
                let $noteSection = jQuery(jQuery.parseHTML(noteSectionHtml));
                $noteSection.find('.note-item').attr('id', appGlobals.currentNote.uid);
                $noteSection.find('.note-title').html(title);
                $noteSection.find('.note-content').html(note_content);
                $noteSection.find('.note-actions').removeClass('hidden');
                let $imageContainer = $noteSection.find('.note-image-container');

                let originalBackgroundData;

                if (appGlobals.humanLoaded){
                    this.human.send("ui.getBackground", (backgroundData) => {
                        originalBackgroundData = backgroundData;
                    });

                    let backgroundColor = 'white';

                    let backgroundData = { colors: [backgroundColor, backgroundColor] };

                    this.human.send("ui.setBackground", backgroundData);

                    this.human.send("ui.snapshot", {}, (imgSrc) => {
                        console.log("Snapshot captured.");
                        this.human.send("ui.setBackground", originalBackgroundData);
                        jQuery("<img>", {
                            "src": imgSrc,
                            "width": "250px",
                            "height": "250px"})
                            .appendTo($imageContainer);

                        this.$notesTimelineContainer.append($noteSection);
                    });
                } else {
                    this.$notesTimelineContainer.append($noteSection);
                }


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
                    wp_az_3d_notes_nonce: ajax_object.wp_az_3d_notes_nonce,
                    wp_az_post_id: appGlobals.post_id,
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
                wp_az_3d_notes_nonce: ajax_object.wp_az_3d_notes_nonce,
                wp_az_post_id: appGlobals.post_id,
                wp_az_note_object: noteToSave,
                wp_az_actions: actions,
                wp_az_actions_changed: actionsChanged,
            };

            saveToDb(data);

        }


        // reset tracking  variables
        this.actionsChanged = false;
        this.changesMade = false;
        this.firstSave = false;

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
                    console.log("Failed. " + JSON.stringify(response));
                    Utils.setNoteUpdateStatus("Saving notes failed.", 3000);

                }
            });
        }
    }

    deleteNote(uid){
        if (!this.userIsEditor) { console.log("Nice try..."); return };
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
                wp_az_3d_notes_nonce: ajax_object.wp_az_3d_notes_nonce,
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
        console.log("setActiveNote");
        let note = appGlobals.notes[uid];

        // get title/content
        let $title = jQuery('.notes-title');
        let $content = jQuery('.notes-text');

        // save current note first if changes made
        if (this.userIsEditor && this.changesMade == true || this.actionsChanged) {
            this.saveNotes($title.val(), this.$noteEditor.getContent());
        }

        // reset tracking variables
        this.changesMade = false;
        this.actionsChanged = false;

        // update note properties
        jQuery('#current-note-label').text('Note ' + note.sequence);
        jQuery('#total-notes-label').text(appGlobals.numNotes + ' notes');

        // update title and content
        if (this.userIsEditor) {
            $title.val(note.title);
            this.$noteEditor.setContent(note.note_content);
        } else {
            $title.text(note.title);
            $content.html(note.note_content);
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

            // load annotations
            this.loadAnnotations();
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
        if (!this.userIsEditor) {console.log("Nice try..."); return};

        // save current notes first
        this.saveNotes(this.$noteTitle.val(), this.$noteEditor.getContent());

        this.$noteTitle.val("");
        this.$noteEditor.setContent("");

        let sequence = (parseInt(appGlobals.numNotes) + 1);
        let addNote = new Note(sequence, "", "", "");

        this.$currentNoteLabel.text("Note " + addNote.sequence);
        this.$numNotesLabel.text(appGlobals.numNotes + " notes");

        // clear actions
        this.clearActions();

        if (appGlobals.humanLoaded){
            this.human.send('scene.capture', (sceneState) => {
                addNote.setSceneState(JSON.stringify(sceneState));
                appGlobals.currentNote = addNote;
            });
        } else {
            appGlobals.currentNote = addNote;
        }

    }
    

    // ACTIONS
    addAction(callback) {

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

            });

            if (callback) callback(action);

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

    /**
     *
     * @param aspectRatio Specified by the 'data-ratio' attribute. Options: 'one-one', 'four-three'
     * @param backgroundColor
     * @param callback
     */
    takeSnapshot(aspectRatio, backgroundColor, callback){

        appGlobals.numSnapshots++;

        // resize
        this.$modelContainer
            .removeClass('col-md-8')
            .addClass('col-md-12');

        let height;

        switch(aspectRatio){
            case 'one-one':
                height = this.$humanWidget.width();
                console.log("aspect ratio: " + aspectRatio + " height: " + height);
                break;

            case 'four-three':
                height = parseInt((this.$humanWidget.width() / 4) * 3);
                console.log("aspect ratio: " + aspectRatio + " height: " + height);
                break;
        }

        this.$humanWidget.attr("height", height);

        setTimeout(() => {
            let originalBackgroundData;

            this.human.send("ui.getBackground", (backgroundData) => {
                originalBackgroundData = backgroundData;
            });

            if (!backgroundColor) backgroundColor = 'white';

            let backgroundData = { colors: [backgroundColor, backgroundColor] };

            this.human.send("ui.setBackground", backgroundData);

            this.human.send("ui.snapshot", {
                openInTab: false

            }, (imgSrc) => {
                console.log("Snapshot captured.");
                this.human.send("ui.setBackground", originalBackgroundData);
                this.$modelContainer
                    .removeClass('col-md-12')
                    .addClass('col-md-8');
                this.$humanWidget.attr("height", "600");

                // Show image properties modal
                Utils.resetModal();
                Utils.showModal({
                    title: "Edit snapshot",
                    body: "",
                });

                this.$modalImageProps.removeClass('hidden');

                // Set field defaults
                let defaultTitle = "Snapshot " + appGlobals.numSnapshots;
                this.$imgTitle.val(defaultTitle);
                this.$modalImageProps.find('.image-thumbnail img').attr('src', imgSrc);

                // Cancel
                this.$modalBtn1.on('click', () => {
                    this.$modalAlert.modal('hide');
                    Utils.resetModal();
                    return;
                });

                // OK
                this.$modalBtn2.on('click', () => {

                    let self = this;
                    let imgTitle;
                    this.$imgTitle.val() == "" ? imgTitle = defaultTitle : imgTitle = this.$imgTitle.val();
                    let imgDesc = this.$imgDesc.val();
                    let imgCaption = this.$imgCaption.val();
                    let imgAlt = this.$imgAlt.val();

                    console.log("title: " + imgTitle + " desc: " + imgDesc + " caption: " + imgCaption + "imgAlt: " + imgAlt);

                    this.$modalAlert.modal('hide');
                    Utils.resetModal();

                    Utils.setNoteUpdateStatus("Saving snapshot...");

                    // Save media to server and append
                    let $updateNote = this.$notesTimelineContainer.find('#' + appGlobals.currentNote.uid);
                    let $imageContainer = $updateNote.find('.note-image-container .row');

                    // Save media
                    jQuery.ajax({
                        url: ajax_object.wp_az_ajax_url,
                        data: {
                            action: 'upload_snapshot',
                            wp_az_3d_notes_nonce: ajax_object.wp_az_3d_notes_nonce,
                            wp_az_post_id: appGlobals.post_id,
                            wp_az_img_data: imgSrc,
                            wp_az_img_title: imgTitle,
                            wp_az_img_desc: imgDesc,
                            wp_az_img_caption: imgCaption,
                            wp_az_img_alt: imgAlt,
                            wp_az_note_id: appGlobals.currentNote.uid
                        },
                        error: function() {
                            console.log("Failed to save snapshot");
                            Utils.setNoteUpdateStatus("Failed to save snapshot", 3000);
                        },
                        success: function(data) {
                            console.log("Snapshot saved", data);
                            Utils.setNoteUpdateStatus("Snapshot saved", 3000);

                            let attachmentId = data['attachment_id'];
                            let attachmentMedium = data['attachment_src_medium'];
                            let attachmentLarge = data['attachment_src_large'];

                            let $newImage = jQuery(
                                "<div class='col-md-4 col-sm-4 col-xs-6'>" +
                                    "<div id='" + attachmentId + "'>" +
                                        "<a rel='" + appGlobals.currentNote.uid + "' href='" + attachmentLarge + "' class='swipebox note-images' title='" + imgCaption + "'>" +
                                            "<img src='" + attachmentMedium + "' alt='image' width='100%' height='100%'>" +
                                        "</a>" +
                                    "</div>" +
                                "</div>");
                            $newImage.appendTo($imageContainer);

                            // add toolbar
                            $newImage.find('a.note-images').toolbar(self.toolbarOptions);
                            self.setImgToolbarListeners($newImage.find('a.note-images'));

                        },
                        type: 'POST'
                    });

                    if (callback) {
                        callback(imgSrc)
                    }

                });

            });
        }, 50);

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
                    appObj.human.send('scene.restore', JSON.parse(action.scene_state), () => {
                        console.log("scene restored");
                        appObj.loadAnnotations();
                    });
                });

                appObj.setCurrentAction(action);

                break;

            default:
                break;

        }

    }

    /*******
     *
     * Perform an action using the action Id
     *
     * @param actionId
     */
    doActionById(actionId){
        console.log("doActionById");
        if (actionId) {
            let actionsArray = appGlobals.actions[appGlobals.currentNote.uid];
            for (let action of actionsArray) {
                if (action.uid == actionId){
                    this.doAction(action, this);
                    break;
                }
            }
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
    loadScene($sceneOption, url, callback) {

        console.log("loadScene");

        let sceneUrl;

        if ($sceneOption && !url) {
            let region = $sceneOption.attr('data-region');
            let structure = $sceneOption.attr('data-structure');
            sceneUrl = appGlobals.scenePresets[region][structure];
        } else {
            sceneUrl = url;
        }
        if (sceneUrl != null && sceneUrl != "") {
            this.$humanWidget.attr('src', sceneUrl);
        } else {
            console.log("No scene for this option yet");
            return;
        }

        if (parseInt(appGlobals.currentNote.sequence) === 1 && sceneUrl !== appGlobals.firstSceneUrl){
            Utils.resetModal();
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
                }, 500);
                callback();
            });
            return;
        }

        this.human = new HumanAPI("embedded-human");
        this.human.on('human.ready', () => {
            console.log("new scene loaded");
            this.setHumanUi();
        });
    }

    updateFirstSceneUrl() {
        console.log("updateFirstScene: " + appGlobals.firstSceneUrl);
        Utils.setNoteUpdateStatus("Saving first scene...");
        jQuery.ajax({
            url: ajax_object.wp_az_ajax_url,
            data: {
                action: 'update_first_scene_url',
                wp_az_3d_notes_nonce: ajax_object.wp_az_3d_notes_nonce,
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

    loadImage(){
        console.log("loadImage");
        this.$modalTitle.text("Load Image");
        this.$modalBody.text("Select image to use");
        this.$modalBtn1.text("Cancel");
        this.$modalBtn2.text("OK");
        this.$modalAlert.modal('show');
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
        console.log("setInitialSceneState.");
        if (appGlobals.currentNote){
            if (appGlobals.currentNote.scene_state !== ""){
                let scene_state = JSON.parse(appGlobals.currentNote['scene_state']);
                human.send("scene.restore", scene_state, () => {
                    this.loadAnnotations();
                });
                if (callback) callback(scene_state);
            }
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
    new AnatomyNotes();
});




