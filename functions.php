<?php
/**
 * Created by IntelliJ IDEA.
 * User: peter
 * Date: 23/03/2017
 * Time: 09:47
 */

function wp_az_show_plugin_layout(){
	global $post;

	if ($post->post_type == '3d-tours'
	    || is_page(WP_AZ_TOOL_3D_BODY_POST_ID)
	    || is_page(WP_AZ_NOTES_DASHBOARD_POST_ID)) {

		return true;
	} else {
		return false;
	}
}

