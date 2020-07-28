<!--项目表(project)-->
<template>
    <div :style="{height:(screenSize.height)+'px'}">
        <el-row :gutter="10" style="height:100%">
            <el-col :span="6" style="height:100%">
                <!-- 列表框开始 -->
                <div class="custom-tree-container tree-node">
                    <div class="block">
                        <el-tree :data="listData.content" node-key="id" default-expand-all :expand-on-click-node="false">
                             <span class="custom-tree-node" slot-scope="{ node, data }">
                                <span><i :class="data.icon" :style="{color : data.color}"></i>  {{ node.label }}</span>
                                <span>
                                    <el-button type="warning" icon="al-icon-tool" size="small" class="operat-but" circle @click="() => goTools(data)"></el-button>
                                    <el-button type="info" icon="al-icon-view" size="small" class="operat-but" circle @click="() => goView(data)"></el-button>
                                    <el-button type="success" icon="al-icon-add-details" size="small" class="operat-but" circle @click="() => goAdd(data)"></el-button>
                                    <el-button type="primary" icon="al-icon-edit" size="small" class="operat-but" circle @click="() => goEdit(data)"></el-button>
                                    <el-button type="danger" icon="al-icon-del" size="small" class="operat-but" circle @click="() => batchDel(data.id)" ></el-button>
                                </span>
                             </span>
                        </el-tree>
                    </div>
                </div>
                <!-- 列表框结束 -->
            </el-col>
            <el-col :span="18" style="height:100%">
                <div class="div-view" v-show="viewDialog.isShow">
                    <!-- 新增/编辑开始 -->
                    <el-form :model="data" v-loading="viewDialog.butIsLoading" :rules="rules" ref="ruleForm">
                        <el-row >
                            <el-col :span="12">
                                 <el-form-item label="名称" clearable :label-width="formLabelWidth" prop="name">
                                    <el-input :disabled="!viewDialog.isEdit" v-model="data.name" placeholder="请输入名称"  autocomplete="off" ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="编号" clearable :label-width="formLabelWidth" prop="number">
                                    <el-input :disabled="!viewDialog.isEdit" v-model="data.number"  placeholder="请输入编号"  autocomplete="off" ></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>        
                        <el-row >
                            <el-col :span="12">
                                <el-form-item label="备注" clearable :label-width="formLabelWidth" prop="remark">
                                    <el-input :disabled="!viewDialog.isEdit" v-model="data.remark" placeholder="请输入备注" autocomplete="off" ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="父对象"  clearable :label-width="formLabelWidth" prop="prefix">
                                    <el-input :disabled="true" v-if="data.projectEntity != undefined" v-model="data.projectEntity.name" autocomplete="off" ></el-input>
                                    <el-input :disabled="true" v-if="data.projectEntity == undefined" v-model="data.projectEntity" autocomplete="off" ></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>        
                        <el-form-item label="SQL"  clearable :label-width="formLabelWidth" v-if="viewDialog.isTools">
                            <div class="sql-div" ref="sqlDiv" v-html="data.sql"  @click="sqlCopy()" :style="{height:(screenSize.height - 180)+'px'}" >
                            </div>
                        </el-form-item>
                    </el-form>
                    <!-- 新增明细开始 -->
                    <div v-if="data.level != 2 && !viewDialog.isTools">
                        <el-row class="spacing" v-show="viewDialog.isEdit">
                            <el-button type="primary"  @click.prevent="addDetails()" :loading="viewDialog.butIsLoading" >新增</el-button>
                            <el-button type="warning"  @click.prevent="up()" :loading="viewDialog.butIsLoading" plain>上移</el-button>
                            <el-button type="primary"  @click.prevent="down()" :loading="viewDialog.butIsLoading" plain>下移</el-button>
                        </el-row>
                        <el-table ref="tbEdit" :data="data.detailEntitys" border :height="screenSize.height - (viewDialog.isEdit ? 250 : 124)" v-loading="viewDialog.butIsLoading" highlight-current-row :row-class-name="tableRowClassName"  @current-change="currentChange" class="tb-edit">
                            <el-table-column width="50" type="index" label="序号"></el-table-column>
                            <el-table-column label="名称" width="150">
                                <template scope="scope">
                                    <el-input v-model="scope.row.name" placeholder="请输入名称" :disabled="scope.row.columnProperties == 'linkColumn'" clearable></el-input>
                                    <span>{{scope.row.name}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="属性名" width="150" >
                                <template scope="scope">
                                    <el-input v-model="scope.row.number" placeholder="请输入属性名" :disabled="scope.row.columnProperties == 'linkColumn'" clearable></el-input>
                                    <span>{{scope.row.number}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="字段属性" width="150" >
                                <template scope="scope">
                                    <el-select v-model="scope.row.columnProperties" placeholder="请选择字段属性"  @change="columnPropertiesChange(scope.$index,scope.row.columnProperties)">
                                        <el-option v-for="item in getOptions('columnProperties')" :key="item.label" :label="item.label" :value="item.value"> </el-option>
                                    </el-select>
                                    <span>{{scope.row.columnProperties | paramsFmt('columnProperties')}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="字段类型" width="200" >
                                <template scope="scope">
                                    <el-select v-model="scope.row.type" placeholder="请选择字段类型" :disabled="scope.row.columnProperties != 'baseColumn'" @change="typeChange(scope.row)">
                                        <el-option v-for="item in getOptions('columnType')" :key="item.label" :label="item.label" :value="item.value"> </el-option>
                                    </el-select>
                                    <span>{{scope.row.type | paramsFmt('columnType')}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="关联表" width="150" >
                                <template scope="scope">
                                    <el-select v-model="scope.row.linkTable" placeholder="请选择关联表" :disabled="scope.row.columnProperties != 'linkColumn'"  @change="linkTableChange(scope.row)">
                                        <el-option v-for="item in tableOptions" :key="item.label" :label="item.label" :value="item.value"> </el-option>
                                    </el-select>
                                    <span>{{scope.row.linkTable | optionsFmt(tableOptions)}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="关联参数" width="150">
                                <template scope="scope">
                                    <el-input  v-model="scope.row.linkParam" placeholder="请输入关联参数" clearable :disabled="scope.row.columnProperties != 'paramColumn'"></el-input> <span>{{scope.row.linkParam}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="允许为空">
                                <template scope="scope">
                                    <el-select v-model="scope.row.allowEmpty" placeholder="请选择" >
                                        <el-option v-for="item in getOptions('yesOrNo')" :key="item.label" :label="item.label" :value="item.value" ></el-option>
                                    </el-select>
                                    <span>{{scope.row.allowEmpty | paramsFmt('yesOrNo')}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="长度">
                                <template scope="scope">
                                    <el-input v-model="scope.row.length" placeholder="请输入长度" clearable :disabled="scope.row.columnProperties != 'baseColumn'"></el-input>
                                    <span>{{scope.row.length}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="小数位">
                                <template scope="scope">
                                    <el-input v-model="scope.row.places" placeholder="请输入小数位" clearable :disabled="scope.row.columnProperties != 'baseColumn'"></el-input>
                                    <span>{{scope.row.places}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="默认值">
                                <template scope="scope">
                                    <el-input v-model="scope.row.defaultValue" placeholder="请输入默认值" clearable :disabled="scope.row.columnProperties != 'baseColumn'"></el-input>
                                    <span>{{scope.row.defaultValue}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" v-if="viewDialog.isEdit">
                                <template slot-scope="scope">
                                    <el-button type="danger" plain size="small" @click="delDetails(scope.$index)" v-if="isEmpty(scope.row.id) && scope.row.number != 'parentId'">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                     <el-row class="tool-spacing" v-show="viewDialog.isTools">
                        <el-button @click="viewDialog.isShow = false" >执行SQL</el-button>
                        <el-button type="primary" @click="buildFileDialog.isShow = true" :loading="viewDialog.butIsLoading" v-if="data.level == 3" >生成代码</el-button>
                    </el-row>
                    <el-row class="save-spacing" v-show="viewDialog.isEdit">
                        <el-button @click="viewDialog.isShow = false" :loading="viewDialog.butIsLoading">取 消</el-button>
                        <el-button type="primary" @click="save()" :loading="viewDialog.butIsLoading">保 存</el-button>
                    </el-row>
                    <el-dialog title="生成代码" :visible.sync="buildFileDialog.isShow" width="30%" >
                        <el-checkbox-group v-model="buildFileDialog.fileTypes" >
                            <div  v-for="item in (parseInt(getOptions('fileType').length / 3) + 1)" :key="item.label">
                                <el-row :class="item != 1 ? 'margin-top-22' : ''" >
                                    <el-col :span="8" v-if="((item - 1)*3+0) < getOptions('fileType').length" ><el-checkbox class="fileType-checkbox" v-model="getOptions('fileType')[(item - 1)*3+0].value" :label="getOptions('fileType')[(item - 1)*3+0].value" border></el-checkbox></el-col>
                                    <el-col :span="8" v-if="((item - 1)*3+1) < getOptions('fileType').length" ><el-checkbox class="fileType-checkbox" v-model="getOptions('fileType')[(item - 1)*3+1].value" :label="getOptions('fileType')[(item - 1)*3+1].value" border></el-checkbox></el-col>
                                    <el-col :span="8" v-if="((item - 1)*3+2) < getOptions('fileType').length" ><el-checkbox class="fileType-checkbox" v-model="getOptions('fileType')[(item - 1)*3+2].value" :label="getOptions('fileType')[(item - 1)*3+2].value" border></el-checkbox></el-col>
                                </el-row> fileType-
                            </div>
                        </el-checkbox-group>   
                        <span slot="footer" >
                            <el-button @click="buildFileDialog.isShow = false">取 消</el-button>
                            <el-button  :type="this.buildFileDialog.isAllSelect ? 'success' : 'primary'" plain  @click="fileTypesAll">{{this.buildFileDialog.isAllSelect ? '取消全选' : '全 选'}}</el-button>
                            <el-button type="primary"  @click="buildFile">确 定</el-button>
                        </span>
                    </el-dialog>

                    <!-- 新增/编辑结束 -->
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    export default {
        created() {
            this.search();
            this.getParams();
            this.refreshScreenSize();
        },
        data() {
            return {
                pageData: {
                    page: 1,
                    size: 5,
                    sort: "creationTime,DESC"
                },
                viewDialog: {
                    isTools: false,
                    isShow: false,
                    isEdit: false,
                    butIsLoading: false
                },
                buildFileDialog: {
                    isAllSelect:false,
                    isShow: false,
                    butIsLoading: false,
                    fileTypes:[],
                },
                tableOptions:[],
                formLabelWidth: "120px",
                currentIndex: null,
                data: {
                    projectEntity:{},
                    detailEntitys: []
                },
                listData: {
                    loading: false
                },
                rules: {
                    name: [{required: false, message: "请输入名称", trigger: "blur"}],
                    number: [
                        {required: false, message: "请输入编号", trigger: "blur"}
                    ],
                    remark: [
                        {required: false, message: "请输入备注", trigger: "blur"}
                    ]
                },
            };
        },
        methods: {
            //执行搜索
            search() {
                this.listData.loading = true;
                if (!this.isEmpty(this.pageData.creationTime)) {
                    this.pageData["creationTime_ge"] =
                        this.pageData.creationTime[0] + "T00:00:00";
                    this.pageData["creationTime_le"] =
                        this.pageData.creationTime[1] + "T00:00:00";
                }
                this.pageData.projectId_isNull = null;
                this.getHttp(
                    "/api/project/findAll?" + this.jsonToUrl(this.pageData)
                ).then(result => {
                    this.listData = result;
                    this.listData.loading = false;
                });
            },
            //批量删除
            batchDel(id) {
                if (this.isEmpty(id) && this.$refs.listTable.selection.length == 0) {
                    this.$message.warning("请先勾选删除列");
                    return;
                }
                this.$confirm('确定要进行删除操作吗?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(() => {
                    if (this.isNotEmpty(id)) {
                        this.getHttp("/api/project/delete?id=" + id).then(result => {
                            this.search();
                        });
                    } else {
                        var ids = this.listExtract(this.$refs.listTable.selection, "id");
                        this.postHttp("/api/project/batchDelete", ids).then(result => {
                            this.search();
                        });
                    }
                })
                
            },
            //打开新增
            goAdd(row) {
                var projectId = this.isEmpty(row.projectId) ? row.id : row.projectId;
                this.getTableOptions(projectId);
                this.viewDialog.isEdit = true;
                this.viewDialog.isTools = false;
                this.getHttp("/api/project/simpleView?id=" + projectId, {}).then(result => {
                    this.viewDialog.isShow = true;
                    this.data = {
                        prefix : result.prefix,
                        level : row.level + 1,
                        projectId : projectId,
                        projectEntity :{ id : row.id, name : row.label},
                        parentId : row.id,
                        detailEntitys : result.detailEntitys
                    }
                    if(row.level > 2){
                        this.data.detailEntitys.push(
                            {
                                id:row.id,
                                name: '父对象关联',
                                number:'parentId',
                                linkTable : row.id,
                                allowEmpty: "N",
                                columnProperties : 'linkColumn',
                                isKey: "N"
                            }
                        );
                    }
                    console.log(JSON.stringify(this.data));
                });
              
            },
            //打开工具箱
            goTools(row) {
                this.getTableOptions(this.isEmpty(row.projectId) ? row.id : row.projectId);
                this.viewDialog.isEdit = false;
                this.viewDialog.isTools = true;
                this.getHttp("/api/project/tools?id=" + row.id, {}).then(result => {
                    this.viewDialog.isShow = true;
                    this.data = result;
                    this.data.level = row.level;
                    this.data.projectEntity  = {id : row.parentId,name : row.parentName};
                });
            },
            //复制语句
            sqlCopy(){
                var selection = window.getSelection();
                var range = document.createRange();
                range.selectNodeContents(this.$refs.sqlDiv);
                selection.removeAllRanges();
                selection.addRange(range);
                //this.copy(text);
            },  
            //打开详情
            goView(row) {
                this.getTableOptions(this.isEmpty(row.projectId) ? row.id : row.projectId);
                this.viewDialog.isEdit = false;
                this.viewDialog.isTools = false;
                this.getHttp("/api/project/editView?id=" + row.id, {}).then(result => {
                    this.viewDialog.isShow = true;
                    this.data = result;
                    //this.data.projectEntity  = {id : row.parentId,name : row.parentName};
                });
            },
            //打开编辑
            goEdit(row) {
                this.getTableOptions(this.isEmpty(row.projectId) ? row.id : row.projectId);
                this.viewDialog.isEdit = true;
                this.viewDialog.isTools = false;
                this.getHttp("/api/project/editView?id=" + row.id).then(result => {
                    this.viewDialog.isShow = true;
                    this.data = result;
                    //this.data.projectEntity = {id : row.parentId,name : row.parentName};
                });
            },
            //添加明细
            addDetails() {
                this.data.detailEntitys.push({
                    parentId: this.data.id,
                    allowEmpty: "Y",
                    columnProperties : 'baseColumn',
                    type : 'varchar',
                    length : '200',
                    isKey: "N"
                });
            },
            //上移
            up(){
                if(this.currentIndex == 0){
                    return;
                }
                this.data.detailEntitys = Object.assign([],this.upIndex(this.data.detailEntitys,this.currentIndex));
                this.data.detailEntitys[this.currentIndex].index = this.currentIndex-1;
                this.data.detailEntitys[this.currentIndex-1].index = this.currentIndex+1;
                this.currentIndex = this.currentIndex-1;
            },
            //下移
            down(){
                if(this.currentIndex == this.data.detailEntitys.length -1){
                    return;
                }
                this.data.detailEntitys = Object.assign([],this.downIndex(this.data.detailEntitys,this.currentIndex)); 
                this.data.detailEntitys[this.currentIndex].index = this.currentIndex+1;
                this.data.detailEntitys[this.currentIndex+1].index = this.currentIndex-1;
                this.currentIndex = this.currentIndex+1;
            },
            //动态修改类名
            tableRowClassName({row, rowIndex}) {
                row.index = rowIndex;
                if (this.isNotEmpty(row.id) || row.number == 'parentId') {
                    return 'warning-row';
                } else { 
                    return 'edit-row';
                }
            },
            //记录下标
            currentChange(row) {
                this.currentIndex = row.index;
            },
            //删除明细
            delDetails(index) {
                this.data.detailEntitys.splice(index, 1);
            },
            //保存
            save() {
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        this.viewDialog.butIsLoading = true;
                        var detailEntitysTemp = [];
                        for(var i = 0 ; i < this.data.detailEntitys.length ; i++){
                            if(this.isEmpty(this.data.detailEntitys[i].id) || this.data.detailEntitys[i].number == 'parentId'){
                                this.data.detailEntitys[i].id = null;
                                detailEntitysTemp.push(this.data.detailEntitys[i]);
                            }
                        }
                        var dataSave = Object.assign({},this.data);
                        dataSave.detailEntitys = detailEntitysTemp;
                        this.postHttp("/api/project/save", dataSave).then(result => {
                            this.viewDialog.butIsLoading = false;
                            if (result.code == 200) {
                                this.viewDialog.isShow = false;
                                this.search();
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            //获取table 下拉参数
            getTableOptions(id) {
                this.getHttp("/api/project/getTableOptions?id="+id,{}).then(result => {
                    this.tableOptions = result;
                });
            },
            //字段属性改变
            columnPropertiesChange(index,columnProperties){
                this.data.detailEntitys[index] = {
                    columnProperties: columnProperties,
                    parentId: this.data.id,
                    allowEmpty: "Y",
                    isKey: "N"
                };
                if(columnProperties == 'baseColumn'){
                    this.data.detailEntitys[index].type = 'varchar'; 
                    this.data.detailEntitys[index].length = '200'; 
                }else if(columnProperties == 'linkColumn'){
                }else if(columnProperties == 'paramColumn'){
                }
                this.data.detailEntitys = Object.assign([],this.data.detailEntitys);
            },
            //字段类型改变
            typeChange(data){
                var type = data.type;
                if(type == 'int'){
                    data.length = '11'; 
                    data.places = '0'; 
                }else if(type == 'varchar'){
                    data.length = '200'; 
                    data.places = ''; 
                }else if(type == 'decimal'){
                    data.length = '11'; 
                    data.places = '2'; 
                }else if(type == 'datetime'){
                    data.length = ''; 
                    data.places = ''; 
                }else if(type == 'char'){
                    data.length = '1'; 
                    data.places = ''; 
                }
                data.defaultValue = ''; 
            },
            //关联表改变了
            linkTableChange(data){
                var id = data.linkTable;
                for(var i = 0; i < this.tableOptions.length ; i++){
                    var obj = this.tableOptions[i];
                    if(id == obj.value){
                        data.name = obj.label; 
                        data.number = obj.number;
                        data.remark = obj.parentNumber;
                        return;
                    }
                }
            },
            //全选
            fileTypesAll(){
                this.buildFileDialog.isAllSelect = !this.buildFileDialog.isAllSelect;
                this.buildFileDialog.fileTypes = [];
                if(this.buildFileDialog.isAllSelect){
                    for(var i = 0 ; i < this.getOptions('fileType').length; i++){
                        this.buildFileDialog.fileTypes.push(this.getOptions('fileType')[i].value);
                    }
                }
            },
            //生成文件
            buildFile(){
                console.log(JSON.stringify(this.buildFileDialog.fileTypes));
                this.postHttp("/api/project/buildFile?id="+this.data.id, this.buildFileDialog.fileTypes).then(result => {
                    this.search();
                });
            },
        },
        
    };
</script>
<style>
    .tree-node {
        height: 100%;
        border-radius: 25px;
        padding: 15px;
        border: 2px solid #ADADAD;
    }
    .div-view {
        height:100%;
        border-radius: 25px;
        padding: 20px;
        border: 2px solid #ADADAD;
    }


    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
        border-radius: 15px;
    }

    .el-tree-node {
        white-space: nowrap;
        outline: 0;
    }

    .el-tree-node__content {
        display: -ms-flexbox;
        display: flex;
        -ms-flex-align: center;
        align-items: center;
        border-radius: 15px;
        height: 42px;
        cursor: pointer;
    }
    .sql-div{
        overflow-y:scroll;
        background-color: #F5F7FA;
        border-color: #E4E7ED;
        color: #C0C4CC;
        cursor: not-allowed;
        -webkit-appearance: none;

        border-radius: 4px;
        border: 1px solid #DCDFE6;
        color: #606266;
        padding: 0 15px;
    }
    .tool-spacing{
        text-align: right;
    }
    .operat-but{
        width: 35px;
    }
    .el-button+.el-button {
        margin-left: 0px;
    }
    .fileType-checkbox {
        width: 150px;
    }
</style>