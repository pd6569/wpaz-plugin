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
                        src="https://human.biodigital.com/widget?be=1l2x&background=255,255,255,51,64,77&ui-tools=true&dk=6f2c42f37ce7c183993a87afb2df8d136fecc7c7">
                </iframe>
                <a href="https://www.biodigital.com"></a>
                </iframe>
            </div>
            <div id="wpaz-notes" class="col-md-4">

                <div id="wpaz-notes-container" class="hidden">
                    <h2 class="post-title text-center">Notes</h2>
                    <form>
                        <div class="form-group">
                            <input type="notes-title" class="form-control notes-title" placeholder="Title">
                        </div>
                        <textarea class="notes-text form-control" rows="10" placeholder="Enter notes"></textarea>
                    </form>

                    <div class="dropdown">
                        <button class="btn btn-default dropdown-toggle" type="button" id="actions-dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                            Actions
                            <span class="caret"></span>
                        </button>
                        <ul id="actions-dropdown-container" class="dropdown-menu" aria-labelledby="actions-dropdown">
                        </ul>
                    </div>

                    <div class="actions-toolbar">
                        <div class="btn-group" role="group" aria-label="...">
                            <button id="action-add" type="button" class="btn btn-default"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button>
                        </div>
                    </div>

                    <div id="callback-alert-box" class="alert alert-info hidden" role="alert"></div>

                    <div id="buttons-container">
                        <button id="notes-save-btn" type="button" class="btn btn-primary notes-button pull-right">Save</button>
                        <button id="notes-add-new-btn" type="button" class="btn btn-success notes-button pull-right">Add new</button>
                    </div>

                    <div id="scene-actions">
                        <ul class="list-group">
                            <!--<li class="list-group-item">Action 1</li>
							<li class="list-group-item">Action 2</li>-->
                        </ul>
                    </div>

                </div>


            </div>
        </div>
        <div class="row">
            <div id="wpaz-toolbar" class="col-md-12">
                <div class="btn-group" role="group" aria-label="...">
                    <button id="toolbar-zoom-in" type="button" class="btn btn-default">Zoom In</button>
                    <button id="toolbar-zoom-out" type="button" class="btn btn-default">Zoom Out</button>
                    <button id="toolbar-reset" type="button" class="btn btn-default">Reset</button>
                </div>
            </div>
        </div>
    </div>
</div>