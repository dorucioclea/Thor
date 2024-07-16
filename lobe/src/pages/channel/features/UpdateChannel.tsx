import { useEffect, useState } from "react";
import { getModels, getTypes } from "../../../services/ModelService";
import { Update } from "../../../services/ChannelService";
import { message, Drawer } from 'antd';
import { Button, Select, Form, Input } from 'antd';
import { getModelPrompt } from "../../../utils/render";

const { Option } = Select;
interface IUpdateChannelProps {
    onSuccess: () => void;
    visible: boolean;
    onCancel: () => void;
    value?: any;
}

interface InputProps {
    name: string;
    type: string;
    address: string;
    other: string;
    key: string;
    models: string[];
    extension: {
        [key: string]: any;
    }
}

export default function UpdateChannel({
    onSuccess,
    visible,
    onCancel,
    value
}: IUpdateChannelProps) {
    // 字典models key, value类型
    const [types, setTypes] = useState<any>();
    const [models, setModels] = useState<any>();
    const [input, setInput] = useState<InputProps>({
        name: '',
        type: '',
        address: '',
        other: '',
        key: '',
        models: [],
        extension: {}
    });


    type FieldType = {
        name?: string;
        type?: string;
        address?: string;
        other?: string;
        key?: string;
        models: string[];
    };

    function loading() {
        getTypes()
            .then(res => {
                if (res.success) {
                    setTypes(res.data);
                } else {
                    message.error({
                        content: res.message
                    });
                }
            })

        getModels()
            .then(res => {
                if (res.success) {
                    setModels(res.data);
                } else {
                    message.error({
                        content: res.message
                    });
                }
            })

    }

    useEffect(() => {
        if (visible) {
            loading();
            setInput({
                name: value.name,
                type: value.type,
                address: value.address,
                other: value.other,
                key: value.key,
                models: value.models,
                extension: value.extension
            });
        }
    }, [visible]);

    function handleSubmit(values: any) {

        Update(value.id, values)
            .then((item) => {
                if (item.success) {
                    message.success({
                        content: '修改成功',
                    });
                    onSuccess();
                } else {
                    message.error({
                        content: item.message
                    });
                }
            });
    }

    return <Drawer
        open={visible}
        width={500}
        title="编辑渠道(Channel)"
        onClose={() => onCancel()}
    >
        {
            visible &&
            <Form initialValues={value} onFinish={(values: any) => handleSubmit(values)} style={{ width: 400 }}>

                <Form.Item<FieldType>
                    label="渠道名称"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: '渠道名称不能为空'
                        },
                        {
                            min: 3,
                            message: '渠道名称长度不能小于3'
                        }
                    ]}
                >
                    <Input
                        value={input.name}
                        onChange={(v) => {
                            setInput({ ...input, name: v.target.value })
                        }}
                        placeholder="请输入渠道名称"
                    />
                </Form.Item>
                <Form.Item<FieldType>
                    rules={[
                        {
                            required: true,
                            message: '平台类型不能为空'
                        },
                    ]}
                    name='type'
                    label='平台类型'
                    style={{ width: '100%' }}
                >
                    <Select
                        placeholder="请选择平台类型"
                        value={input.type}
                        onChange={(v) => {
                            setInput({ ...input, type: v });
                        }}
                        allowClear
                    >
                        {types && Object.keys(types).map((key, index) => {
                            return <Option key={index} value={types[key]}>{key}</Option>
                        })}
                    </Select>
                </Form.Item>

                <Form.Item<FieldType>
                    label="代理地址"
                    name="address"
                >
                    <Input />
                </Form.Item>
                {
                    input.type === "AzureOpenAI" && <Form.Item<FieldType> name='other' label='版本' style={{ width: '100%' }}>
                        <Select
                            placeholder="请选择版本"
                            value={input.type}
                            onChange={(v) => {
                                setInput({ ...input, other: v });
                            }}
                            allowClear
                        >
                            <Option key={'2024-05-01-preview'} value={'2024-05-01-preview'}>2024-05-01-preview</Option>
                            <Option key={'2024-04-01-preview'} value={'2024-04-01-preview'}>2024-04-01-preview</Option>
                            <Option key={'2024-06-01'} value={'2024-06-01'}>2024-06-01</Option>
                        </Select>
                    </Form.Item>

                }
                {
                    input.type === "Hunyuan" && <Form.Item<FieldType> name='other' label='资源地域' style={{ width: '100%' }}>
                        <Select
                            placeholder="资源地域"
                            value={input.type}
                            onChange={(v) => {
                                setInput({ ...input, other: v });
                            }}
                            allowClear
                        >

                            <Option key={'ap-beijing'} value={'ap-beijing'}>北京（ap-beijing）</Option>
                            <Option key={'ap-guangzhou'} value={'ap-guangzhou'}>广州 （ap-guangzhou）</Option>
                        </Select>
                    </Form.Item>
                }
                <Form.Item<FieldType>
                    label="密钥"
                    name="key"

                >
                    <Input.Password
                        placeholder={getModelPrompt(input.type)}
                        autoComplete="new-password"
                    />
                </Form.Item>
                <Form.Item<FieldType> name='models' label='模型' rules={[
                    {
                        required: true,
                        message: '请选择模型'
                    }
                ]} style={{ width: '100%' }}>
                    <Select
                        placeholder="请选择模型"
                        defaultActiveFirstOption={true}
                        mode="tags"
                        value={input.type}
                        onChange={(v) => {
                            setInput({ ...input, type: v });
                        }}
                        allowClear
                    >
                        {

                            models && models.map((model: any) => {
                                return <Option key={model} value={model}>{model}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Button type='primary' block htmlType='submit'>提交</Button>
            </Form>
        }
    </Drawer>;
}