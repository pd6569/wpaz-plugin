/**
 * Created by peter on 24/03/2017.
 */

class Action {

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


}