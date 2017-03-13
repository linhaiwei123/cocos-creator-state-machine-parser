let StateMachine = require('state-machine');
let fsm = StateMachine.create({
initial: 'nope',
//please select the enter-state here ↓
events: [
{"name":"startup","from":"nope","to":"up"},
{"name":"upend","from":"up","to":"left"},
{"name":"leftend","from":"left","to":"down"},
{"name":"downend","from":"down","to":"right"},
{"name":"rightend","from":"right","to":"up"}
]
});
fsm.ASYNC = StateMachine.ASYNC;
module.exports = fsm