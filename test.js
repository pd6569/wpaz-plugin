/**
 * Created by peter on 23/03/2017.
 */

/**
 * Created by peter on 22/03/2017.
 */

class AnatomyTour {

    constructor(){
        console.log("anatomy tours has been loaded");

        this.tmplUrls = {
            TMPL_NOTES_FORM: "templates/item_notes_form.html"
        };

        this.$notes = jQuery('#wpaz-notes');

        // set up UI

        this.renderUi();

    }

    renderUi(){

        //* Data to make available via the $_POST variable
        let data = {
            action: 'process_templates',
            wpaz_3d_tours_nonce: ajax_object.wpaz_3d_tours_nonce
        };

        //* Process the AJAX POST request
        jQuery.post(ajax_object.wpaz_ajax_url, data, response => {
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
        console.log("render UI for template: " + tmplUrl + " data: " + tmplData);
        if (!this.render.tmplCache) {
            this.render.tmplCache = {};
        }

        if (!this.render.tmplCache[tmplUrl]) {
            let tmplString;
            jQuery.ajax({
                url: tmplUrl,
                method: 'GET',
                dataType: 'html', //** Must add
                async: false,
                success: function(data) {
                    console.log("Call for module template: " + tmplUrl + " successfull");
                    tmplString = data;
                    data = jQuery(data);

                }
            });

            // compiles html into a function that can be passed data (i.e. post data)
            this.render.tmplCache[tmplUrl] = Handlebars.compile(tmplString);
        }

        // pass data into handlebars function to generate HTML to insert
        return this.render.tmplCache[tmplUrl](tmplData);
    }

}

jQuery(document).ready(function() {
    console.log("document ready load anatomy tour");
    new AnatomyTour();
});




