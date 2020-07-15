<!--项目表(project)-->
<template>
    <div>
        <!-- 搜索框开始 -->
        <el-row :gutter="10">
            <el-col :span="12">
                <el-form :inline="true"  class="demo-form-inline">
                    <el-form-item label="名称" >
                        <el-input v-model="pageData.name_eq" placeholder="请输入名称"></el-input>
                    </el-form-item>
                    <el-form-item label="编号" >
                        <el-input v-model="pageData.number_eq" placeholder="请输入编号"></el-input>
                    </el-form-item>
                    <el-form-item label="创建人" >
                        <el-input v-model="pageData.create_eq" placeholder="请输入创建人"></el-input>
                    </el-form-item>
                </el-form>
                <el-form :inline="true"  class="demo-form-inline">
                    <el-form-item label="创建时间" >
                        <el-date-picker value-format="yyyy-MM-dd" v-model="pageData.creationTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
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
            <el-button type="danger" @click.prevent="batchDel()">删除</el-button>
        </el-row>
        <!-- 按钮框结束 -->
        <!-- 列表框开始 -->
        <el-table :data="listData.content" ref="listTable"  v-loading="listData.loading" height="500"  fit border style="width: 100%" >
            <el-table-column  type="selection"></el-table-column>
            <el-table-column width="50" type="index" label="序号"></el-table-column>
            <el-table-column  property="name" label="名称" ></el-table-column>
            <el-table-column  property="number" label="编号" ></el-table-column>
            <el-table-column  property="remark" label="备注" ></el-table-column>
            <el-table-column  property="create" label="创建人" ></el-table-column>
            <el-table-column  property="creationTime" label="创建时间" ></el-table-column>
            <el-table-column  property="lastUpdateUser" label="最后修改人" ></el-table-column>
            <el-table-column  property="lastUpdateTime" label="最后修改时间" ></el-table-column>
            <el-table-column  property="audit" label="审核人" ></el-table-column>
            <el-table-column  property="auditTime" label="审核时间" ></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="success" plain size="small" @click="goView(scope.row.id)">查看</el-button>
                    <el-button type="primary" plain size="small" @click="goEdit(scope.row.id)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 列表框结束 -->
        <el-row :gutter="10">
            <el-col :span="24" ><el-pagination background  @size-change="handleSizeChange"  @current-change="handleCurrentChange"
                                               :page-size="listData.size" layout="total,prev, pager, next" :total="listData.totalElements"></el-pagination></el-col>
        </el-row>
        <!-- 新增/编辑开始 -->
        <el-dialog :title="viewDialog.isEdit ? '新增' : '查看'" :visible.sync="viewDialog.isShow" customClass="view-dialog" >
            <el-form :model="data" v-loading="viewDialog.butIsLoading" :rules="rules" ref="ruleForm" >
                <el-form-item label="名称" clearable :label-width="formLabelWidth" prop="name">
                    <el-input :disabled="!viewDialog.isEdit" v-model="data.name" placeholder="请输入名称" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="编号" clearable :label-width="formLabelWidth" prop="number">
                    <el-input :disabled="!viewDialog.isEdit" v-model="data.number" placeholder="请输入编号" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注" clearable :label-width="formLabelWidth" prop="remark">
                    <el-input :disabled="!viewDialog.isEdit" v-model="data.remark" placeholder="请输入备注" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <!-- 新增明细开始 -->
            <el-row class="spacing" v-show="viewDialog.isEdit">
                <el-button type="primary" @click.prevent="addDetails()" :loading="viewDialog.butIsLoading">新增</el-button>
            </el-row>
            <el-table :data="data.detailEntitys"  border height="350"  v-loading="viewDialog.butIsLoading" :highlight-current-row="viewDialog.isEdit" class="tb-edit" >
                <el-table-column width="50" type="index" label="序号"></el-table-column>
                <el-table-column label="名称" >
                    <template scope="scope">
                        <el-input  v-model="scope.row.name" placeholder="请输入名称" clearable></el-input> <span>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="属性名" >
                    <template scope="scope">
                        <el-input  v-model="scope.row.number" placeholder="请输入属性名" clearable></el-input> <span>{{scope.row.number}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="字段类型" >
                    <template scope="scope">
                        <el-select v-model="scope.row.type" placeholder="请选择字段类型">
                            <el-option v-for="item in getOptions('columnType')" :key="item.label" :label="item.label" :value="item.value"> </el-option>
                        </el-select>
                         <span>{{scope.row.type | paramsFmt('columnType')}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="允许为空" >
                    <template scope="scope">
                        <el-select v-model="scope.row.allowEmpty" placeholder="请选择">
                            <el-option v-for="item in getOptions('yesOrNo')" :key="item.label" :label="item.label" :value="item.value"> </el-option>
                        </el-select>
                         <span>{{scope.row.allowEmpty | paramsFmt('yesOrNo')}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="是否主键" >
                    <template scope="scope">
                        <el-select v-model="scope.row.isKey " placeholder="请选择">
                            <el-option v-for="item in getOptions('yesOrNo')" :key="item.label" :label="item.label" :value="item.value"> </el-option>
                        </el-select>
                         <span>{{scope.row.isKey | paramsFmt('yesOrNo')}}</span>
                    </template>
                </el-table-column>    
                <el-table-column label="长度" >
                    <template scope="scope">
                        <el-input  v-model="scope.row.length" placeholder="请输入长度" clearable></el-input> <span>{{scope.row.length}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="精度" >
                    <template scope="scope">
                        <el-input  v-model="scope.row.accuracy" placeholder="请输入精度" clearable></el-input> <span>{{scope.row.accuracy}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="小数位" >
                    <template scope="scope">
                        <el-input  v-model="scope.row.places" placeholder="请输入小数位" clearable></el-input> <span>{{scope.row.places}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="默认值" >
                    <template scope="scope">
                        <el-input  v-model="scope.row.defaultValue" placeholder="请输入默认值" clearable></el-input> <span>{{scope.row.defaultValue}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="备注" >
                    <template scope="scope">
                        <el-input  v-model="scope.row.remark" placeholder="请输入备注" clearable></el-input> <span>{{scope.row.remark}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" v-if="viewDialog.isEdit" >
                    <template slot-scope="scope">
                        <el-button type="danger" plain size="small" @click="delDetails(scope.$index)" >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 新增明细结束 -->
            <span slot="footer" class="dialog-footer" v-show="viewDialog.isEdit">
                <el-button @click="viewDialog.isShow = false" :loading="viewDialog.butIsLoading">取 消</el-button>
                <el-button type="primary" @click="save()" :loading="viewDialog.butIsLoading">保 存</el-button>
            </span>
        </el-dialog>
        <!-- 新增/编辑结束 -->
    </div>
</template>
<script>
    export default {
        created() {
            this.search();
            this.getParams();
        },
        data() {
            return {
                pageData:{
                    page:1,
                    size:5,
                    sort:'creationTime,DESC',
                },
                viewDialog:{
                    isShow: false,
                    isEdit: false,
                    butIsLoading: false,
                },
                formLabelWidth: "120px",
                data: {
                    detailEntitys: []
                },
                listData: {
                    loading:false,
                },
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

                this.getHttp("/api/project/findAllPageByParams?"+this.jsonToUrl(this.pageData)).then(result => {
                    this.listData = result;
                    this.listData.loading = false;
                });
            },
            //批量删除
            batchDel(index) {
                if(this.isNotEmpty(index)){
                    this.getHttp("/api/project/delete?id="+row.id).then(result => {
                        this.search();
                    });
                }else{
                    if(this.$refs.listTable.selection.length == 0){
                        this.$message.warning( '请先勾选删除列' );
                        return;
                    }
                    var ids = this.listExtract(this.$refs.listTable.selection,'id');
                    this.postHttp("/api/project/batchDelete",ids).then(result => {
                        this.search();
                    });
                }
            },
            //页码更新
            handleCurrentChange(val) {
                this.pageData.page = val;
                this.search();
            },
            //打开新增
            goAdd() {
                this.viewDialog.isShow = true;
                this.viewDialog.isEdit = true;
                this.data = {
                    detailEntitys: []
                };
            },
            //打开详情
            goView(id) {
                this.viewDialog.isEdit = false;
                this.getHttp("/api/project/view?id="+id,{}).then(result => {
                    this.viewDialog.isShow = true;
                    this.data = result;
                });
            },
            //打开编辑
            goEdit(id) {
                this.viewDialog.isEdit = true;
                this.getHttp("/api/project/view?id="+id).then(result => {
                    this.viewDialog.isShow = true;
                    this.data = result;
                });
            },
            //添加明细
            addDetails() {
                this.data.detailEntitys.push({'parentId':this.data.id,'allowEmpty':'Y','isKey':'N'});
            },
            //删除明细
            delDetails(index) {
                this.data.detailEntitys.splice(index,1);
            },
            //保存
            save(){
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        this.viewDialog.butIsLoading = true;
                        this.postHttp("/api/project/save",this.data).then(result => {
                            this.viewDialog.butIsLoading = false;
                            if(result.code == 200){
                                this.viewDialog.isShow = false;
                                this.search();
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
        }
    };
</script>
<style >

    

</style>