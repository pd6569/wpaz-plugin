/**
 * Created by peter on 26/04/2017.
 */


class MyNotes {

    constructor (){
        console.log("MyNotes module created");

        this.appRef = appGlobals.appRef;

        // Data
        this.myNotes = []; // array of post objects

        // DOM elements
        this.$notesTable = jQuery('#my-notes-table');
        this.$notesTableBody = this.$notesTable.find('tbody');

        // Listeners
        this.$notesTable.on('click', '.my-notes__note-title', (event) => {
            let $noteSelected = jQuery(event.target);
            console.log("Post id: " + $noteSelected.attr('data-post-id'));
        })
    }

    loadNotes() {

        Utils.showLoading();

        let data = {};

        let url;

        if (this.appRef.userRole === appGlobals.userRoles.ADMIN){
            url = ajax_object.wp_az_root + 'wp/v2/3d-notes'
        } else {
            url = ajax_object.wp_az_root + 'wp/v2/user-notes'
        }

        let myNotesMod = this;

        jQuery.ajax({
            method: 'GET',
            url: url,
            data: data,
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-WP-Nonce', ajax_object.wp_az_nonce);
            },
            success: function(response) {
                console.log("List of 3D notes obtained", response);

                myNotesMod.myNotes = response;

                for (let post of response){

                    let title = post.title.rendered;
                    let id = post.id;
                    let url = post.guid.rendered;
                    let date = post.date;
                    let $row = jQuery(
                        `<tr>
                            <td><a href="${url}" data-post-id="${id}" class="my-notes__note-title">${title}</a></td>
                            <td>${date}</td>
                        </tr>`);
                    myNotesMod.$notesTableBody.append($row);

                }

                // Load datatable
                myNotesMod.$notesTable.DataTable();

                // Hide loading
                Utils.hideLoading();
            },
            error: function(response) {
                console.log("failed: " + JSON.stringify(response));
            }
        })

    }

    displayNoteSet(postId) {

    }

    displayNotes() {

    }

}