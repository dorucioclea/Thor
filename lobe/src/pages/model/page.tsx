import { useEffect, useState } from "react";
import { Header, Input, Tag, } from "@lobehub/ui";
import { IconAvatar, OpenAI } from "@lobehub/icons";
import { Button, Switch, Table } from "antd";
import { getCompletionRatio, renderQuota } from "../../utils/render";
import { getIconByName } from "../../utils/iconutils";
import { GetModelManagerList } from "../../services/ModelManagerService";
import { Search } from "lucide-react";


export default function DesktopLayout() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isK, setIsK] = useState<boolean>(false);
    const [total, setTotal] = useState<number>(0);
    const [input, setInput] = useState({
        page: 1,
        pageSize: 10,
        model: '',
    });

    function loadData() {
        setLoading(true);
        GetModelManagerList(input.model, input.page, input.pageSize, true)
            .then((res) => {
                setData(res.data.items);
                setTotal(res.data.total);
            }).finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        loadData();
    }, [input.page, input.pageSize]);

    return (
        <div 
        style={{
            padding: '20px',
            overflow: 'auto',
            height: 'calc(100vh - 220px - 64px)',
        }}> 
            <Header
                nav={'模型列表'}

                actions={<>
                    <Switch value={isK} checkedChildren={<Tag >K</Tag>} unCheckedChildren={<Tag >M</Tag>} defaultChecked onChange={(checked) => {
                        setIsK(checked);
                    }
                    } />
                    <Input placeholder="请输入需要搜索的模型" value={input.model}
                        suffix={<Button type='text' icon={<Search></Search>} onClick={() => {
                            loadData();
                        }}></Button>}
                        onChange={(v) => {
                            setInput({
                                ...input,
                                model: v.target.value
                            })
                        }} >
                    </Input>
                </>
                }
            >
            </Header>
            <Table
                rowKey={row => row.id}
                pagination={{
                    total: total,
                    pageSize: input.pageSize,
                    defaultPageSize: input.page,
                    onChange: (page, pageSize) => {
                        setInput({
                            ...input,
                            page,
                            pageSize,
                        });
                    }
                }}
                loading={loading}
                dataSource={data}
                scroll={{
                    y: 600,
                    x: 800,
                }}
                style={{
                    margin: '1rem',
                }}
                columns={[
                    {
                        key: 'icon',
                        title: '图标',
                        dataIndex: 'icon',
                        width: 60,
                        render: (value: any) => {
                            const icon = getIconByName(value);
                            return icon?.icon ?? <IconAvatar size={36} Icon={OpenAI} />;
                        }
                    },
                    {
                        key: 'model',
                        title: '模型',
                        dataIndex: 'model'
                    },
                    {
                        key: 'description',
                        title: '描述',
                        dataIndex: 'description'
                    },
                    {
                        key: 'price',
                        title: '模型价格',
                        dataIndex: 'price',
                        render: (_: any, item: any) => {
                            if (isK) {
                                return (<div>
                                    <Tag color='cyan'>提示{renderQuota(item.promptRate * 1000,6)}/1K tokens</Tag>
                                    {item.completionRate ?<><Tag style={{
                                        marginTop: 8
                                    }} color='geekblue'>完成{renderQuota(item.completionRate * 1000,6)}/1K tokens</Tag></>:<><Tag style={{
                                        marginTop: 8
                                    }} color='geekblue'>完成{renderQuota(getCompletionRatio(item.model) * 1000,6)}/1K tokens</Tag></>}
                                </div>)
                            } else {
                                return (<div>
                                    <Tag color='cyan'>提示{renderQuota(item.promptRate * 1000000)}/1M tokens</Tag>
                                    {item.completionRate ?<><Tag style={{
                                        marginTop: 8
                                    }} color='geekblue'>完成{renderQuota(item.completionRate * 1000000)}/1M tokens</Tag></>:<><Tag style={{
                                        marginTop: 8
                                    }} color='geekblue'>完成{renderQuota(getCompletionRatio(item.model) * 1000000)}/1M tokens</Tag></>}
                                </div>)
                            }
                        }
                    },
                    {
                        key: 'quotaType',
                        title: '模型类型',
                        dataIndex: 'quotaType',
                        render: (value: any) => {
                            return value === 1 ? '按量计费' : '按次计费';
                        }
                    },
                    {
                        key: 'quotaMax',
                        title: '模型额度最大上文',
                        dataIndex: 'quotaMax'
                    },
                    {
                        key: "tags",
                        title: '标签',
                        dataIndex: 'tags',
                        render: (value: any) => {
                            return value.map((tag: any) => {
                                return <Tag key={tag} color='blue'>{tag}</Tag>;
                            });
                        }
                    },
                    {
                        key: 'enable',
                        title: '状态',
                        dataIndex: 'enable',
                        render: (value: any) => {
                            if (value) {
                                return <Tag color='green'>可用</Tag>
                            }
                            else {
                                return <Tag color='red'>
                                    不可用
                                </Tag>
                            }
                        }
                    }
                ]}
            />
        </div>
    );
}