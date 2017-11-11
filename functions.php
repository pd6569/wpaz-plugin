<?php
/**
 * Created by IntelliJ IDEA.
 * User: peter
 * Date: 23/03/2017
 * Time: 09:47
 */

//TODO: BUG: rename images uploaded with characters that are incompatible with filename

function wp_az_show_plugin_layout(){

	global $post;
	global $wp_az_notes_dashboard_id;
	global $wp_az_3d_body_id;

	if (!is_admin()){
		if ($post->post_type == WP_AZ_ADMIN_NOTES_POST_TYPE
		    || $post->post_type == WP_AZ_USER_NOTES_POST_TYPE
		    || is_page($wp_az_notes_dashboard_id)
		    || is_page($wp_az_3d_body_id)) {

			return true;
		} else {
			return false;
		}
	}
	return false;
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
function wp_az_save_image( $base64_img, $title, $desc, $caption, $post_id) {

	$userId = wp_get_current_user()->ID;

	// Upload dir.
	$upload_path = str_replace( '/', DIRECTORY_SEPARATOR, WP_AZ_MEDIA_DIR . DIRECTORY_SEPARATOR . $userId) . DIRECTORY_SEPARATOR;
	$user_media_dir = WP_AZ_MEDIA_DIR . '/' . $userId;


	$img             = str_replace( 'data:image/jpeg;base64,', '', $base64_img );
	$img             = str_replace( ' ', '+', $img );
	$decoded         = base64_decode( $img );
	$filename        = $title . '.jpeg';
	$file_type       = 'image/jpeg';
	$hashed_filename = md5( $filename . microtime() ) . '_' . $filename;

	// Check if az media directory exists
	if (!file_exists($user_media_dir)) {
		mkdir($user_media_dir, 0777, true);
	}

	// Upload file
	$upload_file = file_put_contents( $upload_path . $hashed_filename, $decoded );

	$attachment = array(
		'post_mime_type' => $file_type,
		'post_title'     => preg_replace( '/\.[^.]+$/', '', basename( $hashed_filename ) ),
		'post_content'   => $desc,
		'post_excerpt'   => $caption,
		'post_status'    => 'inherit',
		'guid'           => WP_AZ_MEDIA_URL . '/' .$userId . '/' . basename( $hashed_filename )
	);

	$attach_id = wp_insert_attachment( $attachment, $user_media_dir . '/' . $hashed_filename, $post_id);

	// Make sure that this file is included, as wp_generate_attachment_metadata() depends on it.
	require_once( ABSPATH . 'wp-admin/includes/image.php' );

	// Generate the metadata for the attachment, and update the database record.
	$attach_data = wp_generate_attachment_metadata( $attach_id, $user_media_dir . '/' . $hashed_filename );

	wp_update_attachment_metadata( $attach_id, $attach_data );

	return $attach_id;

}

/***
 *
 * Verifies if base64 data URL is an image.
 *
 * @param $base64 {String} base64 encoded image
 *
 * @return bool
 *
 */
function wp_az_check_base64_image($base64) {
	$img = imagecreatefromstring(base64_decode($base64));
	if (!$img) {
		return false;
	}

	imagejpeg($img, 'tmp.jpg');
	$info = getimagesize('tmp.jpg');

	unlink('tmp.jpg');

	if ($info[0] > 0 && $info[1] > 0 && $info['mime']) {
		return true;
	}

	return false;
}

if ( ! function_exists('write_log')) {
	function write_log ( $log )  {
		if ( is_array( $log ) || is_object( $log ) ) {
			error_log( print_r( $log, true ) );
		} else {
			error_log( $log );
		}
	}
}


