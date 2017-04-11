<div class="col-md-12">

	<div id="<?php echo $note->uid ?>" class="panel panel-primary note-item" sequence="<?php echo $note->sequence?>">
		<div class="panel-heading">
			<h3 class="panel-title">
                <a><span class="note-title"><?php if(empty($note->title)): echo "No title"; else: echo $note->title; endif; ?></span></a>

                <?php if ($user_is_editor) : ?>
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
                    <div class="note-image">
                        <?php
                            foreach($attached_images as $image) {
                                if ($note->uid == get_post_meta($image->ID, "_az_note_id", true)): ?>
                                    <img src="<?php echo wp_get_attachment_image_src($image->ID,'medium')[0]; ?>" />
                        <?php
                                endif;
                            } ?>
                    </div>
				</div>
			</div>

		</div>
	</div>

</div>