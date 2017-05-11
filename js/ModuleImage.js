/**
 * Created by peter on 03/05/2017.
 */

"use strict";

import appGlobals from './globals';
import BaseModule from './BaseModule';

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

        // Toolbar
        this.$toolbar = jQuery('#wpaz-image-editor-toolbar');
        this.$toolbarButtons = jQuery('.image-editor-toolbar');

        // Options boxes
        this.$drawingOptions = jQuery('#drawing-mode-options');

        // Image data
        this.fabricRootImage = {}; // uploaded image as Fabric object
        this.imgDimensions = {};

        /*this.toggleModule();*/

        // Set up fabric canvas
        this.setupCanvas();
        
        this.enableModule();
    }

    loadImage(imageSrc = this.rootImage.src, imageType = this.rootImage.type) {

        /*let objects = this.group.getObjects();
        console.log("objects.length before: " + objects.length);
        /!*for (let object of objects) {
            this.group.remove(object);
        }*!/
        for (let i = 0; i < objects.length ; i++){
            this.group.remove(objects[i]);
        }
        console.log("objects.length after: " + this.group.getObjects().length);*/

        let self = this;

        this.fabricCanvas.remove(this.group);
        this.fabricCanvas.renderAll();

        this.createGroup();

        this.resetHistory();

        // Fabric image
        let imageToLoad;

        // Set Image
        if (imageType === 'base64'){
            let imgElement = new Image;
            imgElement.src = imageSrc;

            /*// Calculate ratio if image to viewport and set canvas zoom accordingly
            let imgHeight = imgElement.height;
            let imgWidth = imgElement.width;
            this.imgDimensions = {
                "width": imgWidth,
                "height": imgHeight,
            };
            this.zoomToFit(imgHeight);*/

            // Create fabric image
            imageToLoad = new fabric.Image(imgElement, {});

            this.addImage(imageToLoad);

            /*// Create fabric image
            imageToLoad = new fabric.Image(imgElement, {});

            // Add image to group

            this.group.addWithUpdate(imageToLoad);

            // Add image to canvas
            this.fabricCanvas.add(this.group);
            this.fabricCanvas.viewportCenterObject(this.group);
            this.group.setCoords();
            this.fabricCanvas.setActiveObject(this.group);

            this.fabricRootImage = imageToLoad; // reference to uploaded image as fabric object*/
        } else {
            fabric.Image.fromURL(imageSrc, (image) => {

                // Prevent duplicate images
                if (this.group.getObjects().length > 0){
                    console.log("Image already added, return");
                    return;
                }

                // Add image
                this.addImage(image);

                /*imageToLoad = image;

                this.group.addWithUpdate(image);

                // Add image to canvas
                this.fabricCanvas.add(this.group);
                this.fabricCanvas.viewportCenterObject(this.group);
                this.group.setCoords();
                this.fabricCanvas.setActiveObject(this.group);

                this.fabricRootImage = imageToLoad;*/
            })
        }

    }

    addImage(imageToLoad) {

        let imgHeight = imageToLoad.getHeight();
        this.zoomToFit(imgHeight);


        // Add image to group
        this.group.addWithUpdate(imageToLoad);

        // Add image to canvas
        this.fabricCanvas.add(this.group);
        this.fabricCanvas.viewportCenterObject(this.group);
        this.group.setCoords();
        this.fabricCanvas.setActiveObject(this.group);

        this.fabricRootImage = imageToLoad; // reference to uploaded image as fabric object

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

        /*// Set Image
        if (this.rootImage.src){
            console.log("set image from src");
            let imgElement = new Image;
            imgElement.src = this.rootImage.src;

            // Calculate ratio if image to viewport and set canvas zoom accordingly
            let imgHeight = imgElement.height;
            let imgWidth = imgElement.width;
            this.imgDimensions = {
                "width": imgWidth,
                "height": imgHeight,
            };
            this.zoomToFit(imgHeight);


            // Create fabric image
            let imgInstance = new fabric.Image(imgElement, {});
            /!*imgInstance.selectable = false;*!/

            // Add image to group
            this.group.addWithUpdate(imgInstance);

            // Add image to canvas
            this.fabricCanvas.add(this.group);
            this.fabricCanvas.viewportCenterObject(this.group);
            this.group.setCoords();
            this.fabricCanvas.setActiveObject(this.group);

            this.fabricRootImage = imgInstance; // reference to uploaded image as fabric object
        } else {
            console.log("set fabric image from url: " + this.imgUrl);
            fabric.Image.fromURL(this.imgUrl, (image) => {

                let imgHeight = image.getHeight();
                this.zoomToFit(imgHeight);

                // Add image to group
                this.group.addWithUpdate(image);

                // Add image to canvas
                this.fabricCanvas.add(this.group);
                this.fabricCanvas.viewportCenterObject(this.group);
                this.group.setCoords();
                this.fabricCanvas.setActiveObject(this.group);
            })
        }*/

        // Track history
        this.undoHistory = []; // array of fabric objects

        // Add listeners
        this.setListeners();

        // Load image
        this.loadImage(imageSrc, imageType);
    }

    createGroup(){
        this.group = new fabric.Group();

        if (!this.app.userIsEditor) {
            this.group.hasBorders = false;
            this.group.hasControls = false;
        }
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
            appGlobals.mode.ANNOTATE = false;
        }

        // Set UI
        this.setUi(true);

        this.$imageCanvas.show();

        // Resize canvas
        this.resizeCanvas();

/*
        // If canvas already exists, destroy and create new
        if (this.fabricCanvas) {
            this.fabricCanvas.dispose();
            this.fabricCanvas = null;
        }

        // Create canvas
        this.fabricCanvas = new fabric.Canvas('imageCanvas', {
            backgroundColor: 'rgb(255,255,255)',
        });

        // Set canvas defaults
        this.setCanvasDefaults();

        // Create group
        this.group = new fabric.Group();

        // Set Image
        if (this.imgSrc){
            console.log("set image from src");
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


            // Create fabric image
            let imgInstance = new fabric.Image(imgElement, {});
            /!*imgInstance.selectable = false;*!/

            // Add image to group
            this.group.addWithUpdate(imgInstance);

            // Add image to canvas
            this.fabricCanvas.add(this.group);
            this.fabricCanvas.viewportCenterObject(this.group);
            this.group.setCoords();
            this.fabricCanvas.setActiveObject(this.group);

            this.fabricRootImage = imgInstance; // reference to uploaded image as fabric object
        } else {
            console.log("set fabric image from url: " + this.imgUrl);
            fabric.Image.fromURL(this.imgUrl, (image) => {

                let imgHeight = image.getHeight();
                this.zoomToFit(imgHeight);

                // Add image to group
                this.group.addWithUpdate(image);

                // Add image to canvas
                this.fabricCanvas.add(this.group);
                this.fabricCanvas.viewportCenterObject(this.group);
                this.group.setCoords();
                this.fabricCanvas.setActiveObject(this.group);
            })
        }


        this.fabricCanvas.on('object:added', (event) => {
            let object = event.target;
            /!*object.selectable = false;*!/

            if (object === this.group){
                console.log("group added, return");
                return;
            }

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
        this.setListeners();*/

    }

    disableModule() {

        console.log("disableModule: " + this.moduleName);

        appGlobals.mode.EDIT_IMAGE = false;

        // Disable canvas
        this.$imageCanvas.hide();

        // Set UI
        this.setUi(false);

        /*// Deactivate fabric canvas
        this.destroyCanvas();*/

        /*// Remove listeners
        this.removeListeners();*/

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
        jQuery(window).off();
        this.$toolbarButtons.off();
    }

    setCanvasListeners(){
        this.fabricCanvas.off();
        this.fabricCanvas.on('object:added', (event) => {
            let object = event.target;

            if (object === this.group){
                console.log("group added, return", object);
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
        let self = this;
        let fabricCanvas = this.fabricCanvas;

        let resizeCanvas = function() {
            if (appGlobals.mode.EDIT_IMAGE){
                fabricCanvas.setWidth(app.$humanWidget.width());
                self.toolbarActions.centerImage();
            }
        };

        jQuery(window).off();
        jQuery(window).on('resize', resizeCanvas);

    }

    resizeCanvas() {
        if (appGlobals.mode.EDIT_IMAGE){
            this.fabricCanvas.setWidth(this.app.$humanWidget.width());
            this.toolbarActions.centerImage();
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
        this.fabricCanvas.freeDrawingBrush.width = 6;
        this.fabricCanvas.freeDrawingBrush.color = "rgba(0,255,0, 1)";
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

        this.toolbarActions = {
            undo: function(){
                console.log("undo");
                let objects = self.group.getObjects();
                if (objects.length > 1){
                    let objectToRemove = objects[objects.length - 1];
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

            saveImage: function (srcOnly){
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

                let imgSrc = self.fabricCanvas.toDataURL({
                    format: "jpeg",
                });

                restoreCanvas(originalCanvasProperties);

                if (srcOnly) {
                    return imgSrc;
                }

                self.app.showModal("image", {
                    type: "snapshot",
                    imgSrc: imgSrc
                });

                function restoreCanvas(originalCanvasProperties) {
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
                    let $lineOpacity = jQuery('#drawing-line-opacity');
                    let $changeLineOpacity = jQuery('.change-line-opacity');


                    // Set values
                    $drawingLineWidth.text(self.fabricCanvas.freeDrawingBrush.width);
                    $lineOpacity.text(ModuleImage.getAlphaFromFabricColor(new fabric.Color(self.fabricCanvas.freeDrawingBrush.color)));

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
                        self.fabricCanvas.freeDrawingBrush.width = width;
                    });

                    // Line colour
                    $drawingColour.off();
                    $drawingColour.on('change', (event) => {
                        console.log("colour change:", event);
                        let colour = event.target.value;
                        self.fabricCanvas.freeDrawingBrush.color = colour;
                        $lineOpacity.text("100");
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

                        let currentColor = self.fabricCanvas.freeDrawingBrush.color;
                        let hexColor = new fabric.Color(currentColor).toHex(); // convert to hex
                        let rgba = Utils.convertHex(hexColor, opacity); // change opacity
                        self.fabricCanvas.freeDrawingBrush.color = rgba;


                    })

                } else {
                    self.$drawingOptions.hide();
                }

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