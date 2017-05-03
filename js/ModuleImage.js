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

        // Enable canvas
        this.$canvas.show();

        // Set image in canvas

        // Add listeners
        this.setCanvasListeners();
    }

    disableModule() {

        // Disable canvas
        this.$canvas.hide();

        // Remove listeners
        this.removeListeners();
    }

    toggleModule() {
        let modeState = !appGlobals.mode.EDIT_IMAGE;

        this.turnAllModesOff();

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

    }
}