<?php
/**
 * Created by IntelliJ IDEA.
 * User: peter
 * Date: 23/03/2017
 * Time: 09:47
 */

function wp_az_show_plugin_layout(){
	global $post;
	global $wp_az_notes_dashboard_id;
	global $wp_az_3d_body_id;

	if ($post->post_type == WP_AZ_ADMIN_NOTES_POST_TYPE
	    || is_page($wp_az_notes_dashboard_id)
	    || is_page($wp_az_3d_body_id)) {

		return true;
	} else {
		return false;
	}
}

function wp_az_get_context(){
	global $post;
	global $wp_az_notes_dashboard_id;
	global $wp_az_3d_body_id;

	if (is_page($wp_az_3d_body_id)){
		return WP_AZ_CONTEXT_3D_BODY;
	} else if (is_page($wp_az_notes_dashboard_id)){
		return WP_AZ_CONTEXT_NOTES_DASHBOARD;
	} else {
		if ($post->post_type == WP_AZ_ADMIN_NOTES_POST_TYPE){
			return WP_AZ_CONTEXT_NOTES_PAGE;
		}
		return false;
	}
}

