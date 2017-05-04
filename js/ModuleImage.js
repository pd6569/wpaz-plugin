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
            selectionLineWidth: 2
        });

        // Set canvas properties
        this.fabricCanvas.setZoom(0.5);
        this.fabricCanvas.setWidth(this.app.$humanWidget.width());
        this.fabricCanvas.setHeight(this.app.$humanWidget.height());


        // Set Image
        let imgElement = new Image;
        imgElement.src = this.imgSrc;
        let imgInstance = new fabric.Image(imgElement, {
            left: 0,
            top: 0,
        });
        this.fabricCanvas.add(imgInstance);

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

}