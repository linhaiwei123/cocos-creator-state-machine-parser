'use strict';

module.exports = {
  load () {
    // 当 package 被正确加载的时候执行
    console.log("processon-statemachine loaded");
  },

  unload () {
    // 当 package 被正确卸载的时候执行
    console.log("processon-statemachine unloaded");
  },

  messages: {
    'open' () {
      Editor.Panel.open("processon-statemachine");
    },
    'receive-json' (event, arg) {
      let pos = arg;
      //parse to flow;
      let elements = pos.diagram.elements.elements;

      let fsm_items = [];

      let idx2ids = Object.keys(elements);
          for(let id of idx2ids){
              let value = elements[id];
              if(value.text){
                  let name = value.text;
                  let to = elements[value.to.id].textBlock[0].text;
                  let from = elements[value.from.id].textBlock[0].text;
                  fsm_items.push({name:name, from:from, to:to});
              }
          };

      let fsm_items_string = JSON.stringify(fsm_items);
      Editor.success("processon-statemachine: generating fsm.js");
      //generate file
      let content = "let StateMachine = require('state-machine');\n"+
                    "let fsmData = {\n"+
                       "initial: 'nope',\n" + 
                       "//please select the enter-state here ↓\n" + 
                       "events: [\n" +
                       '//{"name":"startup","from":"nope","to":/*enter-state*/},\n' +  
                       fsm_items_string.substring(1,fsm_items_string.length - 1).replace(/},/g,"},\n") + "\n" + 
                       "]\n" +
                    "};\n";

      //factory for the situation that many body use the same fsm template instend of same fsm
      content += "let create = function(){\n"+
                  "let fsm = StateMachine.create(fsmData);\n"+
                  "fsm.ASYNC = StateMachine.ASYNC;\n"+
                  "return fsm;\n"+
                  "}\n";
      
      //extend enum StateMachine.ASYNC in 
      //content += "fsm.ASYNC = StateMachine.ASYNC;\n"


      
      // # cause the fsm's eventsystem is not a register but just a callback
      // # it mease one event or one state just call only one function instead of broadcast 
      // # so a good way is to broadcast it when fsm invoke that callback
      // # but the other important thing is you could change the flow that state-machine should go by return the signal writed in state-machine.js 's README.md
      // # so i choose to comment the follow code. 
      // "const EventEmitter = require('events');\n"+
      // "let emitter =  new EventEmitter();\n";

      // for(let fsm_item of fsm_items){
      //    content += "fsm.onbefore" + fsm_item.event +" = function(event,from,to,...arg){emitter.emit('before-"+fsm_item.event+"',{event:event,from:from,to:to,arg:arg})}\n";
      //    content += "fsm.onafter" + fsm_item.event +" = function(event,from,to,...arg){emitter.emit('after-"+fsm_item.event+"',{event:event,from:from,to:to,arg:arg})}\n";
      //    content += "fsm.onenter" + fsm_item.from +" = function(event,from,to,...arg){emitter.emit('enter-"+fsm_item.from+"',{event:event,from:from,to:to,arg:arg})}\n";
      //    content += "fsm.onleave" + fsm_item.from +" = function(event,from,to,...arg){emitter.emit('leave-"+fsm_item.from+"',{event:event,from:from,to:to,arg:arg})}\n";
      //    content += "fsm.onenter" + fsm_item.to +" = function(event,from,to,...arg){emitter.emit('enter-"+fsm_item.to+"',{event:event,from:from,to:to,arg:arg})}\n";
      //    content += "fsm.onleave" + fsm_item.to +" = function(event,from,to,...arg){emitter.emit('leave-"+fsm_item.to+"',{event:event,from:from,to:to,arg:arg})}\n";
      // }

      // content += "fsm.onenterstate = function(event,from,to,...arg){emitter.emit('enter-state',{event:event,from:from,to:to,arg:arg})}\n";
      // content += "fsm.onleavestate = function(event,from,to,...arg){emitter.emit('leave-state',{event:event,from:from,to:to,arg:arg})}\n";
      // content += "fsm.onbeforeevent = function(event,from,to,...arg){emitter.emit('before-event',{event:event,from:from,to:to,arg:arg})}\n";
      // content += "fsm.onafterevent = function(event,from,to,...arg){emitter.emit('after-event',{event:event,from:from,to:to,arg:arg})}\n";

      //content += "module.exports = {fsm,emitter}";
      content += "module.exports = {create}";
      Editor.success("processon-statemachine: sending fsm.js to assetdb");
      //Editor.assetdb.create( 'db://assets/fsm.js', content, function ( err, results ) {
        let fs_handler = require("fs");
        fs_handler.writeFileSync(Editor.url("db://assets/fsm.js"),content);
        Editor.success('processon-statemachine: refreshing assets');
        //Editor.assetdb.refresh('db://assets/fsm.js', function (err, results) {});
        Editor.Ipc.sendToMain("asset-db:refresh","db://assets/fsm.js",function(err,results){
          Editor.success("processon-statemachine: finish");
          Editor.success('processon-statemachine: please config the start state in fsm.js');
          Editor.Dialog.messageBox ({
            type:"none",
            buttons: ["shut up"],
            title:"tips",
            message:"please config the start state in fsm.js",
            detail: "dont't forget it !"
          },function(){});
          // let uuid = Editor.assetdb.urlToUuid('db://assets/fsm.js');
          // Editor.Ipc.sendToMain("code-editor:open-by-uuid",uuid);
       });
                    
    },

    'add-statemachine-model' () {
       let fs_handler = require("fs");
       //Editor.log(Editor.url("packages://processon-statemachine/state-machine.js"));
       //Editor.log(Editor.url("db://assets/state-machine.js"));
       Editor.success('processon-statemachine: adding state-machine.js');
       fs_handler.writeFileSync(Editor.url("db://assets/state-machine.js"), fs_handler.readFileSync(Editor.url("packages://processon-statemachine/state-machine.js")));
       //Editor.assetdb.refresh('db://assets/state-machine.js', function (err, results) {});
       Editor.success('processon-statemachine: refreshing assets');
       Editor.Ipc.sendToMain("asset-db:refresh","db://assets/state-machine.js",function(err,results){
          Editor.success("processon-statemachine: finish");
       });
       
    }
       
    },
};