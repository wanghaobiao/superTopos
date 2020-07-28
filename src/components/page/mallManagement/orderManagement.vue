

<!--订单管理( OrderManagementVue ))-->
<template>
    <div :style="{height:(screenSize.height)+'px'}">
        <!-- 搜索框开始 -->
        <el-row  >
            <el-col :span="18">
                <el-form  class="demo-form-inline">
                    <el-row  >
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
                    <el-row  v-show="moreIsShow.query"   >
                        <el-col :span="8">
                            <el-form-item  label="创建时间" :label-width="formLabelWidth">
                                <el-date-picker value-format="yyyy-MM-dd" v-model="pageData.creationTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item  label="商品类型" :label-width="formLabelWidth">
                                <el-select v-model="pageData.productTypesId_eq" clearable placeholder="请选择商品类型" style="width: 100%">
                                    <el-option v-for="item in entityOptions.productTypes" :key="item.label" :label="item.label" :value="item.value"> </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item  label="是否有效" :label-width="formLabelWidth">
                                <el-select v-model="pageData.isEffective_eq" clearable placeholder="请选择是否有效" style="width: 100%">
                                    <el-option v-for="item in getOptions('yesOrNo')" :key="item.label" :label="item.label" :value="item.value"> </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-col>
            <el-col :span="4" :offset="2">
                <el-button type="primary"  @click.prevent="search()">搜索</el-button>
                <el-button type="primary"  @click.prevent="moreIsShow.query = !moreIsShow.query">{{moreIsShow.query ? "收起" : "展开"}}</el-button>
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
        <el-table :data="listData.content" ref="listTable" fixed v-loading="listData.loading" :height="screenSize.height - (66 + 62 * (moreIsShow.query ? 2 : 1))" fit border >
            <el-table-column  type="selection"></el-table-column>
            <el-table-column width="50" type="index" label="序号"></el-table-column>
            <el-table-column  property="id" label="主键id" ></el-table-column>
            <el-table-column  property="name" label="名称" ></el-table-column>
            <el-table-column  property="number" label="编号" ></el-table-column>
            <el-table-column  property="remark" label="备注" ></el-table-column>
            <el-table-column  property="create" label="创建人" ></el-table-column>
            <el-table-column  property="creationTime" label="创建时间" ></el-table-column>
            <el-table-column  property="lastUpdateUser" label="最后更新人" ></el-table-column>
            <el-table-column  property="lastUpdateTime" label="最后更新时间" ></el-table-column>
            <el-table-column  property="audit" label="审核人" ></el-table-column>
            <el-table-column  property="auditTime" label="审核时间" ></el-table-column>
            <el-table-column  label="商品类型" >
                <template slot-scope="scope">{{ scope.row.productTypesId | optionsFmt(entityOptions.productTypes) }}</template>
            </el-table-column>
            <el-table-column  label="是否有效" >
                <template slot-scope="scope">{{ scope.row.isEffective | paramsFmt('yesOrNo') }}</template>
            </el-table-column>
            <el-table-column  property="amountOfGoods" label="商品数量" ></el-table-column>
            <el-table-column  property="totalOrderPrice" label="订单总价" ></el-table-column>
            <el-table-column label="操作"  fixed="right">
                <template slot-scope="scope">
                    <el-button type="success" plain size="small" @click="goView(scope.row.id)">查看</el-button>
                    <el-button type="primary" plain size="small" @click="goEdit(scope.row.id)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 列表框结束 -->
        <el-row :gutter="10" class="pagination">
            <el-pagination background  @size-change="handleSizeChange"  @current-change="handleCurrentChange" :page-size="listData.size" layout="total,prev, pager, next" :total="listData.totalElements"></el-pagination>
        </el-row>
        <!-- 新增/编辑开始 -->
        <el-dialog :title="viewDialog.isView ? '查看' : viewDialog.isView == null ? '新增' : '编辑'" :visible.sync="viewDialog.isShow" customClass="view-dialog" >
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
                    <el-col :span="12">
                        <el-form-item  label="商品类型" :label-width="formLabelWidth" prop="productTypes">
                            <el-select :disabled="viewDialog.isView" v-model="data.productTypesEntity" value-key="id" clearable placeholder="请选择商品类型" style="width: 100%">
                                <el-option v-for="item in entityOptions.productTypes" :key="item.label" :label="item.label" :value="item"> </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item  label="是否有效" :label-width="formLabelWidth" prop="isEffective">
                            <el-select :disabled="viewDialog.isView" v-model="data.isEffective" clearable placeholder="请选择是否有效" style="width: 100%">
                                <el-option v-for="item in getOptions('yesOrNo')" :key="item.label" :label="item.label" :value="item.value"> </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="商品数量" clearable :label-width="formLabelWidth" prop="amountOfGoods">
                            <el-input :disabled="viewDialog.isView" v-model="data.amountOfGoods" placeholder="请输入商品数量" oninput ="value=value.replace(/[^\d]/g,'')"  autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="订单总价" clearable :label-width="formLabelWidth" prop="totalOrderPrice">
                            <el-input :disabled="viewDialog.isView" v-model="data.totalOrderPrice" placeholder="请输入订单总价" oninput ="value=value.replace(/[^0-9.]/g,'')"  autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <!-- 新增明细开始 -->
            <el-row class="spacing" v-show="!viewDialog.isView">
                <el-button type="primary" @click.prevent="addDetails('orderDetails')" :loading="viewDialog.butIsLoading">新增</el-button>
                <el-button type="warning"  @click.prevent="up('orderDetails')" :loading="viewDialog.butIsLoading" plain>上移</el-button>
                <el-button type="primary"  @click.prevent="down('orderDetails')" :loading="viewDialog.butIsLoading" plain>下移</el-button>
            </el-row>
            <el-table :data="data.orderDetails"  border  v-loading="viewDialog.butIsLoading" @current-change="currentChange" :row-class-name="tableRowClassName"  :highlight-current-row="!viewDialog.isView" class="tb-edit" >
                <el-table-column width="50" type="index" label="序号"></el-table-column>
                <el-table-column label="名称">
                    <template scope="scope">
                        <el-input v-model="scope.row.name" placeholder="请输入名称" clearable maxlength="200"  ></el-input>
                        <span>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="编号">
                    <template scope="scope">
                        <el-input v-model="scope.row.number" placeholder="请输入编号" clearable maxlength="200"  ></el-input>
                        <span>{{scope.row.number}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="备注">
                    <template scope="scope">
                        <el-input v-model="scope.row.remark" placeholder="请输入备注" clearable maxlength="200"  ></el-input>
                        <span>{{scope.row.remark}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="过期时间">
                    <template scope="scope">
                        <el-date-picker v-model="scope.row.expiration" type="date" placeholder="选择过期时间" style="width: 100%"> </el-date-picker>
                        <span>{{scope.row.expiration | dateFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="商品类型">
                    <template scope="scope">
                        <el-select v-model="scope.row.productTypesEntity" value-key="id" clearable placeholder="请选择商品类型" >
                            <el-option v-for="item in entityOptions.productTypes" :key="item.label" :label="item.label" :value="item"> </el-option>
                        </el-select>
                        <span>{{scope.row.productTypes}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="是否有效">
                    <template scope="scope">
                        <el-select v-model="scope.row.isEffective" clearable placeholder="请选择是否有效" style="width: 100%" >
                            <el-option v-for="item in getOptions('yesOrNo')" :key="item.label" :label="item.label" :value="item.value"> </el-option>
                        </el-select>
                        <span>{{scope.row.isEffective}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" v-if="!viewDialog.isView"  fixed="right">
                    <template slot-scope="scope">
                        <el-button type="danger" plain size="small" @click="delDetails(scope.$index,'orderDetails')">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 新增明细结束 -->
            <span slot="footer" class="dialog-footer" v-show="!viewDialog.isView">
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
            this.getEntityOptions();
            this.refreshScreenSize();
        },
        data() {
            return {
                moreIsShow:{
                    query:false,
                    viewDialog:false,
                },
                formLabelWidth: "100px",
                entityOptions:{
                    productTypes : "",
                },
                pageData:{
                    page:1,
                    size:5,
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
                tableOptions:[],
                data: {
                    orderDetails : [],
                },
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
                    productTypes : [
                        { required: true, message: '请输入商品类型', trigger: 'blur' },
                    ],
                    isEffective : [
                        { required: true, message: '请输入是否有效', trigger: 'blur' },
                    ],
                    amountOfGoods : [
                        { required: true, message: '请输入商品数量', trigger: 'blur' },
                    ],
                    totalOrderPrice : [
                        { required: false, message: '请输入订单总价', trigger: 'blur' },
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
                this.getHttp("/api/mallManagement/orderManagement/findAllPageByParams?"+this.jsonToUrl(this.pageData)).then(result => {
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
                    if(this.isNotEmpty(id)){
                        this.getHttp("/api/mallManagement/orderManagement/delete?id="+id).then(result => {
                            this.search();
                        });
                    }else{
                        var ids = this.listExtract(this.$refs.listTable.selection,'id');
                        this.postHttp("/api/mallManagement/orderManagement/batchDelete",ids).then(result => {
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
                    orderDetails : [],
                };
            },
            //打开详情
            goView(id) {
                this.viewDialog.isView = true;
                this.getHttp("/api/mallManagement/orderManagement/view?id="+id,{}).then(result => {
                    this.viewDialog.isShow = true;
                    this.data = result;
                });
            },
            //打开编辑
            goEdit(id) {
                this.viewDialog.isView = false;
                this.getHttp("/api/mallManagement/orderManagement/view?id="+id).then(result => {
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
                this.data[mark].splice(index,1);
            },
            //保存
            save(){
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        this.viewDialog.butIsLoading = true;
                        for(var i = 0; i < this.data.orderDetails.length; i++){
                            this.data.orderDetails[i].id = null;
                        }
                        this.postHttp("/api/mallManagement/orderManagement/save",this.data).then(result => {
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
        }
    };
</script>
<style >



</style>
