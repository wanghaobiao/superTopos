<!--项目表(project)-->
<template>
    <div style="background-color: #282c34;">
        <dv-loading v-if="listData.loading" style="color: white;margin-top: 20%">Loading...</dv-loading>
        <el-row :gutter="10" v-if="!listData.loading">
            <el-col :span="5">
                <dv-border-box-13 class="dvBox8">
                    <div class="leftBox">
                        <el-tree :data="listData.content" node-key="id" :expand-on-click-node="false" ref="tree"
                                 @node-click="treeCheck" class="treeNode">
                            <div class="custom-tree-node" slot-scope="{ node, data }" @click="() => goTools(data)">
                                <el-popover
                                    placement="right"
                                    trigger="hover"
                                    width="100"
                                >
                                    <div class="popoverPadding">
                                        <div class="tips" style="display: flex; justify-content: center;"
                                             @click="() => goTools(data)">
                                            <el-button
                                                type="warning"
                                                icon="al-icon-tool"
                                                size="mini"
                                                class="operat-but"
                                                round
                                            ><span style="margin-left: 6px;">工具</span></el-button>
                                            <!-- <span  style="line-height: 2rem;margin-left: 8px;font-weight: bold;">工具</span> -->
                                        </div>
                                        <div class="tips"
                                             style="display: flex; justify-content: center; padding-top: 8px;"
                                             @click="() => goAdd(data)">
                                            <el-button
                                                type="success"
                                                icon="al-icon-add-details"
                                                size="mini"
                                                class="operat-but"
                                                round
                                            ><span style="margin-left: 6px;">新增</span></el-button>
                                            <!-- <span style="line-height: 2rem;margin-left: 8px;font-weight: bold;">新增</span> -->
                                        </div>
                                        <div class="tips"
                                             style="display: flex; justify-content: center; padding-top: 8px;"
                                             @click="() => goEdit(data)">
                                            <el-button
                                                type="primary"
                                                icon="al-icon-edit"
                                                size="mini"
                                                class="operat-but"
                                                round
                                            ><span style="margin-left: 6px;">修改</span></el-button>
                                            <!-- <span  style="line-height: 2rem;margin-left: 8px;font-weight: bold;">修改</span> -->
                                        </div>
                                        <div class="tips"
                                             style="display: flex; justify-content: center; padding-top: 8px;"
                                             @click="() => batchDel(data.id)">
                                            <el-button
                                                type="danger"
                                                icon="al-icon-del"
                                                size="mini"
                                                class="operat-but"
                                                round
                                            ><span style="margin-left: 6px;">删除</span></el-button>
                                            <!-- <span style="line-height: 2rem;margin-left: 8px;font-weight: bold;"></span> -->
                                        </div>
                                    </div>
                                    <div slot="reference">
                           <span @click="goView(data)">
                              <i :class="data.icon" :style="{color : data.color}"></i>
                              {{ node.label }}
                           </span>
                                    </div>
                                </el-popover>
                            </div>
                        </el-tree>
                    </div>
                </dv-border-box-13>
            </el-col>
            <el-col :span="19">
                <dv-loading v-if="viewDialog.isLoading" style="color: white;margin-top: 25%">Loading...</dv-loading>
                <dv-border-box-13 :reverse="true" class="dvBox8" v-show="viewDialog.isShow && !viewDialog.isLoading">
                    <div class="div-view">
                        <!-- 新增/编辑开始 -->
                        <div class="detailInfo">
                            <el-form
                                :model="data"
                                :rules="rules"
                                ref="ruleForm"
                            >
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item
                                            label="名称"
                                            clearable
                                            :label-width="formLabelWidth"
                                            prop="name"
                                        >
                                            <el-input
                                                :disabled="!viewDialog.isEdit"
                                                v-model="data.name"
                                                placeholder="请输入名称"
                                                autocomplete="off"
                                            ></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item
                                            label="编号"
                                            clearable
                                            :label-width="formLabelWidth"
                                            prop="number"
                                        >
                                            <el-input
                                                :disabled="!viewDialog.isEdit"
                                                v-model="data.number"
                                                placeholder="请输入编号"
                                                autocomplete="off"
                                            ></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item
                                            label="备注"
                                            clearable
                                            :label-width="formLabelWidth"
                                            prop="remark"
                                        >
                                            <el-input
                                                :disabled="!viewDialog.isEdit"
                                                v-model="data.remark"
                                                placeholder="请输入备注"
                                                autocomplete="off"
                                            ></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item
                                            label="父对象"
                                            clearable
                                            :label-width="formLabelWidth"
                                            prop="prefix"
                                        >
                                            <el-input
                                                :disabled="true"
                                                v-if="data.projectEntity != undefined"
                                                v-model="data.projectEntity.name"
                                                autocomplete="off"
                                            ></el-input>
                                            <el-input
                                                :disabled="true"
                                                v-if="data.projectEntity == undefined"
                                                v-model="data.projectEntity"
                                                autocomplete="off"
                                            ></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-form-item
                                    label="SQL"
                                    clearable
                                    :label-width="formLabelWidth"
                                    v-if="viewDialog.isTools"
                                >
                                    <div
                                        class="sql-div"
                                        ref="sqlDiv"
                                        v-html="data.sql"
                                        :style="{height:(screenSize.height - 170)+'px'}"
                                    ></div>
                                </el-form-item>
                            </el-form>
                            <!-- 新增明细开始 -->
                            <div v-if="data.level != 2 && !viewDialog.isTools">
                                <el-row class="spacing" v-show="viewDialog.isEdit">
                                    <el-button
                                        type="primary"
                                        @click.prevent="addDetails()"
                                        :loading="viewDialog.butIsLoading"
                                    >新增
                                    </el-button>
                                    <el-button
                                        type="success"
                                        @click.prevent="up()"
                                        :loading="viewDialog.butIsLoading"
                                        plain
                                    >上移
                                    </el-button>
                                    <el-button
                                        class="cancel-but"
                                        @click.prevent="down()"
                                        :loading="viewDialog.butIsLoading"
                                        plain
                                    >下移
                                    </el-button>
                                </el-row>
                                <el-table
                                    ref="tbEdit"
                                    :data="data.detailEntitys"
                                    border
                                    :height="screenSize.height - (viewDialog.isEdit ? 220  : 124)"
                                    v-loading="viewDialog.butIsLoading"
                                    highlight-current-row
                                    :row-class-name="tableRowClassName"
                                    @current-change="currentChange"
                                    fixed
                                    class="tb-edit"
                                    style="margin-top: 20px"
                                    :header-cell-style="{background: 'rgb(55 76 135)',color: '#fff', }"
                                    :row-style="{background: '#282c34',color: '#fff',}"
                                >
                                    <el-table-column width="50" type="index" label="序号"></el-table-column>
                                    <el-table-column label="名称" width="200">
                                        <template scope="scope">
                                            <el-input
                                                v-model="scope.row.name"
                                                placeholder="请输入名称"
                                                :disabled="!viewDialog.isEdit || scope.row.columnProperties == 'linkColumn'"
                                                clearable
                                            ></el-input>
                                            <span>{{ scope.row.name }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="属性名" width="200">
                                        <template scope="scope">
                                            <el-input
                                                v-model="scope.row.number"
                                                placeholder="请输入属性名"
                                                :disabled="!viewDialog.isEdit || scope.row.columnProperties == 'linkColumn'"
                                                clearable
                                            ></el-input>
                                            <span>{{ scope.row.number }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="字段属性" width="150">
                                        <template scope="scope">
                                            <el-select
                                                :disabled="!viewDialog.isEdit"
                                                v-model="scope.row.columnProperties"
                                                placeholder="请选择字段属性"
                                                @change="columnPropertiesChange(scope.$index,scope.row.columnProperties)"
                                            >
                                                <el-option
                                                    v-for="item in getOptions('columnProperties')"
                                                    :key="item.label"
                                                    :label="item.label"
                                                    :value="item.value"
                                                ></el-option>
                                            </el-select>
                                            <span>{{ scope.row.columnProperties | paramsFmt('columnProperties') }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="字段类型" width="200">
                                        <template scope="scope">
                                            <el-select
                                                v-model="scope.row.type"
                                                placeholder="请选择字段类型"
                                                :disabled="!viewDialog.isEdit || scope.row.columnProperties != 'baseColumn'"
                                                @change="typeChange(scope.row)"
                                            >
                                                <el-option
                                                    v-for="item in getOptions('columnType')"
                                                    :key="item.label"
                                                    :label="item.label"
                                                    :value="item.value"
                                                ></el-option>
                                            </el-select>
                                            <span>{{ scope.row.type | paramsFmt('columnType') }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="长度" width="110">
                                        <template scope="scope">
                                            <el-input
                                                v-model="scope.row.length"
                                                placeholder="请输入长度"
                                                clearable
                                                :disabled="!viewDialog.isEdit || scope.row.columnProperties != 'baseColumn'"
                                            ></el-input>
                                            <span>{{ scope.row.length }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="默认值">
                                        <template scope="scope">
                                            <el-input
                                                v-model="scope.row.defaultValue"
                                                placeholder="请输入默认值"
                                                clearable
                                                :disabled="!viewDialog.isEdit || scope.row.columnProperties != 'baseColumn'"
                                            ></el-input>
                                            <span>{{ scope.row.defaultValue }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="小数位">
                                        <template scope="scope">
                                            <el-input
                                                v-model="scope.row.places"
                                                placeholder="请输入小数位"
                                                clearable
                                                :disabled="!viewDialog.isEdit || scope.row.columnProperties != 'baseColumn'"
                                            ></el-input>
                                            <span>{{ scope.row.places }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="关联表" width="150">
                                        <template scope="scope">
                                            <el-select
                                                v-model="scope.row.linkTable"
                                                placeholder="请选择关联表"
                                                :disabled="!viewDialog.isEdit || scope.row.columnProperties != 'linkColumn'"
                                                @change="linkTableChange(scope.row)"
                                            >
                                                <el-option
                                                    v-for="item in tableOptions"
                                                    :key="item.label"
                                                    :label="item.label"
                                                    :value="item.value"
                                                ></el-option>
                                            </el-select>
                                            <span>{{ scope.row.linkTable | optionsFmt(tableOptions) }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="关联参数" width="150">
                                        <template scope="scope">
                                            <el-select
                                                v-model="scope.row.linkParam"
                                                placeholder="请选择关联参数"
                                                :disabled="!viewDialog.isEdit || scope.row.columnProperties != 'paramColumn'"
                                            >
                                                <el-option
                                                    v-for="item in getBaseOptions()"
                                                    :key="item.label"
                                                    :label="item.label"
                                                    :value="item.value"
                                                ></el-option>
                                            </el-select>
                                            <span>{{ scope.row.linkParam | optionsFmt(getBaseOptions()) }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="是否主键">
                                        <template scope="scope">
                                            <el-select v-model="scope.row.isKey" :disabled="!viewDialog.isEdit"
                                                       placeholder="请选择">
                                                <el-option
                                                    v-for="item in getOptions('yesOrNo')"
                                                    :key="item.label"
                                                    :label="item.label"
                                                    :value="item.value"
                                                ></el-option>
                                            </el-select>
                                            <span>{{ scope.row.allowEmpty | paramsFmt('yesOrNo') }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="允许为空">
                                        <template scope="scope">
                                            <el-select v-model="scope.row.allowEmpty" :disabled="!viewDialog.isEdit"
                                                       placeholder="请选择">
                                                <el-option
                                                    v-for="item in getOptions('yesOrNo')"
                                                    :key="item.label"
                                                    :label="item.label"
                                                    :value="item.value"
                                                ></el-option>
                                            </el-select>
                                            <span>{{ scope.row.allowEmpty | paramsFmt('yesOrNo') }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作" v-if="viewDialog.isEdit" fixed="right" width="168">
                                        <template slot-scope="scope">
                                            <el-button
                                                type="success"
                                                plain
                                                size="small"
                                                @click="buildPartialDialog.isShow = true"
                                            >生成
                                            </el-button>
                                            <el-button
                                                type="danger"
                                                plain
                                                size="small"
                                                @click="delDetails(scope.$index)"
                                                v-if="isEmpty(scope.row.id) && scope.row.number != 'parentId'"
                                            >删除
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                            <el-row class="tool-spacing" v-show="viewDialog.isTools">
                                <el-button @click="sqlCopy()" plain type="success">复制SQL</el-button>
                                <el-button
                                    type="primary"
                                    @click="buildFileDialog.isShow = true"
                                    :loading="viewDialog.butIsLoading"
                                    v-if="data.level == 3"
                                >生成代码
                                </el-button>
                            </el-row>
                            <el-row class="save-spacing" v-show="viewDialog.isEdit">
                                <el-button
                                    class="cancel-but"
                                    @click="viewDialog.isShow = false"
                                    :loading="viewDialog.butIsLoading"
                                >取 消
                                </el-button>
                                <el-button type="primary" @click="save()" :loading="viewDialog.butIsLoading">保 存
                                </el-button>
                            </el-row>
                            <el-dialog custom-class="dialog" title="生成代码" :visible.sync="buildFileDialog.isShow"
                                       width="30%">
                                <el-form
                                    :model="data"
                                    v-loading="viewDialog.butIsLoading"
                                    :rules="rules"
                                    ref="ruleForm"
                                >
                                    <el-checkbox-group v-model="buildFileDialog.fileTypes">
                                        <div
                                            v-for="item in (parseInt(getOptions('fileType').length / 3) + 1)"
                                            :key="item.label"
                                        >
                                            <el-row :class="item != 1 ? 'margin-top-22' : ''" :gutter="20">
                                                <el-col
                                                    :span="8"
                                                    v-if="((item - 1)*3+0) < getOptions('fileType').length"
                                                >
                                                    <el-checkbox
                                                        class="fileType-checkbox"
                                                        v-model="getOptions('fileType')[(item - 1)*3+0].value"
                                                        :label="getOptions('fileType')[(item - 1)*3+0].value"
                                                        border
                                                    ></el-checkbox>
                                                </el-col>
                                                <el-col
                                                    :span="8"
                                                    v-if="((item - 1)*3+1) < getOptions('fileType').length"
                                                >
                                                    <el-checkbox
                                                        class="fileType-checkbox"
                                                        v-model="getOptions('fileType')[(item - 1)*3+1].value"
                                                        :label="getOptions('fileType')[(item - 1)*3+1].value"
                                                        border
                                                    ></el-checkbox>
                                                </el-col>
                                                <el-col
                                                    :span="8"
                                                    v-if="((item - 1)*3+2) < getOptions('fileType').length"
                                                >
                                                    <el-checkbox
                                                        class="fileType-checkbox"
                                                        v-model="getOptions('fileType')[(item - 1)*3+2].value"
                                                        :label="getOptions('fileType')[(item - 1)*3+2].value"
                                                        border
                                                    ></el-checkbox>
                                                </el-col>
                                            </el-row>
                                        </div>
                                    </el-checkbox-group>
                                    <el-form-item class="margin-top-22">
                                        <el-select v-model="buildFileDialog.vuePath" clearable
                                                   placeholder="请选择前端代码根目录" :disabled="viewDialog.isView"
                                                   style="width:100%">
                                            <el-option v-for="item in getOptions('vuePath')" :key="item.label"
                                                       :label="item.label" :value="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item class="margin-top-22">
                                        <el-select v-model="buildFileDialog.javaPath" clearable
                                                   placeholder="请选择后端代码根目录" :disabled="viewDialog.isView"
                                                   style="width:100%">
                                            <el-option v-for="item in getOptions('javaPath')" :key="item.label"
                                                       :label="item.label" :value="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item class="margin-top-22">
                                        <el-select v-model="buildFileDialog.codeTemplate" clearable
                                                   placeholder="请选择代码模板" :disabled="viewDialog.isView"
                                                   style="width:100%">
                                            <el-option v-for="item in getOptions('codeTemplate')" :key="item.label"
                                                       :label="item.label" :value="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-form>
                                <span slot="footer">
                     <el-button class="cancel-but" @click="buildFileDialog.isShow = false">取 消</el-button>
                     <el-button
                         :type="this.buildFileDialog.isAllSelect ? 'success' : 'primary'"
                         plain
                         @click="fileTypesAll"
                     >{{ this.buildFileDialog.isAllSelect ? '取消全选' : '全 选' }}</el-button>
                     <el-button type="success" @click="downloadFile()">下 载</el-button>
                     <el-button type="primary" @click="buildFile()">确 定</el-button>
                  </span>
                            </el-dialog>
                            <el-dialog custom-class="dialog" title="生成局部代码"
                                       :visible.sync="buildPartialDialog.isShow" width="30%">
                                <el-form :model="data" v-loading="viewDialog.butIsLoading" :rules="rules"
                                         ref="ruleForm">
                                    <div>
                                        <el-row :gutter="20" v-show="false"><!--   -->
                                            <textarea ref="buildPartialRef" v-html="buildPartialDialog.sql"></textarea>
                                        </el-row>
                                        <el-row :gutter="20">
                                            <el-col :span="8" class="frame-col">
                                                <el-button class="frame-but" type="warning" plain @click="copySql">SQL
                                                </el-button>
                                            </el-col>
                                            <el-col :span="8" class="frame-col">
                                                <el-button class="frame-but" type="primary" plain @click="copyEntity">
                                                    实体
                                                </el-button>
                                            </el-col>
                                            <el-col :span="8" class="frame-col">
                                                <el-button class="frame-but" type="success" plain @click="allCode">
                                                    全部
                                                </el-button>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </el-form>
                            </el-dialog>
                            <!-- 新增/编辑结束 -->
                        </div>
                    </div>
                </dv-border-box-13>
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    name: "tableManagement",

    created() {
        this.search();
        this.getParams();
        this.refreshScreenSize();

    },
    data() {
        return {
            fullscreenLoading: false,
            pageData: {
                page: 1,
                size: 10,
                sort: "creationTime,DESC"
            },
            viewDialog: {
                isTools: false,
                isShow: false,
                isEdit: false,
                butIsLoading: false
            },
            buildFileDialog: {
                isAllSelect: false,
                isShow: false,
                butIsLoading: false,
                fileTypes: [],
                javaPath: "",
                vuePath: ""
            },
            buildPartialDialog: {
                isAllSelect: false,
                isShow: false,
                butIsLoading: false,
                fileTypes: [],
                javaPath: "",
                vuePath: "",
                sql: ""
            },
            tableOptions: [],
            formLabelWidth: "80px",
            formLabelWidthFirst: "80px",
            currentIndex: null,
            data: {
                projectEntity: {},
                detailEntitys: []
            },
            listData: {
                loading: false
            },
            rules: {
                name: [
                    {required: true, message: "请输入名称", trigger: "blur"}
                ],
                number: [
                    {required: true, message: "请输入编号", trigger: "blur"}
                ],
                remark: [
                    {required: false, message: "请输入备注", trigger: "blur"}
                ]
            },
            screenWidth: document.body.clientWidth
        };
    },

    methods: {
        //执行搜索
        search() {
            //alert(this.$route.params.projectType);
            this.listData.loading = true;
            if (!this.isEmpty(this.pageData.creationTime)) {
                this.pageData["creationTime_ge"] =
                    this.pageData.creationTime[0] + "T00:00:00";
                this.pageData["creationTime_le"] =
                    this.pageData.creationTime[1] + "T00:00:00";
            }
            this.pageData["projectType_eq"] = "DQ";
            this.pageData.projectId_isNull = null;
            this.fullscreenLoading = true;
            this.getHttp(
                "/api/project/findAll?" + this.jsonToUrl(this.pageData)
            ).then(result => {
                this.fullscreenLoading = false;
                this.listData = result;
                this.listData.loading = false;
            });
        },
        //批量删除
        batchDel(id) {
            if (
                this.isEmpty(id) &&
                this.$refs.listTable.selection.length == 0
            ) {
                this.$message.warning("请先勾选删除列");
                return;
            }
            this.$confirm("确定要进行删除操作吗?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                if (this.isNotEmpty(id)) {
                    this.getHttp("/api/project/delete?id=" + id).then(
                        result => {
                            this.search();
                        }
                    );
                } else {
                    var ids = this.listExtract(
                        this.$refs.listTable.selection,
                        "id"
                    );
                    this.postHttp("/api/project/batchDelete", ids).then(
                        result => {
                            this.search();
                        }
                    );
                }
            });
        },
        //打开新增
        goAdd(row) {
            this.resetForm("ruleForm");
            var projectId = this.isEmpty(row.projectId)
                ? row.id
                : row.projectId;
            this.getTableOptions(projectId);
            this.viewDialog.isEdit = true;
            this.viewDialog.isTools = false;
            this.getHttp("/api/project/simpleView?id=" + projectId, {}).then(
                result => {
                    this.viewDialog.isShow = true;
                    this.data = {
                        prefix: result.prefix,
                        insertIndex: result.insertIndex,
                        level: row.level + 1,
                        projectId: projectId,
                        projectEntity: {id: row.id, name: row.label},
                        parentId: row.id,
                        detailEntitys: result.detailEntitys
                    };
                    if (row.level > 2) {
                        var temp = [
                            {},
                            {
                                name: this.data.projectEntity.name + "id",
                                number: "parentId",
                                linkTable: row.id,
                                allowEmpty: "N",
                                columnProperties: "linkColumn",
                                isKey: "N"
                            }
                        ];
                        for (
                            var i = 1;
                            i < this.data.detailEntitys.length;
                            i++
                        ) {
                            temp.push(this.data.detailEntitys[i]);
                        }
                        temp[0] = this.data.detailEntitys[0];
                        this.data.detailEntitys = temp;
                    }
                    this.addDetails();
                }
            );
        },
        treeCheck(data, test) {
            this.$refs.tree.store.nodesMap[data.id].expanded = !this.$refs.tree
                .store.nodesMap[data.id].expanded;
            data.unfold = !data.unfold;
        },
        //打开工具箱
        goTools(row) {
            this.getTableOptions(
                this.isEmpty(row.projectId) ? row.id : row.projectId
            );
            this.viewDialog.isLoading = true;
            this.viewDialog.isShow = false;
            this.viewDialog.isEdit = false;
            this.viewDialog.isTools = true;
            this.getHttp("/api/project/tools?id=" + row.id, {}).then(result => {
                this.viewDialog.isShow = true;
                this.viewDialog.isLoading = false;
                this.data = result;
                this.data.level = row.level;
                this.data.projectEntity = {
                    id: row.parentId,
                    name: row.parentName
                };
            });
        },

        //打开详情
        goView(row) {
            this.getTableOptions(
                this.isEmpty(row.projectId) ? row.id : row.projectId
            );
            this.viewDialog.isEdit = false;
            this.viewDialog.isTools = false;
            this.getHttp("/api/project/editView?id=" + row.id, {}).then(
                result => {
                    this.viewDialog.isShow = true;
                    this.data = result;
                    this.data.projectEntity = {id: row.id, name: row.label};
                }
            );
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        //打开编辑
        goEdit(row) {
            this.resetForm("ruleForm");
            this.getTableOptions(
                this.isEmpty(row.projectId) ? row.id : row.projectId
            );
            this.viewDialog.isLoading = true;
            this.viewDialog.isShow = false;
            this.viewDialog.isEdit = true;
            this.viewDialog.isTools = false;
            this.getHttp("/api/project/editView?id=" + row.id).then(result => {
                this.viewDialog.isShow = true;
                this.viewDialog.isLoading = false;
                this.data = result;
                this.data.projectEntity = {id: row.id, name: row.label};
            });
        },
        //添加明细
        addDetails() {
            var insertIndex = this.data.insertIndex;
            insertIndex = this.isEmpty(insertIndex)
                ? this.data.detailEntitys.length
                : insertIndex;
            for (var i = 0; i < this.data.detailEntitys.length; i++) {
                if (this.isEmpty(this.data.detailEntitys[i].id)) {
                    insertIndex++;
                }
            }
            var detail = {
                parentId: this.data.id,
                allowEmpty: "Y",
                columnProperties: "baseColumn",
                type: "varchar",
                length: "200",
                isKey: "N"
            };
            this.data.detailEntitys.splice(insertIndex, 0, detail);
        },
        //上移
        up() {
            if (this.currentIndex == 0) {
                return;
            }
            this.data.detailEntitys = Object.assign(
                [],
                this.upIndex(this.data.detailEntitys, this.currentIndex)
            );
            this.data.detailEntitys[this.currentIndex].index =
                this.currentIndex - 1;
            this.data.detailEntitys[this.currentIndex - 1].index =
                this.currentIndex + 1;
            this.currentIndex = this.currentIndex - 1;
        },
        //下移
        down() {
            if (this.currentIndex == this.data.detailEntitys.length - 1) {
                return;
            }
            this.data.detailEntitys = Object.assign(
                [],
                this.downIndex(this.data.detailEntitys, this.currentIndex)
            );
            this.data.detailEntitys[this.currentIndex].index =
                this.currentIndex + 1;
            this.data.detailEntitys[this.currentIndex + 1].index =
                this.currentIndex - 1;
            this.currentIndex = this.currentIndex + 1;
        },
        //动态修改类名
        tableRowClassName({row, rowIndex}) {
            row.index = rowIndex;
            if (this.isNotEmpty(row.id) || row.number == "parentId") {
                return "warning-row";
            } else {
                return "edit-row";
            }
        },
        //记录下标
        currentChange(row) {
            this.currentIndex = row.index;
        },
        //复制SQL
        copySql() {
            var row = this.data.detailEntitys[this.currentIndex];
            var previousColumnNumber =
                this.currentIndex == 0
                    ? ""
                    : this.data.detailEntitys[this.currentIndex - 1].number;
            this.postHttp(
                "/api/project/oneSql?id=" +
                this.data.projectId +
                "&tableNumber=" +
                this.data.number +
                "&previousColumnNumber=" +
                previousColumnNumber,
                row
            ).then(result => {
                this.buildPartialDialog.sql = result;
                // 使用textarea支持换行，使用input不支持换行
                const textarea = document.createElement("textarea");
                textarea.value = result;
                document.body.appendChild(textarea);
                textarea.select();
                if (document.execCommand("copy")) {
                    document.execCommand("copy");
                    this.$message({message: "复制成功", type: "success"});
                }
                //console.log(JSON.stringify(this.$refs.buildPartialRef.innerText));
                document.body.removeChild(textarea);
            });
        },
        //复制实体
        copyEntity() {
            var row = this.data.detailEntitys[this.currentIndex];
            this.postHttp(
                "/api/project/oneEntity?id=" +
                this.data.projectId +
                "&tableNumber=" +
                this.data.number,
                row
            ).then(result => {
                this.buildPartialDialog.sql = result;
                // 使用textarea支持换行，使用input不支持换行
                const textarea = document.createElement("textarea");
                textarea.value = result;
                document.body.appendChild(textarea);
                textarea.select();
                if (document.execCommand("copy")) {
                    document.execCommand("copy");
                    this.$message({message: "复制成功", type: "success"});
                }
                //console.log(JSON.stringify(this.$refs.buildPartialRef.innerText));
                document.body.removeChild(textarea);
            });
        },
        allCode() {
            var row = this.data.detailEntitys[this.currentIndex];
            var previousColumnNumber =
                this.currentIndex == 0
                    ? ""
                    : this.data.detailEntitys[this.currentIndex - 1].number;
            this.postHttp(
                "/api/project/allCode?id=" +
                this.data.projectId +
                "&tableNumber=" +
                this.data.number +
                "&previousColumnNumber=" +
                previousColumnNumber,
                row
            ).then(result => {
                this.buildPartialDialog.sql = result;
                // 使用textarea支持换行，使用input不支持换行
                const textarea = document.createElement("textarea");
                textarea.value = result;
                document.body.appendChild(textarea);
                textarea.select();
                if (document.execCommand("copy")) {
                    document.execCommand("copy");
                    this.$message({message: "复制成功", type: "success"});
                }
                //console.log(JSON.stringify(this.$refs.buildPartialRef.innerText));
                document.body.removeChild(textarea);
            });
        },

        //复制语句
        sqlCopy() {
            var selection = window.getSelection();
            var range = document.createRange();
            range.selectNodeContents(this.$refs.sqlDiv);
            selection.removeAllRanges();
            selection.addRange(range);
            if (document.execCommand("copy")) {
                document.execCommand("copy");
                this.$message({message: "复制成功", type: "success"});
            }
            selection.removeAllRanges();
        },
        //删除明细
        delDetails(index) {
            this.data.detailEntitys.splice(index, 1);
        },
        //保存
        save() {
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    var detailEntitysTemp = [];
                    for (var i = 0; i < this.data.detailEntitys.length; i++) {
                        if (
                            this.isEmpty(this.data.detailEntitys[i].id) ||
                            this.data.detailEntitys[i].number == "parentId"
                        ) {
                            this.data.detailEntitys[i].id = null;
                            detailEntitysTemp.push(this.data.detailEntitys[i]);
                        }
                    }
                    let isAllOk = false;
                    for (let k = 0; k < this.data.detailEntitys.length; k++) {
                        let li = this.data.detailEntitys[k];
                        if (!li.name || li.name === "") {
                            let msg = `请填写第${k + 1}行名称字段`;
                            this.$message.warning(msg);
                            isAllOk = true;
                            break;
                        }
                        if (!li.number || li.number === "") {
                            let msg = `请填写第${k + 1}行属性名字段`;
                            this.$message.warning(msg);
                            isAllOk = true;
                            break;
                        }
                    }
                    if (isAllOk) {
                        return;
                    }
                    var dataSave = Object.assign({}, this.data);
                    dataSave.detailEntitys = detailEntitysTemp;
                    this.viewDialog.butIsLoading = true;
                    this.postHttp("/api/project/save", dataSave).then(
                        result => {
                            this.viewDialog.butIsLoading = false;
                            if (result.code == 200) {
                                this.viewDialog.isShow = false;
                                if (this.isEmpty(dataSave.id)) {
                                    this.search();
                                }
                            }
                        }
                    );
                } else {
                    return false;
                }
            });
        },
        //获取table 下拉参数
        getTableOptions(id) {
            this.getHttp("/api/project/getTableOptions?id=" + id, {}).then(
                result => {
                    this.tableOptions = result;
                }
            );
        },
        //字段属性改变
        columnPropertiesChange(index, columnProperties) {
            this.data.detailEntitys[index] = {
                columnProperties: columnProperties,
                parentId: this.data.id,
                name: this.data.detailEntitys[index].name,
                number: this.data.detailEntitys[index].number,
                allowEmpty: "Y",
                isKey: "N"
            };
            if (columnProperties == "baseColumn") {
                this.data.detailEntitys[index].type = "varchar";
                this.data.detailEntitys[index].length = "200";
            } else if (columnProperties == "linkColumn") {
            } else if (columnProperties == "paramColumn") {
            }
            this.data.detailEntitys = Object.assign(
                [],
                this.data.detailEntitys
            );
        },
        //字段类型改变
        typeChange(data) {
            var type = data.type;
            if (type == "int") {
                data.length = "11";
                data.places = "0";
            } else if (type == "varchar") {
                data.length = "200";
                data.places = "";
            } else if (type == "decimal") {
                data.length = "11";
                data.places = "2";
            } else if (type == "datetime") {
                data.length = "";
                data.places = "";
            } else if (type == "char") {
                data.length = "1";
                data.places = "";
            }
            data.defaultValue = "";
        },
        //关联表改变了
        linkTableChange(data) {
            var id = data.linkTable;
            for (var i = 0; i < this.tableOptions.length; i++) {
                var obj = this.tableOptions[i];
                if (id == obj.value) {
                    data.name = obj.label;
                    data.number = obj.number;
                    data.remark = obj.parentNumber;
                    return;
                }
            }
        },
        //全选
        fileTypesAll() {
            this.buildFileDialog.isAllSelect = !this.buildFileDialog
                .isAllSelect;
            this.buildFileDialog.fileTypes = [];
            if (this.buildFileDialog.isAllSelect) {
                for (var i = 0; i < this.getOptions("fileType").length; i++) {
                    this.buildFileDialog.fileTypes.push(
                        this.getOptions("fileType")[i].value
                    );
                }
            }
        },
        //生成文件
        buildFile() {
            this.buildFileDialog.id = this.data.id;
            this.postHttp(
                "/api/project/buildFile",
                this.buildFileDialog
            ).then(result => {
            });
        },
        //下载文件
        downloadFile() {
            var fileTypes = this.urlEncodeURIComponent(
                this.toComma(this.buildFileDialog.fileTypes)
            );
            window.open(
                "/api/project/downloadFile?id=" +
                this.data.id +
                "&fileTypes=" +
                fileTypes
            );
        }
    }
};
</script>
<style>

.frame-col {
    text-align: center;
}

.frame-but {
    width: 100%;
}

.tree-node {
    height: 100%;
    /*
    position: absolute;
    overflow: auto; */
    border-radius: 25px;
    padding: 20px;
    /* border: 2px solid #495e9b; */
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

.div-view {
    padding: 0.5vw;
}

.el-tree-node {
    white-space: nowrap;
    outline: 0;
}

.el-tree-node__content {
    margin-top: 3px;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    border-radius: 10px;
    height: 42px;
    cursor: pointer;
}

.el-tree-node__content:hover {
    background-color: rgb(53 67 108);
}

.el-tree-node:focus > .el-tree-node__content {
    background-color: rgb(53 67 108);
}

.sql-div {
    line-height: 25px;
    overflow-y: scroll;
    background-color: #141414;
    border-color: #495e9b;
    color: #c0c4cc;
    cursor: text;
    -webkit-appearance: none;
    border-radius: 4px;
    border: 2px solid #495e9b;
    color: #606266;
    padding: 0 15px;
}

.tool-spacing {
    text-align: right;
}

/* .operat-but {
    width: 2rem;
} */

.el-button + .el-button {
    margin-left: 0px;
}

.fileType-checkbox {
    width: 100%;
    color: #fff;
}

.tips:hover {
    cursor: pointer;
}

.el-popper {
    border-radius: 25px;
}

.el-popover {
    position: absolute;
    background: rgb(49 44 76);
    min-width: 110px;
    margin: 6px;
    border: 1px solid #5f80df;
    padding: 6px;
    z-index: 2000;
    color: #606266;
    line-height: 1.4;
    text-align: justify;
    font-size: 14px;
    /* box-shadow: 0 2px 12px 0; */
    word-break: break-all;
}

.el-popper[x-placement^=right] .popper__arrow::after {
    bottom: -6px;
    left: 1px;
    border-right-color: rgb(49 44 76);
    border-left-width: 0;
}

.el-popper[x-placement^=right] .popper__arrow {
    top: 50%;
    left: -6px;
    margin-bottom: 3px;
    border-right-color: #5f80df;
    border-left-width: 0;
}

.popoverPadding {
    border: 2px dashed #4e68b6;
    border-radius: 25px;
    padding: 15px;
}

.dvBox8 {
    height: calc(93vh - 20px);
}

.leftBox {
    padding: 0.5vw;
}

.treeNode {
    margin: 0.5vw;
    height: calc(90vh - 20px - 2vw);
    background-color: #282c34;
    color: #fff;
    overflow: auto;
}

.detailInfo {
    padding: 0.5vw;
    height: calc(90vh - 2vw);
    overflow-x: auto;
    overflow-y: hidden;
}

.operat-but:hover {
    animation: shake3856 0.3s linear infinite both;
}

@keyframes shake3856 {
    0% {
        -webkit-transform: translate(0);
        transform: translate(0);
    }

    20% {
        -webkit-transform: translate(-2px, 2px);
        transform: translate(-2px, 2px);
    }

    40% {
        -webkit-transform: translate(-2px, -2px);
        transform: translate(-2px, -2px);
    }

    60% {
        -webkit-transform: translate(2px, 2px);
        transform: translate(2px, 2px);
    }

    80% {
        -webkit-transform: translate(2px, -2px);
        transform: translate(2px, -2px);
    }

    100% {
        -webkit-transform: translate(0);
        transform: translate(0);
    }
}

.el-checkbox.is-bordered {
    padding: 9px 20px 9px 10px;
    border-radius: 4px;
    border: 1px solid #495e9b;
    box-sizing: border-box;
    line-height: normal;
    height: 40px;
}
.el-input .el-input__inner {
    background-color: rgb(53 67 108);
    border-color: #495e9b;
    color: #C0C4CC;
    cursor: not-allowed;
}
</style>

<style scoped>
.el-form-item {
    margin-bottom: 1.6vh;
}


</style>
