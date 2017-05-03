/**
 * Created by peter on 03/05/2017.
 */

class NotesModule {
    
    constructor(moduleName, moduleData = {}){

        console.log("New module: " + moduleName + " Data: " + moduleData);

        appGlobals.modulesLoaded[moduleName] = this;

        // App reference
        this.app = appGlobals.appRef;

        // Module Properties
        this.moduleName = moduleName;
        this.moduleData = moduleData;

        this.init();
    }

    init() {}

    enableModule () {
        console.log(this.moduleName + " enabled");
    }

    disableModule () {
        console.log(this.moduleName + " disabled");
    }

    toggleModule() {}

    /****
     *
     * @param modeName {String} Name of mode specified in appGlobals.mode
     */

    setMode(modeName) {

        let modes = Object.keys(appGlobals.mode);
        for (let mode of modes){
            modeName === mode ? appGlobals.mode[mode] = true : appGlobals.mode[mode] = false;
        }
    }

    turnAllModesOff() {

        let modes = Object.keys(appGlobals.mode);
        for (let mode of modes){
            appGlobals.mode[mode] = false;
        }
    }
}