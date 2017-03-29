/**
 * Created by peter on 24/03/2017.
 */

class Action {

    constructor(note_id, action_order, type, scene_state = "", data = {}) {

        this.note_id = note_id;
        this.uid = Utils.generateUID();
        this.action_order = action_order;
        this.type = type;
        this.scene_state = scene_state;
        this.data = data;
    }

    setNoteId(note_id){
        this.note_id = note_id;
    }

    setActionOrder(action_order){
        this.action_order = action_order;
    }

    setType(type){
        this.type = type;
    }

    setSceneState(scene_state){
        this.scene_state = scene_state;
    }

    setData(data){
        this.data = data;
    }



}