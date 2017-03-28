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

}
