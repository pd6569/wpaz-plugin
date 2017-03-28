<div class="col-md-8">

	<div id="note-<?php echo $note->sequence ?>" class="panel panel-primary note-item" sequence="<?php echo $note->sequence?>">
		<div class="panel-heading">
			<h3 class="panel-title">
                <span class="note-title"><?php echo $note->title ?></span>
				<span class="glyphicon glyphicon-trash pull-right delete-note note-actions hvr-grow" aria-hidden="true"></span>
                <span class="glyphicon glyphicon-pencil pull-right edit-note note-actions hvr-grow" aria-hidden="true"></span>
            </h3>

		</div>
		<div class="panel-body">

			<div class="row">
				<div class="col-md-6 note-content">
					<?php echo $note->note_content ?>
				</div>

				<div class="col-md-6">
					<ul class="list-group">
						<li class="list-group-item">Action 1</li>
						<li class="list-group-item">Action 2</li>
						<li class="list-group-item">Action 3</li>
						<li class="list-group-item">Action 4</li>
						<li class="list-group-item">Action 5</li>
					</ul>
				</div>
			</div>

		</div>
	</div>

</div>