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
        this.resetSceneState = {};

        // notes variables
        this.notes = {};
        this.sceneStateString = "";
        this.notesOrder = 1;

        // actions varibles
        this.numActions = 0;
        this.storedActions = [];

        // user
        this.isUserAdmin = ajax_object.wp_az_user_role;

        this.human.on('human.ready', () => {
            console.log("Human is now ready for action");

            this.updateCameraInfo();
            this.setToolbarListeners();
            this.setSceneState();
            this.registerCallbacks();
        });

        // DOM
        this.$notesTitle = jQuery('.notes-title');
        this.$notesText = jQuery('.notes-text');
        this.$callbackAlert = jQuery('#callback-alert-box');
        this.$cameraBtn = jQuery('#action-camera');
        this.$saveBtn = jQuery('#notes-save-btn');
        this.$actionsSequenceContainer = jQuery('#scene-actions .list-group');

        // DOM Event listeners
        this.$saveBtn.on('click', (event) => {
            event.preventDefault();

            this.human.send('scene.capture', (sceneState) => {
                this.currentSceneState = sceneState;
                console.log("scene.capture : " + JSON.stringify(sceneState));

                let title = this.$notesTitle.val();
                let notesText = this.$notesText.val();
                let notesOrder = this.notesOrder;
                let sceneStateString = JSON.stringify(this.currentSceneState);

                //!* Data to make available via the $_POST variable
                let data = {
                    action: 'save_notes',
                    wp_az_3d_tours_nonce: ajax_object.wp_az_3d_tours_nonce,
                    wp_az_post_id: ajax_object.wp_az_post_id,
                    wp_az_notes_title: title,
                    wp_az_notes_text: notesText,
                    wp_az_notes_scene_state: sceneStateString,
                    wp_az_notes_order: notesOrder
                };

                console.log("data: " + JSON.stringify(data));

                //!* Process the AJAX POST request
                jQuery.post(ajax_object.wp_az_ajax_url, data, response => {
                    if (response.status == 'success') {
                        // Show success message, then fade out the button after 2 seconds
                        console.log("Success! " + JSON.stringify(response));
                    } else {
                        // Re-enable the button and revert to original text
                        console.log("Failed. " + JSON.stringify(response));
                    }
                });

            });

        });

        this.$cameraBtn.on('click', (event) => {

            this.numActions++;

            let actionId = "action-" + this.numActions;
            let $actionItem = jQuery("<li id='" + actionId + "' class='list-group-item'><a>" + this.numActions + ". Updated Camera Position</a></li>")

            event.preventDefault();
            this.$actionsSequenceContainer.append($actionItem);

            // create new camera action
            let action = new Action(this.numActions, 'camera', this.cameraInfo.position);
            this.storedActions.push(action);
            console.log("action stored: " + JSON.stringify(action));

            $actionItem.on('click', (event) => {
                this.human.send('camera.set', {
                    position: action.data,
                    animate: true
                })
            })
        });

        // Load notes data
        this.loadNotes();
    }

    registerCallbacks() {

        this.human.on("camera.updated", (cameraInfo) => {
            this.cameraInfo = cameraInfo;
            this.$callbackAlert.text('Camera position updated - click camera button to store new location').removeClass('hidden');
        });
    }

    setSceneState(){
        console.log("setSceneState");
        if (this.sceneStateString.length > 0){
            console.log("setSceneState restore previous scene state");
            let sceneState = JSON.parse(this.sceneStateString);
            this.human.send("scene.restore", sceneState);

            // save scene as reset point
            this.resetSceneState = sceneState;
        } else {
            console.log("setSceneState no previous state to restore, set reset point");
            this.human.send('scene.capture', (sceneState) => {
               this.resetSceneState = sceneState;
            });
        }
    }

    loadNotes(){

        let data = {
            action: 'load_notes',
            wp_az_post_id: ajax_object.wp_az_post_id,
            wp_az_notes_order: this.notesOrder
        };

        //!* Process the AJAX GET request
        jQuery.get(ajax_object.wp_az_ajax_url, data, response => {
            if (response.status == 'success') {
                // Show success message, then fade out the button after 2 seconds
                console.log("Success! " + JSON.stringify(response));
                this.notes = response.notes;
                response.scene_state != null ? this.sceneStateString = response.scene_state : this.sceneStateString = "";

                if (response.notes){
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

        let $toolbarZoomIn = jQuery('#toolbar-zoom-in');
        let $toolbarZoomOut = jQuery('#toolbar-zoom-out');
        let $toolbarReset = jQuery('#toolbar-reset');

        $toolbarZoomIn.on('click', event => {
            console.log("zoom in. current zoom " + this.cameraInfo.zoom);
            let newZoom = this.cameraInfo.zoom + 0.001;
            this.human.send("camera.zoom", newZoom);
            this.cameraInfo.zoom = newZoom;
        });

        $toolbarZoomOut.on('click', event => {
            console.log("zoom out. current zoom " + this.cameraInfo.zoom);
            let newZoom = this.cameraInfo.zoom - 0.001;
            this.human.send("camera.zoom", newZoom);
            this.cameraInfo.zoom = newZoom;
        });

        $toolbarReset.on('click', event => {
            console.log("reset scene");
            this.human.send("scene.restore", this.resetSceneState);
        })

    }
}

jQuery(document).ready(function() {
    new AnatomyTour();
});




