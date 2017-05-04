/**
 * Created by peter on 03/05/2017.
 */

class ModuleImage extends BaseModule {

    init() {
        console.log("init: " + this.moduleName);

        // Get module data
        this.imgSrc = this.moduleData.imgSrc;

        /*** DOM references ***/

        // Canvas
        this.$imageCanvas = this.app.$imageCanvas;

        // Toolbar
        this.$toolbar = jQuery('#wpaz-image-editor-toolbar');
        this.$toolbarButtons = jQuery('.image-editor-toolbar');

        // Options boxes
        this.$drawingOptions = jQuery('#drawing-mode-options');

        // Track listeners
        this.listenersSet = false;

        this.toggleModule();
    }

    enableModule(){
        console.log("enableModule: " + this.moduleName);

        appGlobals.mode.EDIT_IMAGE = true;

        // Disable conflicting modes/modules
        if (appGlobals.modulesLoaded[appGlobals.modules.ANNOTATE_MODULE]){
            appGlobals.modulesLoaded[appGlobals.modules.ANNOTATE_MODULE].disableModule();
            appGlobals.mode.ANNOTATE = false;
        }

        // Set UI
        this.setUi(true);

        // Show canvas
        this.$imageCanvas.show();

        // If canvas already exists, destroy and create new
        if (this.fabricCanvas) {
            this.fabricCanvas.dispose();
            this.fabricCanvas = null;
        }

        // Create canvas
        this.fabricCanvas = new fabric.Canvas('imageCanvas', {
            backgroundColor: 'rgb(255,255, 255)',
            selectionColor: 'blue',
            selectionLineWidth: 2,
        });

        // Set canvas defaults
        this.setCanvasDefaults();


        // Set Image
        let imgElement = new Image;
        imgElement.src = this.imgSrc;
        console.log("imgElement", imgElement);
        let imgInstance = new fabric.Image(imgElement, {
            left: 0,
            top: 0,
        });
        this.fabricCanvas.add(imgInstance);

        // Add listeners
        if (!this.listenersSet) this.setListeners();

    }

    disableModule() {

        console.log("disableModule: " + this.moduleName);

        appGlobals.mode.EDIT_IMAGE = false;

        // Disable canvas
        this.$imageCanvas.hide();

        // Set UI
        this.setUi(false);

        // Deactivate fabric canvas
        if (this.fabricCanvas) {
            this.fabricCanvas.dispose();
            this.fabricCanvas = null;
        }

    }

    setUi(enable){

        if (enable) {
            this.app.$sceneSelectImageBtn.css("background-color", appGlobals.ui.btnSelected);
            this.$toolbar.removeClass('hidden').show();
        } else {
            this.app.$sceneSelectImageBtn.css("background-color", "");
            this.$toolbar.hide();
        }
    }

    toggleModule() {
        let modeState = !appGlobals.mode.EDIT_IMAGE;

        appGlobals.mode.EDIT_IMAGE = modeState;

        if (modeState) {
            this.enableModule();
        } else {
            this.disableModule();
        }
    }
    
    setListeners(){

        this.setWindowListeners();
        this.setToolbarListeners();

        this.listenersSet = true;
    }

    setWindowListeners(){
        let app = this.app;
        let fabricCanvas = this.fabricCanvas;

        function resizeCanvas(){
            if (appGlobals.mode.EDIT_IMAGE){
                console.log("resize fabric canvas");
                fabricCanvas.setWidth(app.$humanWidget.width());
            }
        }

        window.addEventListener('resize', resizeCanvas);
    }

    setToolbarListeners(){

        this.$toolbarButtons.on('click', (event) => {
            let toolbarAction = jQuery(event.currentTarget).attr('data-toolbar-action');
            this.doToolbarAction(toolbarAction);
        })
    }

    setCanvasDefaults() {

        // Set canvas properties
        this.fabricCanvas.setZoom(0.5);
        this.fabricCanvas.setWidth(this.app.$humanWidget.width());
        this.fabricCanvas.setHeight(this.app.$humanWidget.height());

        // Set tool defaults
        this.fabricCanvas.freeDrawingBrush.width = 6;
    }

    /****
     *
     * Perform toolbar action
     *
     * @param toolbarAction: action specified by data-toolbar-action attribute on toolbar button
     *                       options: add-image, zoom-in, zoom-out, draw, add-text, text-size, text-colour, save, exit
     *
     */
    doToolbarAction(toolbarAction){

        let self = this;

        switch (toolbarAction) {

            case 'add-image':
                console.log("do action: " + toolbarAction);
                break;

            case 'zoom-in':
                zoomCanvas(true);
                break;

            case 'zoom-out':
                zoomCanvas(false);
                break;

            case 'draw':
                console.log("do action: " + toolbarAction);
                drawMode();
                break;

            case 'add-text':
                console.log("do action: " + toolbarAction);
                break;

            case 'text-size':
                console.log("do action: " + toolbarAction);
                break;

            case 'text-colour':
                console.log("do action: " + toolbarAction);
                break;

            case 'save':
                console.log("do action: " + toolbarAction);
                break;

            case 'exit':
                console.log("do action: " + toolbarAction);
                break;

            default:
                console.log("Could not find action: " + toolbarAction);
                break;
        }


        function zoomCanvas(zoomIn){
            let currentZoom =  self.fabricCanvas.getZoom();
            zoomIn ? self.fabricCanvas.setZoom(currentZoom + 0.05) : self.fabricCanvas.setZoom(currentZoom - 0.05);
        }

        function drawMode() {
            self.fabricCanvas.isDrawingMode = !self.fabricCanvas.isDrawingMode;
            if (self.fabricCanvas.isDrawingMode) {
                console.log("show draw options", self.$drawingOptions);
                self.$drawingOptions.removeClass('hidden').show();

                // Get elements
                let $drawingModeSelector = jQuery('#drawing-mode-selector');
                let $drawingLineWidth = jQuery('#drawing-line-width');
                let $changeLineWidth = jQuery('.change-line-width');
                let $drawingColour = jQuery('#drawing-color');

                // Set values
                $drawingLineWidth.text(self.fabricCanvas.freeDrawingBrush.width);

                // Change line width
                $changeLineWidth.on('click', (event) => {
                    let action = jQuery(event.target).attr('data-action');
                    let width = parseInt($drawingLineWidth.text());
                    if (action === 'increase-width') {
                        width++;
                        console.log("width: " + width);
                    } else {
                        if (width > 1) width--;
                        console.log("width: " + width);
                    }
                    $drawingLineWidth.text(width);
                    self.fabricCanvas.freeDrawingBrush.width = width;
                })
            } else {
                self.$drawingOptions.hide();
            }

        }
    }
}