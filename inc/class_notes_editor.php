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
		add_filter('mce_css', array($this, 'plugin_mce_css'));
	}

	public function plugin_mce_css($mce_css) {

		if ( ! empty( $mce_css ) ) {
			$mce_css .= ',';
		}

		$mce_css .= WP_AZ_PLUGIN_URL . 'css/editor-style.css';

		return $mce_css;

	}

}