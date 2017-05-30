/**
 * Created by Peter on 15/05/2017.
 */

//TODO: SORT OUT WINDOW LISTENERS

import appGlobals from './globals'
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
        console.log("currentAction", appGlobals.currentAction);
        if (appGlobals.currentAction.action_type === appGlobals.actionTypes.IMAGE){
            this.app.doAction(appGlobals.currentAction);
        } else {
            this.app.human.on('human.ready', () => {
                console.log("human ready");
                this.app.doAction(appGlobals.currentAction);
                this.app.setHumanUi();
            });
        }
    }

    disableModule () {
        console.log(this.moduleName + " disabled");
        appGlobals.mode.PRESENTATION = false;
        this.removePresentationOverlay();
        this.removeListeners();

        if (appGlobals.mode.EDIT_IMAGE) {
            let imgModule = appGlobals.modulesLoaded[appGlobals.modules.IMAGE_MODULE];
            imgModule.zoomToFit(imgModule.group.getHeight());
            imgModule.toolbarActions.centerImage();
        }

    }

    toggleModule() {}

    setPresentationOverlay(){
        console.log("setPresentationOverlay");

        this.$presentationOverlay = jQuery(
            '<div id="presentation-overlay">\
                <div id="presentation-toolbar">\
                    <span id="presentation-current-note" class="label label-default presentation-toolbar">Note 1 of 3</span>\
                    <span id="presentation-previous-note" class="glyphicon glyphicon-chevron-down presentation-toolbar-btn presentation-toolbar"></span>\
                    <span id="presentation-next-note" class="glyphicon glyphicon-chevron-up presentation-toolbar-btn presentation-toolbar"></span>\
                    <span id="presentation-current-action" class="label label-default presentation-toolbar">Action 1 of 10</span>\
                    <span id="presentation-previous-action" class="glyphicon glyphicon-chevron-left presentation-toolbar-btn presentation-toolbar"></span>\
                    <span id="presentation-next-action" class="glyphicon glyphicon-chevron-right presentation-toolbar-btn presentation-toolbar"></span>\
                    <span id="exit-presentation" class="glyphicon glyphicon-remove presentation-toolbar-btn presentation-toolbar"></span>\
                    <span id="presentation-toggle-toolbar" class="glyphicon glyphicon-eye-close presentation-toolbar-btn"></span>\
                </div>\
			</div>');
        jQuery('body').append(this.$presentationOverlay);

        // Get DOM elements
        this.$toolbar = this.$presentationOverlay.find('#presentation-toolbar');

        // show/hide toolbar
        this.$hideToolbarBtn = jQuery('#presentation-toggle-toolbar');

        // Toolbar Buttons
        this.$toolbarBtns = this.$presentationOverlay.find('.presentation-toolbar-btn');
        this.$exitBtn = this.$toolbar.find('#exit-presentation');
        this.$previousNoteBtn = this.$toolbar.find('#presentation-previous-note');
        this.$nextNoteBtn = this.$toolbar.find('#presentation-next-note');
        this.$nextActionBtn = this.$toolbar.find('#presentation-next-action');
        this.$previousActionBtn = this.$toolbar.find('#presentation-previous-action');


        // Toolbar labels
        this.$currentNoteLabel = this.$toolbar.find('#presentation-current-note');
        this.$currentActionLabel = this.$toolbar.find('#presentation-current-action');

        this.$currentNoteLabel.text("Note " + appGlobals.currentNote.sequence + " of " + appGlobals.numNotes);
        this.$currentActionLabel.text("Action " + (appGlobals.actions[appGlobals.currentNote.uid].indexOf(appGlobals.currentAction) + 1) + " of " + appGlobals.actions[appGlobals.currentNote.uid].length);

        // Toolbar visibility
        this.toolbarVisible = true;

        if (appGlobals.mode.EDIT_IMAGE) {
            let imgMod =  appGlobals.modulesLoaded[appGlobals.modules.IMAGE_MODULE];
            imgMod.resizeCanvas();
        }

        // Disable scrollbars
        document.body.style.overflow = 'hidden';

        // remove margins from canvas
        jQuery('.myCanvas').css({'margin-left': '0px'});

        this.setWidgetFullScreen();
        this.$presentationOverlay.append(this.app.$iframeContainer);

        // Set toolbar listeners
        this.setToolbarListeners();
    }

    removePresentationOverlay(){

        // Disable scrollbars
        document.body.style.overflow = 'visible';

        this.app.$modelContainer.prepend(this.app.$iframeContainer);

        this.app.$humanWidget.width("100%");
        this.app.$humanWidget.height(600);

        if (appGlobals.mode.EDIT_IMAGE) {
            let editModule = appGlobals.modulesLoaded[appGlobals.modules.IMAGE_MODULE];
            editModule.resizeCanvas();
            editModule.toggleToolbar(true);
        }

        // remove margins from canvas
        jQuery('.myCanvas').css({'margin-left': '2px'});

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
        this.$nextNoteBtn.on('click', () => this.app.navigateNotes('right'));
        this.$previousNoteBtn.on('click', () => this.app.navigateNotes());
        this.$nextActionBtn.on('click', () => this.app.navigateActions('next'));
        this.$previousActionBtn.on('click', () => this.app.navigateActions());
        this.$hideToolbarBtn.on('click', () => {
            let $toolbarDisplay = jQuery('.presentation-toolbar');
            if (this.toolbarVisible){
                this.$hideToolbarBtn.removeClass('glyphicon-eye-close');
                this.$hideToolbarBtn.addClass('glyphicon-eye-open');
                $toolbarDisplay.hide();
                this.toolbarVisible = false;
            } else {
                this.$hideToolbarBtn.removeClass('glyphicon-eye-open');
                this.$hideToolbarBtn.addClass('glyphicon-eye-close');
                $toolbarDisplay.show();
                this.toolbarVisible = true;
            }
        })
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
                if (event.keyCode === 27) {
                    console.log("exit presentation mode");
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