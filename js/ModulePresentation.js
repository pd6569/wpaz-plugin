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
        this.removeListeners();

    }

    toggleModule() {}

    setPresentationOverlay(){
        console.log("setPresentationOverlay");

        this.$presentationOverlay = jQuery(
            '<div id="presentation-overlay">\
                <div id="presentation-toolbar">\
                    <span id="exit-presentation" class="glyphicon glyphicon-remove presentation-toolbar-btn"></span>\
                </div>\
			</div>');
        jQuery('body').append(this.$presentationOverlay);

        // Get DOM elements
        this.$toolbar = this.$presentationOverlay.find('#presentation-toolbar');
        this.$toolbarBtns = this.$presentationOverlay.find('.presentation-toolbar-btn');
        this.$exitBtn = this.$toolbar.find('#exit-presentation');

        // Set toolbar listeners
        this.setToolbarListeners();

        this.setWidgetFullScreen();
        this.$presentationOverlay.append(this.app.$iframeContainer);
    }

    removePresentationOverlay(){
        this.app.$humanWidget.width("100%");
        this.app.$humanWidget.height(600);
        this.app.$modelContainer.prepend(this.app.$iframeContainer);
        this.$presentationOverlay.remove();
    }

    setToolbarListeners() {

        let _this = this;

        this.toolbarListeners = {
            "exit": function() {
                _this.disableModule();
            }
        };

        this.$exitBtn.on('click', () => this.toolbarListeners.exit());
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

        jQuery(window).keyup(this.windowListeners.keyboardShortcuts);

        jQuery(window).on('resize', this.windowListeners.resize);
    }

    removeListeners() {
        console.log("removeListeners");

        // Toolbar
        this.$toolbarBtns.off();

        // Window
        jQuery(window).unbind('resize', this.windowListeners.resize);
    }

    setWidgetFullScreen(){
        let viewportHeight = jQuery(window).height();
        let viewPortWidth = jQuery(window).width();

        this.app.$humanWidget.width(viewPortWidth);
        this.app.$humanWidget.height(viewportHeight);
    }


}