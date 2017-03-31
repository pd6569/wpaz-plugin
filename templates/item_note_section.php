<div class="col-md-8">

	<div id="<?php echo $note->uid ?>" class="panel panel-primary note-item" sequence="<?php echo $note->sequence?>">
		<div class="panel-heading">
			<h3 class="panel-title">
                <a><span class="note-title"><?php if(empty($note->title)): echo "No title"; else: echo $note->title; endif; ?></span></a>
                <span class="glyphicon glyphicon-trash pull-right delete-note note-actions hvr-grow hidden" aria-hidden="true"></span>
                <span class="glyphicon glyphicon-pencil pull-right edit-note note-actions hvr-grow hidden" aria-hidden="true"></span>

            </h3>

		</div>
		<div class="panel-body">

			<div class="row">
				<div class="col-md-6 note-content">
					<?php echo $note->note_content ?>
				</div>

				<div class="col-md-6">
                    <div class="note-image">

                    </div>
				</div>
			</div>

		</div>
	</div>

</div>