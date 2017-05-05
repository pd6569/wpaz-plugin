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
        });

        // Set canvas defaults
        this.setCanvasDefaults();

        // Set Image
        let imgElement = new Image;
        imgElement.src = this.imgSrc;

        // Calculate ratio if image to viewport and set canvas zoom accordingly
        let imgHeight = imgElement.height;
        let imgWidth = imgElement.width;
        let viewportImgRatio = this.fabricCanvas.getHeight() / imgHeight;
        this.fabricCanvas.setZoom(viewportImgRatio);

        // Add image to canvas
        let imgInstance = new fabric.Image(imgElement, {});
        imgInstance.selectable = false;
        this.fabricCanvas.add(imgInstance);
        this.fabricCanvas.viewportCenterObject(imgInstance);
        imgInstance.setCoords();

        this.fabricCanvas.on('object:added', (event) => {
            let object = event.target;
            object.selectable = false;
        });

        // Add listeners
        this.setListeners();

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

        // Remove listeners
        this.removeListeners();

    }

    setUi(enable){

        if (enable) {
            this.app.$sceneSelectImageBtn.css("background-color", appGlobals.ui.btnSelected);
            this.$toolbar.removeClass('hidden').show();
        } else {
            this.app.$sceneSelectImageBtn.css("background-color", "");

            // hide toolbar
            this.$toolbar.hide();

            // Hide property boxes
            this.$drawingOptions.hide();
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

    removeListeners(){
        jQuery(window).off();
        this.$toolbarButtons.off();
    }

    setWindowListeners(){
        let app = this.app;
        let self = this;
        let fabricCanvas = this.fabricCanvas;

        function resizeCanvas(){
            if (appGlobals.mode.EDIT_IMAGE){
                console.log("resize fabric canvas");
                fabricCanvas.setWidth(app.$humanWidget.width());
                self.doToolbarAction('center-image');
            }
        }

        jQuery(window).on('resize', resizeCanvas);

    }

    setToolbarListeners(){

        this.$toolbarButtons.on('click', (event) => {
            let toolbarAction = jQuery(event.currentTarget).attr('data-toolbar-action');
            this.doToolbarAction(toolbarAction);
        })
    }

    setCanvasDefaults() {

        // Set canvas properties
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
     *                       options: add-image, center-image, zoom-in, zoom-out, draw, add-text, text-size, text-colour, save, exit
     *
     */
    doToolbarAction(toolbarAction){

        let self = this;

        switch (toolbarAction) {

            case 'add-image':
                console.log("do action: " + toolbarAction);
                break;

            case 'center-image':
                centerImage();
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
                saveImage();
                break;

            case 'exit':
                console.log("do action: " + toolbarAction);
                break;

            default:
                console.log("Could not find action: " + toolbarAction);
                break;
        }

        function saveImage(){
            console.log("saveImage");
            let imgSrc = self.fabricCanvas.toDataURL({
                format: "jpeg",
            });
            self.app.showModal("image", {
                type: "snapshot",
                imgSrc: imgSrc
            })
        }

        function centerImage(){
            console.log("centerImage");
            let img = self.fabricCanvas.getActiveObject();
            if (img) {
                self.fabricCanvas.viewportCenterObject(img);
                img.setCoords();
            }
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
                });
                
                // Line colour
                $drawingColour.on('change', (event) => {
                    console.log("colour change:", event);
                    let colour = event.target.value;
                    self.fabricCanvas.freeDrawingBrush.color = colour;
                })
            } else {
                self.$drawingOptions.hide();
            }

        }
    }
}