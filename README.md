# cocos-creator-state-machine-parser
### [modify] factory func instead of instance directly
use the require("fsm").create() instend of require("fsm") to get the fsm instance.
cause we may meed the situation that a bunch of enemy that use the same fsm-template instead of the same fsm
