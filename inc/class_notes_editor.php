<?php
/**
 * Created by IntelliJ IDEA.
 * User: peter
 * Date: 19/04/2017
 * Time: 16:53
 */

class wpaz_notes_editor {

	public function __construct() {
		$this->setup_editor();
	}

	private function setup_editor(){
		add_filter('mce_external_plugins', array($this, add_tinymce_plugin));
		add_filter('mce_buttons', array($this, add_tinymce_button));
	}

	public function add_tinymce_plugin($plugin_array){
		$plugin_array['linkscene'] = WP_AZ_PLUGIN_URL . 'assets/tinymce-wpaz-plugins/tinymce_buttons.js';
		return $plugin_array;
	}

	public function add_tinymce_button($buttons){
		array_push($buttons, 'linkscene');
		return $buttons;
	}
}