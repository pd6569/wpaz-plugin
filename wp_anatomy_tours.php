<?php
/*
Plugin Name: AnatomyZone 3D Tours Plugin
Plugin URI:  https://anatomyzone.com
Description: Interactive 3D anatomy tours
Version:     1.0.0
Author:      Peter de Souza
Author URI:  http://www.anatomyzone.com
License:     GPL2
License URI: https://www.gnu.org/licenses/gpl-2.0.html
*/

// Exit if accessed directly
if (!defined( 'ABSPATH')) {
	exit;
}

define('WP_AZ_ANATOMY_TOURS_PLUGIN_DIR', untrailingslashit(plugin_dir_path(__FILE__)));
define('WP_AZ_ANATOMY_TOURS_PLUGIN_URL', plugin_dir_url(__FILE__));
define('WP_AZ_ANATOMY_TOURS_PLUGIN_FILE', __FILE__);
define('WP_AZ_ANATOMY_TOURS_PLUGIN_BASENAME', plugin_basename(__FILE__));
define('WP_AZ_ANATOMY_TOURS_VERSION', 1.0);

# templates
define('TMPL_URL_LAYOUT_3D_TOURS', WP_AZ_ANATOMY_TOURS_PLUGIN_DIR . "/templates/layout_3d_tours.php");
define('TMPL_URL_ITEM_NOTE_SECTION', WP_AZ_ANATOMY_TOURS_PLUGIN_DIR . "/templates/item_note_section.php");


require_once (WP_AZ_ANATOMY_TOURS_PLUGIN_DIR . '/functions.php');
require_once (WP_AZ_ANATOMY_TOURS_PLUGIN_DIR . '/templates.php');

// Database
$wp_az_db_version = '1.0';


class wp_az_anatomy_tours {

	public function __construct() {

		$this->hooks();

		global $wp_az_is_user_admin;

		// generate item templates
		wp_az_generate_item_templates();

	}
	
	public function hooks(){
		add_action('init', array($this,'register_anatomy_tours')); //register location content type
		add_action('admin_enqueue_scripts', array($this,'enqueueAdmin'));
		add_action('wp_enqueue_scripts', array($this,'enqueue'), 50); // ensure styles are enqueued AFTER theme!
		add_filter('the_content', array($this, 'set_content'));
		
		// Ajax hooks
		add_action('wp_ajax_save_notes', array($this, 'save_notes' ));
		add_action('wp_ajax_load_notes', array($this, 'load_notes'));
		add_action('wp_ajax_nopriv_load_notes', array($this, 'load_notes'));
		add_action('wp_ajax_load_single_note', array($this, 'load_single_note'));
		add_action('wp_ajax_send_item_templates', array($this, 'send_item_templates'));
		add_action('wp_ajax_nopriv_send_item_templates', array($this, 'send_item_templates'));
		add_action('wp_ajax_delete_note', array($this, 'delete_note'));
		add_action('wp_ajax_update_first_scene_url', array($this, 'update_first_scene_url'));

		register_activation_hook(__FILE__, array($this, 'plugin_activate'));
		register_deactivation_hook(__FILE__, array($this, 'plugin_deactivate'));
	}

	public function set_content($content){

		global $post;
		global $wp_az_is_user_admin;
		global $layout_template_names;

		if ($post->post_type == '3d-tours') {

			$content = wp_az_get_template_html($layout_template_names['3D_TOURS']);

		}


		return $content;
	}

	public function register_anatomy_tours(){

		// Labels for post type
		$labels = array(
			'name'               => 'Anatomy Tours',
			'singular_name'      => 'Anatomy Tour',
			'menu_name'          => 'Anatomy Tours',
			'name_admin_bar'     => 'Anatomy Tour',
			'add_new'            => 'Add New',
			'add_new_item'       => 'Add New Anatomy Tour',
			'new_item'           => 'New Anatomy Tour',
			'edit_item'          => 'Edit Anatomy Tour',
			'view_item'          => 'View Anatomy Tour',
			'all_items'          => 'All Anatomy Tours',
			'search_items'       => 'Search Anatomy Tours',
			'parent_item_colon'  => 'Parent Anatomy Tour:',
			'not_found'          => 'No Anatomy Tours found.',
			'not_found_in_trash' => 'No Anatomy Tours found in Trash.',
		);

		// arguments for post type
		$args = array(
			'labels'            => $labels,
			'public'            => true,
			'publicly_queryable'=> true,
			'show_ui'           => true,
			'show_in_nav'       => true,
			'query_var'         => true,
			'hierarchical'      => false,
			'supports'          => array('title','thumbnail','editor'),
			'has_archive'       => true,
			'menu_position'     => 20,
			'show_in_admin_bar' => true,
			'menu_icon'         => 'dashicons-location-alt',
			'rewrite'            => array('slug' => '3d-tours', 'with_front' => 'true')
		);

		// register post type
		register_post_type('3d-tours', $args);

	}

	public function enqueueAdmin() {

		$screen = get_current_screen();
		if (!($screen->base == 'post' && $screen->post_type == '3d-tours')) return;

		// enqueue admin scripts

	}

	public function enqueue() {

		global $post;
		global $item_templates;

		// modify post object here
		if ($post->post_type == '3d-tours'){

			// styles
			wp_enqueue_style('wp_az_bootstrap', plugins_url('css/bootstrap.css', __FILE__));
			wp_enqueue_style('wp_az_3d_tours_main_style', plugins_url('css/styles.css?v=' . time(), __FILE__));

			// scripts
			wp_enqueue_script('wp_az_bootstrap', plugins_url('lib/bootstrap.js', __FILE__), null, null, true);
			wp_enqueue_script('wp_az_handlebars', plugins_url('lib/handlebars-v4.0.5.js', __FILE__), null, null, true);
			wp_enqueue_script('wp_az_biodigital_human', plugins_url('lib/human-api.min.js', __FILE__), null, null, true);
			wp_enqueue_script('wp_az_biodigital_human_components', plugins_url('lib/human-components.js', __FILE__), null, null, true);
			wp_enqueue_script('wp_az_globals', plugins_url('js/globals.js', __FILE__), array('jquery'), '1.0', true);
			wp_enqueue_script('wp_az_note', plugins_url('js/Note.js', __FILE__), array('jquery'), '1.0', true);
			wp_enqueue_script('wp_az_actions', plugins_url('js/Actions.js', __FILE__), array('jquery'), '1.0', true);
			wp_enqueue_script('wp_az_utils', plugins_url('js/Utils.js', __FILE__), array('jquery'), '1.0', true);
			wp_enqueue_script('wp_az_3d_tours_main', plugins_url('js/3dtours.js', __FILE__), array('jquery'), '1.0', true);


			// sends ajax script to wp_az_3d_tours_main script
			wp_localize_script( 'wp_az_3d_tours_main', 'ajax_object', array(
				'wp_az_ajax_url'         => admin_url('admin-ajax.php'),
				'wp_az_3d_tours_nonce'   => wp_create_nonce('wp_az_3d_tours_nonce'),
				'wp_az_post_id'          => $post->ID,
				'wp_az_user_role'        => current_user_can('administrator'),
				'wp_az_item_templates'   => $item_templates['NOTE_SECTION']
			));
		}

	}

	//triggered on activation of the plugin (called only once)
	public function plugin_activate() {

		// call out custom content type function
		$this->register_anatomy_tours();

		// flush permalinks
		flush_rewrite_rules();

		//create database entry
		$this->create_db();


	}

	// triggered on deactivation of the plugin (called only once)
	public function plugin_deactivate(){
		//flush permalinks
		flush_rewrite_rules();
	}

	/*********************
	 * PRIVATE FUNCTIONS *
	 *********************/

	private function create_db(){

		global $wpdb;
		global $wp_az_db_version;

		$table_notes = $wpdb->prefix . 'anatomy_tours_notes';
		$table_actions = $wpdb->prefix . 'anatomy_tours_actions';


		$charset_collate = $wpdb->get_charset_collate();

		$sql = "CREATE TABLE $table_notes (
		id mediumint(9) NOT NULL AUTO_INCREMENT,
		uid tinytext NOT NULL,
		post_id mediumint(9) NOT NULL,
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
		PRIMARY KEY  (id)
		) $charset_collate;";

		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
		dbDelta( $sql );

		add_option('wp_az_db_version', $wp_az_db_version);

	}

	private function resequence_notes($sequence_index, $post_id) {

		global $wpdb;
		$table_name = $wpdb->prefix . 'anatomy_tours_notes';

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
		if (!isset($_POST['wp_az_3d_tours_nonce']) || !isset($_POST['wp_az_note_object']) || !isset($_POST['wp_az_post_id'])) {
			wp_die('Your request failed permission check.');
		}

		$post_id = intval($_POST['wp_az_post_id']);
		$notes = $_POST['wp_az_note_object'];
		$actions = $_POST['wp_az_actions'];
		$actions_changed = $_POST['wp_az_actions_changed'];

		// write to database
		global $wpdb;

		$notes_table = $wpdb->prefix . 'anatomy_tours_notes';
		$actions_table = $wpdb->prefix . 'anatomy_tours_actions';

		$notes_data = array (
			'post_id'              => $post_id,
			'uid'                  => $notes['uid'],
			'last_modified'        => current_time('mysql'),
			'title'                => $notes['title'],
			'note_content'         => $notes['note_content'],
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
					'action_data'   => $action['action_data']
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
		if (current_user_can('administrator')):

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
		if (!isset($_POST['wp_az_3d_tours_nonce'])) {
			wp_die('Your request failed permission check.');
		}

		global $wpdb;
		$table_name = $wpdb->prefix . 'anatomy_tours_notes';

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
		$table_name = $wpdb->prefix . 'anatomy_tours_notes';
		$table_actions = $wpdb->prefix . 'anatomy_tours_actions';

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
		if (!isset($_POST['wp_az_3d_tours_nonce'])) {
			wp_die('Your request failed permission check.');
		}

		global $wpdb;
		$table_notes = $wpdb->prefix . 'anatomy_tours_notes';
		$table_actions = $wpdb->prefix . 'anatomy_tours_actions';

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
		if (!isset($_POST['wp_az_3d_tours_nonce'])) {
			wp_die('Your request failed permission check.');
		}

		global $wpdb;
		$table_notes = $wpdb->prefix . 'anatomy_tours_notes';

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
			$message = 'updated URL';
		} else {
			$status = 'failed';
			$message = 'failed to update URL';
		}

		wp_send_json(array(
			'status'        => $status,
			'message'       => $message
		));
	}

}

global $anatomy_tours;

$anatomy_tours = new wp_az_anatomy_tours();