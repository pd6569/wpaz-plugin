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

        // Image data
        this.baseImage = {} // uploaded image as Fabric object
        this.imgDimensions = {};

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
        this.imgDimensions = {
            "width": imgWidth,
            "height": imgHeight,
        };
        this.zoomToFit(imgHeight);

        // Create group
        this.group = new fabric.Group();

        // Create fabric image
        let imgInstance = new fabric.Image(imgElement, {});
        /*imgInstance.selectable = false;*/

        // Add image to group
        this.group.addWithUpdate(imgInstance);

        // Add image to canvas
        this.fabricCanvas.add(this.group);
        this.fabricCanvas.viewportCenterObject(this.group);
        this.group.setCoords();
        this.fabricCanvas.setActiveObject(this.group);

        this.baseImage = imgInstance; // reference to uploaded image as fabric object

        this.fabricCanvas.on('object:added', (event) => {
            let object = event.target;
            /*object.selectable = false;*/

            // Clone the object, add to group, remove original object
            object.clone((newObject) => {
                this.group.addWithUpdate(newObject);
                this.fabricCanvas.remove(object);

                this.fabricCanvas.setActiveObject(this.group);
            })
        });

        // Track history
        this.undoHistory = []; // array of fabric objects

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
        this.fabricCanvas.freeDrawingBrush.color = "#00ff00";
        this.doToolbarAction('get-all').drawMode(false);
    }

    zoomToFit(objectHeight){
        let viewportImgRatio = this.fabricCanvas.getHeight() / objectHeight;
        this.fabricCanvas.setZoom(viewportImgRatio);
    }

    /****
     *
     * Perform toolbar action
     *
     * @param toolbarAction: action specified by data-toolbar-action attribute on toolbar button
     *                       options: add-image, center-image, zoom-in, zoom-out, draw, add-text, text-size, text-colour,
     *                       save, exit, get-all
     *
     */
    doToolbarAction(toolbarAction){

        let self = this;

        let toolbarActions = {
            undo: function(){
                console.log("undo");
                let objects = self.group.getObjects();
                if (objects.length > 1){
                    let objectToRemove = objects[objects.length - 1];
                    console.log("objectToRemove: ", objectToRemove);
                    self.group.remove(objectToRemove);

                    // add to history
                    self.undoHistory.push(objectToRemove);

                    self.fabricCanvas.renderAll();
                }
            },
            redo: function() {
                console.log("redo");
                if (self.undoHistory.length > 0){
                    let objectToAdd = self.undoHistory[self.undoHistory.length - 1];
                    self.group.add(objectToAdd);
                    self.fabricCanvas.renderAll();
                    self.undoHistory.pop();
                }
            },

            saveImage: function (){
                console.log("saveImage");


                let originalCanvasProperties = {
                    "width": self.fabricCanvas.getWidth(),
                    "height": self.fabricCanvas.getHeight(),
                    "zoom": self.fabricCanvas.getZoom(),
                };

                self.fabricCanvas.setDimensions({
                    "width": self.group.getWidth(),
                    "height": self.group.getHeight(),
                });
                self.group.top = 0;
                self.group.left = 0;
                self.fabricCanvas.setZoom(1);


                /*if (objects.length > 1){
                 console.log("Create object group: " + objects.length);

                 group = new fabric.Group();
                 self.fabricCanvas.forEachObject((object, index) => {
                 group.addWithUpdate(object);
                 });

                 self.fabricCanvas.setActiveGroup(group);
                 self.fabricCanvas.add(group);

                 console.log("group width: " + group.getWidth() + " group height: " + group.getHeight());

                 self.fabricCanvas.setDimensions({
                 "width": group.getWidth(),
                 "height": group.getHeight(),
                 });
                 group.top = 0;
                 group.left = 0;
                 self.fabricCanvas.setZoom(1);

                 }
                 */
                let imgSrc = self.fabricCanvas.toDataURL({
                    format: "jpeg",
                });

                restoreCanvas(originalCanvasProperties);

                self.app.showModal("image", {
                    type: "snapshot",
                    imgSrc: imgSrc
                });

                function restoreCanvas(originalCanvasProperties) {
                    console.log("originalCanvasProps: ", originalCanvasProperties);

                    self.fabricCanvas.setWidth(originalCanvasProperties.width);
                    self.fabricCanvas.setHeight(originalCanvasProperties.height);
                    self.fabricCanvas.setZoom(originalCanvasProperties.zoom);
                    self.doToolbarAction('center-image');
                }
            },

            centerImage: function (){
                console.log("centerImage");
                let img = self.fabricCanvas.getActiveObject();
                if (img) {
                    self.fabricCanvas.viewportCenterObject(img);
                    img.setCoords();
                }
            },

            zoomCanvas: function (zoomIn) {
                let currentZoom =  self.fabricCanvas.getZoom();
                zoomIn ? self.fabricCanvas.setZoom(currentZoom + 0.05) : self.fabricCanvas.setZoom(currentZoom - 0.05);
            },

            drawMode: function (enable) {
                console.log("drawingmode: " + self.fabricCanvas.isDrawingMode);

                if (!enable) {
                    self.fabricCanvas.isDrawingMode = false;
                    self.$drawingOptions.hide();
                    return;
                }

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
                        let action = jQuery(event.currentTarget).attr('data-action');
                        console.log("event: ", event);
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

        };

        switch (toolbarAction) {

            case 'add-image':
                console.log("do action: " + toolbarAction);
                break;

            case 'undo':
                toolbarActions.undo();
                break;

            case 'redo':
                toolbarActions.redo();
                break;

            case 'center-image':
                toolbarActions.centerImage();
                break;

            case 'zoom-in':
                toolbarActions.zoomCanvas(true);
                break;

            case 'zoom-out':
                toolbarActions.zoomCanvas(false);
                break;

            case 'draw':
                console.log("do action: " + toolbarAction);
                toolbarActions.drawMode(true);
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
                toolbarActions.saveImage();
                break;

            case 'exit':
                console.log("do action: " + toolbarAction);
                break;

            case 'get-all':
                console.log("return all actions");
                return toolbarActions;

            default:
                console.log("No action selected");
                break;
        }



/*        function saveImage(){
            console.log("saveImage");


            let originalCanvasProperties = {
                "width": self.fabricCanvas.getWidth(),
                "height": self.fabricCanvas.getHeight(),
                "zoom": self.fabricCanvas.getZoom(),
            };

            self.fabricCanvas.setDimensions({
                "width": self.group.getWidth(),
                "height": self.group.getHeight(),
            });
            self.group.top = 0;
            self.group.left = 0;
            self.fabricCanvas.setZoom(1);


            /!*if (objects.length > 1){
                console.log("Create object group: " + objects.length);

                group = new fabric.Group();
                self.fabricCanvas.forEachObject((object, index) => {
                    group.addWithUpdate(object);
                });

                self.fabricCanvas.setActiveGroup(group);
                self.fabricCanvas.add(group);

                console.log("group width: " + group.getWidth() + " group height: " + group.getHeight());

                self.fabricCanvas.setDimensions({
                    "width": group.getWidth(),
                    "height": group.getHeight(),
                });
                group.top = 0;
                group.left = 0;
                self.fabricCanvas.setZoom(1);

            }
*!/
            let imgSrc = self.fabricCanvas.toDataURL({
                format: "jpeg",
            });

            restoreCanvas(originalCanvasProperties);

            self.app.showModal("image", {
                type: "snapshot",
                imgSrc: imgSrc
            });

            function restoreCanvas(originalCanvasProperties) {
                console.log("originalCanvasProps: ", originalCanvasProperties);

                self.fabricCanvas.setWidth(originalCanvasProperties.width);
                self.fabricCanvas.setHeight(originalCanvasProperties.height);
                self.fabricCanvas.setZoom(originalCanvasProperties.zoom);
                self.doToolbarAction('center-image');
            }
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

        function drawMode(enable) {
            console.log("drawingmode: " + self.fabricCanvas.isDrawingMode);

            if (!enable) {
                self.fabricCanvas.isDrawingMode = false;
                self.$drawingOptions.hide();
                return;
            }

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

        }*/
    }

}