

<!--代码储备库( CodeReserve ))-->
<template>
    <div :style="{height:(screenSize.height)+'px'}" >
        <!-- 搜索框开始 -->
        <el-row  >
            <el-col :span="19">
                <el-form  class="demo-form-inline">
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item  >
                                <el-input class="input-border" v-model="pageData.name_eq" placeholder="请输入名称" autocomplete="off"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-select v-model="pageData.codeType_eq" placeholder="请选择" @change="search()">
                                <el-option  v-for="item in getOptions('codeType')" :key="item.label" :label="item.label" :value="item.value" ></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-form>
            </el-col>
            <el-col :span="5"  >
                <el-button type="primary" plain @click.prevent="search()">搜索</el-button>
                <!-- <el-button type="primary"  @click.prevent="moreIsShow.query = !moreIsShow.query">{{moreIsShow.query ? "收起" : "展开"}}</el-button> -->
                <el-button type="success" plain @click.prevent="goAdd()">新增</el-button>
                <el-button type="warning" plain @click.prevent="goEdit()">修改</el-button>
                <el-button type="danger" plain @click.prevent="delIsShow = !delIsShow">删除</el-button>
            </el-col>
        </el-row>
        <!-- 搜索框结束 -->
        <!-- 标签列表开始 -->
        <div class="radius-border">
            <div  v-for="(item, index) in listData.content"  :key="index" class="label-border" :style="{border: '2px solid '+labelColor[(index+1)%4],'background-color': labelClickIndex == index ?  labelColor[(index+1)%4] : '','margin-left': index == 0 ? '0px' : ''}">
                <span @click="labelClick(index)" class="label-span" :style="{color: labelClickIndex == index ?  'white' : '' }">{{item.name}}</span>
                <span class="x-span" v-if="delIsShow" @click="batchDel(item.id)">✖</span>
            </div>
        </div>
        <!-- 标签列表结束 -->
        <!-- 标签详情开始 -->
        <div class="radius-border margin-top-10 "   v-if="labelClickIndex != null"><!--border-2-adadad :style="{height:(screenSize.height - 90)+'px'}"-->
            <div  v-for="(item, index) in this.data.codeReserveDetail"  :key="index" class="label-border" :style="{border: '2px solid '+labelColor[(index+1)%4],'background-color': labelDetailClickIndex == index ?  labelColor[(index+1)%4] : '','margin-left': index == 0 ? '0px' : ''}">
                <span @click="labelDetailClick(index)" class="label-span" :style="{color: labelDetailClickIndex == index ?  'white' : '' }">{{item.name}}</span>
                <span class="x-span" v-if="delIsShow" @click="delDetails(index,'codeReserveDetail')">✖</span>
            </div>
            <div @click="goDetailAdd()" class="label-border" :style="{border: '2px solid '+labelColor[2],'background-color': labelColor[2]}">
                <span  class="label-span" :style="{color: 'white'}">新增</span>
            </div>
        </div>
        <!-- 标签详情结束 -->
        <!-- 标签内容开始 -->
        <div class="radius-border margin-top-10 border-2-adadad"   :style="{height:(screenSize.height - 130)+'px'}" v-if="labelDetailClickIndex != null">
            <div class="text-div2"  ref="sqlDiv" v-html="codeReserveDetail.content" ></div>
        </div>
        <!-- 标签内容结束 -->
        <!-- 新增/编辑开始 -->
        <el-dialog :title="viewDialog.isView ? '查看' : viewDialog.isView == null ? '新增' : '编辑'" :visible.sync="viewDialog.isShow" customClass="view-dialog" :close-on-click-modal="false">
            <el-form :model="data" v-loading="viewDialog.butIsLoading" :rules="rules" ref="ruleForm" >
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="名称" clearable :label-width="formLabelWidth" prop="name">
                            <el-input :disabled="viewDialog.isView" v-model="data.name" placeholder="请输入名称" maxlength="200"  autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="编号" clearable :label-width="formLabelWidth" prop="number">
                            <el-input :disabled="viewDialog.isView" v-model="data.number" placeholder="请输入编号" maxlength="200"  autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="备注" clearable :label-width="formLabelWidth" prop="remark">
                            <el-input :disabled="viewDialog.isView" v-model="data.remark" placeholder="请输入备注" maxlength="200"  autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer" v-show="!viewDialog.isView">
                <el-button @click="viewDialog.isShow = false" :loading="viewDialog.butIsLoading">取 消</el-button>
                <el-button type="primary" @click="save()" :loading="viewDialog.butIsLoading">保 存</el-button>
            </span>
        </el-dialog>
        <!-- 新增/编辑结束 -->

        <!-- 新增/编辑开始 -->
        <el-dialog :title="viewDetailDialog.isView ? '查看' : viewDetailDialog.isView == null ? '新增' : '编辑'" :visible.sync="viewDetailDialog.isShow" customClass="view-dialog" :close-on-click-modal="viewDetailDialog.isView">
            <el-form :model="data" v-loading="viewDetailDialog.butIsLoading" :rules="rules" ref="ruleForm" >
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="名称" clearable :label-width="formLabelWidth" prop="name">
                            <el-input :disabled="viewDetailDialog.isView" v-model="codeReserveDetail.name" placeholder="请输入名称" maxlength="200"  autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="编号" clearable :label-width="formLabelWidth" prop="number">
                            <el-input :disabled="viewDetailDialog.isView" v-model="codeReserveDetail.number" placeholder="请输入编号" maxlength="200"  autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="内容" clearable :label-width="formLabelWidth" prop="remark">
                             <kindeditor  v-if="!viewDetailDialog.isView"  :content.sync="codeReserveDetail.content" :id="'kin'"  height="450px"  width="100%"/>
                            <!-- <quill-editor v-if="!viewDetailDialog.isView" ref="myTextEditor" v-model="codeReserveDetail.content"  style="height:450px;"></quill-editor> --><!-- :options="editorOption" -->
                            <div class="text-div" v-if="viewDetailDialog.isView" ref="sqlDiv" v-html="codeReserveDetail.content" :style="{height:'450px'}"></div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer" >
                <el-button @click="viewDetailDialog.isShow = false" :loading="viewDetailDialog.butIsLoading">取 消</el-button>
                <el-button v-show="viewDetailDialog.isView" type="success"  @click="sqlCopy()" >复制</el-button>
                <el-button v-show="viewDetailDialog.isView" type="primary" @click="viewDetailDialog.isView = false" >编辑</el-button>
<!--                <el-button v-show="!viewDetailDialog.isView" @click="viewDetailDialog.isView = true" :loading="viewDetailDialog.butIsLoading">取 消</el-button>-->
                <el-button v-show="!viewDetailDialog.isView" type="primary" @click="saveDetail()" :loading="viewDetailDialog.butIsLoading">保 存</el-button>
            </span>
        </el-dialog>
        <!-- 新增/编辑结束 -->
    </div>
</template>
<script>
    export default {
        created() {
            this.monitorEnter();
            this.search();
            this.getParams();
            this.getEntityOptions();
            this.refreshScreenSize();
        },
        data() {
            return {
                labelColor:{
                    1 : "#E6A23C",
                    2 : "#67C23A",
                    3 : "#409EFF",
                    0 : "#F56C6C"
                },
                delIsShow : false,
                labelClickIndex:null,
                labelDetailClickIndex:null,
                moreIsShow:{
                    query:false,
                    viewDialog:false,
                },
                formLabelWidth: "100px",
                entityOptions:{
                },
                pageData:{
                    page:1,
                    size:10000,
                    codeType_eq:"1",
                    sort:'creationTime,DESC',
                },
                listData: {
                    loading:false,
                },
                viewDialog:{
                    isShow: false,
                    isView: false,
                    butIsLoading: false,
                },
                viewDetailDialog:{
                    isShow: false,
                    isView: false,
                    butIsLoading: false,
                },
                tableOptions:[],
                data: {
                    codeReserveDetail : [],
                },
                codeReserveDetail:{

                },
                currentIndex:null,
                rules: {
                    name : [
                        { required: true, message: '请输入名称', trigger: 'blur' },
                    ],
                    number : [
                        { required: false, message: '请输入编号', trigger: 'blur' },
                    ],
                    remark : [
                        { required: false, message: '请输入备注', trigger: 'blur' },
                    ],
                }
            };
        },
        methods: {
            //执行搜索
            search() {
                this.listData.loading = true;
                if(!this.isEmpty(this.pageData.creationTime)){
                    this.pageData['creationTime_ge'] = this.pageData.creationTime[0]+'T00:00:00';
                    this.pageData['creationTime_le'] = this.pageData.creationTime[1]+'T00:00:00';
                }
                this.getHttp("/api/systemConfig/codeReserve/findAllPageByParams?"+this.jsonToUrl(this.pageData)).then(result => {
                    this.listData = result;
                    this.listData.loading = false;
                    this.labelClick(this.labelClickIndex);
                });
            },
            //批量删除
            batchDel(id) {
                if (this.isEmpty(id) && this.$refs.listTable.selection.length == 0) {
                    this.$message.warning("请先勾选删除列");
                    return;
                }
                this.$confirm('确定要进行删除操作吗?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(() => {
                    if(this.isNotEmpty(id)){
                        this.getHttp("/api/systemConfig/codeReserve/delete?id="+id).then(result => {
                            this.search();
                        });
                    }else{
                        var ids = this.listExtract(this.$refs.listTable.selection,'id');
                        this.postHttp("/api/systemConfig/codeReserve/batchDelete",ids).then(result => {
                            this.search();
                        });
                    }
                })
            },
            //页码更新
            handleCurrentChange(val) {
                this.pageData.page = val;
                this.search();
            },
            //打开新增
            goAdd() {
                this.tableOptions = [];
                this.viewDialog.isShow = true;
                this.viewDialog.isView = null;
                this.data = {
                    codeType : this.pageData.codeType_eq,
                    codeReserveDetail : [],
                };
            },
            //打开详情
            goView(id) {
                this.viewDialog.isView = true;
                this.getHttp("/api/systemConfig/codeReserve/view?id="+id,{}).then(result => {
                    this.viewDialog.isShow = true;
                    this.data = result;
                });
            },
            //打开编辑
            goEdit() {
                 if(this.isEmpty(this.labelClickIndex)){
                    this.$message.warning("请选择标签");
                    return;
                }
                var id = this.listData.content[this.labelClickIndex].id;
                this.viewDialog.isView = false;
                this.getHttp("/api/systemConfig/codeReserve/view?id="+id).then(result => {
                    this.viewDialog.isShow = true;
                    this.data = result;
                });
            },
            //添加明细
            addDetails(mark) {
                var length = this.data[mark].length;
                this.data[mark].push({
                    index : length,
                });
            },
            //删除明细
            delDetails(index,mark) {
                this.$confirm('确定要进行删除操作吗?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(() => {
                    this.data[mark].splice(index,1);
                    this.save();
                })

            },
            //保存
            save(){
                this.viewDialog.butIsLoading = true;
                for(var i = 0; i < this.data.codeReserveDetail.length; i++){
                    this.data.codeReserveDetail[i].id = null;
                }
                this.postHttp("/api/systemConfig/codeReserve/deleteDetail",this.data).then(result => {
                    this.viewDialog.butIsLoading = false;
                    if(result.code == 200){
                        this.viewDialog.isShow = false;
                        this.search();
                    }
                });
            },

            //记录下标
            currentChange(row) {
                this.currentIndex = row.index;
            },
            //动态修改类名
            tableRowClassName({row, rowIndex}) {
                row.index = rowIndex;
                if(this.viewDialog.isView){
                    return 'warning-row';
                } else {
                    return 'edit-row';
                }
            },
            //上移
            up(mark){
                if(this.currentIndex == 0){
                    return;
                }
                this.data[mark] = Object.assign([],this.upIndex(this.data[mark],this.currentIndex));
                this.data[mark][this.currentIndex].index = this.currentIndex-1;
                this.data[mark][this.currentIndex-1].index = this.currentIndex+1;
                this.currentIndex = this.currentIndex-1;
            },
            //下移
            down(mark){
                if(this.currentIndex == this.data[mark].length -1){
                    return;
                }
                this.data[mark] = Object.assign([],this.downIndex(this.data[mark],this.currentIndex));
                this.data[mark][this.currentIndex].index = this.currentIndex+1;
                this.data[mark][this.currentIndex+1].index = this.currentIndex-1;
                this.currentIndex = this.currentIndex+1;
            },
            //获取下拉实体数据
            getEntityOptions() {
                this.getHttp("/api/common/getEntityOptions?"+this.jsonToUrl(this.entityOptions)).then(result => {
                    this.entityOptions = result;
                });
            },
            //点击标签
            labelClick(index){
                this.labelClickIndex = index;
                this.getHttp("/api/systemConfig/codeReserve/view?id="+this.listData.content[index].id,{}).then(result => {
                    this.data = result;
                });
            },

            //打开新增明细
            goDetailAdd() {
                this.viewDetailDialog.isShow = true;
                this.viewDetailDialog.isView = null;
                this.codeReserveDetail = {};
            },
            //点击明细标签
            labelDetailClick(index){
                this.labelDetailClickIndex = index;
                this.codeReserveDetail = this.data.codeReserveDetail[this.labelDetailClickIndex];
                //this.goDetailView();
            },
            //打开明细详情
            goDetailView() {
                this.viewDetailDialog.isView = true;
                this.viewDetailDialog.isShow = true;
            },
            //打开明细编辑
            goDetailEdit() {
                this.viewDetailDialog.isView = false;
                this.viewDetailDialog.isShow = true;
            },
            //保存明细
            saveDetail(){
                  if(this.isEmpty(this.codeReserveDetail.name)){
                     this.$message({ message: '名称不能为空', type: 'error' });
                     return;
                }
                if(this.isEmpty(this.codeReserveDetail.id)){
                    this.data.codeReserveDetail.push(this.codeReserveDetail);
                }else{
                    this.data.codeReserveDetail[this.labelDetailClickIndex] = this.codeReserveDetail;
                }
                for(var i = 0; i < this.data.codeReserveDetail.length; i++){
                    this.data.codeReserveDetail[i].id = null;
                }
                this.postHttp("/api/systemConfig/codeReserve/save",this.data).then(result => {
                    this.viewDialog.butIsLoading = false;
                    if(result.code == 200){
                        this.viewDetailDialog.isShow = false;
                            this.labelClick(this.labelClickIndex);
                    }
                });
            },
             //复制语句
            sqlCopy() {
                var selection = window.getSelection();
                var range = document.createRange();
                range.selectNodeContents(this.$refs.sqlDiv);
                selection.removeAllRanges();
                selection.addRange(range);
                if (document.execCommand('copy')) {
                document.execCommand('copy');
                    this.$message({ message: '复制成功', type: 'success' });
                }
                selection.removeAllRanges();
            },
            //监听enter事件
            monitorEnter(){
                var _self = this
                document.onkeydown = function () {
                    var key = window.event.keyCode
                    if (key === 13) {
                        _self.goDetailEdit();
                    }
                };
            }
        }
    };
</script>
<style  >
/* 圆框的样式 */
.input-border .el-input__inner {
    border-radius: 10px;
    margin-left: 0px;
    overflow:auto;
    border: 2px solid #adadad;
    height: 42px;
    font-size: 16px;
}
/* 下拉框 */
.el-input--suffix .el-input__inner {
     border-radius: 10px;
    overflow:auto;
    border: 2px solid #adadad;
    margin-left: 4px;
    height: 42px;
    font-size: 16px;
}
.el-select-dropdown__item {
    font-size: 16px;
    padding: 0 20px;
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #606266;
    height: 34px;
    line-height: 34px;
    box-sizing: border-box;
    cursor: pointer;
}
.el-select-dropdown__item.selected {
    color: #409EFF;
    font-size: 16px;
}
.el-form-item {
    margin-bottom: 12px;
}
/* 圆框的样式 */
.radius-border {
    border-radius: 10px;
    overflow:auto;
}
.label-border {
    height: 36px;
    line-height: 36px;
    margin: 4px;
    float: left;
    border-radius: 10px;
}
.label-span {
    cursor: default;
    margin-left: 5px;
    margin-right: 5px;
}
.x-span {
    cursor: default;
    color: red;
    margin-right: 5px;
}
.text-div {
   overflow-y: scroll;
   background-color: #f5f7fa;
   border-color: #e4e7ed;
   color: #c0c4cc;
   cursor: text;
   -webkit-appearance: none;
   border-radius: 4px;
   height: 350px;
   border: 1px solid #dcdfe6;
   color: #606266;
   padding: 0 15px;
}
.text-div2 {
    overflow:hidden;
    border-color: #e4e7ed;
    color: #c0c4cc;
    cursor: text;
    -webkit-appearance: none;
    border-radius: 4px;
    color: #606266;
    padding: 0 15px;
}
.el-form-item__content {
    line-height: 15px;
    position: relative;
    font-size: 14px;
}

</style>
