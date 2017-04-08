<?php
/**
 * Created by IntelliJ IDEA.
 * User: peter
 * Date: 26/03/2017
 * Time: 10:54
 */



global $item_template_names;
global $layout_template_names;

global $item_templates;
global $layout_templates;

$item_template_names = array(
	'NOTE_SECTION'  => 'note_section'
);

$layout_template_names = array(
	'3D_NOTES'          => '3d_notes',
);

/**
 * @param $template_name
 *
 * @return string|void
 *
 */
function wp_az_get_template_html($template_name){

	global $layout_template_names;
	global $item_template_names;

	switch($template_name){

		case $layout_template_names['3D_NOTES']:
			return wp_az_return_output(TMPL_URL_LAYOUT_3D_NOTES);

		case $item_template_names['NOTE_SECTION']:
			return wp_az_return_output(TMPL_URL_ITEM_NOTE_SECTION);

		default:
			return;
	}
}

function wp_az_generate_item_templates(){

	global $item_template_names;
	global $item_templates;

	foreach ($item_template_names as $item_template_key => $item_template_value) {
		$item_templates[$item_template_key] = wp_az_get_template_html($item_template_value);
	}
}

function wp_az_return_output($fileUrl){
	ob_start();
	include $fileUrl;
	return ob_get_clean();
}
