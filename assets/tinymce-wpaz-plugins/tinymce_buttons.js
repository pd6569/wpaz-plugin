( function() {
    tinymce.create('tinymce.plugins.LinkScene', {

        /**
         * Initialize the TinyMCE plugin
         */
        init : function( editor, url ) {
            console.log("init linkscene tinymce plugin. " + url);
            editor.addButton( 'linkscene', {
                title : 'Link text toscene',
                image : url + '/images/linkscene.png',

                onclick: function() {
                    console.log("Link this text to an action");
                    editor.windowManager.open( {
                        title: 'Link action',

                        body: [{
                            type: 'textbox',
                            multiline: true,
                            name: 'linktext',
                            label: 'Link scene to text',
                            value: 'PWNAGE TEXT'
                        }],

                        onsubmit: function(e) {
                            editor.execCommand( 'mceInsertContent', 0, 'Pwning the noobs' );
                        }
                    });
                },


            } );
        }
    });

    // Register the plugin
    tinymce.PluginManager.add( 'linkscene', tinymce.plugins.LinkScene );
} )();

