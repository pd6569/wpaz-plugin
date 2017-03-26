<?php
/**
 * Created by IntelliJ IDEA.
 * User: peter
 * Date: 23/03/2017
 * Time: 09:47
 */
function debug_to_console( $data ) {
	$output = $data;
	if ( is_array( $output ) )
		$output = implode( ',', $output);

	echo "<script>console.log( 'Debug Objects: " . $output . "' );</script>";
}