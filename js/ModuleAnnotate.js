/**
 * Created by peter on 03/05/2017.
 */

class ModuleAnnotate extends BaseModule {

    init(){
        console.log("init");

        // DOM ref

        // Canvas reference
        this.$annotationCanvas = this.app.$annotationCanvas;
        this.annotationCanvas = this.app.annotationCanvas;
        this.annotationCanvasCtx = this.app.annotationCanvasCtx;

        // Module state
        this.listenersSet = false;

        this.toggleModule();
    }

    enableModule(){
        console.log("enableModule");
        appGlobals.mode.ANNOTATE = true;

        // disable conflicting modules
        if (appGlobals.modulesLoaded[appGlobals.modules.IMAGE_MODULE]){
            appGlobals.modulesLoaded[appGlobals.modules.IMAGE_MODULE].disableModule();
            appGlobals.mode.EDIT_IMAGE = false;
        }

        // Setup canvas
        this.annotationCanvas.width = this.app.$humanWidget.width();
        this.annotationCanvas.height = this.app.$humanWidget.height();
        this.$annotationCanvas.show();

        // Set UI
        this.setUi(true);

        // Set listeners
        if (!this.listenersSet) this.setListeners();
    }

    disableModule() {
        appGlobals.mode.ANNOTATE = false;

        // Unset canvas and UI
        this.$annotationCanvas.hide();
        this.setUi(false);

    }

    toggleModule(){
        console.log("toggleModule");

        let modeState = !appGlobals.mode.ANNOTATE;

        appGlobals.mode.ANNOTATE = modeState;

        if (modeState) {
            this.enableModule();
        } else {
            this.disableModule();
        }

    }

    setUi(enable){
        if (enable){
            this.app.$annotateModelBtn.css("background-color", "#337ab7");
            this.app.$modeInfo
                .removeClass('hidden')
                .show()
                .text("ANNOTATE MODE");
        } else {
            this.app.$annotateModelBtn.css("background-color", "");
            this.app.$modeInfo.hide();
        }
    }

    setListeners(){

        console.log("setListeners");

        let app = this.app;
        let annotationCanvas = this.annotationCanvas;

        function createAnnotation(event) {
            console.log("canvas clicked");
            let canvasX = event.offsetX;
            let canvasY = event.offsetY;

            app.human.send('scene.pick', {
                x: canvasX,
                y: canvasY,
            }, (pickInfo) => {
                console.log("Picked: ", pickInfo);

                let objectId = pickInfo.objectId;
                let pos3d = [];
                pos3d['x'] = pickInfo.position.x;
                pos3d['y'] = pickInfo.position.y;
                pos3d['z'] = pickInfo.position.z;

                let posObj = pickInfo.position;

                console.log("position: ", pickInfo.position);

                app.human.send('annotations.create', {
                    title: "",
                    description: "",
                    objectId: pickInfo.objectId,
                    position: [pickInfo.position.x, pickInfo.position.y, pickInfo.position.z]
                }, (newAnnotation) => {
                    console.log("New annotation created: " + JSON.stringify(newAnnotation));
                    newAnnotation.isNewAnnotation = true; // if cancel clicked on modal, annotation will be deleted
                    app.showModal('annotations', newAnnotation);

                })
            });
        }

        function resizeCanvas(){
            if (appGlobals.mode.ANNOTATE){
                console.log("resize annotations canvas");
                annotationCanvas.width = app.$humanWidget.width();
                annotationCanvas.height = app.$humanWidget.height();
            }
        }

        this.annotationCanvas.addEventListener('click', createAnnotation);

        // Resize canvas to window
        window.addEventListener('resize', resizeCanvas);

        this.listenersSet = true;
    }

}