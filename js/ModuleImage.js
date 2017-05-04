/**
 * Created by peter on 03/05/2017.
 */

class ModuleImage extends NotesModule {

    init() {
        console.log("init: " + this.moduleName);

        // Get module data
        this.imgSrc = this.moduleData.imgSrc;

        this.toggleModule();
    }

    enableModule(){

        console.log("enableModule: " + this.moduleName);

        // Disable conflicting modes/modules
        if (appGlobals.modulesLoaded[appGlobals.modules.ANNOTATE_MODULE]){
            appGlobals.modulesLoaded[appGlobals.modules.ANNOTATE_MODULE].disableModule();
            appGlobals.mode.ANNOTATE = false;
        }

        // Enable canvas
        this.app.$imageCanvas.show();

        // Set image in canvas
        this.fabricCanvas = new fabric.Canvas('imageCanvas', {
            backgroundColor: 'rgb(255,255, 255)',
            selectionColor: 'blue',
            selectionLineWidth: 2
        });
        this.fabricCanvas.setZoom(0.5);
        this.fabricCanvas.setWidth(this.app.$humanWidget.width());
        this.fabricCanvas.setHeight(this.app.$humanWidget.height());

        jQuery(window).on('resize', () => {
            console.log("resize fabric canvas");
            this.fabricCanvas.setWidth(this.app.$humanWidget.width());
        });


        // Set Image
        let imgElement = new Image;
        imgElement.src = this.imgSrc;
        let imgInstance = new fabric.Image(imgElement, {
            left: 0,
            top: 0,
        });
        this.fabricCanvas.add(imgInstance);

        // Add listeners
        this.setCanvasListeners();

    }

    disableModule() {

        console.log("disableModule: " + this.moduleName);

        // Disable canvas
        this.app.$imageCanvas.hide();

        // Remove listeners
        this.removeListeners();

        // Deactivate fabric canvas
        if (this.fabricCanvas) {
            this.fabricCanvas.dispose();
            this.fabricCanvas = null;
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
    
    setCanvasListeners(){

        this.canvas.addEventListener('click', (event) => {
            console.log("Image canvas clicked");
        })
    }

    removeListeners(){
        jQuery(window).off();
    }
}