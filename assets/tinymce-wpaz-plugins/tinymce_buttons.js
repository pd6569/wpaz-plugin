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
                    let actionData;

                    editor.windowManager.open( {
                        title: 'Link action',

                        body: [{
                            type: 'textbox',
                            multiline: true,
                            name: 'linktext',
                            label: 'Link scene to text',
                            value: text
                        }, {
                            type   : 'listbox',
                            name   : 'action',
                            label  : 'Action',
                            values : [
                                { text : 'No action', value: null },
                                { text: 'Rotate camera', value: appGlobals.actionDataTypes.ROTATE_CAMERA }
                            ],
                            onSelect: function () {
                                console.log("Value selected: " + this.value());
                                if (this.value() === appGlobals.actionDataTypes.ROTATE_CAMERA) {
                                    actionData = {
                                        type: appGlobals.actionDataTypes.ROTATE_CAMERA,
                                        rotationSpeed: 0.5
                                    }
                                }
                            }
                        }],

                        onsubmit: function(e) {
                            appGlobals.appRef.addAction(text, actionData, (action) => {
                                console.log("added action: ", action);
                                let linkedText =
                                    "<span class='linked-scene' data-action-id='" + action.uid + "'>" +
                                    text +
                                    "</span>";
                                editor.execCommand( 'mceInsertContent', true, linkedText);

                            })
                        }
                    });
                },


            } );
        }
    });

    // Register the plugin
    tinymce.PluginManager.add( 'linkscene', tinymce.plugins.LinkScene );
} )();

