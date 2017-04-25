<?php
/*
Plugin Name: AnatomyZone 3D Notes Plugin
Plugin URI:  https://anatomyzone.com
Description: Interactive 3D anatomy notes
Version:     1.0.0
Author:      Peter de Souza
Author URI:  http://www.anatomyzone.com
License:     GPL2
License URI: https://www.gnu.org/licenses/gpl-2.0.html
*/

//TODO: update AJAX json responses
//TODO: switch to REST api where possible
//TODO: BUG. if post excerpt is not set, then wp editor does not load properly

// Exit if accessed directly
if (!defined( 'ABSPATH')) {
	exit;
}

define('WP_AZ_PLUGIN_DIR', untrailingslashit(plugin_dir_path(__FILE__)));
define('WP_AZ_PLUGIN_URL', plugin_dir_url(__FILE__));
define('WP_AZ_PLUGIN_FILE', __FILE__);
define('WP_AZ_PLUGIN_BASENAME', plugin_basename(__FILE__));
define('WP_AZ_VERSION', 1.0);

# templates
define('TMPL_URL_LAYOUT_3D_NOTES', WP_AZ_PLUGIN_DIR . "/templates/layout_3d_notes.php");
define('TMPL_URL_ITEM_NOTE_SECTION', WP_AZ_PLUGIN_DIR . "/templates/item_note_section.php");

# App contexts
define('WP_AZ_CONTEXT_NOTES_PAGE', 'NOTES_PAGE');
define('WP_AZ_CONTEXT_3D_BODY', '3D_BODY');
define('WP_AZ_CONTEXT_NOTES_DASHBOARD', 'NOTES_DASHBOARD');

# Post types
define('WP_AZ_ADMIN_NOTES_POST_TYPE', '3d-notes');
define('WP_AZ_USER_NOTES_POST_TYPE', 'user-notes');


require_once ( WP_AZ_PLUGIN_DIR . '/functions.php');
require_once ( WP_AZ_PLUGIN_DIR . '/templates.php');
require_once ( WP_AZ_PLUGIN_DIR . '/inc/class_notes_editor.php');

// Database
$wp_az_db_version = '1.0';

// Static page Id
global $wp_az_3d_body_id;
global $wp_az_notes_dashboard_id;

class wp_az_3d_notes {

	public function __construct() {

		$this->hooks();

		// generate item templates
		wp_az_generate_item_templates();

	}
	
	public function hooks(){
		add_action('init', array($this,'register_3d_notes')); //register admin notes post type
		add_action('init', array($this,'register_user_notes')); //register user notes post type
		add_action('init', array($this, 'set_globals_from_options'));
		add_action('init', array($this, 'setup_notes_editor'));
		add_action('admin_enqueue_scripts', array($this,'enqueueAdmin'));
		add_action('wp_enqueue_scripts', array($this,'enqueue'), 50); // ensure styles are enqueued AFTER theme!
		add_filter('the_content', array($this, 'set_content'));
		
		// Ajax hooks logged in users
		add_action('wp_ajax_save_notes', array($this, 'save_notes' ));
		add_action('wp_ajax_load_notes', array($this, 'load_notes'));
		add_action('wp_ajax_load_single_note', array($this, 'load_single_note'));
		add_action('wp_ajax_send_item_templates', array($this, 'send_item_templates'));
		add_action('wp_ajax_delete_note', array($this, 'delete_note'));
		add_action('wp_ajax_update_first_scene_url', array($this, 'update_first_scene_url'));
		add_action('wp_ajax_update_post_title', array($this, 'update_post_title'));
		add_action('wp_ajax_upload_snapshot', array($this, 'upload_snapshot'));

		// AJAX for logged out users
		add_action('wp_ajax_nopriv_load_notes', array($this, 'load_notes'));
		add_action('wp_ajax_nopriv_send_item_templates', array($this, 'send_item_templates'));

		register_activation_hook(__FILE__, array($this, 'plugin_activate'));
		register_deactivation_hook(__FILE__, array($this, 'plugin_deactivate'));
	}

	public function set_content($content){

		global $layout_template_names;

		if (wp_az_show_plugin_layout()){

			$content = wp_az_get_template_html($layout_template_names['3D_NOTES']);

		}

		return $content;
	}

	// INIT

	public function register_3d_notes(){

		// Labels for post type
		$labels = array(
			'name'               => '3D Notes',
			'singular_name'      => '3D Note',
			'menu_name'          => '3D Notes',
			'name_admin_bar'     => '3D Note',
			'add_new'            => 'Add New',
			'add_new_item'       => 'Add New 3D Note',
			'new_item'           => 'New 3D Note',
			'edit_item'          => 'Edit 3D Note',
			'view_item'          => 'View 3D Note',
			'all_items'          => 'All 3D Notes',
			'search_items'       => 'Search 3D Notes',
			'parent_item_colon'  => 'Parent 3D Note:',
			'not_found'          => 'No 3D Notes found.',
			'not_found_in_trash' => 'No 3D Notes found in Trash.',
		);

		// arguments for post type
		$args = array(
			'labels'            => $labels,
			'public'            => true,
			'show_in_rest'      => true,
			'publicly_queryable'=> true,
			'show_ui'           => true,
			'map_meta_cap'      => true,
			'show_in_nav'       => true,
			'query_var'         => true,
			'hierarchical'      => false,
			'supports'          => array('title','thumbnail','editor', 'excerpt'),
			'has_archive'       => true,
			'menu_position'     => 20,
			'show_in_admin_bar' => true,
			'menu_icon'         => 'dashicons-location-alt',
			'rewrite'           => array('slug' => WP_AZ_ADMIN_NOTES_POST_TYPE, 'with_front' => 'true'),
			'capability_type'   => WP_AZ_ADMIN_NOTES_POST_TYPE
		);

		// register post type
		register_post_type(WP_AZ_ADMIN_NOTES_POST_TYPE, $args);

	}

	public function register_user_notes(){

		// Labels for post type
		$labels = array(
			'name'               => 'User Notes',
			'singular_name'      => 'User Note',
			'menu_name'          => 'User Notes',
			'name_admin_bar'     => 'User Note',
			'add_new'            => 'Add New',
			'add_new_item'       => 'Add New User Note',
			'new_item'           => 'New User Note',
			'edit_item'          => 'Edit User Note',
			'view_item'          => 'View User Note',
			'all_items'          => 'All User Notes',
			'search_items'       => 'Search User Notes',
			'parent_item_colon'  => 'Parent User Note:',
			'not_found'          => 'No User Notes found.',
			'not_found_in_trash' => 'No User Notes found in Trash.',
		);

		// arguments for post type
		$args = array(
			'labels'            => $labels,
			'public'            => true,
			'show_in_rest'      => true,
			'publicly_queryable'=> true,
			'show_ui'           => true,
			'map_meta_cap'      => true,
			'show_in_nav'       => true,
			'query_var'         => true,
			'hierarchical'      => false,
			'supports'          => array('title','thumbnail','editor', 'excerpt'),
			'has_archive'       => true,
			'menu_position'     => 20,
			'show_in_admin_bar' => true,
			'menu_icon'         => 'dashicons-format-aside',
			'rewrite'           => array('slug' => WP_AZ_USER_NOTES_POST_TYPE, 'with_front' => 'true'),
			'capability_type'   => WP_AZ_USER_NOTES_POST_TYPE
		);

		// register post type
		register_post_type(WP_AZ_USER_NOTES_POST_TYPE, $args);

	}

	public function set_globals_from_options(){
		global $wp_az_notes_dashboard_id;
		global $wp_az_3d_body_id;

		$wp_az_notes_dashboard_id = get_option('wp_az_notes_dashboard_post_id');
		$wp_az_3d_body_id = get_option('wp_az_3d_body_post_id');

	}

	public function setup_notes_editor(){

		$notes_editor = new wpaz_notes_editor();

	}

	//  ENQUEUE SCRIPTS AND STYLES

	public function enqueueAdmin() {

		$screen = get_current_screen();
		if (!($screen->base == 'post' && $screen->post_type == WP_AZ_ADMIN_NOTES_POST_TYPE)) return;

		// enqueue admin scripts

	}

	public function enqueue() {

		global $post;
		global $wp_az_notes_dashboard_id;
		global $item_templates;

		// modify post object here
		if (wp_az_show_plugin_layout()){

			// styles
			wp_enqueue_style('wp_az_bootstrap_style', plugins_url('lib/bootstrap.css', __FILE__));
			wp_enqueue_style('wp_az_swipebox_style', plugins_url('lib/swipebox.css', __FILE__));
			wp_enqueue_style('wp_az_toolbar_style', plugins_url('lib/jquery.toolbar.css', __FILE__));
			wp_enqueue_style('wp_az_main_style', plugins_url('css/styles.css?v=' . time(), __FILE__));

			// scripts
			wp_enqueue_script('wp_az_bootstrap', plugins_url('lib/bootstrap.js', __FILE__), null, null, true);
			wp_enqueue_script('wp_az_swipebox', plugins_url('lib/jquery.swipebox.js', __FILE__), null, null, true);
			wp_enqueue_script('wp_az_toolbar', plugins_url('lib/jquery.toolbar.js', __FILE__), null, null, true);
			wp_enqueue_script('wp_az_biodigital_human', plugins_url('lib/human-api.min.js', __FILE__), null, null, true);
			wp_enqueue_script('wp_az_biodigital_human_components', plugins_url('lib/human-components.js', __FILE__), null, null, true);
			wp_enqueue_script('wp_az_fabric', plugins_url('lib/fabric.js', __FILE__), null, null, true);
			wp_enqueue_script('wp_az_globals', plugins_url('js/globals.js', __FILE__), array('jquery'), '1.0', true);
			wp_enqueue_script('wp_az_note', plugins_url('js/Note.js', __FILE__), array('jquery'), '1.0', true);
			wp_enqueue_script('wp_az_actions', plugins_url('js/Actions.js', __FILE__), array('jquery'), '1.0', true);
			wp_enqueue_script('wp_az_utils', plugins_url('js/Utils.js', __FILE__), array('jquery'), '1.0', true);
			wp_enqueue_script('wp_az_3d_notes_main', plugins_url('js/3dnotes.js', __FILE__), array('jquery'), '1.0', true);


			// sends ajax script to main JS script
			wp_localize_script( 'wp_az_3d_notes_main', 'ajax_object', array(
				'wp_az_root'                => esc_url_raw(rest_url()),
				'wp_az_ajax_url'            => admin_url('admin-ajax.php'),
				'wp_az_3d_notes_nonce'      => wp_create_nonce('wp_az_3d_notes_nonce'),
				'wp_az_nonce'               => wp_create_nonce('wp_rest'),
				'wp_az_post_id'             => $post->ID,
				'wp_az_user_can_edit'       => wp_az_user_can_edit_notes(),
				'wp_az_user_role'           => wp_az_get_user_role(),
				'wp_az_item_templates'      => $item_templates['NOTE_SECTION'],
				'wp_az_current_user_id'     => get_current_user_id(),
				'wp_az_context'             => wp_az_get_context()
			));
		}

	}

	//triggered on activation of the plugin (called only once)
	public function plugin_activate() {

		// call custom content type function
		$this->register_3d_notes();
		$this->register_user_notes();

		// create static pages
		$this->create_static_pages();

		// flush permalinks
		flush_rewrite_rules();

		//create database entry
		$this->create_db();


	}

	// triggered on deactivation of the plugin (called only once)
	public function plugin_deactivate(){
		// flush permalinks
		flush_rewrite_rules();

		// delete static pages
		$body_post_id = get_option('wp_az_3d_body_post_id');
		$dashboard_id = get_option('wp_az_notes_dashboard_post_id');

		wp_delete_post($body_post_id);
		wp_delete_post($dashboard_id);
	}

	public function create_static_pages(){

		// Create 3d body page
		$body_3d = array(
			'post_title'    => '3D Body',
			'post_content'  => 'Interact with 3D Body',
			'post_status'   => 'publish',
			'post_type'     => 'page',
			'post_excerpt'  => 'Use our free interactive 3D model to learn anatomy by region or system'
		);

		// Create notes dashboard page
		$notes_dashboard = array(
			'post_title'    => 'Notes Dashboard',
			'post_content'  => 'Notes Dashboard',
			'post_status'   => 'publish',
			'post_type'     => 'page',
			'post_excerpt'  => 'Create your own 3D anatomy notes using our novel 3D notes platform.'
		);

		$wp_az_3d_body_id = wp_insert_post($body_3d);
		$wp_az_notes_dashboard_id = wp_insert_post($notes_dashboard);

		// add to options
		update_option( 'wp_az_3d_body_post_id', $wp_az_3d_body_id, 'yes');
		update_option( 'wp_az_notes_dashboard_post_id', $wp_az_notes_dashboard_id, 'yes');

	}

	/*********************
	 * PRIVATE FUNCTIONS *
	 *********************/

	private function create_db(){

		global $wpdb;
		global $wp_az_db_version;

		global $table_notes;
		global $table_actions;


		$table_notes = $wpdb->prefix . 'az_notes';
		$table_notes_images = $wpdb->prefix . 'az_notes_images';
		$table_actions = $wpdb->prefix . 'az_actions';

		$charset_collate = $wpdb->get_charset_collate();

		$sql = "CREATE TABLE $table_notes (
		id mediumint(9) NOT NULL AUTO_INCREMENT,
		uid tinytext NOT NULL,	  
		post_id mediumint(9),
		created datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
		last_modified datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
		title tinytext NOT NULL,
		note_content text NOT NULL,
		sequence tinyint NOT NULL,
		scene_state text,
		url tinytext,
		PRIMARY KEY  (id)
		) $charset_collate;";

		$sql .= "CREATE TABLE $table_actions (
		id mediumint(9) NOT NULL AUTO_INCREMENT,
		uid tinytext NOT NULL,
		post_id mediumint(9) NOT NULL,
		note_id tinytext NOT NULL,
		action_order tinyint NOT NULL,
		action_type tinytext NOT NULL,
		scene_state text,
		action_data text,
		action_title tinytext,
		PRIMARY KEY  (id)
		) $charset_collate;";

		$sql .= "CREATE TABLE $table_notes_images (
		id mediumint(9) NOT NULL AUTO_INCREMENT,
		uid tinytext NOT NULL,
		post_id mediumint(9) NOT NULL,
		note_id tinytext NOT NULL,
		image_order tinyint NOT NULL,
		image_url tinytext NOT NULL,	
		) $charset_collate;";

		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
		dbDelta( $sql );

		add_option('wp_az_db_version', $wp_az_db_version);

	}

	private function resequence_notes($sequence_index, $post_id) {

		global $wpdb;

		$table_name = $wpdb->prefix . 'az_notes';

		foreach ($sequence_index as $note_sequence) {
			$uid = $note_sequence[0];
			$sequence = $note_sequence[1];

			$sequence_data = array(
				uid         => $uid,
				sequence    => $sequence
			);

			$wpdb->update(
				$table_name,
				$sequence_data,
				array (
					post_id  => $post_id,
					uid      => $uid
				)
			);
		}
	}
	
	/**********************
	 *  AJAX FUNCTIONS    *
	 **********************/

	//TODO: use wpdb->prepare function to sanitise SQL queries

	public function save_notes(){

		// first check if data is being sent and that it is the data we want
		if (!isset($_POST['wp_az_3d_notes_nonce']) || !isset($_POST['wp_az_note_object']) || !isset($_POST['wp_az_post_id'])) {
			wp_die('Your request failed permission check.');
		}

		$post_id = intval($_POST['wp_az_post_id']);
		$notes = $_POST['wp_az_note_object'];
		$actions = $_POST['wp_az_actions'];
		$actions_changed = $_POST['wp_az_actions_changed'];

		// write to database
		global $wpdb;

		$notes_table = $wpdb->prefix . 'az_notes';
		$actions_table = $wpdb->prefix . 'az_actions';

		$notes_data = array (
			'post_id'              => $post_id,
			'uid'                  => $notes['uid'],
			'last_modified'        => current_time('mysql'),
			'title'                => $notes['title'],
			'note_content'         => stripslashes_deep($notes['note_content']),
			'sequence'             => $notes['sequence'],
			'scene_state'          => $notes['scene_state']
		);

		// delete all actions data first
		$wpdb->delete(
			$actions_table,
			array( note_id => $notes[uid] )
		);

		if ($actions && $actions_changed) {
			foreach ($actions as $action) {

				$action_data = array (
					'uid'           => $action['uid'],
					'note_id'       => $action['note_id'],
					'post_id'       => $post_id,
					'action_order'  => $action['action_order'],
					'action_type'   => $action['action_type'],
					'scene_state'   => $action['scene_state'],
					'action_data'   => json_encode($action['action_data']),
					'action_title'  => $action['action_title']
				);

				$update = $wpdb->update(
					$actions_table,
					$action_data,
					array (
						post_id => $post_id,
						uid     => $action->uid
					)
				);

				if (!$update) {
					$wpdb->insert(
						$actions_table,
						$action_data
					);
				}

				$actions_db_updated = true;
			}


		}

		// try to update notes if available
		if (current_user_can('access_s2member_level2')):

		$update = $wpdb->update(
				$notes_table,
				$notes_data,
				array (
					post_id  => $post_id,
					uid      => $notes['uid']
				)
			);

		// insert new notes if no record exists
		if (!$update) {
			$notes_data['created'] = current_time('mysql');
			$wpdb->insert(
				$notes_table,
				$notes_data
			);
		}

		endif;

		// success
		wp_send_json (array(
			'status'                => 'success',
			'message'               => 'Notes saved',
			'post_id'               => $post_id,
			'uid'                   => $notes['uid'],
			'title'                 => $notes['title'],
			'note_content'          => $notes['note_content'],
			'sequence'              => $notes['sequence'],
			'actions'               => $actions_db_updated,
		));


	}

	public function load_single_note(){

		// first check if data is being sent and that it is the data we want
		if (!isset($_POST['wp_az_3d_notes_nonce'])) {
			wp_die('Your request failed permission check.');
		}

		global $wpdb;
		$table_name = $wpdb->prefix . 'az_notes';

		$post_id = intval($_GET['wp_az_post_id']);
		$sequence = intval($_GET['wp_az_sequence']);

		$notes = $wpdb->get_row( "SELECT title, note_content, sequence, scene_state FROM $table_name WHERE post_id = $post_id AND sequence = $sequence" );
		$scene_state = stripslashes_deep($notes->scene_state);

		wp_send_json(array (
			'status' => "success",
			'notes' => $notes,
			'scene_state' => $scene_state
		));

	}

	public function load_notes(){

		global $wpdb;
		$table_name = $wpdb->prefix . 'az_notes';
		$table_actions = $wpdb->prefix . 'az_actions';

		$post_id = intval($_GET['wp_az_post_id']);

		$notes = $wpdb->get_results(
			"SELECT title, uid, note_content, sequence, scene_state
                  FROM $table_name 
                  WHERE post_id = $post_id
                  ORDER BY sequence ASC" );

		foreach ($notes as $note){
			$scene_state = stripslashes_deep($note->scene_state);
			$note->scene_state = $scene_state;
		}

		$actionsQuery = $wpdb->get_results(
			"SELECT *
					FROM $table_actions
					WHERE post_id = $post_id
					ORDER BY note_id"
		);

		wp_send_json(array (
			'status'    => "success",
			'notes'     => $notes,
			'actions'   => stripslashes_deep($actionsQuery),
		));

	}

	public function send_item_templates() {

		global $item_templates;

		wp_send_json(array (
			'status' => "success",
			'templates' => $item_templates,
		));

	}

	public function delete_note() {

		// first check if data is being sent and that it is the data we want
		if (!isset($_POST['wp_az_3d_notes_nonce'])) {
			wp_die('Your request failed permission check.');
		}

		global $wpdb;
		$table_notes = $wpdb->prefix . 'az_notes';
		$table_actions = $wpdb->prefix . 'az_actions';

		$post_id = intval($_POST['wp_az_post_id']);
		$uid = $_POST['wp_az_note_uid'];
		$sequence_index = $_POST['wp_az_sequence_index'];

		// delete notes
		$wpdb->delete(
			$table_notes,
			array(
				post_id => $post_id,
				uid => $uid));

		this.$this->resequence_notes($sequence_index, $post_id);

		// delete actions
		$wpdb->delete (
			$table_actions,
			array (
				note_id => $uid
			)
		);

		wp_send_json(array (
			'status' => "success",
			'message' => "Note deleted: " . $uid
		));

	}

	public function update_first_scene_url() {

		// first check if data is being sent and that it is the data we want
		if (!isset($_POST['wp_az_3d_notes_nonce'])) {
			wp_die('Your request failed permission check.');
		}

		global $wpdb;
		$table_notes = $wpdb->prefix . 'az_notes';

		$note_id = $_POST['wp_az_note_id'];
		$url = $_POST['wp_az_first_scene_url'];

		$update = $wpdb->update(
			$table_notes,
			array(
				url => $url
			),
			array(
				uid => $note_id
			)
		);

		if ($update){
			$status = 'success';
			$message = 'First scene saved.';
		} else {
			$status = 'failed';
			$message = 'Failed to save first scene.';
		}

		wp_send_json(array(
			'status'        => $status,
			'message'       => $message
		));
	}

	public function update_post_title(){

		// first check if data is being sent and that it is the data we want
		if (!isset($_POST['wp_az_3d_notes_nonce'])) {
			wp_die('Your request failed permission check.');
		}

		$post_id = intval($_POST['wp_az_post_id']);
		$new_title = sanitize_text_field($_POST['wp_az_new_post_title']);

		$update_post = array(
			'ID'            => $post_id,
			'post_title'    => $new_title,
		);

		wp_update_post($update_post);

		wp_send_json(array(
			'status'        => 'success',
			'message'       => 'post title updated'
		));
	}

	public function upload_snapshot() {

		// first check if data is being sent and that it is the data we want
		if (!isset($_POST['wp_az_3d_notes_nonce'])) {
			wp_die('Your request failed permission check.');
		}

		$img = $_POST['wp_az_img_data'];
		$img_title = $_POST['wp_az_img_title'];
		$img_desc = $_POST['wp_az_img_desc'];
		$img_caption = $_POST['wp_az_img_caption'];
		$img_alt = $_POST['wp_az_img_alt'];
		$post_id = $_POST['wp_az_post_id'];
		$note_id = $_POST['wp_az_note_id'];

		$attach_id = wp_az_save_image($img, $img_title, $img_desc, $img_caption, $post_id);

		if ($attach_id) {
			$attach_src_medium = wp_get_attachment_image_src($attach_id, 'medium')[0];
			$attach_src_large = wp_get_attachment_image_src($attach_id, 'large')[0];

			update_metadata ( 'post', $attach_id, '_az_note_id', $note_id);
			update_metadata ( 'post', $attach_id, '_wp_attachment_image_alt', $img_alt);
		}

		wp_send_json(array(
			'status'            => 'success',
			'message'           => 'media updated. ',
			'attachment_id'     => $attach_id,
			'attachment_src_medium'    => $attach_src_medium,
			'attachment_src_large'      => $attach_src_large
		));

	}
}

global $anatomy_notes;

$anatomy_notes = new wp_az_3d_notes();