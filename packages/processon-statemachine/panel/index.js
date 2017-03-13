//panel/index.js
Editor.Panel.extend({
    style:`
    :host {margin: 5px;}
    h2 {color: #f90;display: inline-block;}
    }
    `
    ,

    template:`
    <h2>添加依赖state-machine.js到项目中</h2><br>
    <ui-button type="button" id="add-statemachine-module" value="addstatemachinejs">add</ui-button>
    <hr />
    <h2>请选择*.pos文件:&nbsp;</h2><h2 id="file-name"></h2><br>
    <ui-button type="button"id="file-btn")/>file</ui-button>
        <input type="file" id="upload-file" hidden=true/>
    <ui-button type="button" id="parse" value="parse"/>start</ui-button>
    `
    ,

    $: {
        file: '#upload-file',
        btn: '#parse',
        add: '#add-statemachine-module',
        filebtn: '#file-btn',
        filename: '#file-name',
    },

    ready () {
         this.$filebtn.addEventListener('mouseup', function() {
                this.$file.click();
                //"document.querySelector('#demo').click()"
        }.bind(this));

        this.$file.addEventListener('change',function(){
             this.$filename.innerText = this.$file.files[0].name;
        }.bind(this));

        this.$btn.addEventListener("mouseup",function(){
            var file;
                for(var x = 0, xlen = this.$file.files.length; x < xlen; x++) {
                    file = this.$file.files[x];
                        Editor.success("processon-statemachine: loading pos file");
                        var reader = new FileReader();
                        
                        reader.onload = function(e) {
                            Editor.success("processon-statemachine: parsing pos file");
                            //Editor.log(reader.result);
                            Editor.Ipc.sendToMain("processon-statemachine:receive-json",JSON.parse(reader.result));
                        };
                        
                        reader.readAsText(file);
            }
        }.bind(this));

        

        this.$add.addEventListener("mouseup",function(){
            Editor.success("processon-statemachine: sending request to main");
            Editor.Ipc.sendToMain("processon-statemachine:add-statemachine-model");
        })
    },
});