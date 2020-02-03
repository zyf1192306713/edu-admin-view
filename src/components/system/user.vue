<template>
    <div>
        <el-row>
            <el-col :span="24">
                <!-- 根据角色搜索 -->
                <el-select v-model="role_query" style="width: 130px">
                    <el-option @click.native="initList" v-for="item in searchRoleTypeList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
                </el-select>

                <!-- 根据用户搜索 -->
                <el-input placeholder="用户名" class="search-input" v-model="userName_query" @keydown.native.enter="initList" clearable></el-input>

                <!-- 根据真实姓名搜索 -->
                <el-input placeholder="真实姓名" class="search-input" v-model="realName_query" @keydown.native.enter="initList" clearable></el-input>

                <el-tooltip content="点击搜索" placement="top" :enterable="false" effect="light">
                    <el-button type="primary" plain icon="el-icon-search" @click="initList"></el-button>
                </el-tooltip>

                <!-- 添加用户 -->
                <el-button type="success" plain @click="showAddDialog">添加用户</el-button>

                <!-- 批量删除按钮 -->
                <el-tooltip content="删除已选用户" placement="top" :enterable="false">
                    <el-button type="danger" icon="el-icon-delete" circle plain size="medium" @click="deleteSelection"></el-button>
                </el-tooltip>
            </el-col>
        </el-row>

        <!-- 表格渲染 -->
        <el-table
            stripe
            ref="multipleTable"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange"
            :height="tableHeight"
            class="margin-20"
            v-loading="loading"
            :data="allUserList"
            border
            :fit="true"
            style="width: 100%">

            <el-table-column type="selection" width="60" align="center">
            </el-table-column>
            <el-table-column prop="id" label="ID" :show-overflow-tooltip="true" align="center"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="userName" align="center" label="用户名"> </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="realName" align="center" label="真实姓名"> </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="gender" align="center" label="性别"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="phone" align="center" label="手机号码"></el-table-column>
            <el-table-column v-if="role_query==0" :show-overflow-tooltip="true" prop="roleName" align="center" label="用户角色"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="createUser" align="center" label="创建人"> </el-table-column>
            <el-table-column prop="createTime" :show-overflow-tooltip="true" align="center" label="创建时间">
                <template slot-scope="scope">
                    {{!isEmpty(scope.row.createTime)?DateFormat(scope.row.createTime):''}}
                </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="lastUpdateUser" align="center" label="最后更新人"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="lastUpdateTime" align="center" label="最后更新时间">
                <template slot-scope="scope">
                    {{!isEmpty(scope.row.lastUpdateTime)?DateFormat(scope.row.lastUpdateTime):''}}
                </template>
            </el-table-column>
            
            <el-table-column label="操作" align="center" width="250" fixed="right">
                <template slot-scope="scope">
                    <el-button size="mini" type="success" plain icon="el-icon-user" @click="showDeleteDialog(scope.row)"></el-button>
                    <el-button size="mini" type="primary" plain icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
                    <el-popover :ref="scope.row.id" placement="top" width="200">
                        <p>确定删除本条数据吗？</p>
                        <div style="text-align: right; margin: 0">
                            <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                            <el-button type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
                        </div>
                        <el-button style="margin-left:10px" slot="reference" plain type="danger" icon="el-icon-delete" size="mini"/>
                    </el-popover>
                </template>
            </el-table-column>
        </el-table>

        <div class="page">
            <el-pagination 
                background 
                @size-change="handleSizeChange" 
                @current-change="handleCurrentChange"
                :current-page="currentPage" 
                :page-sizes="[10, 20, 30, 40]" 
                :page-size="10"
                layout="total, sizes, prev, pager, next, jumper" 
                :total="this.total">
            </el-pagination>
        </div>

        <!-- 新增用户信息对话框 -->
        <el-dialog title="添加用户" class="addUser-dialog" :visible.sync="addDialogFormVisible" center @close="addClose" style="width:100%">
            <el-form :model="form" :rules="rules" ref="form" style="width:90%">
                <el-form-item label="用户名" :label-width="formLabelWidth" prop="userName">
                    <el-input v-model="form.userName" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
                    <el-input v-model="form.password" autocomplete="off" type="password"></el-input>
                </el-form-item>

                <el-form-item label="真实姓名" :label-width="formLabelWidth" prop="realName">
                    <el-input v-model="form.realName" autocomplete="off"></el-input>
                </el-form-item>

                <!-- <el-form-item label="身份证号码" :label-width="formLabelWidth" prop="cardNumber">
                    <el-input v-model="form.cardNumber" autocomplete="off"></el-input>
                </el-form-item> -->

                <!-- <el-form-item label="出生年月日" :label-width="formLabelWidth" prop="birthday">
                    <el-date-picker type="date" placeholder="选择出生年月日" v-model="form.birthday" style="width: 100%;"></el-date-picker>
                </el-form-item>

                <el-form-item label="手机号" :label-width="formLabelWidth" prop="phone">
                    <el-input v-model="form.phone" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="紧急联系人号码" :label-width="formLabelWidth" prop="pPhone">
                    <el-input v-model="form.pPhone" autocomplete="off"></el-input>
                </el-form-item> -->

                <el-form-item label="用户身份" :label-width="formLabelWidth" prop="roleIds">
                    <el-popover placement="right" trigger="manual" v-model="selectTeacherVisible">
                            <el-checkbox-group  v-model="form.roleIds" @change="roleChange">
                                <el-checkbox v-for="item in roleList" :label="item.id" :key="item.id" size="100">{{item.roleName}}</el-checkbox>
                            </el-checkbox-group>
                           
                            <el-radio-group  v-model="roleType" slot="reference"  @change="changeRoleType">
                                <el-radio :label="5" border>学生</el-radio>
                                <el-radio :label="1" border>教师</el-radio>
                            </el-radio-group>
                        </el-popover>   
                </el-form-item>
                
                <!-- 所属班级 || 管理班级 -->
                <el-form-item :label="formItemLabel" v-if="GradeClassVisible" :label-width="formLabelWidth" prop="gradeClassIds">
                    <el-select style="width:100%" v-model="form.gradeClassIds">
                        <el-option v-for="item in allGradeClassList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="指定班干部" v-if="isStudent" :label-width="formLabelWidth" prop="cadresId">
                    <el-select v-model="form.cadresId" style="width:100%">
                        <el-option v-for="item in gadresList" :key="item.id" :label="item.cadresName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="授课班级" v-if="isTeacher" :label-width="formLabelWidth" prop="teachingClasses" placeholder="请选择科任老师授课班级">
                    <!-- <el-input style="width:100%" v-model="testInput" @click.native="showTransfer" readonly autocomplete="off">
                        <el-tag>aaaa</el-tag>
                    </el-input> -->
                    <el-select v-model="form.teachingClasses" :label-width="formLabelWidth" multiple placeholder="请选择">
                        <el-option v-for="(item) in allGradeClassList" :key="item.id" :label="item.name" :value="item.id"/>
                    </el-select>
                </el-form-item>

                <el-form-item label="性别" :label-width="formLabelWidth" prop="gender">
                    <el-select style="width:100%" v-model="form.gender" placeholder="性别">
                        <el-option autocomplete="off" :value="1" label="男"></el-option>
                        <el-option autocomplete="off" :value="2" label="女"></el-option>
                    </el-select>
                </el-form-item>

                <!-- <el-form-item label="家庭住址" :label-width="formLabelWidth" prop="address">
                    <el-input v-model="form.address" autocomplete="off"></el-input>
                </el-form-item> -->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="add('form')">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 选择授课班级穿梭框 -->
        <!-- <el-dialog  title="选择授课班级" class="transfer-dialog" :visible.sync="selectTeachingClassesDialog" style="width:100%" :append-to-body="true">
            <el-transfer
                @change="changeTransfer"
                :data="transferData"
                v-model="form.teachingClasses"
                :titles="['班级列表', '已选班级']">
            </el-transfer>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeSelectTeachingClassesDialog">取 消</el-button>
                <el-button type="primary" @click="saveTeachingClasses">确 定</el-button>
            </div>
        </el-dialog> -->

        <!-- 编辑用户信息对话框
            :append-to-body="true" 解决弹框层相互遮盖
         -->

    </div>
</template>

<script>
import {getUserList,getRoleTypeList,getAllGradeClass,getAllCadres,addUser,deleteUser} from "@/api";
    export default {
        data() {
            let phoneRepeat = (rule, value, callback) => {
                if (value.length != 11) {
                    callback(new Error("请输入11位手机号码"))
                } else {
                    callback()
                }
            }
            return {
                loading: false,
                // 所有用户信息列表
                allUserList: [],

                //所有角色（包括 管理员 与 查询所有）
                searchRoleTypeList: [],
                //所有角色（不含管理员）
                roleList: [],
                //所有班级信息
                allGradeClassList: [],
                //所有班干部类型
                gadresList: [],

                //角色类型查询
                role_query: 0,
                //用户名查询
                userName_query: '',
                //真实姓名查询
                realName_query: '',
                
                testInput:'',

                //学生为 所属班级，班主任为 管理班级
                formItemLabel: '',
            
                //表格数据分页时默认显示为第 1 页
                currentPage:1,
                //显示一共多少条数据(根据后台数据动态赋值)
                total:0,
                pageNumber: 1,
                pageSize: 10,
                //表格适应窗口动态高度
                tableHeight: window.innerHeight * 0.7 - 11,
                 //勾选中的数据
                multipleSelection: '',
                
                //添加弹框开关，默认为关闭
                addDialogFormVisible: false,
                //编辑弹框开关，默认为关闭
                editDialogFormVisible: false,
                //选择班级选项，默认为关闭
                GradeClassVisible: false,
                //选择教师后显示详细教师类型
                selectTeacherVisible: false,
                //选中授课班级输入框，默认隐藏，当教师类型选中任课老师后显示
                isTeacher: false,
                //科任老师授课穿梭框，默认为隐藏， 点击对应输入框后显示
                selectTeachingClassesDialog: false,
                //选择学生后显示
                isStudent:false,

                form: {
                    //用户名
                    userName: '',
                    //密码
                    password: '',
                    //真实姓名
                    realName: '',
                    //身份证号码
                    cardNumber: '',
                    //手机号码
                    phone: '',
                    //紧急联系人号码
                    pPhone: '',
                    //出生年月日
                    birthday: '',

                    //用户身份（教师）
                    roleIds: [],
                    //所属班级(学生)、管理班级(班主任)
                    gradeClassIds: '',
                    //学生身份（20为普通学生）
                    cadresId: 20,
                    //授课班级
                    teachingClasses: [],
                    //性别
                    gender: '',
                    //家庭地址
                    address: '',
                },
                //用户身份（1：教师  2：学生）
                roleType: '',

                rules: {
                    userName: [
                        { required: true, message: '请输入用户名', trigger: 'change' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'change' }
                    ],
                    realName: [
                        { required: true, message: '请输入用户真实姓名', trigger: 'change' }
                    ],
                    cardNumber: [
                        { required: true, message: '请输入身份证号码', trigger: 'change' }
                    ],
                    phone: [
                        { required: true, message: '请输入手机号码', trigger: 'change' }
                    ],
                    pPhone: [
                        { required: true, message: '请输入紧急联系人号码', trigger: 'change' }
                    ],
                    roleIds: [
                        { required: true, message: '请指定用户身份', trigger: 'blur' }
                    ],
                    gradeClassIds: [
                        { required: true, message: '请指定所属班级/管理班级', trigger: 'change' }
                    ],
                    birthday: [
                        { required: true, message: '请填写出生年月日', trigger: 'change' }
                    ],
                    cadresId: [
                        { required: true, message: '请指定学生身份', trigger: 'change' }
                    ],
                    teachingClasses: [
                        { required: true, message: '请选择授课班级', trigger: 'change' }
                    ],
                    gender: [
                        { required: true, message: '请选择性别', trigger: 'change' }
                    ],
                    address: [
                        { required: true, message: '请输入家庭地址', trigger: 'change' }
                    ],
                },
                formLabelWidth: "150px",
            }
        },
        mounted() {
            this.initList();
        },
        methods: {
            handleSizeChange (val) {
                this.pageSize = val
                this.initList()
            },
            handleCurrentChange (val) {
                this.pageNumber = val 
                this.initList()
            },

            layOut() {
                setTimeout(()=> {
                    this.$refs.multipleTable.doLayout()
                },200)
            },

            initList(){
                let params = {roleId:this.role_query,userName:this.userName_query,realName:this.realName_query,pageNumber: this.pageNumber, pageSize: this.pageSize}
                this.loading = true;
                getUserList(params).then(res => {
                    if(res.code == 0){
                        this.allUserList = res.data.list;
                        this.total = res.data.total
                    }else{
                        this.$message({
                            title: '错误',
                            type: 'error',
                            message: res.msg
                        });
                    }
                    this.loading = false;
                    this.layOut();
                });

                //获取所有的角色集合
                getRoleTypeList().then(res => {
                    if(res.code == 0){
                        this.searchRoleTypeList = res.data;
                        this.searchRoleTypeList.unshift({
                            "id": 0,
                            "roleName": '查看所有'
                        })
                    }else{
                        this.$message({
                            title: '错误',
                            type: 'error',
                            message: res.msg
                        });
                    }
                    
                });
            },
            
            //显示新增用户信息弹框
            showAddDialog(){
                this.addDialogFormVisible = true;
                //获取所有角色
                getRoleTypeList().then(res => {
                    if(res.code == 0){
                        this.roleList = res.data;
                        console.log(this.roleList)
                        //从数组中删除管理员权限（只允许存在一个管理员，无法自行添加）
                        this.roleList.forEach((item, index, arr) => {
                            //删除学生权限与管理员权限
                            if(item.id == 5 || item.id == 1){
                                arr.splice(index,1);
                            }
                        });
                    }else{
                        this.$message({
                            title: '错误',
                            type: 'error',
                            message: res.msg
                        });
                    }
                });
                //获取所有的班级信息
                getAllGradeClass().then(res => {
                    if(res.code == 0){
                        this.allGradeClassList = res.data;
                        // //处理数据后存入transferData(穿梭框数据)
                        // this.allGradeClassList.forEach(item => {
                        //     this.transferData.push({
                        //         key: item.id,
                        //         label: item.name
                        //     });
                        // });
                    }else{
                        this.$message({
                            title: '错误',
                            type: 'error',
                            message: res.msg
                        });
                    }
                });
            },

            //选择用户身份时调用
            roleChange(){
                //当用户身份包含班主任时
                if(this.form.roleIds.indexOf(3)>-1){
                    this.GradeClassVisible = true;
                    this.formItemLabel = "管理班级";
                }else{
                    //当不包含时隐藏
                    this.GradeClassVisible = false;
                }

                //当身份包含科任老师时显示对应输入框(选中任课班级)
                if(this.form.roleIds.indexOf(4)>-1){
                   this.isTeacher = true;
                }else{
                    //关闭输入框
                    this.isTeacher = false;
                    //清空穿梭框之前选中数据
                    this.form.teachingClasses = [];
                }
            },

            //当选择教师或学生时调用
            changeRoleType(value){
                //教师
                if(value == 1){
                    this.GradeClassVisible = false;
                    this.selectTeacherVisible = true;
                    this.form.roleIds =  [];
                    //将之前选中的所属班级（管理班级）清空
                    this.form.gradeClassIds = '';
                    //关闭指定班干部选择框
                    this.isStudent = false;
                }
                
                //学生
                if(value == 5){
                    this.GradeClassVisible = true;
                    this.formItemLabel = "所属班级";
                    this.selectTeacherVisible = false;
                    //选择学生后。清除教师类型数组中的数据
                    this.form.roleIds = [];
                    this.form.roleIds.push(5);
                    //选择学生后，将授课班级输入框隐藏
                    this.isTeacher = false;
                    //清空穿梭框之前选中数据
                    this.form.teachingClasses = [];
                    //将之前选中的所属班级（管理班级）清空
                    this.form.gradeClassIds = '';
                    //清空之前选择的班干部类型
                    this.form.cadresId = 20;

                    //获取所有班干部名称
                    getAllCadres().then(res => {
                        if(res.code == 0){
                            this.gadresList = res.data;
                        }else{
                            this.$message({
                                title: '错误',
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                    //显示指定班干部选择框
                    this.isStudent = true;
                }
            },

            //显示穿梭选择框
            showTransfer(){
                this.selectTeachingClassesDialog = true;
            },
            
            //保存穿梭框数据到input
            saveTeachingClasses(){
                console.log(this.form.teachingClasses)
                this.selectTeachingClassesDialog = false;
            },
            changeTransfer(){

            },

            //关闭选择授课班级弹框
            closeSelectTeachingClassesDialog(){
                this.selectTeachingClassesDialog = false;
            },

            add(form){
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        if(this.roleType == 5){
                            this.form.roleIds = [];
                            this.form.roleIds.push(this.roleType);
                        }
                        
                        //将密码加密
                        this.form.roleIds = this.form.roleIds.toString();
                        this.form.teachingClasses = this.form.teachingClasses.toString();
                        addUser(this.form).then(res => {
                            if(res.code == 0){
                                this.$message({
                                    title: "成功",
                                    type: "success",
                                    message: res.msg
                                });
                            }else{
                                this.$message({
                                    title: "失败",
                                    type: "error",
                                    message: res.msg
                                });
                            }
                            this.addDialogFormVisible = false
                            this.initList();
                        });
                    } else {
                        return false;
                    }
                });
            },

            //新增弹框关闭时调用
            addClose(){ 
                //清空数据
                this.$refs['form'].resetFields()
                this.selectTeacherVisible = false;
                //将选择授课班级输入框默认值设置为false
                this.isTeacher = false;
                //将之前选择的用户身份置为空
                this.roleType = '';
                //关闭所属班级选择框
                this.GradeClassVisible = false;
                //关闭指定班干部选择框
                this.isStudent = false;
            },

            //显示编辑弹框
            showEditDialog(){

            },

            //显示删除弹框
            showDeleteDialog(){

            },

            //提交删除(单个)
            subDelete(id){
                let params = {ids: id}
                deleteUser(params).then(res => {
                    if(res.code == 0){
                        this.$message({
                            title: "成功",
                            type: "success",
                            message: res.msg
                        });
                        this.initList();
                    }else{
                        this.$message({
                            title: "失败",
                            type: "error",
                            message: res.msg
                        });
                    }
                });
            },

            //批量选择时调用
            handleSelectionChange(val){
                this.multipleSelection = [];
                //存放id
                val.forEach(item => {
                    this.multipleSelection.push(item.id);
                })
            },

            //提交批量删除
            deleteSelection(){
                if(this.multipleSelection.length<=0){
                    this.$message({
                        type: 'warning',
                        message: '未选中数据'
                    });
                    return;
                }
                this.$confirm('此操作将永久删除这'+this.multipleSelection.length+'条用户信息，是否继续？',{
                    confirmButtonText: '继续',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = {ids: this.multipleSelection.toString()}
                    deleteUser(params).then(res => {
                        if(res.code == 0){
                            this.$message({
                                title: "成功",
                                type: "success",
                                message: res.msg
                            });
                            this.initList();
                        }else{
                            this.$message({
                                title: "失败",
                                type: "error",
                                message: res.msg
                            });
                        }
                    });
                }).catch(() => {
                            
                })
            }
        }   
    }
</script>

<style lang="css" scoped>
    .margin-20 {
        margin: 20px 0;
    }
    .search-input {
        width: 200px;
    }
    .page {
        padding: 5px 0;
        background-color: #D3DCE6;
    }
    .bread{
        padding: 20px;
        background-color: #D3DCE6;
    }
</style>