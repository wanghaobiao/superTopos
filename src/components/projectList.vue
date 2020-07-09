<template>
    <div>
        <!-- 搜索框开始 -->
        <el-row class="spacing">
            <el-col :span="10">
                <el-input v-model="input" placeholder="请输入id"></el-input>
            </el-col>
            <el-col :span="4" class="search">
                <el-button type="primary" @click.prevent="search()" icon="el-icon-search">搜索</el-button>
            </el-col>
        </el-row>
        <!-- 搜索框结束 -->
        <!-- 按钮框开始 -->
        <el-row class="spacing">
            <el-button type="primary" @click.prevent="goAdd()">新增</el-button>
            <el-button type="danger">删除</el-button>
            <el-button type="success">启用</el-button>
            <el-button type="danger">禁用</el-button>
        </el-row>
        <!-- 按钮框结束 -->
        <!-- 列表框开始 -->
        <el-table :data="listData.content" ref="multipleTable"  fit border style="width: 100%" >
            <el-table-column  type="selection"></el-table-column>
            <el-table-column width="50" type="index" label="序号"></el-table-column>
            <el-table-column  property="id" label="id" sortable></el-table-column>
            <el-table-column  property="name" label="项目名"></el-table-column>
            <el-table-column  property="number" label="项目编号"></el-table-column>
            <el-table-column  property="remark" label="备注"></el-table-column>
            <el-table-column  property="create" label="创建人"></el-table-column>
            <el-table-column  property="creationTime" label="创建时间"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="success" plain size="small">查看</el-button>
                    <el-button type="primary" plain size="small" @click="goEdit(scope.row.id)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 列表框结束 -->
        <!-- 新增/编辑开始 -->
        <el-dialog title="项目维护" :visible.sync="addPageIsShow">
            <el-form :model="data">
                <el-form-item label="项目名称" :label-width="formLabelWidth">
                    <el-input v-model="data.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="项目编号" :label-width="formLabelWidth">
                    <el-input v-model="data.number" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="项目备注" :label-width="formLabelWidth">
                    <el-input v-model="data.remark" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <el-row class="spacing">
                <el-button type="primary" @click.prevent="addDetails()">新增</el-button>
                <el-button type="danger">删除</el-button>
            </el-row>
            <el-table :data="data.projectColumnEntitys" border style="width: 100%">
                <el-table-column  type="selection"></el-table-column>
                <el-table-column width="50" type="index" label="序号"></el-table-column>
                <el-table-column property="name" label="字段名称" ></el-table-column>
                <el-table-column property="number" label="字段编号" ></el-table-column>
                <el-table-column property="type" label="字段类型" ></el-table-column>
                <el-table-column property="length" label="长度" ></el-table-column>
                <el-table-column property="accuracy" label="精度" ></el-table-column>
                <el-table-column property="places" label="小数位" ></el-table-column>
                <el-table-column property="defaul" label="默认值" ></el-table-column>
                <el-table-column property="remark" label="备注" ></el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <el-button type="danger" plain size="small" @click="delDetails(scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addPageIsShow = false">取 消</el-button>
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
        },
        data() {
            return {
                addPageIsShow: false,
                formLabelWidth: "120px",
                data: {
                    projectColumnEntitys: []
                },
                input: "",
                listData: {} 
            };
        },
        methods: {
            search() {
                this.$axios.get("/api/project/findAllPageByParams?page=1&size=5&sort=id,ASC").then(result => {
                    this.listData = result.data;
                    console.log(JSON.stringify(this.listData));
                });
            },
            delList(index, row) {
                this.$axios.get("/api/project/delete?id="+row.id).then(result => {
                    this.$message({ message: '删除成功!', type: 'success' });
                    this.search();
                });
            },
            goAdd() {
                this.addPageIsShow = true;
                this.data = {
                    projectColumnEntitys: []
                };
            },
            goEdit(id) {
                this.$axios.get("/api/project/view?id="+id).then(result => {
                    this.addPageIsShow = true;
                    this.data = result.data;
                });
            },
            save(){
                console.log(JSON.stringify(this.data));
                this.$axios.post("/api/project/save",this.data).then(result => {
                    this.$message({ message: '保存成功!', type: 'success' });
                    this.addPageIsShow = false;
                });
            },
            addDetails() {
                this.data.projectColumnEntitys.push({name: "字段名称"});
            },
            delDetails(index) {
                this.data.projectColumnEntitys.splice(index,1);
            },
            
           
        }
    };
</script>
<style scoped>
    .spacing {
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .search {
        margin-left: 20px;
    }

</style>