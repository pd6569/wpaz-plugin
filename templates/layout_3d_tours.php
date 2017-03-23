<div id="wpaz-3d-tours-layout">
    <div class="container">
        <div class="row">
            <div id="wpaz-toolbar" class="col-md-12">
                <div class="btn-group" role="group" aria-label="...">
                    <button id="toolbar-zoom-in" type="button" class="btn btn-default">Zoom In</button>
                    <button id="toolbar-zoom-out" type="button" class="btn btn-default">Zoom Out</button>
                </div>
            </div>
        </div>
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
            <div id="wpaz-notes-container" class="col-md-4">
                <h2 class="text-center">Notes</h2>
                <form>
                    <div class="form-group">
                        <input type="notes-title" class="form-control notes-title" placeholder="Title">
                    </div>
                    <textarea class="notes-textarea form-control" rows="10" placeholder="Enter notes"></textarea>
                </form>

                <button id="notes-save-btn" type="button" class="btn btn-primary notes-save-button pull-right">Save</button>
            </div>
        </div>
    </div>
</div>