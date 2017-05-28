<?php
    global $note;
    global $user_is_editor;

?>
<div class="col-md-12">

	<div id="<?php if (gettype($note) == 'object') { echo $note->uid; } ?>" class="panel panel-primary note-item" sequence="<?php if (gettype($note) == 'object') { echo $note->sequence; } ?>">
		<div class="panel-heading">
			<h3 class="panel-title">
                <a><span class="note-title"><?php if(empty($note->title)): echo "No title"; else: echo $note->title; endif; ?></span></a>

                <?php

                global $ajax_call;

                if ($user_is_editor || $ajax_call) : ?>
                <span class="glyphicon glyphicon-trash pull-right delete-note note-actions hvr-grow" aria-hidden="true"></span>
                <span class="glyphicon glyphicon-pencil pull-right edit-note note-actions hvr-grow" aria-hidden="true"></span>
                <?php endif ?>

            </h3>

		</div>
		<div class="panel-body">

			<div class="row">
				<div class="col-md-6 note-content">
					<?php echo $note->note_content ?>
				</div>

				<div class="col-md-6">
                    <div class="note-image-container">
                        <div class="row">
                        <?php

                            if (is_array($attached_images)):
                                foreach($attached_images as $image) {
                                    if ($note->uid == get_post_meta($image->ID, "_az_note_id", true)): ?>
                                        <div class="col-md-4 col-sm-4 col-xs-6">
                                            <div id="<?php echo $image->ID ?>">
                                                <a rel="<?php echo $note->uid ?>" href="<?php echo wp_get_attachment_image_src($image->ID,'full')[0]; ?>" class="swipebox note-images" title="<?php echo $image->post_excerpt ?>">
                                                    <img src="<?php echo wp_get_attachment_image_src($image->ID,'medium')[0]; ?>" alt="image" width="100%" height="100%">
                                                </a>
                                            </div>
                                        </div>
                        <?php
                                    endif;
                                }
                            endif; ?>
                        </div>
                    </div>
				</div>
			</div>

		</div>
	</div>

</div>