<!--(params)-->
<template>
    <div :style="{height:(screenSize.height)+'px'}">
        <!-- 搜索框开始 -->
        <dv-border-box-12 style="height: 78px;background-color: #282c34;color: #fff; z-index: 11;margin-top: 15px;">
        <el-row style="margin-top: -10px" >
            <el-col :span="18">
                <el-form  class="demo-form-inline">
                    <el-row style="margin-top: 17px">
                    <el-col :span="8">
                            <el-form-item  label="名称" :label-width="formLabelWidth">
                                <el-input v-model="pageData.name_eq" placeholder="请输入名称" autocomplete="off"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item  label="编号" :label-width="formLabelWidth">
                                <el-input v-model="pageData.number_eq" placeholder="请输入编号" autocomplete="off"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item  label="创建人" :label-width="formLabelWidth">
                                <el-input v-model="pageData.create_eq" placeholder="请输入创建人" autocomplete="off"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-col>
            <el-col :span="4" :offset="2" style="margin-top: 17px">
                <el-button type="primary" plain @click.prevent="search()">搜索</el-button>
                <el-button type="success" plain @click.prevent="goAdd()">新增</el-button>
                <el-button class="cancel-but" plain @click.prevent="refreshParams('刷新成功')">刷新缓存</el-button>
            </el-col>
        </el-row>
        </dv-border-box-12>
        <!-- 搜索框结束 -->
        <!-- 列表框开始 -->
        <dv-loading v-if="listData.loading" style="color: white;height: 95%">Loading...</dv-loading>
        <el-table :data="listData.content" v-if="!listData.loading" ref="listTable" row-key="id"  :height="screenSize.height - 75"  fit border style="width: 100%;margin-top: 5px"  :tree-props="{children: 'detailEntitys'}"
                  :header-cell-style="{background: 'rgb(55 76 135)',color: '#fff'}" :row-style="{background: '#282c34',color: '#fff'} " >
            <el-table-column  property="name" label="参数名称" ></el-table-column>
            <el-table-column  property="number" label="参数编码" ></el-table-column>
            <el-table-column  property="isEnable" label="是否启用" ></el-table-column>
            <el-table-column  property="remark" label="备注" ></el-table-column>
            <el-table-column  property="create" label="创建人" ></el-table-column>
            <el-table-column  property="creationTime" label="创建时间" ></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                     <el-button type="success" plain size="small" @click.prevent="goAdd(scope.row)">新增</el-button>
                    <el-button type="danger" plain size="small" @click="batchDel(scope.row.id)">删除</el-button>
                    <el-button type="primary" plain size="small" @click="goEdit(scope.row.id)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 列表框结束 -->
        <el-row :gutter="10" class="pagination" v-if="!listData.loading">
            <el-col :span="24" ><el-pagination background  @size-change="handleSizeChange"  @current-change="handleCurrentChange"
            :page-size="listData.size" layout="total,prev, pager, next" :total="listData.totalElements"></el-pagination></el-col>
        </el-row>
        <!-- 新增/编辑开始 -->
        <el-dialog :title="viewDialog.isEdit ? '编辑' : '查看'" :visible.sync="viewDialog.isShow" customClass="view-dialog" >
            <el-form :model="data" v-loading="viewDialog.butIsLoading" :rules="rules" ref="ruleForm" >
                <el-form-item label="参数名称" clearable :label-width="formLabelWidth" prop="name">
                    <el-input :disabled="!viewDialog.isEdit" v-model="data.name" placeholder="请输入参数名称" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="参数编码" clearable :label-width="formLabelWidth" prop="number">
                    <el-input :disabled="!viewDialog.isEdit" v-model="data.number" placeholder="请输入参数编码" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="备用字段1" clearable :label-width="formLabelWidth" prop="valueBak1">
                    <el-input :disabled="!viewDialog.isEdit" v-model="data.valueBak1" placeholder="请输入备用字段1" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="备用字段2" clearable :label-width="formLabelWidth" prop="valueBak2">
                    <el-input :disabled="!viewDialog.isEdit" v-model="data.valueBak2" placeholder="请输入备用字段2" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="备用字段3" clearable :label-width="formLabelWidth" prop="valueBak3">
                    <el-input :disabled="!viewDialog.isEdit" v-model="data.valueBak3" placeholder="请输入备用字段3" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="备用字段4" clearable :label-width="formLabelWidth" prop="valueBak4">
                    <el-input :disabled="!viewDialog.isEdit" v-model="data.valueBak4" placeholder="请输入备用字段4" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否启用" clearable :label-width="formLabelWidth" prop="isEnable">
                    <el-input :disabled="!viewDialog.isEdit" v-model="data.isEnable" placeholder="请输入是否启用" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注" clearable :label-width="formLabelWidth" prop="remark">
                    <el-input :disabled="!viewDialog.isEdit" v-model="data.remark" placeholder="请输入备注" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <!-- 新增明细开始 -->
            <!-- 新增明细结束 -->
            <span slot="footer" class="dialog-footer"  v-show="viewDialog.isEdit">
                <el-button @click="viewDialog.isShow = false" class="cancel-but" :loading="viewDialog.butIsLoading">取 消</el-button>
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
            this.getOptions();
            this.refreshScreenSize();
        },
        data() {
            return {
                options:{
                    columnType:[],
                    yesOrNo:[],
                },
                pageData:{
                    page:1,
                    size:20,
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
                        { required: false, message: '请输入参数名称', trigger: 'blur' },
                    ],
                    number : [
                        { required: false, message: '请输入参数编码', trigger: 'blur' },
                    ],
                    valueBak1 : [
                        { required: false, message: '请输入备用字段1', trigger: 'blur' },
                    ],
                    valueBak2 : [
                        { required: false, message: '请输入备用字段2', trigger: 'blur' },
                    ],
                    valueBak3 : [
                        { required: false, message: '请输入备用字段3', trigger: 'blur' },
                    ],
                    valueBak4 : [
                        { required: false, message: '请输入备用字段4', trigger: 'blur' },
                    ],
                    isEnable : [
                        { required: false, message: '请输入是否启用', trigger: 'blur' },
                    ],
                    parentId : [
                        { required: false, message: '请输入父类id  自身关联 kid', trigger: 'blur' },
                    ],
                    remark : [
                        { required: false, message: '请输入备注', trigger: 'blur' },
                    ],
                }
            };
        },
        methods: {
            //获取参数
            getOptions(){
                this.getHttp("/api/common/getOptions?"+this.jsonToUrl(this.options)).then(result => {
                    this.options = result;
                });
            },
            //执行搜索
            search() {
                this.listData.loading = true;
                if(!this.isEmpty(this.pageData.creationTime)){
                    this.pageData['creationTime_ge'] = this.pageData.creationTime[0]+'T00:00:00';
                    this.pageData['creationTime_le'] = this.pageData.creationTime[1]+'T00:00:00';
                }
                this.pageData.parentId_isNull = null;
                this.getHttp("/api/params/findAllPageByParams?"+this.jsonToUrl(this.pageData)).then(result => {
                    this.listData = result;
                    this.listData.loading = false;
                });
            },
            //批量删除
            batchDel(id) {
                if(this.isNotEmpty(id)){
                    this.getHttp("/api/params/delete?id="+id).then(result => {
                        this.search();
                    });
                }else{
                    if(this.$refs.listTable.selection.length == 0){
                        this.$message.warning( '请先勾选删除列' );
                        return;
                    }
                    var ids = this.listExtract(this.$refs.listTable.selection,'id');
                    this.postHttp("/api/params/batchDelete",ids).then(result => {
                        this.search();
                    });
                }
                this.refreshParams();
            },
            //页码更新
            handleCurrentChange(val) {
                this.pageData.page = val;
                this.search();
            },
            //打开新增
            goAdd(row) {
                this.viewDialog.isShow = true;
                this.viewDialog.isEdit = true;
                this.data = {
                    detailEntitys: []
                };
                if(this.isNotEmpty(row)){
                    this.data.parentId = row.id;
                }
            },
            //打开详情
            goView(id) {
                this.viewDialog.isEdit = false;
                this.getHttp("/api/params/view?id="+id,{}).then(result => {
                    this.viewDialog.isShow = true;
                    this.data = result;
                });
            },
            //打开编辑
            goEdit(id) {
                this.viewDialog.isEdit = true;
                this.getHttp("/api/params/view?id="+id).then(result => {
                    this.viewDialog.isShow = true;
                    this.data = result;
                });
            },
            //添加明细
            addDetails() {
                this.data.detailEntitys.push({});
            },
            //删除明细
            delDetails(index) {
                this.data.detailEntitys.splice(index,1);
                this.refreshParams();
            },
            //保存
            save(){
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        this.viewDialog.butIsLoading = true;
                        this.postHttp("/api/params/save",this.data).then(result => {
                            this.viewDialog.butIsLoading = false;
                            if(result.code == 200){
                                this.viewDialog.isShow = false;
                                this.search();
                                this.refreshParams();
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
<style scoped>


</style>
