<?php
/**
 * Created by IntelliJ IDEA.
 * User: peter
 * Date: 23/03/2017
 * Time: 09:47
 */

function wp_az_return_output($file){
	ob_start();
	include $file;
	return ob_get_clean();
}
