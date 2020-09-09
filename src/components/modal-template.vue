<template>
    <div>
        <i-table  :columns="format" :data="node_list">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary"  style="margin-right: 5px" @click="add_taint(index)">添加容忍</Button>
                <Button type="error" style="margin-right: 5px"  @click="del_taint(index)">删除容忍</Button>
                <Button type="primary" style="margin-right: 5px"  @click="add_label(index)">打标签</Button>
                <Button type="error"   @click="del_label(index)">删标签</Button> 
            </template>
        </i-table>
        <!-- 添加容忍模态框 -->
        <Modal v-model="show_add_taint_modal" width="600">
            <p slot="header" style="color:#f60;text-align:center">
                {{ node_name }}<span>增加污点</span>
            </p>
            <div style="text-align:center">
                <Form :ref="addTaintForm" :model="addTaintForm" :rules="rules" label-position="left"  :label-width="100">
                    <Form-Item label="选择污点效果" prop="taint_effect">
                        <Select v-model="addTaintForm.taint_effect">
                            <Option v-for="effect in taint_effect_list" :key="effect" :value="effect">{{ effect }}</Option>
                        </Select>
                    </Form-Item> 
                    <Form-Item label="key:"  prop="taint_key">
                        <Input type="text"  v-model="addTaintForm.taint_key" />
                    </Form-Item>
                    <Form-Item label="value:" prop="taint_value">
                        <Input type="text"  v-model="addTaintForm.taint_value"  />
                    </Form-Item>
                </Form> 
            </div>
            <div slot="footer">
                <Button type="primary" size="large"  @click="btn_add_taint">提交</Button>
            </div>
        </Modal>
        <!-- 删除容忍模态框 -->
        <Modal v-model="show_del_taint_modal" width="600">
            <p slot="header" style="color:#f60;text-align:center;">
                {{ node_name }}<span>删除污点</span>
            </p>
            <div style="">
                <Form>
                    <Form-Item >
                        <Radio-Group v-model="taint_del_index" vertical>
                            <Radio v-for="(taint,index) in taints" :label="index" :key="index">{{ taint }}</Radio>
                        </Radio-Group>
                    </Form-Item> 
                </Form> 
            </div>
            <div slot="footer">
                <Button type="primary" size="large"  @click="btn_del_taint">提交</Button>
            </div>
        </Modal>
        <!-- 打标签模态框 -->
        <Modal v-model="show_add_label_modal" width="600">
            <p slot="header" style="color:#f60;text-align:center">
                {{ node_name }}<span>打标签</span>
            </p>
            <div style="text-align:center">
                <Form :ref="addLabelForm" :model="addLabelForm" :rules="addLabelRules" label-position="left"  :label-width="100">
                    <Form-Item label="key:"  prop="key">
                        <Input type="text"  v-model="addLabelForm.key" />
                    </Form-Item>
                    <Form-Item label="value:" prop="value">
                        <Input type="text"  v-model="addLabelForm.value"  />
                    </Form-Item>
                </Form> 
            </div>
            <div slot="footer">
                <Button type="primary" size="large"  @click="btn_add_label">提交</Button>
            </div>
        </Modal>
        <!-- 删标签模态框 -->
        <Modal v-model="show_del_label_modal" width="600">
            <p slot="header" style="color:#f60;text-align:center;">
                <span>删除标签({{ node_name }})</span>
            </p>
            <div style="">
                <Form>
                    <Form-Item >
                        <CheckboxGroup v-model="label_del_key" vertical>
                            <Checkbox v-for="(val,key) in labels" :label="key" :key="key">键:{{ key }} 值:{{val}}</Checkbox>
                        </CheckboxGroup>
                    </Form-Item> 
                </Form> 
            </div>
            <div slot="footer">
                {{ label_del_key }}
                <Button type="primary" size="large"  @click="btn_del_label">提交</Button>
            </div>
        </Modal>
    </div>
</template>