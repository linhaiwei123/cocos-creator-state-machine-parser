cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad: function () {
        let fsm = require("fsm");
        fsm.onleaveup = function(){
            this.scheduleOnce(function(){
                fsm.transition();
                //暂停这个状态机

                //然后调用另一个状态机

                //扩展  
                //然后那边跑完 再跑这个
                //很简单就可以实现状态机的扩展
                //有点像分层状态机  
                //单独地管理状态机的状态机切换
            }.bind(this),1)
            return fsm.ASYNC;
        }.bind(this),
        
        fsm.onup = function(event,from,to,arg){
            this.node.runAction(
                cc.sequence(
                    cc.moveBy(1,cc.v2(0,150)),
                    cc.callFunc(function(){
                        fsm.upend();
                    }.bind(this))
                )
            );
        }.bind(this);
        fsm.onleft = function(){
            this.node.runAction(
                cc.sequence(
                    cc.moveBy(1,cc.v2(-150,0)),
                    cc.callFunc(function(){
                        fsm.leftend();
                    }.bind(this))
                )
            );
        }.bind(this);
        fsm.ondown = function(){
            this.node.runAction(
                cc.sequence(
                    cc.moveBy(1,cc.v2(0,-150)),
                    cc.callFunc(function(){
                        fsm.downend();
                    }.bind(this))
                )
            );
        }.bind(this);
        fsm.onright = function(){
            this.node.runAction(
                cc.sequence(
                    cc.moveBy(1,cc.v2(150,0)),
                    cc.callFunc(function(){
                        fsm.rightend();
                    }.bind(this))
                )
            );
        }.bind(this);

        fsm.startup({hello: "world"});
    },

});
