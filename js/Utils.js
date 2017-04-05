/**
 * Created by peter on 25/03/2017.
 */

class Utils {

    constructor () {

    }

    static showLoading($appendToElement) {
        let html =
            "<div class='wpaz-spinner'>" +
                "<div class='double-bounce1'>" +
                "</div>" +
                "<div class='double-bounce2'>" +
                "</div>" +
            "</div>";
        $appendToElement.append(html);
    }

    static hideLoading(){
        jQuery('.wpaz-spinner').addClass('hidden');
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
        let $modalBody = $modalAlert.find('.modal-body');
        let $modalBtn1 = $modalAlert.find('#modal-btn-1');
        let $modalBtn2 = $modalAlert.find('#modal-btn-2');

        // Set default text, remove existing event listeners
        $modalTitle.text("");
        $modalBody.empty();
        $modalBtn1.off();
        $modalBtn2.off();
        $modalBtn1.text("Cancel");
        $modalBtn2.text("OK");
    }

    /**
     *
     * @param modalObj Object with properties: title - title text, body - html body text, btn1text - text on button 1,
     *                                          btn2text - text on button 2, btn1click - function for button 1,
     *                                          btn2click - function for button 2
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
}
