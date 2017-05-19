/**
 * Created by peter on 03/05/2017.
 */

//TODO: Fade in animation when switching from image to image

"use strict";

// vendor
import 'fabric';

// 3D notes modules
import appGlobals from './globals';
import BaseModule from './BaseModule';
import Utils from './Utils';


export default class ModuleImage extends BaseModule {

    init() {
        console.log("init: " + this.moduleName);

        // Get module data
        this.rootImage = {};
        this.rootImage.src = this.moduleData.imgSrc;
        this.rootImage.type = this.moduleData.imgType;


        /*** DOM references ***/

        // Canvas
        this.$imageCanvas = this.app.$imageCanvas;
        this.canvasMarginsSet = true; // margins either side of canvas - to be removed in presentation mode

        // Toolbar
        this.$toolbar = jQuery('#wpaz-image-editor-toolbar');
        this.$toolbarButtons = jQuery('.image-editor-toolbar');

        // Options boxes
        this.$drawingOptions = jQuery('#drawing-mode-options');

        // Image data
        this.fabricRootImage = {}; // uploaded image as Fabric object
        this.imgDimensions = {};

        // Window Listeners
        this.windowListenerIsSet = false;

        // Set up fabric canvas
        this.setupCanvas();
        
        this.enableModule();

        this.loadImage();
    }

    loadImage(imageSrc = this.rootImage.src, imageType = this.rootImage.type) {
        console.log("loadImage");

        this.group.remove(this.fabricRootImage);


        this.resetHistory();

        // Fabric image
        let imageToLoad;

        // Set Image
        if (imageType === 'base64'){
            let imgElement = new Image;
            imgElement.src = imageSrc;

            // Create fabric image
            imageToLoad = new fabric.Image(imgElement, {});

            this.addImage(imageToLoad);

        } else {

            // Unclear why but sometimes callback is called TWICE duplicating image
            fabric.Image.fromURL(imageSrc, (image) => {

                console.log("image from URL called");

                // Prevent duplicate images
                if (this.group.getObjects().length > 0) {

                    let objects = this.group.getObjects();
                    let i = 0;
                    while (objects.length != 0) {
                        i++;
                        this.group.removeWithUpdate(objects[0])
                    }

                }

                // Add image
                this.addImage(image);

            });
        }

    }

    addImage(imageToLoad) {
        console.log("addImage");
        let _this = this;

        let imgHeight = imageToLoad.getHeight();

        this.zoomToFit(imgHeight);

        // Add image to canvas
        imageToLoad.setOpacity(0);

        this.group.addWithUpdate(imageToLoad);

        _this.fabricCanvas.viewportCenterObject(_this.group);
        _this.group.setCoords();

        imageToLoad.animate('opacity', '1', {
            onChange: _this.fabricCanvas.renderAll.bind(_this.fabricCanvas),
            onComplete: function() {
                console.log("fade animation complete");

                _this.fabricRootImage = imageToLoad; // reference to uploaded image as fabric object
            }
        });

    }



    createCanvas(){
        // Create canvas
        this.fabricCanvas = new fabric.Canvas('imageCanvas', {
            backgroundColor: 'rgb(255,255,255)',
        });

        // Set canvas defaults
        this.setCanvasDefaults();

        // Change canvas reference to fabric canvas
        this.$imageCanvas = jQuery('.canvas-container');
    }

    destroyCanvas(){
        if (this.fabricCanvas) {
            this.fabricCanvas.dispose();
            this.fabricCanvas = null;
        }
    }

    setupCanvas(imageSrc, imageType) {
        console.log("setupCanvas");

        // Show canvas
        this.$imageCanvas.show();

        // If canvas already exists, destroy and create new
        this.destroyCanvas();

        // Create canvas
        this.createCanvas();

        // Create group to contain image and all annotataions/drawings
        this.createGroup();

        // Track history
        this.undoHistory = []; // array of fabric objects

        // Add listeners
        this.setListeners();

    }

    createGroup(){
        this.group = new fabric.Group();

        if (!this.app.userIsEditor || appGlobals.mode.PRESENTATION) {
            this.group.hasBorders = false;
            this.group.hasControls = false;
        }

        this.fabricCanvas.add(this.group);
        this.fabricCanvas.viewportCenterObject(this.group);
        this.group.setCoords();
        this.fabricCanvas.setActiveObject(this.group);
    }

    resetHistory() {
        this.undoHistory = [];
    }

    enableModule(){
        console.log("enableModule: " + this.moduleName);

        appGlobals.mode.EDIT_IMAGE = true;

        // Disable conflicting modes/modules
        if (appGlobals.modulesLoaded[appGlobals.modules.ANNOTATE_MODULE]){
            appGlobals.modulesLoaded[appGlobals.modules.ANNOTATE_MODULE].disableModule();
        }

        // Set UI
        this.setUi(true);

        this.$imageCanvas.show();

        // Resize canvas
        this.resizeCanvas();

        // Create new group
        this.fabricCanvas.remove(this.group);
        this.createGroup();

        // Check mode
        appGlobals.mode.PRESENTATION ? this.toggleToolbar(false) : this.toggleToolbar(true);

        // Enable window listeners
        this.setWindowListeners();

        console.log("group: " + this.group.getObjects().length);
    }

    disableModule(destroyCanvas) {

        console.log("disableModule: " + this.moduleName);

        let _this = this;

        appGlobals.mode.EDIT_IMAGE = false;

        // Set UI
        this.setUi(false);

        // Reset root image
        this.fabricRootImage = {};

        // Remove window listeners
        this.removeListeners();

        // Disable canvas
        if (destroyCanvas) {
            this.fabricCanvas.dispose();
            this.$imageCanvas = jQuery('#imageCanvas');
            this.$imageCanvas.hide();

        } else {
            this.$imageCanvas.fadeOut({
                'duration': 1000,
                'progress': function() {
                    // check if mode has been enabled by user during the fade transition - if so, fade the canvas back in and terminate the current fade out animation
                    if (appGlobals.mode.EDIT_IMAGE) {
                        console.log("terminate animation");
                        _this.$imageCanvas.stop();
                        _this.$imageCanvas.fadeIn();
                    }
                }
            });
        }



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
        this.setCanvasListeners();
    }

    removeListeners(){

        console.log("removeListeners");

        // Window listeners
        jQuery(window).unbind('resize', this.windowListeners.resizeCanvas);
    }

    setCanvasListeners(){
        this.fabricCanvas.off();
        this.fabricCanvas.on('object:added', (event) => {

            let object = event.target;

            if (object === this.group){
                console.log("group added, return", object);
                return;
            }

            if (object === this.mouseCursor){
                console.log("cursor added, return");
                return;
            }

            // Clone the object, add to group, remove original object
            object.clone((newObject) => {
                this.group.addWithUpdate(newObject);
                this.fabricCanvas.remove(object);

                this.fabricCanvas.setActiveObject(this.group);
            })
        });

    }

    setWindowListeners(){
        let app = this.app;
        let _this = this;
        let fabricCanvas = this.fabricCanvas;

        this.windowListeners = {
            "resizeCanvas": function() {
                if (appGlobals.mode.EDIT_IMAGE){

                    // Remove margins if in presentation mode
                    if (appGlobals.mode.PRESENTATION){
                        console.log("presentation mode - remove margins");

                        // remove margins from canvas
                        if (_this.canvasMarginsSet) {
                            jQuery('.canvas-container').css({
                                'margin-left': '0px',
                                'margin-right': '0px'
                            });
                        }

                        let viewportHeight = jQuery(window).height();
                        let viewPortWidth = jQuery(window).width();

                        fabricCanvas.setWidth(viewPortWidth);
                        fabricCanvas.setHeight(viewportHeight);

                        _this.toolbarActions.centerImage();

                        _this.canvasMarginsSet = false;
                    } else {

                        // reset canvas margins
                        if (!_this.canvasMarginsSet) {
                            jQuery('.canvas-container').css({
                                'margin-left': '15px',
                                'margin-right': '15px'
                            });
                        }
                        fabricCanvas.setWidth(app.$humanWidget.width());
                        fabricCanvas.setHeight(app.$humanWidget.height());
                        _this.toolbarActions.centerImage();

                        _this.canvasMarginsSet = true;
                    }
                }
            }
        };

        console.log("set resize canvas handler");

        if (!this.windowListenerIsSet) {
            jQuery(window).on('resize', this.windowListeners.resizeCanvas);
        }

        this.windowListenerIsSet = true;

    }

    resizeCanvas() {
        if (appGlobals.mode.EDIT_IMAGE){
            this.windowListeners.resizeCanvas();
        }
    }

    setToolbarListeners(){

        this.$toolbarButtons.off();
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
        this.fabricCanvas.freeDrawingBrush.width = 50;
        this.fabricCanvas.freeDrawingBrush.color = "rgba(0,255,0, 1)";
        this.doToolbarAction('get-all').drawMode(false);
    }

    zoomToFit(objectHeight){
        let viewportImgRatio = this.fabricCanvas.getHeight() / objectHeight;
        this.fabricCanvas.setZoom(viewportImgRatio);
    }

    toggleToolbar(on){
        on ? this.$toolbar.show() : this.$toolbar.hide();
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

        let _this = this;

        this.toolbarActions = {
            undo: function(){
                console.log("undo");
                let objects = _this.group.getObjects();
                if (objects.length > 1){
                    let objectToRemove = objects[objects.length - 1];
                    _this.group.remove(objectToRemove);

                    // add to history
                    _this.undoHistory.push(objectToRemove);

                    _this.fabricCanvas.renderAll();
                }
            },
            redo: function() {
                console.log("redo");
                if (_this.undoHistory.length > 0){
                    let objectToAdd = _this.undoHistory[_this.undoHistory.length - 1];
                    _this.group.add(objectToAdd);
                    _this.fabricCanvas.renderAll();
                    _this.undoHistory.pop();
                }
            },

            saveImage: function (srcOnly){
                console.log("saveImage");

                let originalCanvasProperties = {
                    "width": _this.fabricCanvas.getWidth(),
                    "height": _this.fabricCanvas.getHeight(),
                    "zoom": _this.fabricCanvas.getZoom(),
                };

                _this.fabricCanvas.setDimensions({
                    "width": _this.group.getWidth(),
                    "height": _this.group.getHeight(),
                });
                _this.group.top = 0;
                _this.group.left = 0;
                _this.fabricCanvas.setZoom(1);

                let imgSrc = _this.fabricCanvas.toDataURL({
                    format: "jpeg",
                });

                restoreCanvas(originalCanvasProperties);

                if (srcOnly) {
                    return imgSrc;
                }

                _this.app.showModal("image", {
                    type: "snapshot",
                    imgSrc: imgSrc
                });

                function restoreCanvas(originalCanvasProperties) {
                    _this.fabricCanvas.setWidth(originalCanvasProperties.width);
                    _this.fabricCanvas.setHeight(originalCanvasProperties.height);
                    _this.fabricCanvas.setZoom(originalCanvasProperties.zoom);
                    _this.doToolbarAction('center-image');
                }
            },

            centerImage: function (){
                console.log("centerImage");
                let img = _this.fabricCanvas.getActiveObject();
                if (img) {
                    _this.fabricCanvas.viewportCenterObject(img);
                    img.setCoords();
                }
            },

            zoomCanvas: function (zoomIn) {
                let currentZoom =  _this.fabricCanvas.getZoom();
                zoomIn ? _this.fabricCanvas.setZoom(currentZoom + 0.05) : _this.fabricCanvas.setZoom(currentZoom - 0.05);
            },

            drawMode: function (enable) {
                console.log("drawingmode: " + _this.fabricCanvas.isDrawingMode);

                if (!enable) {
                    _this.fabricCanvas.isDrawingMode = false;
                    _this.$drawingOptions.hide();

                    console.log("before objects on canvas: " +  _this.fabricCanvas.getObjects().length + " cursor: ", _this.mouseCursor);

                    _this.fabricCanvas.remove(_this.mouseCursor);
                    _this.mouseCursor = null;
                    _this.fabricCanvas.renderAll();

                    console.log("after objects on canvas: ",  _this.fabricCanvas.getObjects().length + " cursor: ", _this.mouseCursor);
                    return;
                }

                _this.fabricCanvas.isDrawingMode = !_this.fabricCanvas.isDrawingMode;

                if (_this.fabricCanvas.isDrawingMode) {
                    console.log("show draw options", _this.$drawingOptions);
                    _this.$drawingOptions.removeClass('hidden').show();


                    /********* START CURSOR SET UP ************/

                    _this.fabricCanvas.freeDrawingCursor = 'none';

                    // Set up cursor
                    _this.mouseCursor = new fabric.Circle({
                        'selectable': false,
                        'hasBorders': false,
                        'hasControls': false,
                        'left': 0,
                        'top': 0,
                        'radius': parseInt((_this.fabricCanvas.freeDrawingBrush.width / 2) / _this.fabricCanvas.getZoom()),
                        'fill': _this.fabricCanvas.freeDrawingBrush.color,
                        'originX': 'center',
                        'originY': 'center',
                        'scaleX': _this.fabricCanvas.getZoom(),
                        'scaleY': _this.fabricCanvas.getZoom(),
                    });

                    _this.fabricCanvas.add(_this.mouseCursor);

                    _this.fabricCanvas.sendToBack(_this.group);
                    _this.fabricCanvas.bringToFront(_this.mouseCursor);

                    _this.fabricCanvas.renderAll();

                    _this.fabricCanvas.on('mouse:move', (object) => {
                        if (_this.mouseCursor) {
                            _this.mouseCursor.top = object.e.layerY / _this.fabricCanvas.getZoom();
                            _this.mouseCursor.left = object.e.layerX / _this.fabricCanvas.getZoom();
                            _this.fabricCanvas.setActiveObject(_this.mouseCursor);
                            _this.fabricCanvas.renderAll();
                        }

                    });


                    _this.fabricCanvas.on('mouse:out', (object) =>  {
                        // put circle off screen

                        if (_this.mouseCursor) {
                            _this.mouseCursor.top = -100;
                            _this.mouseCursor.left = -100;

                            _this.fabricCanvas.renderAll()
                        }

                    });

                    /********* END CURSOR SET UP ************/

                    // Get elements
                    let $minimise = jQuery('#drawing-options-top-panel .minimise-options');
                    let $optionsBody = jQuery('#drawing-options-body');

                    let $drawingModeSelector = jQuery('#drawing-mode-selector');

                    // Width
                    let $drawingLineWidth = jQuery('#drawing-line-width');
                    let $changeLineWidth = jQuery('.change-line-width');
                    let $widthSlider = jQuery('#line-width-slider');

                    // Colour
                    let $drawingColour = jQuery('#drawing-color');

                    // Opacity
                    let $lineOpacity = jQuery('#drawing-line-opacity');
                    let $changeLineOpacity = jQuery('.change-line-opacity');
                    let $opacitySlider = jQuery('#line-opacity-slider');


                    // Set values
                    let lineWidth = _this.fabricCanvas.freeDrawingBrush.width;
                    $drawingLineWidth.text(lineWidth);
                    $widthSlider.attr('value', lineWidth);

                    let opacity = ModuleImage.getAlphaFromFabricColor(new fabric.Color(_this.fabricCanvas.freeDrawingBrush.color));
                    $lineOpacity.text(opacity);
                    $opacitySlider.attr('value', opacity);

                    // Change line width
                    $changeLineWidth.off();
                    $changeLineWidth.on('click', (event) => {
                        let action = jQuery(event.currentTarget).attr('data-action');
                        let width = parseInt($drawingLineWidth.text());
                        if (action === 'increase-width') {
                            width++;
                        } else {
                            if (width > 1) width--;
                        }
                        $drawingLineWidth.text(width);
                        _this.fabricCanvas.freeDrawingBrush.width = width;
                        _this.mouseCursor.setRadius(parseInt((width / 2) / _this.fabricCanvas.getZoom()));
                    });

                    $widthSlider.off();
                    $widthSlider.on('change', (event) => {
                        console.log("change line width", event);
                        let width = event.target.value;
                        $drawingLineWidth.text(width);
                        _this.fabricCanvas.freeDrawingBrush.width = width;
                        _this.mouseCursor.setRadius(parseInt((width / 2) / _this.fabricCanvas.getZoom()));
                    });

                    // Line colour
                    $drawingColour.off();
                    $drawingColour.on('change', (event) => {
                        console.log("colour change:", event);
                        let colour = event.target.value;
                        _this.fabricCanvas.freeDrawingBrush.color = colour;
                        _this.mouseCursor.setColor(colour);
                        $lineOpacity.text("100");
                        $opacitySlider.attr('value', '100');
                    });

                    // Line opacity
                    $changeLineOpacity.off();
                    $changeLineOpacity.on('click', (event) => {
                        let action = jQuery(event.currentTarget).attr('data-action');
                        let opacity = parseInt($lineOpacity.text());

                        if (action === 'increase-opacity') {
                            if (opacity < 100){
                                opacity += 1;
                            }
                        } else if (opacity > 0) {
                            opacity -= 1;
                        }

                        $lineOpacity.text(opacity);

                        let currentColor = _this.fabricCanvas.freeDrawingBrush.color;
                        let hexColor = new fabric.Color(currentColor).toHex(); // convert to hex
                        let rgba = Utils.convertHex(hexColor, opacity); // change opacity
                        _this.fabricCanvas.freeDrawingBrush.color = rgba;
                    });

                    $opacitySlider.off();
                    $opacitySlider.on('change', (event) => {
                        console.log("change line opacity");
                        let opacity = event.target.value;
                        $lineOpacity.text(opacity);

                        let currentColor = _this.fabricCanvas.freeDrawingBrush.color;
                        let hexColor = new fabric.Color(currentColor).toHex(); // convert to hex
                        let rgba = Utils.convertHex(hexColor, opacity); // change opacity
                        _this.fabricCanvas.freeDrawingBrush.color = rgba;
                        _this.mouseCursor.setColor(rgba);

                    });

                    // Minimise
                    $minimise.off();
                    $minimise.on('click', () => {
                        $optionsBody.toggle();
                        if ($optionsBody.is(":hidden")) {
                            $minimise.removeClass('glyphicon-chevron-up');
                            $minimise.addClass('glyphicon-chevron-down');
                        } else {
                            $minimise.removeClass('glyphicon-chevron-down');
                            $minimise.addClass('glyphicon-chevron-up');
                        }
                    });


                } else {
                    _this.$drawingOptions.hide();
                }

            },

            moveImage: function() {
                this.drawMode(false);
            }

        };

        switch (toolbarAction) {

            case 'add-image':
                break;

            case 'undo':
                this.toolbarActions.undo();
                break;

            case 'redo':
                this.toolbarActions.redo();
                break;

            case 'center-image':
                this.toolbarActions.centerImage();
                break;

            case 'zoom-in':
                this.toolbarActions.zoomCanvas(true);
                break;

            case 'zoom-out':
                this.toolbarActions.zoomCanvas(false);
                break;

            case 'move':
                this.toolbarActions.moveImage();
                break;

            case 'draw':
                this.toolbarActions.drawMode(true);
                break;

            case 'add-text':
                break;

            case 'text-size':
                break;

            case 'text-colour':
                break;

            case 'save':
                this.toolbarActions.saveImage();
                break;

            case 'exit':
                this.disableModule();
                break;

            case 'get-all':
                return this.toolbarActions;

            default:
                break;
        }

    }

    /****************************************
     *            STATIC FUNCTIONS          *
     ****************************************/

    static getAlphaFromFabricColor(fabricColor){
        return parseInt(fabricColor._source[3] * 100);
    }

    /****************************************
     *           PRIVATE FUNCTIONS          *
     ****************************************/


}