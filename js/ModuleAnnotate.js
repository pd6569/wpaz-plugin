/**
 * Created by peter on 03/05/2017.
 */

class ModuleAnnotate extends NotesModule {

    init(){

        this.toggleModule();
    }

    enableModule(){
        
        // disable conflicting modules
        if (appGlobals.modulesLoaded[appGlobals.modules.IMAGE_MODULE]){
            appGlobals.modulesLoaded[appGlobals.modules.IMAGE_MODULE].disableModule();
            appGlobals.mode.EDIT_IMAGE = false;
        }

        this.$canvas.show();
        this.app.$annotateModelBtn.css("background-color", "#337ab7");
        this.app.$modeInfo
            .removeClass('hidden')
            .show()
            .text("ANNOTATE MODE");

        // Set listeners
        this.setCanvasListeners();
    }

    disableModule() {
        this.$canvas.hide();
        this.app.$annotateModelBtn.css("background-color", "");
        this.app.$modeInfo.hide();
        
        // Remove listeners
        this.removeCanvasListeners();

    }

    toggleModule(){

        let modeState = !appGlobals.mode.ANNOTATE;

        appGlobals.mode.ANNOTATE = modeState;

        if (modeState) {
            this.enableModule();
        } else {
            this.disableModule();
        }

    }

    /*removeListeners() {

        let listenerKeys = Object.keys(this.listeners);
        if (listenerKeys.length > 0){
            for (let listenerKey of listenerKeys) {
                this.canvas.removeEventListener('click', this.listeners[listenerKey]);
            }
        }
        this.listeners = {};
    }*/

    setCanvasListeners(){

        let app = this.app;

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


        this.canvas.addEventListener('click', createAnnotation);
        this.canvasListeners['CREATE_ANNOTATION'] = createAnnotation;

    }

}