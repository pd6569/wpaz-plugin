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
        this.sceneState = {};

        // notes variables
        this.notes = {};
        this.sceneStateString = "";
        this.decodedSceneState= {};
        this.notesOrder = 1;

        // user
        this.isUserAdmin = ajax_object.wp_az_user_role;

        this.human.on('human.ready', () => {
            console.log("Human is now ready for action");
            this.setCameraInfo();
            this.setToolbarListeners();
            this.setSceneState();
        });

        // DOM
        this.$notesTitle = jQuery('.notes-title');
        this.$notesText = jQuery('.notes-text');
        this.$saveBtn = jQuery('#notes-save-btn');
        this.$saveBtn.on('click', (event) => {
            event.preventDefault();

            this.human.send('scene.capture', (sceneState) => {
                this.sceneState = sceneState;
                console.log("scene.capture : " + JSON.stringify(sceneState));

                let title = this.$notesTitle.val();
                let notesText = this.$notesText.val();
                let notesOrder = this.notesOrder;
                let sceneStateString = JSON.stringify(this.sceneState);

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

        })

        // Load notes data
        this.loadNotes();
    }

    setSceneState(){
        if (this.sceneStateString.length > 0){
            console.log("sceneStateInfoAvailable: " + this.sceneStateString);
            let sceneState = JSON.parse(this.sceneStateString);
            console.log("scene state object:" + JSON.stringify(sceneState));
            this.human.send("scene.restore", sceneState);
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
                this.sceneStateString = response.scene_state;

                if (this.isUserAdmin) {
                    this.$notesTitle.val(response.notes.notes_title);
                    this.$notesText.text(response.notes.notes_text);
                } else {
                    this.$notesTitle.text(response.notes.notes_title);
                    this.$notesText.empty().append(response.notes.notes_text);

                    //ignores 'left', 'right', and 'bones of the' when searching for matching anatomy objects.
                    let toStrip = /^left\s|right\s|bones\sof\sthe\s/i;

                    //outputs <button class="anatomy-object" data-id="OBJECT_ID">OBJECT DISPLAY NAME</button>
                    this.$humanWidget.scanner({toStrip: toStrip, formatData: 'focus'});
                }

            } else {
                // Re-enable the button and revert to original text
                console.log("Failed. " + JSON.stringify(response));
            }
        });
    }

    setCameraInfo() {
        console.log("setCameraInfo");

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

    }
}

jQuery(document).ready(function() {
    new AnatomyTour();
});




