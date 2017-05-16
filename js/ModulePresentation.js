/**
 * Created by Peter on 15/05/2017.
 */

//TODO: SORT OUT WINDOW LISTENERS

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

        this.app.human = new HumanAPI("embedded-human");
        this.app.human.on('human.ready', () => {
            console.log("human ready");
            this.app.doAction(appGlobals.currentAction);
        });
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
                <div id="presentation-toolbar">\
                    <span class="glyphicon glyphicon-remove pull-right"></span>\
                </div>\
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

        let _this = this;
        this.windowListeners = {

            "resize": function () {
                console.log("resize presentation module");
                _this.setWidgetFullScreen();
            },
            "keyboardShortcuts": function(event) {
                console.log("disable presentation module");
                if (event.keyCode === 27) {
                    _this.disableModule();
                }
            }
        };

        jQuery(document).keyup((event) => this.windowListeners.keyboardShortcuts(event));

        jQuery(window).on('resize', () => this.windowListeners.resize());
    }

    setWidgetFullScreen(){
        let viewportHeight = jQuery(window).height();
        let viewPortWidth = jQuery(window).width();

        this.app.$humanWidget.width(viewPortWidth);
        this.app.$humanWidget.height(viewportHeight);
    }


}