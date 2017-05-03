/**
 * Created by peter on 03/05/2017.
 */

class ModuleImage extends NotesModule {

    init() {
        console.log("init: " + this.moduleName);

        // Get refs to canvas
        this.$canvas = this.app.$canvas;
        this.canvas = this.app.canvas;

        // Get module data
        this.imgSrc = this.moduleData.imgSrc;

        this.toggleModule();
    }

    enableModule(){

        // Enable canvas
        this.$canvas.show();
    }

    disableModule() {

        // Disable canvas
        this.$canvas.hide();
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
}