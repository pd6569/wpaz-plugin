/**
 * Created by peter on 26/04/2017.
 */


class MyNotes {

    constructor (){
        console.log("MyNotes module created");

        this.appRef = appGlobals.appRef;

        // Data
        this.myNotes = []; // array of post objects
        this.dataTableIsCreated = false;
        this.requireReload = false;

        // DOM elements

        this.dataTable = null;
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

        let data = {
            'per_page': 100,
        };

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

                // Destroy datatable
                if (myNotesMod.dataTableIsCreated) {
                    console.log("destroy datatable");
                    myNotesMod.dataTable.destroy();
                }

                // empty table
                myNotesMod.$notesTableBody.empty();

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

                // Load data table
                myNotesMod.dataTable = myNotesMod.$notesTable.DataTable({
                    "order": [[ 1, "desc" ]]
                });

                // Hide loading
                Utils.hideLoading();

                // Set data
                myNotesMod.dataTableIsCreated = true;
                myNotesMod.requireReload = false;
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