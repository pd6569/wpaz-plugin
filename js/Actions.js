/**
 * Created by peter on 24/03/2017.
 */

class Action {

    /*****
     *
     * @param note_id
     * @param action_order
     * @param action_type
     * @param scene_state
     * @param action_data Object.
     *              Parameters:
     *              type (required) - set using appGlobals.actionDataTypes.
     *              rotationSpeed (optional)
     *
     * @param action_title
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

}