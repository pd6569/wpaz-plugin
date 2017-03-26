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
define('TMPL_URL_LAYOUT_3D_TOURS_PUBLIC', WP_AZ_ANATOMY_TOURS_PLUGIN_DIR . "/templates/layout_3d_tours_public.php");
define('TMPL_URL_ITEM_NOTE_SECTION', WP_AZ_ANATOMY_TOURS_PLUGIN_DIR . "/templates/item_note_section.php");


require_once (WP_AZ_ANATOMY_TOURS_PLUGIN_DIR . '\functions.php');
require_once (WP_AZ_ANATOMY_TOURS_PLUGIN_DIR . '\templates.php');

// Database
global $wp_az_db_version;
$wp_az_db_version = '1.0';


class wp_az_anatomy_tours {

	/*public static $TMPL_ITEM_NOTES_FORM = "item_notes_form.html";*/
	/*public static $TMPL_LAYOUT_3D_TOURS = "/templates/layout_3d_tours.php";
	public static $TMPL_LAYOUT_3D_TOURS_PUBLIC = "/templates/layout_3d_tours_public.php";
	public static $TMPL_ITEM_NOTE_SECTION = "/templates/item_note_section.php";*/

	public function __construct() {
		$this->hooks();
	}
	
	public function hooks(){
		add_action('init', array($this,'register_anatomy_tours')); //register location content type
		add_action('admin_enqueue_scripts', array($this,'enqueueAdmin'));
		add_action('wp_enqueue_scripts', array($this,'enqueue'));
		add_action('the_post', array($this, 'set_content'));
		
		// Ajax hooks
		add_action('wp_ajax_save_notes', array($this, 'save_notes' ));
		add_action('wp_ajax_load_notes', array($this, 'load_notes'));
		add_action('wp_ajax_nopriv_load_notes', array($this, 'load_notes'));

		register_activation_hook(__FILE__, array($this, 'plugin_activate'));
		register_deactivation_hook(__FILE__, array($this, 'plugin_deactivate'));
	}

	public function set_content($post_object){

		if ($post_object->post_type == '3d-tours'){

			add_action('the_content', array($this, 'clear_content'));
		}
	}

	public function clear_content($content){

		global $layout_templates;

		add_action( 'the_post', 'my_the_post_action' );

		if (current_user_can('administrator')) :
			$content = wp_az_get_template($layout_templates['3D_TOURS']);
		else :
			$content = wp_az_get_template($layout_templates['3D_TOURS_PUBLIC']);
		endif;

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

		function my_the_post_action( $post_object ) {

			// modify post object here
			if ($post_object->post_type == '3d-tours'){

				// styles
				wp_enqueue_style('wp_az_bootstrap', plugins_url('css/bootstrap.css', __FILE__));
				wp_enqueue_style('wp_az_3d_tours_main_style', plugins_url('css/styles.css', __FILE__), null, '1.0');

				// scripts
				wp_enqueue_script('wp_az_bootstrap', plugins_url('lib/bootstrap.js', __FILE__), null, null, true);
				wp_enqueue_script('wp_az_handlebars', plugins_url('lib/handlebars-v4.0.5.js', __FILE__), null, null, true);
				wp_enqueue_script('wp_az_biodigital_human', plugins_url('lib/human-api.min.js', __FILE__), null, null, true);
				wp_enqueue_script('wp_az_biodigital_human_components', plugins_url('lib/human-components.js', __FILE__), null, null, true);
				wp_enqueue_script('wp_az_actions', plugins_url('js/Actions.js', __FILE__), array('jquery'), '1.0', true);
				wp_enqueue_script('wp_az_utils', plugins_url('js/Utils.js', __FILE__), array('jquery'), '1.0', true);
				wp_enqueue_script('wp_az_3d_tours_main', plugins_url('js/3dtours.js', __FILE__), array('jquery'), '1.0', true);

				// sends ajax script to wp_az_3d_tours_main script
				wp_localize_script( 'wp_az_3d_tours_main', 'ajax_object', array(
					'wp_az_ajax_url'         => admin_url('admin-ajax.php'),
					'wp_az_3d_tours_nonce'   => wp_create_nonce('wp_az_3d_tours_nonce'),
					'wp_az_post_id'          => $post_object->ID,
					'wp_az_user_role'        => current_user_can('administrator'),
				));
			}
		}

		add_action( 'the_post', 'my_the_post_action' );
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

		$table_name = $wpdb->prefix . 'az_anatomy_tours';

		$charset_collate = $wpdb->get_charset_collate();

		$sql = "CREATE TABLE $table_name (
		id mediumint(9) NOT NULL AUTO_INCREMENT,
		post_id mediumint(9) NOT NULL,
		notes_time datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
		notes_title tinytext NOT NULL,
		notes_text text NOT NULL,
		notes_order tinyint NOT NULL,
		notes_scene_state text,
		PRIMARY KEY  (id)
		) $charset_collate;";

		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
		dbDelta( $sql );

		add_option('wp_az_db_version', $wp_az_db_version);

	}
	
	/**********************
	 *  AJAX FUNCTIONS    *
	 **********************/

	public function save_notes(){

		// first check if data is being sent and that it is the data we want
		if (!isset($_POST['wp_az_3d_tours_nonce']) || !isset($_POST['wp_az_notes_title']) || !isset($_POST['wp_az_notes_text'])) {
			wp_die('Your request failed permission check.');
		}

		$post_id = intval($_POST['wp_az_post_id']);
		$notes_title = $_POST['wp_az_notes_title'];
		$notes_text = $_POST['wp_az_notes_text'];
		$notes_scene_state = stripslashes_deep($_POST['wp_az_notes_scene_state']);
		$notes_order = $_POST['wp_az_notes_order'];


		// write to database
		global $wpdb;

		$table_name = $wpdb->prefix . 'az_anatomy_tours';
		$notes_data = array (
			'post_id'           => $post_id,
			'notes_time'        => current_time('mysql'),
			'notes_title'       => $notes_title,
			'notes_text'        => $notes_text,
			'notes_order'       => $notes_order,
			'notes_scene_state' => $notes_scene_state
		);

		// try to update notes if available
		$update = $wpdb->update(
				$table_name,
				$notes_data,
				array (
					post_id => $post_id,
					notes_order => $notes_order
				)
			);

		// insert new notes if no record exists
		if (!$update) {
			$wpdb->insert(
				$table_name,
				$notes_data
			);
		}

		// success
		wp_send_json (array(
			'status'    => 'success',
			'message'   => 'Notes saved',
			'id'        => $post_id,
			'title'     => $notes_title,
			'text'      => $notes_text,
			'order'     => $notes_order,
		));


	}

	public function load_notes(){

		global $wpdb;
		$table_name = $wpdb->prefix . 'az_anatomy_tours';

		$post_id = intval($_GET['wp_az_post_id']);
		$order = intval($_GET['wp_az_notes_order']);

		$notes = $wpdb->get_row( "SELECT notes_title, notes_text, notes_order, notes_scene_state FROM $table_name WHERE post_id = $post_id" );
		$scene_state = stripslashes_deep($notes->notes_scene_state);

		wp_send_json(array (
			'status' => "success",
			'notes' => $notes,
			'scene_state' => $scene_state
		));

	}

	/*public function process_template_request() {
		// first check if data is being sent and that it is the data we want
		if (!isset($_POST['wp_az_3d_tours_nonce'])) {
			wp_die('Your request failed permission check.');
		}

		// success
		wp_send_json (array(
			'status' => 'success',
			'message' => 'Your request was processed',
			'template' => WP_AZ_ANATOMY_TOURS_TEMPLATES_URL . '/' . self::$TMPL_ITEM_NOTES_FORM
		));
	}*/
}

global $anatomy_tours;

$anatomy_tours = new wp_az_anatomy_tours();