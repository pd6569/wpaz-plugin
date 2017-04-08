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
	    || $post->post_type == WP_AZ_USER_NOTES_POST_TYPE
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

function wp_az_get_user_role(){
	if (!is_user_logged_in()){
		return 'logged_out';
	} else {
		if (current_user_can('administrator')){
			return 'administrator';
		} else if (current_user_can('access_s2member_level2')) {
			return 's2_member_level2';
		} else if (current_user_can('access_s2member_level1')) {
			return 's2_member_level1';
		} else if (current_user_can('subscriber')){
			return 'subscriber';
		}
	}
}

function wp_az_user_can_edit_notes(){

	global $post;
	global $wp_az_notes_dashboard_id;

	if (current_user_can('access_s2member_level2') && $post->post_author == get_current_user_id()
	    || current_user_can('access_s2member_level2') && is_page($wp_az_notes_dashboard_id)
	    || current_user_can('administrator')) {

		return true;
	}

	return false;
}

