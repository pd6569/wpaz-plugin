/**
 * Created by peter on 26/04/2017.
 */


class MyNotes {

    constructor (){
        console.log("MyNotes module created");

        this.appRef = appGlobals.appRef;
    }

    loadNotes() {

    }

    displayNotes() {

        let data = {};

        let url;

        if (this.appRef.userRole === appGlobals.userRoles.ADMIN){
            url = ajax_object.wp_az_root + 'wp/v2/3d-notes'
        } else {
            url = ajax_object.wp_az_root + 'wp/v2/user-notes'
        }

        jQuery.ajax({
            method: 'GET',
            url: url,
            data: data,
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-WP-Nonce', ajax_object.wp_az_nonce);
            },
            success: function(response) {
                console.log("success: " + JSON.stringify(response));
            },
            error: function(response) {
                console.log("failed: " + JSON.stringify(response));
            }
        })

    }

}