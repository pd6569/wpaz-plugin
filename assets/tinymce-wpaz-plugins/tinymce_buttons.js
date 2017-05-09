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
                    let imgSrc;

                    if (appGlobals.mode.EDIT_IMAGE) {
                        let imageModule = appGlobals.modulesLoaded[appGlobals.modules.IMAGE_MODULE];
                        if (imageModule) {
                            imgSrc = imageModule.doToolbarAction('get-all').saveImage(true);
                        }
                    }

                    appGlobals.appRef.showModal('edit_action', {
                        actionText: text,
                        newAction: true,
                        imgSrc: imgSrc
                    });
                },


            } );
        }
    });

    // Register the plugin
    tinymce.PluginManager.add( 'linkscene', tinymce.plugins.LinkScene );
} )();

