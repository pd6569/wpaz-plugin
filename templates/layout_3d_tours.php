<?php

    global $wpdb;
    global $post;
    global $item_template_names;

    $table_name = $wpdb->prefix . 'anatomy_tours_notes';

    $notes = $wpdb->get_results(
            "SELECT title, uid, note_content, sequence, scene_state, url
                  FROM $table_name 
                  WHERE post_id = $post->ID
                  ORDER BY sequence ASC" );
    ?>


<div id="wpaz-3d-tours-layout">

    <div class="container">

        <div class="row">

            <div id="wpaz-model-container" class="col-md-8">
                <iframe
                        id="embedded-human"
                        frameBorder="0"
                        width="100%"
                        height="600"
                        allowFullScreen="true"
                        src="<?php if (!empty($notes[0]->url)): echo $notes[0]->url; else: echo "https://human.biodigital.com/widget?be=1mHv&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7"; endif; ?>">
                </iframe>


	            <?php if (current_user_can('administrator')): ?>

                    <div id="wpaz-scene-selector" class="text-center">

                        <div class="btn-group scene-selector scene-selector__whole-body dropup">
                            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Body <span class="caret"></span>
                            </button>
                            <ul id="scene-selector-body" class="dropdown-menu">
                                <li><a class="scene-selector-option" data-region="body" data-structure="all">All</a></li>
                                <li><a class="scene-selector-option" data-region="body" data-structure="bone">Bones</a></li>
                                <li><a class="scene-selector-option" data-region="body" data-structure="muscle">Muscles</a></li>
                                <li><a class="scene-selector-option" data-region="body" data-structure="nerve">Nerves</a></li>
                                <li><a class="scene-selector-option" data-region="body" data-structure="artery">Arteries</a></li>
                                <li><a class="scene-selector-option" data-region="body" data-structure="vein">Veins</a></li>
                                <li><a class="scene-selector-option" data-region="body" data-structure="vessel">All vessels</a></li>
                                <li><a class="scene-selector-option" data-region="body" data-structure="lymph">Lymphatics</a></li>
                                <li><a class="scene-selector-option" data-region="body" data-structure="organ">Viscera</a></li>
                            </ul>
                        </div>

                        <div class="btn-group scene-selector scene-selector__head dropup">
                            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Head <span class="caret"></span>
                            </button>
                            <ul id="scene-selector-body" class="dropdown-menu">
                                <li><a class="scene-selector-option" data-region="head" data-structure="all">All</a></li>
                                <li><a class="scene-selector-option" data-region="head" data-structure="bone">Bones</a></li>
                                <li><a class="scene-selector-option" data-region="head" data-structure="muscle">Muscles</a></li>
                                <li><a class="scene-selector-option" data-region="head" data-structure="nerve">Nerves</a></li>
                                <li><a class="scene-selector-option" data-region="head" data-structure="artery">Arteries</a></li>
                                <li><a class="scene-selector-option" data-region="head" data-structure="vein">Veins</a></li>
                                <li><a class="scene-selector-option" data-region="head" data-structure="vessel">All vessels</a></li>
                                <li><a class="scene-selector-option" data-region="head" data-structure="lymph">Lymphatics</a></li>
                                <li><a class="scene-selector-option" data-region="head" data-structure="organ">Viscera</a></li>
                            </ul>
                        </div>

                        <div class="btn-group scene-selector scene-selector__neck dropup">
                            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Neck <span class="caret"></span>
                            </button>
                            <ul id="scene-selector-body" class="dropdown-menu">
                                <li><a class="scene-selector-option" data-region="neck" data-structure="all">All</a></li>
                                <li><a class="scene-selector-option" data-region="neck" data-structure="bone">Bones</a></li>
                                <li><a class="scene-selector-option" data-region="neck" data-structure="muscle">Muscles</a></li>
                                <li><a class="scene-selector-option" data-region="neck" data-structure="nerve">Nerves</a></li>
                                <li><a class="scene-selector-option" data-region="neck" data-structure="artery">Arteries</a></li>
                                <li><a class="scene-selector-option" data-region="neck" data-structure="vein">Veins</a></li>
                                <li><a class="scene-selector-option" data-region="neck" data-structure="vessel">All vessels</a></li>
                                <li><a class="scene-selector-option" data-region="neck" data-structure="lymph">Lymphatics</a></li>
                                <li><a class="scene-selector-option" data-region="neck" data-structure="organ">Viscera</a></li>
                            </ul>
                        </div>

                        <div class="btn-group scene-selector scene-selector__thorax dropup">
                            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Thorax <span class="caret"></span>
                            </button>
                            <ul id="scene-selector-body" class="dropdown-menu">
                                <li><a class="scene-selector-option" data-region="thorax" data-structure="all">All</a></li>
                                <li><a class="scene-selector-option" data-region="thorax" data-structure="bone">Bones</a></li>
                                <li><a class="scene-selector-option" data-region="thorax" data-structure="muscle">Muscles</a></li>
                                <li><a class="scene-selector-option" data-region="thorax" data-structure="nerve">Nerves</a></li>
                                <li><a class="scene-selector-option" data-region="thorax" data-structure="artery">Arteries</a></li>
                                <li><a class="scene-selector-option" data-region="thorax" data-structure="vein">Veins</a></li>
                                <li><a class="scene-selector-option" data-region="thorax" data-structure="vessel">All vessels</a></li>
                                <li><a class="scene-selector-option" data-region="thorax" data-structure="lymph">Lymphatics</a></li>
                                <li><a class="scene-selector-option" data-region="thorax" data-structure="organ">Viscera</a></li>
                            </ul>
                        </div>

                        <div class="btn-group scene-selector scene-selector__back dropup">
                            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Back <span class="caret"></span>
                            </button>
                            <ul id="scene-selector-body" class="dropdown-menu">
                                <li><a class="scene-selector-option" data-region="back" data-structure="all">All</a></li>
                                <li><a class="scene-selector-option" data-region="back" data-structure="bone">Bones</a></li>
                                <li><a class="scene-selector-option" data-region="back" data-structure="muscle">Muscles</a></li>
                                <li><a class="scene-selector-option" data-region="back" data-structure="nerve">Nerves</a></li>
                                <li><a class="scene-selector-option" data-region="back" data-structure="artery">Arteries</a></li>
                                <li><a class="scene-selector-option" data-region="back" data-structure="vein">Veins</a></li>
                                <li><a class="scene-selector-option" data-region="back" data-structure="vessel">All vessels</a></li>
                                <li><a class="scene-selector-option" data-region="back" data-structure="lymph">Lymphatics</a></li>
                                <li><a class="scene-selector-option" data-region="back" data-structure="organ">Viscera</a></li>
                            </ul>
                        </div>

                        <div class="btn-group scene-selector scene-selector__abdomen dropup">
                            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Abdomen <span class="caret"></span>
                            </button>
                            <ul id="scene-selector-body" class="dropdown-menu">
                                <li><a class="scene-selector-option" data-region="abdomen" data-structure="all">All</a></li>
                                <li><a class="scene-selector-option" data-region="abdomen" data-structure="bone">Bones</a></li>
                                <li><a class="scene-selector-option" data-region="abdomen" data-structure="muscle">Muscles</a></li>
                                <li><a class="scene-selector-option" data-region="abdomen" data-structure="nerve">Nerves</a></li>
                                <li><a class="scene-selector-option" data-region="abdomen" data-structure="artery">Arteries</a></li>
                                <li><a class="scene-selector-option" data-region="abdomen" data-structure="vein">Veins</a></li>
                                <li><a class="scene-selector-option" data-region="abdomen" data-structure="vessel">All vessels</a></li>
                                <li><a class="scene-selector-option" data-region="abdomen" data-structure="lymph">Lymphatics</a></li>
                                <li><a class="scene-selector-option" data-region="abdomen" data-structure="organ">Viscera</a></li>
                            </ul>
                        </div>

                        <div class="btn-group scene-selector scene-selector__pelvis dropup">
                            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Pelvis <span class="caret"></span>
                            </button>
                            <ul id="scene-selector-body" class="dropdown-menu">
                                <li><a class="scene-selector-option" data-region="pelvis" data-structure="all">All</a></li>
                                <li><a class="scene-selector-option" data-region="pelvis" data-structure="bone">Bones</a></li>
                                <li><a class="scene-selector-option" data-region="pelvis" data-structure="muscle">Muscles</a></li>
                                <li><a class="scene-selector-option" data-region="pelvis" data-structure="nerve">Nerves</a></li>
                                <li><a class="scene-selector-option" data-region="pelvis" data-structure="artery">Arteries</a></li>
                                <li><a class="scene-selector-option" data-region="pelvis" data-structure="vein">Veins</a></li>
                                <li><a class="scene-selector-option" data-region="pelvis" data-structure="vessel">All vessels</a></li>
                                <li><a class="scene-selector-option" data-region="pelvis" data-structure="lymph">Lymphatics</a></li>
                                <li><a class="scene-selector-option" data-region="pelvis" data-structure="organ">Viscera</a></li>
                            </ul>
                        </div>

                        <div class="btn-group scene-selector scene-selector__upper-limb dropup">
                            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Upper Limb <span class="caret"></span>
                            </button>
                            <ul id="scene-selector-body" class="dropdown-menu">
                                <li><a class="scene-selector-option" data-region="upperLimb" data-structure="all">All</a></li>
                                <li><a class="scene-selector-option" data-region="upperLimb" data-structure="bone">Bones</a></li>
                                <li><a class="scene-selector-option" data-region="upperLimb" data-structure="muscle">Muscles</a></li>
                                <li><a class="scene-selector-option" data-region="upperLimb" data-structure="nerve">Nerves</a></li>
                                <li><a class="scene-selector-option" data-region="upperLimb" data-structure="artery">Arteries</a></li>
                                <li><a class="scene-selector-option" data-region="upperLimb" data-structure="vein">Veins</a></li>
                                <li><a class="scene-selector-option" data-region="upperLimb" data-structure="vessel">All vessels</a></li>
                                <li><a class="scene-selector-option" data-region="upperLimb" data-structure="lymph">Lymphatics</a></li>
                                <li><a class="scene-selector-option" data-region="upperLimb" data-structure="organ">Viscera</a></li>
                            </ul>
                        </div>

                        <div class="btn-group scene-selector scene-selector__lower-limb dropup">
                            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Lower Limb <span class="caret"></span>
                            </button>
                            <ul id="scene-selector-body" class="dropdown-menu">
                                <li><a class="scene-selector-option" data-region="lowerLimb" data-structure="all">All</a></li>
                                <li><a class="scene-selector-option" data-region="lowerLimb" data-structure="bone">Bones</a></li>
                                <li><a class="scene-selector-option" data-region="lowerLimb" data-structure="muscle">Muscles</a></li>
                                <li><a class="scene-selector-option" data-region="lowerLimb" data-structure="nerve">Nerves</a></li>
                                <li><a class="scene-selector-option" data-region="lowerLimb" data-structure="artery">Arteries</a></li>
                                <li><a class="scene-selector-option" data-region="lowerLimb" data-structure="vein">Veins</a></li>
                                <li><a class="scene-selector-option" data-region="lowerLimb" data-structure="vessel">All vessels</a></li>
                                <li><a class="scene-selector-option" data-region="lowerLimb" data-structure="lymph">Lymphatics</a></li>
                                <li><a class="scene-selector-option" data-region="lowerLimb" data-structure="organ">Viscera</a></li>
                            </ul>
                        </div>
                    </div>

	            <?php endif ?>

            </div>

            <?php if ($post->ID != WP_AZ_TOOL_3D_BODY_POST_ID) : ?>

            <div id="wpaz-notes" class="col-md-4">

                <div id="wpaz-notes-container">

                    <div class="note-header">

                        <h2 class="post-title text-center">
                            <span id="note-nav-left" class="glyphicon glyphicon-chevron-left pull-left chapter-nav" aria-hidden="true"></span>
		                    <?php echo $post->post_title ?>
                            <span id="note-nav-right" class="glyphicon glyphicon-chevron-right pull-right chapter-nav" aria-hidden="true"></span>
                        </h2>
                        <div id="note-properties">
                            <span id="current-note-label" class="label label-primary">Note 1</span>
                            <span id="total-notes-label" class="label label-success"><?php echo count($notes) . ' notes' ?></span>
                        </div>

                    </div>

	                <?php if (current_user_can('administrator')): ?>

                    <div class="active-note-container-admin">

                        <div class="edit-note-container">
                            <form>
                                <div class="form-group">
                                    <input type="notes-title" class="form-control notes-title" placeholder="Enter title" value="<?php echo $notes[0]->title ?>">
                                </div>
                                <textarea class="notes-text form-control" rows="10" placeholder="Enter notes">
                                    <?php echo $notes[0]->note_content ?>
                                </textarea>
                            </form>
                        </div>

                        <div id="toolbar-buttons" class="container">

                            <div class="row toolbar-row">
                                <div class="col-md-6 actions-buttons">
                                    <div class="btn-group" role="group" aria-label="...">
                                        <button id="action-add" type="button" class="btn btn-default"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button>
                                        <button id="action-previous" type="button" class="btn btn-default"><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span></button>
                                        <button id="action-next" type="button" class="btn btn-default"><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></button>
                                        <button class="btn btn-default dropdown-toggle" type="button" id="actions-dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                            Actions
                                            <span class="caret"></span>
                                        </button>
                                        <ul id="actions-dropdown-container" class="dropdown-menu" aria-labelledby="actions-dropdown">
                                        </ul>
                                        <button id="action-snapshot" type="button" class="btn btn-default"><span class="glyphicon glyphicon-camera"></span></button>
                                    </div>
                                    <div class="action-properties">
                                        <span id="current-action" class="label label-info">Action 1</span>
                                        <span id="num-actions" class="label label-info">0 actions</span>
                                    </div>
                                </div>
                                <div class="col-md-6 actions-buttons">
                                    <div class="btn-group pull-right" role="group" aria-label="...">
                                        <button id="toolbar-reset" type="button" class="btn btn-default">Reset</button>
                                        <button id="toolbar-clear-actions" type="button" class="btn btn-default">Clear Actions</button>
                                    </div>
                                </div>

                            </div>

                            <div class="row">
                                <div class="col-md-12 note-scenes">

                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-12 save-actions">
                                    <div id="buttons-container">
                                        <button id="notes-save-btn" type="button" class="btn btn-primary notes-button pull-right">Save</button>
                                        <button id="notes-add-new-btn" type="button" class="btn btn-success notes-button pull-right">Add new</button>
                                        <button id="notes-delete-btn" type="button" class="btn btn-danger notes-button pull-right">Delete</button>
                                    </div>

                                </div>
                            </div>

                            <div id="action-status-box" class="alert alert-info hidden" role="alert"></div>
                            <div class="update-status hidden"></div>

                        </div>

                    </div>

                    <?php else: ?>

                <!--USERS LAYOUT-->

                    <div class="active-note-container-user">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <h2 class="notes-title text-center">
				                    <?php echo $notes[0]->title ?>
                                </h2>
                            </div>
                            <div class="panel-body notes-text" data-scantext data-target="embedded-human">
			                    <?php echo $notes[0]->note_content ?>
                            </div>
                        </div>
                        <div>
                            <div class="btn-group" role="group" aria-label="...">
                                <button id="action-previous" type="button" class="btn btn-default"><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span></button>
                                <button id="action-next" type="button" class="btn btn-default"><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></button>
                            </div>
                            <div class="action-properties">
                                <span id="current-action" class="label label-info">Action 1</span>
                                <span id="num-actions" class="label label-info">0 actions</span>
                            </div>
                        </div>
                    </div>

                <?php endif ?>

            </div>
        </div>

            <?php endif ?>

        </div>

        <?php if ($post->ID != WP_AZ_TOOL_3D_BODY_POST_ID) : ?>
        <div class="row">

            <div id="notes-timeline" class="row">
		    <?php
                if ($notes != null):
                    foreach($notes as $note){
                        include TMPL_URL_ITEM_NOTE_SECTION;
                    }
                endif
            ?>
        </div>

        </div>
        <?php endif ?>
    </div>
</div>

<div class="modal fade" id="wpaz-modal-alert" tabindex="-1" role="dialog" aria-labelledby="wpaz-alert-label">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="wpaz-alert-label"></h4>
            </div>
            <div class="modal-body">
            </div>
            <div class="modal-footer">
                <button id="modal-btn-1" type="button" class="btn btn-default"></button>
                <button id="modal-btn-2" type="button" class="btn btn-default"></button>
            </div>
        </div>
    </div>
</div>
