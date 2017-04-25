/**
 * Created by peter on 25/03/2017.
 */

class Utils {

    constructor () {

    }

    static showLoading() {
        jQuery('.wpaz-loading-container').removeClass('hidden');
    }

    static hideLoading(){
        jQuery('.wpaz-loading-container').addClass('hidden');
    }

    static setNoteUpdateStatus(statusText, timeoutMillis){
        let $updateStatus = jQuery('.update-status');
        $updateStatus.text(statusText).removeClass('hidden').show();

        if (timeoutMillis){
            setTimeout(() => {
                $updateStatus.fadeOut();
            }, timeoutMillis)
        }

    }

    static updateActionStatusBox(statusText, timeoutMillis = 3000){
        console.log("updateActionStatusBox");
        let $actionStatusBox = jQuery('#action-status-box');
        $actionStatusBox
            .empty()
            .append(statusText)
            .hide()
            .removeClass('hidden')
            .fadeIn();

        if (timeoutMillis){
            setTimeout(() => {
                $actionStatusBox.fadeOut();
            }, timeoutMillis)
        }
    }

    static generateUID() {
        let firstPart = (Math.random() * 46656) | 0;
        let secondPart = (Math.random() * 46656) | 0;
        firstPart = ("000" + firstPart.toString(36)).slice(-3);
        secondPart = ("000" + secondPart.toString(36)).slice(-3);
        return firstPart + secondPart;
    }

    static compare(a, b){
        if (parseInt(a.action_order) < parseInt(b.action_order))
            return -1;
        if (parseInt(a.action_order) > parseInt(b.action_order))
            return 1;
        return 0;
    }

    static resetModal(){
        let $modalAlert = jQuery('#wpaz-modal-alert');
        let $modalTitle = $modalAlert.find('.modal-title');
        let $modalError = $modalAlert.find('.modal-error p');
        let $modalBody = $modalAlert.find('.modal-body');
        let $modalImageProps = $modalAlert.find('.modal-image-properties');
        let $modalAnnotations = $modalAlert.find('.modal-annotations');
        let $modalActions = $modalAlert.find('.modal-actions');
        let $modalBtn1 = $modalAlert.find('#modal-btn-1');
        let $modalBtn2 = $modalAlert.find('#modal-btn-2');
        let $modalDeleteBtn = $modalAlert.find('#modal-btn-delete');

        // Set default text, remove existing event listeners
        $modalTitle.text("");
        $modalBody.empty();
        $modalImageProps.addClass('hidden');
        $modalAnnotations.addClass('hidden');
        $modalActions.addClass('hidden');
        $modalError.empty();
        $modalBtn1.off();
        $modalBtn2.off();
        $modalBtn1.text("Cancel");
        $modalBtn2.text("OK");
        $modalDeleteBtn.addClass('hidden');
        $modalDeleteBtn.off();
    }

    /**
     *
     * @param modalObj Object. Properties:
     *                         title - title text
     *                         body - html body text
     *                         btn1 - text on button 1,
     *                         btn2- text on button 2
     */
    static showModal(modalObj){
        let $modalAlert = jQuery('#wpaz-modal-alert');
        let $modalTitle = $modalAlert.find('.modal-title');
        let $modalBody = $modalAlert.find('.modal-body');
        let $modalBtn1 = $modalAlert.find('#modal-btn-1');
        let $modalBtn2 = $modalAlert.find('#modal-btn-2');

        $modalTitle.text(modalObj.title);
        $modalBody.html(modalObj.body);
        modalObj.btn1 ? $modalBtn1.text(modalObj.btn1) : $modalBtn1.text("Cancel");
        modalObj.btn2 ? $modalBtn1.text(modalObj.btn2) : $modalBtn2.text("OK");

        $modalAlert.modal('show');
    }

    static resetAppState(){

        appGlobals.post_id = 0;
        appGlobals.notes = {};
        appGlobals.sequenceIndex = [];
        appGlobals.numNotes = 0;
        appGlobals.actions = {};
        appGlobals.firstSceneUrl = appGlobals.scenePresets.head.bone;
        appGlobals.currentNote = {};
        appGlobals.notesLoaded = false;
        appGlobals.humanLoaded = false;
        appGlobals.actions = {};
        appGlobals.currentAction = {};

    }

    static capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    /****
     *
     * @param tabToActivate. (String) 'MY_NOTES', 'NOTE_EDITOR'
     */
    static setActiveTab(tabToActivate){

        console.log("setActiveTab" + tabToActivate);

        // Get ref to layouts
        let $noteEditor = jQuery('#wpaz-main-layout');
        let $myNotes = jQuery('#wpaz-my-notes');

        // Ref to tabs
        let $tabs = jQuery('.toolbar-tab');
        let $noteEditorTab = jQuery('#toolbar-active-note');
        let $myNotesTab = jQuery('#toolbar-my-notes');

        // hide current tab

        $tabs.removeClass('active');
        if (appGlobals.currentTab == appGlobals.tabs.NOTE_EDITOR) {
            $noteEditor.fadeOut(() => { showTab() });

        } else if (appGlobals.currentTab == appGlobals.tabs.MY_NOTES) {
            $myNotes.fadeOut(() => { showTab() });

        } else {
            console.log("Could not find active tab");
            return;
        }

        // show new tab
        function showTab(){
            if (tabToActivate === appGlobals.tabs.NOTE_EDITOR) {
                $noteEditor.fadeIn();
                $noteEditorTab.addClass('active');
            } else if (tabToActivate === appGlobals.tabs.MY_NOTES) {
                $myNotes.fadeIn();
                $myNotes.addClass('active');
            }

            // Set current tab
            appGlobals.currentTab = tabToActivate;
        }

    }
}
