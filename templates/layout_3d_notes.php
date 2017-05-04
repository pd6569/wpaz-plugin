<?php

//TODO: ONLY ALLOW USER WHO CREATED NOTE TO EDIT IT!

    global $wpdb;
    global $post;
    global $wp_az_3d_body_id;
    global $wp_az_notes_dashboard_id;
    global $item_template_names;

    $table_name = $wpdb->prefix . 'az_notes';

    $notes = $wpdb->get_results(
            "SELECT title, uid, note_content, sequence, scene_state, url
                  FROM $table_name 
                  WHERE post_id = $post->ID
                  ORDER BY sequence ASC" );

    $attached_images = get_attached_media('image/jpeg', $post->ID);

    $user_is_editor = wp_az_user_can_edit_notes();

    ?>


<div id="wpaz-3d-notes-layout">

    <div class="container">

        <?php if ( $user_is_editor && !is_page($wp_az_3d_body_id)) : ?>
            <div class="row">
                <div id="wpaz-main-toolbar" class="col-md-12">
                    <ul class="nav nav-tabs">
                        <li id="toolbar-active-note" role="presentation" class="toolbar-tab active">
                            <a href="#">
                                <?php if (!is_page($wp_az_notes_dashboard_id)) {
                                    echo $post->post_title;
                                } else {
                                    echo "No title";
                                }
                                ?>
                            </a></li>
                        <li id="toolbar-my-notes" role="presentation" class="toolbar-tab"><a href="#">My Notes</a></li>
                        <li id="toolbar-create-new" role="presentation" class="toolbar-tab"><a href="#">Create new</a></li>
                    </ul>
                </div>
            </div>

        <!-------- MY-NOTES MODULE ----------->
        <div id="wpaz-my-notes" class="row hidden">

            <div class="row">

                <div class="col-md-4 col-md-offset-4 text-center">

                    <div class="my-notes-filters">

                        <div class="btn-group">
                            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Region <span class="caret"></span>
                            </button>
                            <ul class="dropdown-menu">
                                <li><a href="#">Head</a></li>
                                <li><a href="#">Neck</a></li>
                                <li><a href="#">Thorax</a></li>
                                <li><a href="#">Abdomen</a></li>
                                <li><a href="#">Back</a></li>
                                <li><a href="#">Pelvis</a></li>
                                <li><a href="#">Upper Limb</a></li>
                                <li><a href="#">Lower Limb</a></li>
                            </ul>
                        </div>

                        <div class="btn-group">
                            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Structure <span class="caret"></span>
                            </button>
                            <ul class="dropdown-menu">
                                <li><a href="#">Bone</a></li>
                                <li><a href="#">Muscle</a></li>
                                <li><a href="#">Joint</a></li>
                                <li><a href="#">Nerve</a></li>
                                <li><a href="#">Organ</a></li>
                                <li><a href="#">Lymphatics</a></li>
                                <li><a href="#">Artery</a></li>
                                <li><a href="#">Vein</a></li>
                                <li><a href="#">Blood Vessel</a></li>
                            </ul>
                        </div>

                        <div class="btn-group">
                            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                System <span class="caret"></span>
                            </button>
                            <ul class="dropdown-menu">
                                <li><a href="#">Muscular</a></li>
                                <li><a href="#">Skeletal</a></li>
                                <li><a href="#">Nervous</a></li>
                                <li><a href="#">Respiratory</a></li>
                                <li><a href="#">Cardiovascular</a></li>
                                <li><a href="#">Gastrointestinal</a></li>
                                <li><a href="#">Urinary</a></li>
                                <li><a href="#">Reproductive</a></li>
                            </ul>
                        </div>

                    </div>


                </div>
            </div>

            <div class="row">

                <div class="col-md-12">

                    <div class="my-notes-item">

                        <div class="table-responsive">

                            <table id="my-notes-table" class="table table-striped table-bordered">
                                <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Created</th>
                                </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>

                        </div>

                    </div>
                </div>

            </div>
        </div>

        <?php endif ?>

        <div id="wpaz-main-layout">
            <div class="row">

                <div id="wpaz-model-container" class="col-md-8">

                    <div id="iframe-container">
                        <iframe
                                id="embedded-human"
                                frameBorder="0"
                                width="100%"
                                height="600"
                                allowFullScreen="true"
                                src="<?php if (!empty($notes[0]->url)): echo $notes[0]->url; else: echo "https://human.biodigital.com/widget?be=1mHv&background=255,255,255,51,64,77&ui-nav=false&ui-fullscreen=false&ui-share=false&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7"; endif; ?>">
                        </iframe>

                        <div id="wpaz-mode-info" class="hidden"></div>

                        <div id="drawing-mode-options" class="hidden">
                            <div id="drawing-options-top-panel">
                                <span class="drawing-options-title text-center">
                                    Drawing Options
                                </span>
                                <span class="glyphicon glyphicon-chevron-up pull-right"></span>
                            </div>
                            <label for="drawing-mode-selector">Mode:</label>
                            <select id="drawing-mode-selector">
                                <option>Pencil</option>
                                <option>Circle</option>
                                <option>Spray</option>
                                <option>Pattern</option>

                                <option>hline</option>
                                <option>vline</option>
                                <option>square</option>
                                <option>diamond</option>
                                <option>texture</option>
                            </select><br>

                            <label for="drawing-line-width">Line width:</label>
                            <span class="change-line-width glyphicon glyphicon-plus" data-action="increase-width"></span>
                            <span id="drawing-line-width">5</span>
                            <span class="change-line-width glyphicon glyphicon-minus" data-action="decrease-width"></span><br>

                            <label for="drawing-color">Line color:</label>
                            <input type="color" value="#005E7A" id="drawing-color"><br>

                        </div>

                        <div id="wpaz-image-editor-toolbar" class="hidden">

                            <div class="btn-group" role="group" aria-label="...">
                                <button type="button" class="btn btn-default image-editor-toolbar" data-toolbar-action="add-image">
                                    <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
                                </button>
                                <button type="button" class="btn btn-default image-editor-toolbar" data-toolbar-action="zoom-in">
                                    <span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span>
                                </button>
                                <button type="button" class="btn btn-default image-editor-toolbar" data-toolbar-action="zoom-out">
                                    <span class="glyphicon glyphicon-zoom-out" aria-hidden="true"></span>
                                </button>
                                <button type="button" class="btn btn-default image-editor-toolbar" data-toolbar-action="draw">
                                    <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                                </button>
                                <button type="button" class="btn btn-default image-editor-toolbar" data-toolbar-action="add-text">
                                    <span class="glyphicon glyphicon-font" aria-hidden="true"></span>
                                </button>
                                <button type="button" class="btn btn-default image-editor-toolbar" data-toolbar-action="text-size">
                                    <span class="glyphicon glyphicon-text-size" aria-hidden="true"></span>
                                </button>
                                <button type="button" class="btn btn-default image-editor-toolbar" data-toolbar-action="text-colour">
                                    <span class="glyphicon glyphicon-text-color" aria-hidden="true"></span>
                                </button>
                                <button type="button" class="btn btn-default image-editor-toolbar" data-toolbar-action="save">
                                    <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
                                </button>
                                <button type="button" class="btn btn-default image-editor-toolbar" data-toolbar-action="exit">
                                    <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                                </button>
                            </div>


                        </div>


                    </div>

			        <?php if ( $user_is_editor || is_page($wp_az_3d_body_id)): ?>

                        <div id="wpaz-scene-selector" class="text-center">

					        <?php if (!is_page($wp_az_3d_body_id)) : ?>
                                <button id="scene-selector-image" type="button" class="btn btn-default pull-left"><span class="glyphicon glyphicon-picture" aria-hidden="true"></span></button>
                                <button id="scene-selector-annotate-model" type="button" class="btn btn-default pull-left"><span class="glyphicon glyphicon-pushpin" aria-hidden="true"></span></button>
					        <?php endif ?>

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


		        <?php if ($post->ID != $wp_az_3d_body_id) : ?>

                    <div id="wpaz-notes" class="col-md-4">

                        <div id="wpaz-notes-container">

                            <div class="note-header">

                                <h2 class="text-center">
                                    <span id="note-nav-left" class="glyphicon glyphicon-chevron-left pull-left chapter-nav" aria-hidden="true"></span>
                                    <span id="post-title">
                                <?php if (!is_page($wp_az_notes_dashboard_id)) {
	                                echo $post->post_title;
                                } else {
	                                echo "No title";
                                }
                                ?>
                            </span>
                                    <span id="note-nav-right" class="glyphicon glyphicon-chevron-right pull-right chapter-nav" aria-hidden="true"></span>
                                </h2>
                                <div id="note-properties">
                                    <span id="current-note-label" class="label label-primary">Note 1</span>
                                    <span id="total-notes-label" class="label label-success"><?php echo count($notes) . ' notes' ?></span>
                                </div>

                            </div>

					        <?php if ($user_is_editor) : ?>

                                <div class="active-note-container-admin">

                                    <div class="edit-note-container">
                                        <form>
                                            <div class="form-group">
                                                <input type="text" class="form-control notes-title" placeholder="Enter title" value="<?php echo $notes[0]->title ?>">
                                            </div>
                                        </form>

								        <?php wp_editor( $notes[0]->note_content, 'notetexteditor'); ?>

                                    </div>

                                    <div id="toolbar-buttons" class="container">

                                        <div class="row toolbar-row">
                                            <div class="col-md-6 actions-buttons">
                                                <div class="btn-group" role="group" aria-label="...">
                                                    <button id="action-add" type="button" class="btn btn-default"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button>
                                                    <button id="action-previous" type="button" class="btn btn-default"><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span></button>
                                                    <button id="action-next" type="button" class="btn btn-default"><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></button>

                                                    <div class="btn-group">
                                                        <button class="btn btn-default dropdown-toggle" type="button" id="actions-dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                            Actions
                                                            <span class="caret"></span>
                                                        </button>
                                                        <ul id="actions-dropdown-container" class="dropdown-menu" aria-labelledby="actions-dropdown">
                                                        </ul>
                                                    </div>

                                                    <div class="btn-group">
                                                        <button class="btn btn-default dropdown-toggle" type="button" id="snapshot-dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                            <span class="glyphicon glyphicon-camera"></span>
                                                            <span class="caret"></span>
                                                        </button>
                                                        <ul id="snapshot-dropdown" class="dropdown-menu" aria-labelledby="snapshot-dropdown">
                                                            <li class="take-snapshot" data-ratio="one-one"><a>1:1</a></li>
                                                            <li class="take-snapshot" data-ratio="four-three"><a>4:3</a></li>
                                                        </ul>
                                                    </div>

                                                </div>
                                                <div class="action-properties">
                                                    <span id="current-action" class="label label-info">Action 1</span>
                                                    <span id="num-actions" class="label label-info">0 actions</span>
                                                </div>
                                                <div class="toolbar-annotations">
                                                    <button class="btn btn-default dropdown-toggle" type="button" id="annotations-dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                        Annotations
                                                        <span class="caret"></span>
                                                    </button>
                                                    <ul id="annotations-dropdown-container" class="dropdown-menu" aria-labelledby="annotations-dropdown">
                                                    </ul>
                                                </div>
                                                <div class="annotation-properties">
                                                    <span id="num-annotations" class="label label-info">0 annotations</span>
                                                </div>
                                            </div>
                                            <div class="col-md-6 actions-buttons">
                                                <div class="btn-group pull-right" role="group" aria-label="...">
                                                    <button id="toolbar-reset" type="button" class="btn btn-default">Reset</button>
                                                    <button id="toolbar-clear-actions" type="button" class="btn btn-default">Clear Actions</button>
                                                    <button id="toolbar-clear-annotations" type="button" class="btn btn-default">Clear Annotations</button>
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

                                <!--USERS/NON-EDITOR LAYOUT-->

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


	        <?php if ($post->ID != $wp_az_3d_body_id) : ?>
                <div class="row">

                    <!--------------- NOTES TIMELINE ------------------>
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
</div>


<!---------- MODAL POPUP -------------->
<div class="modal fade" id="wpaz-modal-alert" tabindex="-1" role="dialog" aria-labelledby="wpaz-alert-label">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="wpaz-alert-label"></h4>
            </div>
            <div class="modal-body">
            </div>
            <div class="modal-image hidden">
                <div class="modal-image-upload hidden">
                    <input id="image-upload" type="file" />
                </div>
                <div class="modal-image-properties hidden">

                    <div class="form-group">
                        <form>
                            <input type="text" class="form-control image-title" placeholder="Title" value="">
                            <textarea class="form-control image-description" rows="5" placeholder="Description"></textarea>
                            <input type="text" class="form-control image-caption" placeholder="Caption" value="">
                            <input type="text" class="form-control image-alt" placeholder="Alt" value="">
                        </form>
                    </div>
                    <div class="image-thumbnail pull-right">
                        <img src="" width="100%" height="100%">
                    </div>
                </div>
            </div>

            <div class="modal-annotations hidden">
                <div class="form-group">
                    <form>
                        <input type="text" class="form-control annotation-title" placeholder="Title" value="">
                        <textarea class="form-control annotation-description" rows="5" placeholder="Description"></textarea>
                    </form>
                </div>
            </div>
            <div class="modal-actions hidden">
                <div class="form-group">
                    <div class="dropdown">
                        <button class="btn btn-default dropdown-toggle" type="button" id="modal-actions__dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                            Actions
                            <span class="caret"></span>
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="modal-actions__dropdown">

                            <!-- data-action-data-type MUST match format specified in appGlobals.actionDataTypes -->
                            <li><a href="#" class="modal-action-option" data-action-data-type="noAction">No action</a></li>
                            <li><a href="#" class="modal-action-option" data-action-data-type="rotateCamera">360 Camera Rotate</a></li>
                        </ul>
                        <span class="label-action-options">No action</span>
                    </div>

                    <div class="modal-actions__options">
                        <div class="modal-actions__camera-rotate modal-action-options-container hidden">
                            <h4>Camera Rotate Options</h4>
                            <div class="dropdown">
                                <button class="btn btn-default dropdown-toggle" type="button" id="camera-rotate-options__dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                    Rotation Speed
                                    <span class="caret"></span>
                                </button>
                                <ul class="dropdown-menu" aria-labelledby="camera-rotate-options__dropdown">
                                    <li><a href="#" class="camera-rotate-speed-option" data-camera-rotate="slow">Slow</a></li>
                                    <li><a href="#" class="camera-rotate-speed-option" data-camera-rotate="medium">Medium</a></li>
                                    <li><a href="#" class="camera-rotate-speed-option" data-camera-rotate="fast">Fast</a></li>
                                </ul>
                                <span class="label-camera-rotate">Medium</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-error text-center hidden"><p></p></div>
            <div class="modal-footer">
                <button id="modal-btn-delete" type="button" class="btn btn-danger pull-left hidden">Delete</button>
                <button id="modal-btn-1" type="button" class="btn btn-default"></button>
                <button id="modal-btn-2" type="button" class="btn btn-default"></button>
            </div>
        </div>
    </div>
</div>

<!-- toolbar for editing images -->
<?php if ( $user_is_editor ) : ?>
    <div id="toolbar-options" class="hidden">
        <a id="toolbar-edit-image" href="#"><i class="fa fa-pencil"></i></a>
        <a id="toolbar-delete-image" href="#"><i class="fa fa-trash"></i></a>
    </div>
<?php endif ?>

<div class='wpaz-loading-container hidden'>
    <div class='wpaz-spinner'>
        <div class='double-bounce1'></div>
        <div class='double-bounce2'></div>
    </div>;
</div>

