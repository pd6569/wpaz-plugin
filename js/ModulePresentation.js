/**
 * Created by Peter on 15/05/2017.
 */

import appGlobals from './globals'
import Utils from './Utils'
import BaseModule from './BaseModule'

export default class ModulePresentation extends BaseModule {

    init() {
        console.log("Presentation module init");
        this.enableModule();
    }

    enableModule () {
        console.log(this.moduleName + " enabled");
        appGlobals.mode.PRESENTATION = true;
        this.setPresentationOverlay();
        this.setListeners();
    }

    disableModule () {
        console.log(this.moduleName + " disabled");
        appGlobals.mode.PRESENTATION = false;
        this.removePresentationOverlay();

    }

    toggleModule() {}

    setPresentationOverlay(){
        console.log("setPresentationOverlay");

        this.$presentationOverlay = jQuery(
            '<div id="presentation-overlay">\
			</div>');

        jQuery('body').append(this.$presentationOverlay);

    }

    removePresentationOverlay(){
        this.$presentationOverlay.remove();
    }

    setListeners(){
        console.log("setListeners");
        jQuery(document).keyup((event) => {
            if (event.keyCode === 27) this.disableModule();
        })
    }

}