<div class="col-md-8">

	<div id="az-note-<?php echo $notes->sequence ?>" class="panel panel-primary">
		<div class="panel-heading">
			<h3 class="panel-title">
				<?php echo $notes->title ?>
				<span class="glyphicon glyphicon-trash pull-right delete-note" aria-hidden="true"></span></h3>

		</div>
		<div class="panel-body">

			<div class="row">
				<div class="col-md-6">
					<?php echo $notes->note_content ?>
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