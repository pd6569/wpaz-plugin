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
}
