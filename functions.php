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

function base64ToImage($base64_string, $output_file) {
	$file = fopen($output_file, "wb");
	$data = explode(',', $base64_string);
	fwrite($file, base64_decode($data[1]));
	fclose($file);
    return $output_file;
 }

/**
 * Save the image on the server.
 */
function wp_az_save_image( $base64_img, $title, $post_id) {

	// Upload dir.
	$upload_dir  = wp_upload_dir();
	$upload_path = str_replace( '/', DIRECTORY_SEPARATOR, $upload_dir['path'] ) . DIRECTORY_SEPARATOR;

	$img             = str_replace( 'data:image/jpeg;base64,', '', $base64_img );
	$img             = str_replace( ' ', '+', $img );
	$decoded         = base64_decode( $img );
	$filename        = $title . '.jpeg';
	$file_type       = 'image/jpeg';
	$hashed_filename = md5( $filename . microtime() ) . '_' . $filename;

	// Save the image in the uploads directory.
	$upload_file = file_put_contents( $upload_path . $hashed_filename, $decoded );

	$attachment = array(
		'post_mime_type' => $file_type,
		'post_title'     => preg_replace( '/\.[^.]+$/', '', basename( $hashed_filename ) ),
		'post_content'   => '',
		'post_status'    => 'inherit',
		'guid'           => $upload_dir['url'] . '/' . basename( $hashed_filename )
	);

	$attach_id = wp_insert_attachment( $attachment, $upload_dir['path'] . '/' . $hashed_filename, $post_id);

	// Make sure that this file is included, as wp_generate_attachment_metadata() depends on it.
	require_once( ABSPATH . 'wp-admin/includes/image.php' );

	// Generate the metadata for the attachment, and update the database record.
	$attach_data = wp_generate_attachment_metadata( $attach_id, $upload_dir['path'] . '/' . $hashed_filename );

	wp_update_attachment_metadata( $attach_id, $attach_data );


}

