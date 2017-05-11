/**
 * Created by peter on 03/05/2017.
 */

"use strict";

class BaseModule {
    
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

    init() {
        console.log("init called from super class");
    }

    enableModule () {
        console.log(this.moduleName + " enabled");
    }

    disableModule () {
        console.log(this.moduleName + " disabled");
    }

    toggleModule() {}

    /****
     *
     * Update app state with current mode
     *
     * @param modeName {String} Name of mode specified in appGlobals.mode
     */

    setMode(modeName) {

        let modes = Object.keys(appGlobals.mode);
        for (let mode of modes){
            modeName === mode ? appGlobals.mode[mode] = true : appGlobals.mode[mode] = false;
        }
    }


    /****
     *
     * Turn off all modes
     *
     */
    static turnAllModesOff() {

        let modes = Object.keys(appGlobals.mode);
        for (let mode of modes){
            appGlobals.mode[mode] = false;
            if (mode === 'ANNOTATE') {
                if (appGlobals.modulesLoaded[appGlobals.modules.ANNOTATE_MODULE]){
                    appGlobals.modulesLoaded[appGlobals.modules.ANNOTATE_MODULE].disableModule();
                }
            } else if (mode === 'EDIT_IMAGE'){
                if (appGlobals.modulesLoaded[appGlobals.modules.IMAGE_MODULE]){
                    appGlobals.modulesLoaded[appGlobals.modules.IMAGE_MODULE].disableModule();
                }
            }

        }
    }
}