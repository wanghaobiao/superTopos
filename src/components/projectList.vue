<template>
    <div>
         <!-- 搜索框开始 -->
        <el-row :gutter="10">
            <el-col :span="12">
                <el-form :inline="true"  class="demo-form-inline">
                    <el-form-item label="项目名称" >
                        <el-input v-model="pageData.kName_eq" placeholder="请输入审批人" ></el-input>
                    </el-form-item>
                    <el-form-item label="项目编号" >
                        <el-input v-model="pageData.kNumber_eq" placeholder="请输入审批人"></el-input>
                    </el-form-item>
                    <el-form-item label="创建人" >
                        <el-input v-model="pageData.kCreate_eq" placeholder="请输入审批人"></el-input>
                    </el-form-item>
                </el-form>
                <el-form :inline="true"  class="demo-form-inline">
                    <el-form-item label="创建时间" >
                        <el-input v-model="pageData.kCreationTime" placeholder="请输入审批人" ></el-input>
                    </el-form-item>
                    <el-form-item label="审批人" >
                        <el-input v-model="pageData.kCreationTime" placeholder="请输入审批人"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="6">
                <el-button type="primary" @click.prevent="search()">搜索</el-button>
            </el-col>
        </el-row>
        <!-- 搜索框结束 -->
        <!-- 按钮框开始 -->
        <el-row class="spacing">
            <el-button type="primary" @click.prevent="goAdd()">新增</el-button>
            <el-button type="danger">删除</el-button>
        </el-row>
        <!-- 按钮框结束 -->
        <!-- 列表框开始 -->
        <el-table :data="listData.content" ref="multipleTable" height="500"  fit border style="width: 100%" >
            <el-table-column  type="selection"></el-table-column>
            <el-table-column width="50" type="index" label="序号"></el-table-column>
            <el-table-column  property="kId" label="id" sortable></el-table-column>
            <el-table-column  property="kName" label="项目名"></el-table-column>
            <el-table-column  property="kNumber" label="项目编号"></el-table-column>
            <el-table-column  property="kRemark" label="备注"></el-table-column>
            <el-table-column  property="kCreate" label="创建人"></el-table-column>
            <el-table-column  property="kCreationTime" label="创建时间"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="success" plain size="small" @click="goView(scope.row.kId)">查看</el-button>
                    <el-button type="primary" plain size="small" @click="goEdit(scope.row.kId)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 列表框结束 -->
        <el-row :gutter="10">
            <el-col :span="24" ><el-pagination background  @size-change="handleSizeChange"  @current-change="handleCurrentChange"  
            :page-size="listData.size" layout="total,prev, pager, next" :total="listData.totalElements"></el-pagination></el-col>
        </el-row>
        <!-- 新增/编辑开始 -->
        <el-dialog title="项目维护" :visible.sync="viewDialog.isShow" width="500">
            <el-form :model="data">
                <el-form-item label="项目名称" :label-width="formLabelWidth">
                    <el-input :disabled="!viewDialog.isEdit" v-model="data.kName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="项目编号" :label-width="formLabelWidth">
                    <el-input :disabled="!viewDialog.isEdit" v-model="data.kNumber" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="项目备注" :label-width="formLabelWidth">
                    <el-input :disabled="!viewDialog.isEdit" v-model="data.kRemark" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <el-row class="spacing" v-show="viewDialog.isEdit">
                <el-button type="primary" @click.prevent="addDetails()">新增</el-button>
            </el-row>
            <el-table :data="data.projectColumnEntitys" border style="width: 100%;" height="300" :highlight-current-row="viewDialog.isEdit" class="tb-edit" >
                <el-table-column width="50" type="index" label="序号"></el-table-column>
                <el-table-column label="字段名称" >
                    <template scope="scope">
                        <el-input  v-model="scope.row.kName" placeholder="请输入字段名称" ></el-input> <span>{{scope.row.kName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="字段编号" >
                    <template scope="scope">
                        <el-input  v-model="scope.row.kNumber" placeholder="请输入字段编号" ></el-input> <span>{{scope.row.kNumber}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="字段类型" >
                    <template scope="scope">
                        <el-select v-model="scope.row.kType" placeholder="请选择">
                            <el-option v-for="item in options.columnType" :key="item.label" :label="item.label" :value="item.value"> </el-option>
                        </el-select>
                         <span>{{scope.row.kType}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="长度" >
                    <template scope="scope">
                        <el-input  v-model="scope.row.kLength" placeholder="请输入长度" ></el-input> <span>{{scope.row.kLength}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="精度" >
                    <template scope="scope">
                        <el-input  v-model="scope.row.kAccuracy" placeholder="请输入精度" ></el-input> <span>{{scope.row.kAccuracy}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="小数位" >
                    <template scope="scope">
                        <el-input  v-model="scope.row.kPlaces" placeholder="请输入小数位" ></el-input> <span>{{scope.row.kPlaces}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="默认值" >
                    <template scope="scope">
                        <el-input  v-model="scope.row.kDefaultValue" placeholder="请输入默认值" ></el-input> <span>{{scope.row.kDefaultValue}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="备注" >
                    <template scope="scope">
                        <el-input  v-model="scope.row.kRemark" placeholder="请输入备注" ></el-input> <span>{{scope.row.kRemark}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" v-if="viewDialog.isEdit" >
                    <template slot-scope="scope">
                        <el-button type="danger" plain size="small" @click="delDetails(scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer" v-show="viewDialog.isEdit">
                <el-button @click="viewDialog.isShow = false">取 消</el-button>
                <el-button type="primary" @click="save()">保 存</el-button>
            </span>
        </el-dialog>
        <!-- 新增/编辑结束 -->
    </div>
</template>
<script>
    export default {
        created() {
            this.search();
            this.getOptions();
        },
        data() {

            return {
                options:{
                    columnType:[],
                },
                pageData:{
                    page:1,
                    size:5,
                    sort:'kId,ASC',
                },
                viewDialog:{
                    isShow: false,
                    isEdit: false,
                },
                formLabelWidth: "120px",
                data: {
                    projectColumnEntitys: []
                },
                input: "",
                listData: {} 
            };
        },
        methods: {
            getOptions(){
                this.$axios.get("/api/common/getOptions?"+this.jsonToUrl(this.options)).then(result => {
                    this.options = result.data;
                });
            },
            search() {
                this.$axios.get("/api/project/findAllPageByParams?"+this.jsonToUrl(this.pageData)).then(result => {
                    this.listData = result.data;
                });
            },
            delList(index, row) {
                this.$axios.get("/api/project/delete?kId="+row.kId).then(result => {
                    this.$message({ message: '删除成功!', type: 'success' });
                    this.search();
                });
            },
            
            handleCurrentChange(val) {
                this.pageData.page = val;
                this.search();
            },
            goAdd() {
                this.viewDialog.isShow = true;
                this.viewDialog.isEdit = true;
                this.data = {
                    projectColumnEntitys: []
                };
            },
            goView(kId) {
                this.viewDialog.isEdit = false;
                this.$axios.get("/api/project/view?kId="+kId).then(result => {
                    this.viewDialog.isShow = true;
                    this.data = result.data;
                });
            },
            goEdit(kId) {
                this.viewDialog.isEdit = true;
                this.$axios.get("/api/project/view?kId="+kId).then(result => {
                    this.viewDialog.isShow = true;
                    this.data = result.data;
                });
            },
            addDetails() {
                this.data.projectColumnEntitys.push({name: "字段名称"});
            },
            delDetails(index) {
                this.data.projectColumnEntitys.splice(index,1);
            },
            save(){
                console.log(JSON.stringify(this.data));
                this.$axios.post("/api/project/save",this.data).then(result => {
                    this.$message({ message: '保存成功!', type: 'success' });
                    this.viewDialog.isShow = false;
                });
            },

        }
    };
</script>
<style scoped>
  
    
</style>