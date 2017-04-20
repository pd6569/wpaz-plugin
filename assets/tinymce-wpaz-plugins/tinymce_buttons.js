( function() {
    tinymce.create('tinymce.plugins.LinkScene', {

        /**
         * Initialize the TinyMCE plugin
         */
        init : function( editor, url ) {
            editor.addButton( 'linkscene', {
                title : 'Link text to current scene',
                image : url + '/images/linkscene.png',
                onclick: function() {
                    console.log("Link this text to an action");
                    let text = editor.selection.getContent();
                    editor.windowManager.open( {
                        title: 'Link action',

                        body: [{
                            type: 'textbox',
                            multiline: true,
                            name: 'linktext',
                            label: 'Link scene to text',
                            value: text
                        }],

                        onsubmit: function(e) {

                            let id = "linked-scene-" + appGlobals.currentAction.uid;
                            let linkedText =
                                "<span id='" + id + "' class='linked-scene' data-action-id='" + appGlobals.currentAction.uid + "'>" +
                                    text +
                                "</span>";
                            editor.execCommand( 'mceInsertContent', true, linkedText);

                            /*this.$editorBody = jQuery(editor.getBody());
                            this.$editorBody.find('#' + id).css('color', 'red');*/
                        }
                    });
                },


            } );
        }
    });

    // Register the plugin
    tinymce.PluginManager.add( 'linkscene', tinymce.plugins.LinkScene );
} )();

