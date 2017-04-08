<?php
/**
 * Created by IntelliJ IDEA.
 * User: peter
 * Date: 23/03/2017
 * Time: 09:47
 */

function wp_az_show_plugin_layout(){
	global $post;

	if ($post->post_type == WP_AZ_ADMIN_NOTES_POST_TYPE
	    || is_page(WP_AZ_TOOL_3D_BODY_POST_ID)
	    || is_page(WP_AZ_NOTES_DASHBOARD_POST_ID)) {

		return true;
	} else {
		return false;
	}
}

function wp_az_get_context(){
	global $post;

	if (is_page(WP_AZ_TOOL_3D_BODY_POST_ID)){
		return WP_AZ_CONTEXT_3D_BODY;
	} else if (is_page(WP_AZ_NOTES_DASHBOARD_POST_ID)){
		return WP_AZ_CONTEXT_NOTES_DASHBOARD;
	} else {
		if ($post->post_type == WP_AZ_ADMIN_NOTES_POST_TYPE){
			return WP_AZ_CONTEXT_NOTES_PAGE;
		}
		return false;
	}
}

