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
        let $modalBtn1 = $modalAlert.find('#modal-btn-1');
        let $modalBtn2 = $modalAlert.find('#modal-btn-2');

        // Set default text, remove existing event listeners
        $modalTitle.text("");
        $modalBody.empty();
        $modalImageProps.addClass('hidden');
        $modalAnnotations.addClass('hidden');
        $modalError.empty();
        $modalBtn1.off();
        $modalBtn2.off();
        $modalBtn1.text("Cancel");
        $modalBtn2.text("OK");
    }

    /**
     *
     * @param modalObj Object with properties: title - title text, body - html body text, btn1 - text on button 1,
     *                                          btn2- text on button 2
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
}
