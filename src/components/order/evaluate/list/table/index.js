import React, { Component } from "react";
import { Row, Col, Button, Input, Rate, Switch, Pagination, Spin } from "antd";
import styles from "./index.css";
import Image from "@/components/image/index";
import { View } from "react-web-dom";
import moment from "moment";
import { connect } from "dva";
import PhotoGallery from "@/components/photoGallery/index";
import GoodsApi from "@/services/goods";
import Query from "@/utils/query";
import router from "umi/router";

const { TextArea } = Input;
const { Fragment } = React;

@connect(({ evaluate, loading }) => ({
    evaluateList: evaluate.result,
    evaluateListLoading: loading.effects["evaluate/list"]
}))
export default class EvaluateListTable extends Component {

    state = {
        reply_content: [],
        queryParams: {
            keywords_type: "goods_name",
            keywords: null,
            create_time: [],
            type: "all"
        }
    };
    PhotoGallery;

    componentDidMount() {
        this.initList();
    }

    initList() {
        const { dispatch } = this.props;
        const get = Query.make([
            { key: "type", rule: ["eq", "all"] },
            { key: "keywords_type", rule: ["rely", "keywords"] }
        ]);
        if (get["create_time"] !== undefined) {
            get["create_time"] = [moment(get["create_time"][0]).unix(), moment(get["create_time"][1]).unix()];
        }
        dispatch({
            type: "evaluate/list",
            payload: {
                page: get.page,
                rows: get.rows
            },
            callback: () => {
                this.setState({
                    get
                });
            }
        });
    }

    render() {
        const { reply_content } = this.state;
        const { evaluateList, evaluateListLoading } = this.props;
        const { list } = evaluateList;
        return (
            <Spin tip="Loading..." spinning={evaluateListLoading}>
                <PhotoGallery ref={(e) => {
                    this.PhotoGallery = e;
                }} />
                <View className={"EvaluateListTable"}>
                    {
                        Array.isArray(list) && list.map((item, e) =>
                            <Row key={e}>
                                <Col span={1}>
                                    <Image
                                        type='avatar'
                                        src={item.avatar}
                                        className={styles.avatar}
                                    />
                                </Col>
                                <Col span={16} style={{ padding: "0 20px" }}>
                                    <View className={styles.top}>
                                        <View className={styles.topLeft}>
                                            <p>
                                                {item.nickname}
                                                {item.phone ? <span>
                                                    {item.phone}
                                                </span> : null}
                                            </p>
                                            <Rate
                                                style={{
                                                    color: "#ff6969"
                                                }}
                                                disabled
                                                defaultValue={item.score}
                                            />
                                        </View>
                                        <View className={styles.topRight}>
                                            <span>
                                                {
                                                    moment(item.create_time, "X").format("YYYY-MM-DD HH:mm:ss")
                                                }
                                            </span>
                                            <p>
                                                <span>隐藏评价</span>
                                                <Switch
                                                    checked={!item.display}
                                                    onChange={async () => {
                                                        const response = await GoodsApi.list({ id: item.id });
                                                        if (response.code === 0) {
                                                            this.initList();
                                                        }
                                                    }}
                                                />
                                            </p>
                                        </View>
                                    </View>
                                    {
                                        item.content ?
                                            <View className={styles.evaluateContent}>
                                                <p>
                                                    <strong>评价内容：</strong>
                                                    {item.content}
                                                </p>
                                            </View> : null
                                    }
                                    {
                                        Array.isArray(item.images) && item.images.length > 0 ?
                                            <View className={styles.evaluateImg}>
                                                {
                                                    item.images.map((imgListItem, i) =>
                                                        <div key={`evaluateImg_${i}`}>
                                                            <Image
                                                                key={i}
                                                                src={imgListItem}
                                                                onClick={() => {
                                                                    this.PhotoGallery.setState({
                                                                        index: i,
                                                                        photos: item.images.map((src) => {
                                                                            return { src };
                                                                        }),
                                                                        open: true
                                                                    });
                                                                }}
                                                            />
                                                        </div>
                                                    )
                                                }
                                            </View> : null
                                    }
                                    {
                                        <View className={styles.goodsList}>
                                            <View
                                                className={styles.goodsListItem}
                                            >
                                                <Image
                                                    src={item.goods_img}
                                                />
                                                <View className={styles.goodsListRight}>
                                                    <a>{item.goods_title}</a>
                                                </View>
                                            </View>
                                        </View>
                                    }
                                    {
                                        item.reply_time > 0 ?
                                            <View className={styles.contentList}>
                                                <View
                                                    className={styles.contentListItem}
                                                >
                                                    <p className={styles.contentItemTop}>
                                                        <a>管理员</a>
                                                        <span>{moment(item.reply_time, "X").format("YYYY-MM-DD HH:mm")}</span>
                                                    </p>
                                                    <p
                                                        className={styles.contentItemBot}
                                                    >
                                                        {item.reply_content}
                                                    </p>
                                                </View>
                                            </View> : null
                                    }
                                    {
                                        item.additional_time > 0 ?
                                            <View className={styles.contentList}>
                                                <View
                                                    className={styles.contentListItem}
                                                >
                                                    <p className={styles.contentItemTop}>
                                                        <a>{item.nickname}</a>
                                                        <span>{moment(item.additional_time, "X").format("YYYY-MM-DD HH:mm")}</span>
                                                    </p>
                                                    <p
                                                        className={styles.contentItemBot}
                                                    >
                                                        {item.additional_content}
                                                    </p>
                                                </View>
                                            </View> : null
                                    }
                                    {
                                        Array.isArray(item.additional_images) && item.additional_images.length > 0 ?
                                            <View className={styles.evaluateImg}>
                                                {
                                                    item.additional_images.map((imgListItem, i) =>
                                                        <div key={`additional_images_${i}`}><Image
                                                            key={i}
                                                            src={imgListItem}
                                                            onClick={() => {
                                                                this.PhotoGallery.setState({
                                                                    index: i,
                                                                    photos: item.additional_images.map((src) => {
                                                                        return { src };
                                                                    }),
                                                                    open: true
                                                                });
                                                            }}
                                                        /></div>
                                                    )
                                                }
                                            </View> : null
                                    }
                                    {
                                        item.reply_time2 > 0 ?
                                            <View className={styles.contentList}>
                                                <View
                                                    className={styles.contentListItem}
                                                >
                                                    <p className={styles.contentItemTop}>
                                                        <a>管理员</a>
                                                        <span>{moment(item.reply_time2, "X").format("YYYY-MM-DD HH:mm")}</span>
                                                    </p>
                                                    <p
                                                        className={styles.contentItemBot}
                                                    >
                                                        {item.reply_content2}
                                                    </p>
                                                </View>
                                            </View> : null
                                    }
                                </Col>
                                <Col span={7} className={styles.replyCol}>
                                    {
                                        !item.reply_time || (item.additional_time > 0 && !item.reply_time2) ?
                                            <Fragment>
                                                <TextArea
                                                    value={reply_content[item.id] ? reply_content[item.id] : null}
                                                    placeholder="感谢您对本店的支持！我们会更加的努力为您提供更优质的服务。（可在此输入回复内容，也可直接点击回复选择系统自动回复）"
                                                    autosize={{ minRows: 8, maxRows: 12 }}
                                                    onChange={(e) => {
                                                        reply_content[item.id] = e.target.value;
                                                        this.setState({
                                                            reply_content
                                                        });
                                                    }}
                                                />
                                                <Button
                                                    type='primary'
                                                    onClick={async () => {
                                                        const response = await GoodsApi.evaluate.reply({
                                                            id: item.id,
                                                            reply_content: reply_content[item.id]
                                                        });
                                                        if (response.code === 0) {
                                                            reply_content[item.id] = "";
                                                            this.setState({
                                                                reply_content
                                                            });
                                                            this.initList();
                                                        }
                                                    }}
                                                >
                                                    回复
                                                </Button>
                                            </Fragment>
                                            : null
                                    }
                                </Col>
                                <Col
                                    span={23}
                                    style={{
                                        marginLeft: "4.16666667%",
                                        marginBottom: "24px",
                                        paddingBottom: "10px",
                                        borderBottom: "1px solid #e9e9e9"
                                    }}
                                />
                            </Row>
                        )
                    }
                    <View className={styles.pageView}>
                        <Pagination
                            current={this.get.page}
                            pageSize={this.get.rows}
                            total={evaluateList.total_number}
                            onChange={({ current, pageSize }) => {
                                router.push(Query.page(current, pageSize));
                                this.initList();
                            }}
                        />
                    </View>
                </View>
            </Spin>
        );
    }
}
