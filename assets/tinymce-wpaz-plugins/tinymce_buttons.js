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
                },
            } );
        }
    });

    // Register the plugin
    tinymce.PluginManager.add( 'linkscene', tinymce.plugins.LinkScene );
} )();