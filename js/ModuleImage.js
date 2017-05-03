/**
 * Created by peter on 03/05/2017.
 */

class ModuleImage {

    constructor(){
        appGlobals.modulesLoaded[appGlobals.modules.IMAGE_MODULE] = this;
        console.log("Image Module created");

        this.load();
    }

    load() {
        console.log("Load image module");
    }
}