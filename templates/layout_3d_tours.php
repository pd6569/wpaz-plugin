<?php

    global $wpdb;
    global $post;
    global $item_template_names;

    $table_name = $wpdb->prefix . 'anatomy_tours_notes';

    $notes = $wpdb->get_results(
            "SELECT title, uid, note_content, sequence, scene_state
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
                        src="https://human.biodigital.com/widget?be=1l2x&background=255,255,255,51,64,77&ui-all=true&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7">
                </iframe>
                <a href="https://www.biodigital.com"></a>
                </iframe>
            </div>
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
                                <div class="col-md-12 actions-buttons">
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
                                    </div>

                                    <span id="num-actions" class="label label-info">0 actions</span>
                                    <div class="btn-group pull-right" role="group" aria-label="...">
                                        <button id="toolbar-reset" type="button" class="btn btn-default">Reset</button>
                                        <button id="toolbar-clear-actions" type="button" class="btn btn-default">Clear Actions</button>
                                    </div>
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
                    </div>

                <?php endif ?>

            </div>
        </div>

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
</div>