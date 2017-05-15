/**
 * Created by peter on 24/03/2017.
 */
"use strict";

import appGlobals from './globals';
import Utils from './Utils';

export default class Action {

    /*****
     *
     * @param   {int}       note_id
     * @param   {int}       action_order
     * @param   {string}    action_type
     * @param   {object}    scene_state
     * @param   {object}    action_data
     * @param   {string}    action_data.type              - set using appGlobals.actionDataTypes
     * @param   {number}    [action_data.rotationSpeed]
     * @param   {string}    [action_data.imgSrc]          - temporary property to store base64 encoded image url
     * @param   {string}    [action_data.imgUrl]          - URL to image
     * @param   {string}    action_title
     */
    constructor(note_id, action_order, action_type, scene_state = "", action_data = {}, action_title = "New Action") {

        this.note_id = note_id;
        this.uid = Utils.generateUID();
        this.action_order = action_order;
        this.action_type = action_type;
        this.scene_state = scene_state;
        this.action_data = action_data;
        this.action_title = action_title;

    }


    setNoteId(note_id){
        this.note_id = note_id;
    }

    setActionOrder(action_order){
        this.action_order = action_order;
    }

    setType(action_type){
        this.action_type = action_type;
    }

    setSceneState(scene_state){
        this.scene_state = scene_state;
    }

    setData(action_data){
        this.action_data = action_data;
    }

    setTitle(action_title){
        this.action_title = action_title;
    }

    /***** STATIC FUNCTIONS *****/

    static deleteAction(actionId){
        let currentNoteId = appGlobals.currentNote.uid;
        if (appGlobals.actions[currentNoteId]){
            let actions = appGlobals.actions[currentNoteId];
            let index;
            for (let i = 0; i < actions.length; i++) {
                if (actions[i].uid == actionId){
                    index = i;
                    break;
                }
            }
            console.log("action to delete index: " + index);
            actions.splice(index, 1);

        }
    }

    /***
     *
     * Function to get action object from action id. If no note Id is specified, the function will look for an actionId
     * associated with the current note.
     *
     * @param actionId (String) uid of action
     * @param noteId (String) uid for note that contains the action, defaults to current note Id.
     * @returns Action Object
     */
    static getActionById(actionId, noteId = appGlobals.currentNote.uid) {
        let actions = appGlobals.actions[noteId];
        console.log("actions: ", actions);
        for (let action of actions) {
            if (action) {
                if (action.uid === actionId){
                    return action;
                }
            }
        }
    }

    static actionDataValues () {
        return {
            ROTATE_CAMERA: {
                speeds: {
                    'slow': 0.2,
                    'medium': 0.5,
                    'fast': 1,
                }
            }
        }
    }

    static sortActionsForCurrentNote() {
        console.log("sortActionsForCurrentNote");

        let appObj = appGlobals.appRef;
        let $linkedScenes;
        appObj.userIsEditor ? $linkedScenes = appObj.$editorBody.find('.linked-scene') : $linkedScenes = appObj.$noteText.find('.linked-scene');
        let numActions = $linkedScenes.length;
        if (numActions > 0){
            console.log("Sort actions. Number of actions: " + $linkedScenes.length);

            let sortedActions = [];
            if (numActions > 0){
                for (let i = 0; i < numActions ; i++){
                    console.log("action id: " + jQuery($linkedScenes[i]).attr('data-action-id'));
                    let actionId = jQuery($linkedScenes[i]).attr('data-action-id');
                    sortedActions.push(Action.getActionById(actionId, appGlobals.currentNote.uid));
                }
                appGlobals.actions[appGlobals.currentNote.uid] = sortedActions;
                console.log("appglobals sorted actions: ", appGlobals.actions[appGlobals.currentNote.uid])
            }
        }
    }

    static actionFunctions(action_data) {

        return {
            rotateCamera: function() {

                appGlobals.animateUpdate = true;

                // Stop rotating camera if scene is clicked
                appGlobals.appRef.human.on('scene.picked', function () {
                    appGlobals.animateUpdate = false;
                });

                function update() {
                    // Orbit camera horizontally around target
                    appGlobals.appRef.human.send("camera.orbit", {
                        yaw: action_data.rotationSpeed,
                    });

                    if (appGlobals.animateUpdate) {
                        requestAnimationFrame(update);
                    }
                };

                requestAnimationFrame(update);
            }
        }
    }
}