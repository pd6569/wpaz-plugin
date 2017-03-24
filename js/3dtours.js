/**
 * Created by peter on 22/03/2017.
 */

class AnatomyTour {

    constructor() {
        console.log("anatomy tours loaded");

        // get BioDigital Human
        this.human = new HumanAPI("embedded-human");

        // variables
        this.cameraInfo = {};

        this.human.on('human.ready', () => {
            console.log("Human is now ready for action");
            this.setCameraInfo();
            this.setToolbarListeners();
        });

        // DOM
        this.$notesTitle = jQuery('.notes-title');
        this.$notesText = jQuery('.notes-textarea');
        this.$saveBtn = jQuery('#notes-save-btn');
        this.$saveBtn.on('click', (event) => {
            event.preventDefault();

            this.human.send('scene.capture', (sceneState) => {
                console.log("sceneState: " + JSON.stringify(sceneState));
            });

            let title = this.$notesTitle.val();
            let notesText = this.$notesText.val();

            //!* Data to make available via the $_POST variable
            let data = {
                action: 'save_notes',
                wp_az_3d_tours_nonce: ajax_object.wp_az_3d_tours_nonce,
                wp_az_post_id: ajax_object.wp_az_post_id,
                wp_az_notes_title: title,
                wp_az_notes_text: notesText
            };

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



        })


        /*// Example of ajax call
         renderUi(){

         //!* Data to make available via the $_POST variable
         let data = {
         action: 'process_templates',
         wp_az_3d_tours_nonce: ajax_object.wp_az_3d_tours_nonce
         };

         //!* Process the AJAX POST request
         jQuery.post(ajax_object.wp_az_ajax_url, data, response => {
         if ( response.status == 'success' ) {
         // Show success message, then fade out the button after 2 seconds
         console.log("Success " + JSON.stringify(response));
         this.$notes.append(AnatomyTour.render(response.template, null));
         } else {
         // Re-enable the button and revert to original text
         console.log("Failed. data: " + JSON.stringify(data) + " response: " + JSON.stringify(response));
         }
         });

         return false;

         }

         static render(tmplUrl, tmplData) {
         console.log("render UI");
         if (!this.render.tmplCache) {
         this.render.tmplCache = {};
         }

         if (!this.render.tmplCache[tmplUrl]) {
         let tmplString;
         jQuery.ajax({
         url: tmplUrl,
         method: 'GET',
         dataType: 'html', //!** Must add
         async: false,
         success: function(data) {
         tmplString = data;
         data = jQuery(data);

         }
         });

         // compiles html into a function that can be passed data (i.e. post data)
         this.render.tmplCache[tmplUrl] = Handlebars.compile(tmplString);
         }

         // pass data into handlebars function to generate HTML to insert
         return this.render.tmplCache[tmplUrl](tmplData);
         }*/
    }

    setCameraInfo() {
        // set initial variables
        this.human.send("camera.info", (camera) => {
            this.cameraInfo = camera;
            console.log("cameraInfo: " + JSON.stringify(this.cameraInfo));
        })
    }

    setToolbarListeners() {

        // get DOM elements
        console.log("setToolbarListeners cameraInfo: " + JSON.stringify(this.cameraInfo));

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




