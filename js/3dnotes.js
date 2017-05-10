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

        // Tab default
        appGlobals.currentTab = appGlobals.tabs.NOTE_EDITOR;

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

        // Layouts
        this.$mainLayout = jQuery('#wpaz-main-layout');

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

        // Dropdowns
        jQuery('body .dropdown-toggle').dropdown(); // conflict with datatables and bootstrap drop downs - requires this

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
        this.$annotateModelBtn = jQuery('#scene-selector-annotate-model');


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
        this.$modalImage = jQuery('.modal-image');
        this.$modalAnnotations = this.$modalAlert.find('.modal-annotations');
        this.$modalActions = this.$modalAlert.find('.modal-actions');
        this.$modalError = this.$modalAlert.find('.modal-error p');
        this.$modalBtn1 = this.$modalAlert.find('#modal-btn-1');
        this.$modalBtn2 = this.$modalAlert.find('#modal-btn-2');

        // Image Upload
        this.$modalImageUpload = jQuery('.modal-image-upload');

        // Image Properties
        this.$modalImageProps = this.$modalAlert.find('.modal-image-properties');
        this.$imgTitle = jQuery('.modal-image-properties .image-title');
        this.$imgDesc = jQuery('.modal-image-properties .image-description');
        this.$imgCaption = jQuery('.modal-image-properties .image-caption');
        this.$imgAlt = jQuery('.modal-image-properties .image-alt');
        this.$imgEdit = jQuery('.modal-image-properties .image-edit');

        // Annotations
        this.$annotationsTitle = this.$modalAnnotations.find('.annotation-title');
        this.$annotationsDescription = this.$modalAnnotations.find('.annotation-description');

        /*******************************
         *  set DOM Event listeners    *
         *******************************/

        // Main Toolbar
        this.$mainToolbarActiveNotes.on('click', () => { Utils.setActiveTab(appGlobals.tabs.NOTE_EDITOR)});
        this.$mainToolbarMyNotes.on('click', () => {
            Utils.setActiveTab(appGlobals.tabs.MY_NOTES);
            let myNotesModule = appGlobals.modulesLoaded[appGlobals.tabs.MY_NOTES];
            if (myNotesModule){

                if (myNotesModule.requireReload){
                    console.log("reload Notes");
                    myNotesModule.loadNotes();
                } else {
                    // do nothing
                }
            } else {
                myNotesModule = new MyNotes();
                appGlobals.modulesLoaded[appGlobals.tabs.MY_NOTES] = myNotesModule;
                myNotesModule.loadNotes();
            }
        });
        this.$mainToolbarCreateNew.on('click', () => { this.showModal('new_note_set') });

        // Scene selector
        this.$sceneSelectorOption.on('click', (event) => { this.loadScene(jQuery(event.target)) });
        this.$sceneSelectImageBtn.on('click', (event) => { this.loadImage(event) });
        this.$annotateModelBtn.on('click', (event) => { this.loadModule(appGlobals.modules.ANNOTATE_MODULE);});


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

            this.$editorBody = jQuery(this.$noteEditor.getBody());

            // add dynamic listener in editor to link scenes to text
            this.$editorBody.on('click', '.linked-scene', (event) => {
                console.log("linked scene clicked in editor");
                let appObj = this;
                let $editLink = jQuery(event.target);
                let linkText = $editLink.text();
                let actionId = $editLink.attr('data-action-id');
                this.doActionById(actionId);

                this.showModal('edit_action', {
                    actionText: linkText,
                    newAction: false,
                    actionId: actionId
                });

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

        // get html templates
        this.getItemTemplates();

        // set UI
        this.setAppUi();

        this.setCanvasLayers();
    }

    /****************************
     *      CLASS METHODS       *
     ****************************/

    /***
     *
     * Set up canvases for modules: annotations, image editing
     *
     */
    setCanvasLayers(){

        // Get initial canvas dimensions
        let height = this.$humanWidget.height();
        let width = this.$humanWidget.width();

        // Create and insert canvases
        let $annotationCanvasHtml = jQuery(
            "<canvas id='annotationCanvas' class='myCanvas' width='" + width + "' height='" + height + "'>" +
            "</canvas>");

        let $imageCanvasHtml = jQuery(
            "<canvas id='imageCanvas' class='myCanvas' width='" + width + "' height='" + height + "'>" +
            "</canvas>");

        $annotationCanvasHtml.appendTo(this.$iframeContainer);
        $imageCanvasHtml.appendTo(this.$iframeContainer);

        // Annotation canvas
        this.annotationCanvas = document.getElementById('annotationCanvas');
        this.annotationCanvasCtx = this.annotationCanvas.getContext('2d');
        this.$annotationCanvas = jQuery('#annotationCanvas');
        this.$annotationCanvas.hide();

        // Image canvas
        this.$imageCanvas = jQuery('#imageCanvas');
        this.$imageCanvas.hide();

    }

    /********
     *
     *
     * @param moduleName {String} Module names as defined in appGlobals
     * @param data {object} Data object with data to load module
     *                      Image Module:
     *                          imgSrc  {String} base64 string encoding image
     */
    loadModule(moduleName, data) {

        let moduleToLoad;


        // Reload open module

        if (moduleToLoad = appGlobals.modulesLoaded[moduleName]) {
            console.log(moduleName + " already exists, load/toggle it");

            switch(moduleName) {

                case appGlobals.modules.IMAGE_MODULE:
                    moduleToLoad.imgSrc = data.imgSrc;
                    moduleToLoad.enableModule();
                    break;

                case appGlobals.modules.ANNOTATE_MODULE:
                    moduleToLoad.toggleModule();
                    break;

                default:
                    console.log("Could not load module: " + moduleName);
                    break;
            }
        }

        // Create new module

        else {
            console.log(moduleName + " does not exist, create it");

            switch(moduleName) {

                case appGlobals.modules.IMAGE_MODULE:
                    new ModuleImage(moduleName, data);
                    break;

                case appGlobals.modules.ANNOTATE_MODULE:
                    new ModuleAnnotate(moduleName);
                    break;

                default:
                    console.log("Could not load module: " + moduleName);
            }
        }

    }


    /****
     *
     * @param modalType {String} Select modal type:
     *                              'annotations',
     *                              'edit_action',
     *                              'new_note_set'
     *                              'image'
     * @param data {Object} Data object associated with modal.
     *          Annotations: takes annotation object, as specified by BioDigital API.
     *          Actions modal:
     *              actionText - (String) text in editor that will be linked to the scene. Required
     *              newAction - (Boolean) true if new action, false if existing action. Optional
     *              actionId - (String) id of action to edit. Optional
     *              imgSrc          {String} base64 encoded image src
 *              Image modal:
     *              type            {String} 'upload', 'snapshot'
     *              imgSrc          {String} base64 encoded image src
     *              callback        {function}
     */
    showModal(modalType, data){

        Utils.resetModal();

        // Other modal elements
        let $deleteBtn = jQuery('#modal-btn-delete');
        $deleteBtn.off(); // detach previous listeners

        switch (modalType){

            case 'annotations':
                console.log("show annotations modal: " + JSON.stringify(data));
                Utils.showModal({
                    title: "Edit Annotation",
                    body: ""
                });

                this.$modalAnnotations.removeClass('hidden');
                $deleteBtn.removeClass('hidden');

                this.$annotationsTitle.val(data.title);
                this.$annotationsDescription.val(data.description);

                this.$modalBtn1.on('click', () => {
                    this.$modalAlert.modal('hide');
                    Utils.resetModal();
                    if (data.isNewAnnotation) {
                        console.log("destroy Annotation", data.annotationId);
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

                $deleteBtn.on('click', () => {
                    console.log("delete annotation");
                    this.human.send('annotations.destroy', data.annotationId, () => {
                        console.log("destroy annotation: " + data.annotationId);
                        this.loadAnnotations(); // reload annotations dropdown
                    });
                    this.$modalAlert.modal('hide');
                    Utils.resetModal();
                });

                return true;

            case 'edit_action':
                Utils.showModal({
                    title: "Edit Action: " + data.actionText,
                    body: "Current scene will be linked to text '" + data.actionText + "'"
                });

                console.log("action modal data: ", data);

                // Data
                let actionData = {};
                let actionObj;

                // Different actions
                let $actions = jQuery('.modal-action-option');

                // Labels
                let $labelActions = jQuery('.label-action-options');
                $labelActions.text("No action");
                let $labelCameraRotate = jQuery('.label-camera-rotate');

                // Containers for all option settings
                let $allOptionsContainers = jQuery('.modal-action-options-container');
                $allOptionsContainers.addClass('hidden');

                // Individual option containers
                let $cameraRotateOptionsContainer = jQuery('.modal-actions__camera-rotate');


                if (!appGlobals.mode.EDIT_IMAGE) {
                    this.$modalActions.removeClass('hidden').show();
                }

                // Existing scene link
                if (!data.newAction) {
                    $deleteBtn.removeClass('hidden');

                    $deleteBtn.on('click', () => {
                        // remove action data
                        Action.deleteAction(data.actionId);

                        // Update UI
                        this.removeAction(data.actionId);

                        // remove from editor
                        let $removeLink = this.$editorBody.find(`span[data-action-id='${data.actionId}']`);
                        $removeLink.remove();

                        this.$noteEditor.execCommand( 'mceInsertContent', true, data.actionText);

                        this.$modalAlert.modal('hide');
                        Utils.resetModal();
                    });

                    // Get existing action data
                    console.log("Action associated with this data", Action.getActionById(data.actionId));
                    actionObj = Action.getActionById(data.actionId);
                    actionData = actionObj.action_data;

                    // Set correct action label and show options
                    if (actionData) {
                        if (actionData.type === appGlobals.actionDataTypes.ROTATE_CAMERA) {
                            $labelActions.text("360 Camera Rotate")
                        } else {
                            $labelActions.text("No Action");
                        }

                        showOptionsForDataAction(actionData.type);
                    }
                }

                $actions.on('click', (event) => {
                    let $actionSelected = jQuery(event.target);
                    let dataActionSelected = $actionSelected.attr('data-action-data-type');

                    // Update action label
                    $labelActions.text($actionSelected.text());

                    showOptionsForDataAction(dataActionSelected);
                });


                this.$modalBtn1.on('click', () => {
                    this.$modalAlert.modal('hide');
                    Utils.resetModal();
                });

                this.$modalBtn2.on('click', () => {

                    if (data.newAction) {

                        let actionType;
                        if (appGlobals.mode.EDIT_IMAGE){
                            actionType = appGlobals.actionTypes.IMAGE;
                            actionData.type = appGlobals.actionDataTypes.STATIC_IMAGE;
                            actionData.imgSrc = data.imgSrc;
                        } else {
                            actionType = appGlobals.actionTypes.GENERAL;
                        }
                        this.addAction(data.actionText, actionData, (action) => {
                            console.log("added action: ", action);
                            let linkedText =
                                "<span class='linked-scene' data-action-id='" + action.uid + "'>" +
                                data.actionText +
                                "</span>";
                            this.$noteEditor.execCommand( 'mceInsertContent', true, linkedText);
                        }, actionType);
                    } else {
                        console.log("Function to update actions...");
                        Action.getActionById(actionObj.uid).action_data = actionData;
                    }

                    this.$modalAlert.modal('hide');
                    Utils.resetModal();

                    this.actionsChanged = true;
                });

            /***
             *
             * Private function. Displays the options for a selected action.
             *
             * @param dataActionSelected Data action type as specified in appGlobls.actionDataTypes
             */
                function showOptionsForDataAction(dataActionSelected) {

                    if (!actionData) {
                        actionData = {};
                    }

                    // Function for rotate camera action
                    if (dataActionSelected === appGlobals.actionDataTypes.ROTATE_CAMERA){

                        actionData.type = appGlobals.actionDataTypes.ROTATE_CAMERA;


                        /*******************************************
                         * Add/Update action option behaviour here *
                         *******************************************/

                        // show camera rotation options
                        $cameraRotateOptionsContainer.removeClass('hidden');
                        let $cameraRotateSpeed = jQuery('.camera-rotate-speed-option');

                        if (actionData.rotationSpeed) {
                            let rotationSpeeds = Object.keys(Action.actionDataValues().ROTATE_CAMERA.speeds);
                            for (let speedText of rotationSpeeds) {
                                console.log("current speed: " + Action.actionDataValues().ROTATE_CAMERA.speeds[speedText] + " rotationSpeed: " + actionData.rotationSpeed);
                                if (Action.actionDataValues().ROTATE_CAMERA.speeds[speedText] == actionData.rotationSpeed) {
                                    $labelCameraRotate.text(Utils.capitalizeFirstLetter(speedText));
                                    break;
                                }
                            }
                        }

                        $cameraRotateSpeed.on('click', (event) => {
                            let $speedSelected = jQuery(event.target);
                            let speed = $speedSelected.attr('data-camera-rotate');
                            if (speed === 'slow') actionData.rotationSpeed = Action.actionDataValues().ROTATE_CAMERA.speeds.slow;
                            if (speed === 'medium') actionData.rotationSpeed = Action.actionDataValues().ROTATE_CAMERA.speeds.medium;
                            if (speed === 'fast') actionData.rotationSpeed = Action.actionDataValues().ROTATE_CAMERA.speeds.fast;

                            // Update label
                            $labelCameraRotate.text($speedSelected.text());
                        })

                    } else {
                        actionData = {};
                        $allOptionsContainers.addClass('hidden');
                    }

                }

                return true;

            case 'new_note_set':
                console.log("new_note_set");
                Utils.resetModal();
                Utils.showModal({
                    title: "Create New Notes",
                    body: "<input id='create-new-note-set' type='text' class='form-control' placeholder='Enter title' value=''>",
                });
                this.$modalBtn1.on('click', () => { this.$modalAlert.modal('hide')});
                this.$modalBtn2.on('click', () => {
                    let newTitle = jQuery('#create-new-note-set').val();
                    this.clearActiveNotes();
                    this.$postTitle.text(newTitle);
                    this.$mainToolbarActiveNotes.find('a').text(newTitle);
                    this.$modalAlert.modal('hide');


                    // CREATE NEW POST IN DB
                    this.createPostInDb(newTitle);

                    // Notify MyNotes module that reload will be required
                    if (appGlobals.modulesLoaded[appGlobals.tabs.MY_NOTES]) {
                        appGlobals.modulesLoaded[appGlobals.tabs.MY_NOTES].requireReload = true;
                    }

                    // Switch tab
                    if (appGlobals.currentTab !== appGlobals.tabs.NOTE_EDITOR) {
                        Utils.setActiveTab(appGlobals.tabs.NOTE_EDITOR)
                    }
                });
                return true;

            case 'image':

                let self = this;
                let type = data.type;
                let imgSrc = data.imgSrc;
                let callback = data.callback;
                let defaultTitle;

                Utils.resetModal();
                Utils.showModal({
                    title: type == 'upload' ? "Upload Image" : "Edit Snapshot",
                    body: "",
                });

                this.$modalImage.removeClass('hidden');

                // default click listeners
                this.$modalBtn1.on('click', () => {
                    this.$modalAlert.modal('hide');
                    Utils.resetModal();
                    return;
                });

                this.$modalBtn2.on('click', () => {
                    this.$modalAlert.modal('hide');
                    Utils.resetModal();
                    return;
                });

                if (type === 'upload'){
                    this.$modalImageUpload.removeClass('hidden');
                    this.$modalImageProps.addClass('hidden');

                    let $imageUpload = jQuery('#image-upload');

                    // reset file input
                    $imageUpload.val("");

                    $imageUpload.on('change', (event) => {

                        if (event.target.value == "" || event.target.value == null) return;

                        // Check that file upload is jpeg (add additional file types as required)
                        let ext = event.target.value.match(/\.([^\.]+)$/)[1];
                        console.log("ext: ", ext);
                        switch(ext)
                        {
                            case 'jpg':
                                break;
                            default:
                                alert('Please select a JPEG/JPG file');
                                $imageUpload.val("");
                                this.$modalImageProps.addClass('hidden');
                                return;
                        }


                        let file = event.target.files[0];
                        let fileName = event.target.files[0].name.replace(/\.[^/.]+$/, "");
                        let reader = new FileReader();

                        reader.readAsDataURL(file);

                        // Called once data has been read as data url
                        reader.onload = function(event) {

                            imgSrc = event.target.result;

                            loadImgProperties(fileName);
                        };
                    });

                } else if (type === 'snapshot') {
                    this.$modalImageUpload.addClass('hidden');
                    loadImgProperties();
                }

                function loadImgProperties(title) {
                    self.$modalImageProps.removeClass('hidden');

                    // Set field defaults
                    title ? defaultTitle = title : defaultTitle = "Snapshot " + appGlobals.numSnapshots;
                    self.$imgTitle.val(defaultTitle);
                    self.$modalImageProps.find('.image-thumbnail img').attr('src', imgSrc);

                    // clear fields
                    self.$imgDesc.val("");
                    self.$imgCaption.val("");
                    self.$imgAlt.val("");

                    setClickListeners();
                }

                function setClickListeners(){
                    self.$imgEdit.off();
                    self.$imgEdit.on('click', (event) => {
                        console.log("load Image Editor");
                        event.preventDefault();
                        self.$modalAlert.modal('hide');
                        Utils.resetModal();
                        self.loadModule(appGlobals.modules.IMAGE_MODULE, {
                            imgSrc: imgSrc
                        })
                    });

                    self.$modalBtn2.off();
                    self.$modalBtn2.on('click', () => {

                        let imgTitle;
                        self.$imgTitle.val() == "" ? imgTitle = defaultTitle : imgTitle = self.$imgTitle.val();
                        let imgDesc = self.$imgDesc.val();
                        let imgCaption = self.$imgCaption.val();
                        let imgAlt = self.$imgAlt.val();

                        console.log("title: " + imgTitle + " desc: " + imgDesc + " caption: " + imgCaption + "imgAlt: " + imgAlt);

                        self.$modalAlert.modal('hide');
                        Utils.resetModal();

                        if (type === 'upload'){
                            self.loadModule(appGlobals.modules.IMAGE_MODULE, {
                                imgSrc: imgSrc,
                            })
                        } else {

                            Utils.setNoteUpdateStatus("Saving image...");

                            self.saveImageToServer({
                                'imgSrc': imgSrc,
                                'imgTitle': imgTitle,
                                'imgDesc': imgDesc,
                                'imgCaption': imgCaption,
                                'imgAlt': imgAlt,
                            }, (data) => {

                                let $updateNote = self.$notesTimelineContainer.find('#' + appGlobals.currentNote.uid);
                                let $imageContainer = $updateNote.find('.note-image-container .row');

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

                            });

                            /*// Save media to server and append
                            let $updateNote = self.$notesTimelineContainer.find('#' + appGlobals.currentNote.uid);
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
                            });*/

                        }

                        if (callback) {
                            callback(imgSrc)
                        }

                    });

                }

                return true;

            default:
                console.log("No modal found for: ", modalType);
                return false;
        }
    }

    saveImageToServer(imageProperties, success, error) {
        console.log("saveImageToServer", imageProperties);
        jQuery.ajax({
            url: ajax_object.wp_az_ajax_url,
            data: {
                action: 'upload_snapshot',
                wp_az_3d_notes_nonce: ajax_object.wp_az_3d_notes_nonce,
                wp_az_post_id: appGlobals.post_id,
                wp_az_img_data: imageProperties['imgSrc'],
                wp_az_img_title: imageProperties['imgTitle'],
                wp_az_img_desc: imageProperties['imgDesc'],
                wp_az_img_caption: imageProperties['imgCaption'],
                wp_az_img_alt: imageProperties['imgAlt'],
                wp_az_note_id: appGlobals.currentNote.uid
            },
            error: function() {
                console.log("Failed to save snapshot");
                Utils.setNoteUpdateStatus("Failed to save snapshot", 3000);

                if (error) {
                    error();
                }
            },
            success: function(data) {
                console.log("Snapshot saved", data);
                Utils.setNoteUpdateStatus("Snapshot saved", 3000);

                if (success) {
                    success(data);
                }

            },
            type: 'POST'
        });
    }

    /****
     *
     * Creates new post in DB using WP REST API
     *
     * @param title (String) Title of new post (note set)
     * @param callback (Function) Function called once post created. Takes one argument (post object)
     */
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

                if (callback) callback(response);

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
                console.log("Got templates", data);
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
                        setActionData(action);
                        appGlobals.actions[action.note_id].push(action);
                    } else {
                        setActionData(action);
                        appGlobals.actions[action.note_id] = [action];
                    }

                    // if action has data, parse string into object and set data.
                    function setActionData(action){
                        if (action.action_data) {
                            if (Object.keys(action.action_data).length > 0){
                                let actionDataObj = JSON.parse(action.action_data);
                                action.action_data = actionDataObj;
                            }
                        }
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

                this.$notesTimelineContainer.append($noteSection);
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

    updateActionLabel(){
        this.actionsChanged = true;
        this.$numActionsLabel.text(this.numActions + ' actions');
    }

    addAction(actionTitle, actionData, callback, actionType = appGlobals.actionTypes.GENERAL) {

        this.numActions++;
        this.updateActionLabel();

        let self = this;

        // create action, add to array
        let noteId = appGlobals.currentNote.uid;
        let action = new Action(noteId, this.numActions, actionType);
        if (actionTitle) action.setTitle(actionTitle);
        if (actionData) action.setData(actionData);
        if(appGlobals.actions[noteId]) {
            appGlobals.actions[noteId].push(action);
        } else {
            appGlobals.actions[noteId] = [action];
        }

        let $actionItem;

        if (!actionTitle) {
            $actionItem = jQuery("<li id='" + action.uid + "' class='list-group-item'><a> Action " + this.numActions + "</a></li>");
        } else {
            $actionItem = jQuery("<li id='" + action.uid + "' class='list-group-item'><a>" + actionTitle + "</a></li>");
        }
        this.$actionsDropdownContainer.append($actionItem);

        // Set current action
        this.setCurrentAction(action);

        // create new generic action
        if (actionType === appGlobals.actionTypes.GENERAL){
            this.getSceneState((sceneState) => {
                action.setSceneState(JSON.stringify(sceneState));
                console.log("Scene state saved as action");
                Utils.updateActionStatusBox("Action added to this note set.");

                setActionListener();

                if (callback) callback(action);

            });
        } else if (actionType === appGlobals.actionTypes.IMAGE){

            setActionListener();

            if (callback) callback(action);
        }

        function setActionListener(){
            $actionItem.on('click', (event) => {
                event.preventDefault();

                self.doAction(action, self);

                /*switch(action.action_type){
                    case appGlobals.actionTypes.GENERAL:
                        self.doAction(action, self);
                        break;
                }*/

            });
        }


    }

    removeAction(actionId) {
        console.log("removeAction");

        this.numActions--;
        this.updateActionLabel();

        // Remove from dropdown
        this.$actionsDropdownContainer.find('#' + actionId).remove();
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

                let data = {
                    type: 'snapshot',
                    imgSrc: imgSrc,
                }
                this.showModal('image', data);

            });
        }, 50);

    }

    /**
     * If action has action data - execute this data
     */
    execActionData(action_data, appObj){
        console.log("execActionData", action_data);
        if (action_data.type){
            switch (action_data.type) {
                case appGlobals.actionDataTypes.ROTATE_CAMERA:
                    console.log("Rotate camera");

                    appGlobals.animateUpdate = true;

                    // Stop rotating camera if scene is clicked
                    appObj.human.on('scene.picked', function () {
                        appGlobals.animateUpdate = false;
                    });

                    function update() {
                        // Orbit camera horizontally around target
                        appObj.human.send("camera.orbit", {
                            yaw: action_data.rotationSpeed,
                        });

                        if (appGlobals.animateUpdate) {
                            requestAnimationFrame(update);
                        }
                    };

                    requestAnimationFrame(update);
                    return true;

                default:
                    return false;
            }
        } else {
            return false;
        }
    }

    // DO ACTION METHODS
    doAction(action, appObj){
        console.log("doAction");

        // Stop any current animations
        appGlobals.animateUpdate = false;

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

                        // If action has associated data, execute this data
                        if (action.action_data) appObj.execActionData(action.action_data, appObj);

                    });
                });

                appObj.setCurrentAction(action);

                break;

            case appGlobals.actionTypes.IMAGE:
                console.log("Load image into canvas");

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
        console.log("doActionById: " + actionId);
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
                let actionTitle;
                if (action.action_title) {
                    actionTitle = action.action_title;
                } else {
                    actionTitle = "Action " + action.action_order;
                }

                let $actionItem = jQuery("<li id='" + action.uid + "' class='list-group-item'><a>" + actionTitle + "</a></li>");
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

    loadImage(event){
        event.preventDefault();

        console.log("loadImage");

        this.showModal('image', {
            type: 'upload',
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




