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
        this.setListeners();

        this.setPresentationOverlay();
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

        this.setWidgetFullScreen();
        this.$presentationOverlay.append(this.app.$iframeContainer);
    }

    removePresentationOverlay(){
        this.app.$humanWidget.width("100%");
        this.app.$humanWidget.height(600);
        this.app.$modelContainer.prepend(this.app.$iframeContainer);
        this.$presentationOverlay.remove();
    }

    setListeners(){
        console.log("setListeners");

        jQuery(document).keyup((event) => {
            console.log("disable presentation module");
            if (event.keyCode === 27) this.disableModule();
        });

        jQuery(window).off();
        jQuery(window).on('resize', (event) =>{
            this.setWidgetFullScreen();
        })
    }

    setWidgetFullScreen(){
        let viewportHeight = jQuery(window).height();
        let viewPortWidth = jQuery(window).width();

        this.app.$humanWidget.width(viewPortWidth);
        this.app.$humanWidget.height(viewportHeight);
    }


}