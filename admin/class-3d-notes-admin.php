<?php
/**
 * Created by IntelliJ IDEA.
 * User: peter
 * Date: 25/04/2017
 * Time: 10:43
 */

class wp_az_3d_notes_admin {

	public function __construct() {

		$this->set_admin_hooks();
	}


	public function set_admin_hooks() {
		add_action('add_meta_boxes', array($this,'remove_metaboxes'));
		add_action( 'save_post', array($this, 'add_post_excerpt'));
	}

	public function remove_metaboxes() {
		remove_meta_box('wpseo_meta', WP_AZ_USER_NOTES_POST_TYPE, 'normal');
		remove_meta_box('wpseo_meta', WP_AZ_ADMIN_NOTES_POST_TYPE, 'normal');
	}

	/***
	 *
	 * Automatically add post excerpt to 3d notes or user notes
	 *
	 * @param $post_id
	 */
	public function add_post_excerpt($post_id) {

		if (get_post_type($post_id) == WP_AZ_ADMIN_NOTES_POST_TYPE || get_post_type($post_id) == WP_AZ_USER_NOTES_POST_TYPE){

			error_log("add_post_excerpt");

			$post_title = get_the_title($post_id);

			$excerpt = "Interactive 3D anatomy notes";
			if ($post_title) {
				$excerpt .= " for " . $post_title;
			}

			// un-hook this function to avoid infinite loop
			remove_action( 'save_post', array($this, 'add_post_excerpt') );

			// update the post, which calls save_post again
			wp_update_post( array( 'ID' => $post_id, 'post_excerpt' => $excerpt ) );

			// re-hook this function
			add_action( 'save_post', array($this, 'add_post_excerpt'));

		}

	}

}