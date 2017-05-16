/**
 * Created by peter on 03/05/2017.
 */

"use strict";

import appGlobals from './globals';

export default class BaseModule {
    
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
     * @param {object} excludeModes  - Associative array of modes to remain ON;
     */
    static turnAllModesOff(excludeModes) {

        console.log("turnAllModesOff");

        let modes = Object.keys(appGlobals.mode);
        for (let mode of modes){

            if (mode === 'ANNOTATE' && !excludeModes.ANNOTATE) {
                console.log("disable annotate mode");
                if (appGlobals.modulesLoaded[appGlobals.modules.ANNOTATE_MODULE]){
                    appGlobals.modulesLoaded[appGlobals.modules.ANNOTATE_MODULE].disableModule();
                }
            } else if (mode === 'EDIT_IMAGE' && !excludeModes.EDIT_IMAGE){
                console.log("disable edit image mode");
                if (appGlobals.modulesLoaded[appGlobals.modules.IMAGE_MODULE]){
                    appGlobals.modulesLoaded[appGlobals.modules.IMAGE_MODULE].disableModule();
                }
            } else if (mode === 'PRESENTATION_MODE' && !excludeModes.PRESENTATION) {
                console.log("disable presentation mode");
                if (appGlobals.modulesLoaded[appGlobals.modules.PRESENTATION_MODULE]) {
                    appGlobals.modulesLoaded[appGlobals.modules.PRESENTATION_MODULE].disableModule();
                }
            }
        }

    }
}