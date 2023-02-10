

<!--代码储备库( CodeReserve ))-->
<template>
    <div :style="{height:(screenSize.height)+'px'}">
        <!-- 搜索框开始 -->
        <el-form  class="demo-form-inline">
            <el-row :gutter="20">
                <el-col :span="4">
                    <el-select v-model="pageData.topicType_eq" placeholder="请选择" @change="getNextTopic()">
                        <el-option  v-for="item in getOptions('topicType')" :key="item.label" :label="item.label" :value="item.value" ></el-option>
                    </el-select>
                </el-col>
                <el-col :span="4">
                    <el-select v-model="pageData.topicDetailType_eq" placeholder="请选择" @change="getNextTopic()">
                        <el-option  v-for="item in opicDetailTypeOptions" :key="item.label" :label="item.label" :value="item.value" ></el-option>
                    </el-select>
                </el-col>
                <el-col :span="10">
                    <div  class="label-border-prompt" >
                        <span class="label-span-prompt" >您本次为第 <span style="color: #E6A23C;">{{prompt.count}}</span> 次考核 , 已做 <span style="color: #67C23A;">{{prompt.alreadyCount}}</span> 题 , 未做 <span style="color: #F56C6C;">{{prompt.noCount}}</span> 题。</span>
                    </div>
                </el-col>
            </el-row>
        </el-form>
        <!-- 搜索框结束 -->
        <!-- 题目详情开始 -->
        <div class="radius-border margin-top-10 border-2-495e9b " :style="{height:(screenSize.height - 20)+'px'}" >
            <el-form class="form-div" :model="data" v-loading="viewDetailDialog.butIsLoading" :rules="rules" ref="ruleForm" >
                <el-row>
                     <el-col :span="12">
                        <el-form-item label="主题" clearable :label-width="formLabelLeftWidth" prop="topicName">
                            <el-input disabled v-model="topicDetail.topicType" maxlength="200"  autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="简称" clearable :label-width="formLabelWidth" prop="topicName">
                            <el-input :disabled="viewDetailDialog.isView" v-model="topicDetail.name" placeholder="请输入简称" maxlength="200"  autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="题目" clearable :label-width="formLabelLeftWidth" prop="topicName">
                            <el-input :disabled="viewDetailDialog.isView" v-model="topicDetail.topicName" placeholder="请输入简称" maxlength="200"  autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="内容" clearable :label-width="formLabelLeftWidth" prop="remark">
                            <quill-editor v-if="!viewDetailDialog.isView" ref="myTextEditor" v-model="topicDetail.content"  :style="{height:(screenSize.height - 356)+'px'}"></quill-editor><!-- :options="editorOption" -->
                            <div class="text-div" v-if="viewDetailDialog.isView"  ref="sqlDiv" v-html="topicDetail.content" :style="{height:(screenSize.height - 290)+'px'}"></div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :style="{'margin-top': viewDetailDialog.isView ? '0px' : '70px'}">
                     <el-col :span="12">
                        <el-form-item label="评分" clearable :label-width="formLabelLeftWidth" prop="remark">
                            <div class="item-div"> <el-rate class="rate-div" v-model="topicDetail.thisRate"  ></el-rate></div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="平均评分" clearable :label-width="formLabelWidth" prop="avgRate">
                            <div class="item-div" @click="viewDetailDialog.isView = true"> <el-rate disabled class="rate-div" v-model="topicDetail.avgRate"  show-score  text-color="red"></el-rate></div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-col :span="24"  class="form-but">
                    <el-button type="success"  :loading="viewDetailDialog.rateIsLoading" @click="saveDetail(false)">评分</el-button>
                    <el-button type="primary"  :loading="viewDetailDialog.nextTopicIsLoading" @click="getNextTopic()">下一题</el-button>
                    <el-button v-show="viewDetailDialog.isView" type="danger" @click="viewDetailDialog.isView = false" >编辑</el-button>
                    <el-button v-show="!viewDetailDialog.isView" type="danger" @click="saveDetail(true)" :loading="viewDetailDialog.butIsLoading">保 存</el-button>
                </el-col>
            </el-form>

        </div>
        <!-- 题目详情结束 -->

    </div>
</template>
<script>
    export default {
        created() {
            this.search();
            this.getParams();
            this.getEntityOptions();
            this.refreshScreenSize();
            this.getTopicDetailTypeOptions();
            this.getNextTopic();
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
                formLabelWidth: "80px",
                formLabelLeftWidth: "50px",
                prompt: {},
                entityOptions:{
                },
                pageData:{
                    page:1,
                    size:10000,
                    topicType_eq:"java",
                    topicDetailType_eq:"",
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
                    isView: true,
                    nextTopicIsLoading: false,
                },
                tableOptions:[],
                data: {
                    topicDetail : [],
                },
                topicDetail:{

                },
                opicDetailTypeOptions:[],
                currentIndex:null,
                rules: {
                    name : [
                        { required: false, message: '请输入名称', trigger: 'blur' },
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
                this.getHttp("/api/topicManage/topic/findAllPageByParams?"+this.jsonToUrl(this.pageData)).then(result => {
                    this.listData = result;
                    this.listData.loading = false;
                    this.labelClick(this.labelClickIndex);
                });
            },
            //页码更新
            handleCurrentChange(val) {
                this.pageData.page = val;
                this.search();
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
            //获取下拉实体数据
            getEntityOptions() {
                this.getHttp("/api/common/getEntityOptions?"+this.jsonToUrl(this.entityOptions)).then(result => {
                    this.entityOptions = result;
                });
            },
            //打开详情
            getNextTopic() {
                this.viewDetailDialog.nextTopicIsLoading = true;
                this.getHttp("/api/topicManage/topic/getNextTopic?topicType="+this.pageData.topicType_eq+"&topicId="+this.pageData.topicDetailType_eq).then(result => {
                    this.viewDetailDialog.nextTopicIsLoading = false;
                    this.topicDetail = result;
                    this.getTestCount();
                });
            },
            //打开新增明细
            goDetailAdd() {
                this.viewDetailDialog.isShow = true;
                this.viewDetailDialog.isView = null;
                this.topicDetail = {};
            },
            //点击明细标签
            labelDetailClick(index){
                this.labelDetailClickIndex = index;
                this.topicDetail = this.data.topicDetail[this.labelDetailClickIndex];
                this.goDetailView();
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
            saveDetail(isEdit){
                this.viewDetailDialog.rateIsLoading = true;
                this.topicDetail.isEdit = isEdit;
                this.postHttp("/api/topicManage/topic/saveDetail",this.topicDetail).then(result => {
                    this.viewDetailDialog.rateIsLoading = false;
                    if(result.code == 200){
                        if(!isEdit){
                            this.getNextTopic();
                        }
                        this.viewDetailDialog.isView = true;

                    }
                });
            },
            getTopicDetailTypeOptions(){
                this.getHttp("/api/topicManage/topic/getTopicDetailTypeOptions?topicType="+this.pageData.topicType_eq).then(result => {
                     this.opicDetailTypeOptions =  result;
                });
            },
            getTestCount(){
                this.getHttp("/api/topicManage/topic/getTestCount?topicType="+this.pageData.topicType_eq+"&topicId="+this.topicDetail.parentId).then(result => {
                     this.prompt =  result;
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

        }
    };
</script>
<style  >
.el-input.is-disabled .el-input__inner {
    background-color: #F5F7FA;
    border-color: #E4E7ED;
    color: #000000;
    cursor: not-allowed;
}
/* 圆框的样式 */
.input-border .el-input__inner {
    border-radius: 10px;
    overflow:auto;
    border: 2px solid #495e9b;
    margin-left: 0px;
    height: 42px;
    font-size: 16px;
    width: 100%;
}
/* 下拉框 */
.el-input--suffix .el-input__inner {
     border-radius: 10px;
    overflow:auto;
    border: 2px solid #495e9b;
    margin-left: 4px;
    height: 42px;
    width: 100%;
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
    width: 100%;
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
    width: 100%;
    overflow:auto;
}
.form-div{
    padding: 20px;
}
.label-border {
    height: 36px;
    line-height: 36px;
    margin: 4px;
    float: left;
    border-radius: 10px;
}
.label-span {
    margin-left: 5px;
    margin-right: 5px;
}
.label-border-prompt {
    border: 2px solid #495e9b;
    height: 39px;
    line-height: 39px;
    text-align: center;
    float: left;
    border-radius: 10px;
}
.label-span-prompt {
    /* color: #495e9b; */
    margin-left: 15px;
    margin-right: 15px;
}
.x-span {
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
   height: 400px;
   border: 1px solid #dcdfe6;
   color: #606266;
   padding: 0 15px;
}
.item-div {
   overflow-y: scroll;
   background-color: #f5f7fa;
   border-color: #e4e7ed;
   color: #c0c4cc;
   cursor: text;
   -webkit-appearance: none;
   border-radius: 4px;
   height: 45px;
   border: 1px solid #dcdfe6;
   line-height: 45px;
   color: #606266;
   padding: 0 15px;
}
.rate-div {
    margin-top: 12px;
}
.el-form-item__content {
    line-height: 15px;
    position: relative;
    font-size: 14px;
}
.form-but{
    text-align: center;
    margin-top: 10px;
}


</style>
