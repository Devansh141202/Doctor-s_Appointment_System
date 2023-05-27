import { Button, Col, Form, Input, Row, TimePicker } from "antd";
import moment from "moment";
import React from "react";

function DoctorFormAdmin({ onFinish, initivalValues }) {
    return (
        <Form
            layout="vertical"
            initialValues={{
                ...initivalValues,
                ...(initivalValues && {
                    timings: [
                        moment(initivalValues?.timings[0], "HH:mm"),
                        moment(initivalValues?.timings[1], "HH:mm"),
                    ],
                }),
            }}
        >
            <h1 className="card-title mt-3">Personal Information</h1>
            <Row gutter={20}>
                <Col span={8} xs={24} sm={24} lg={8}>
                    <Form.Item
                        required
                        label="First Name"
                        name="firstName"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="First Name" readOnly />
                    </Form.Item>
                </Col>
                <Col span={8} xs={24} sm={24} lg={8}>
                    <Form.Item
                        required
                        label="Last Name"
                        name="lastName"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="Last Name" readOnly />
                    </Form.Item>
                </Col>
                <Col span={8} xs={24} sm={24} lg={8}>
                    <Form.Item
                        required
                        label="Phone Number"
                        name="phoneNumber"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="Phone Number" readOnly />
                    </Form.Item>
                </Col>
                <Col span={8} xs={24} sm={24} lg={8}>
                    <Form.Item
                        required
                        label="Website"
                        name="website"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="Website" readOnly />
                    </Form.Item>
                </Col>
                <Col span={8} xs={24} sm={24} lg={8}>
                    <Form.Item
                        required
                        label="Address"
                        name="address"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="Address" readOnly />
                    </Form.Item>
                </Col>
            </Row>
            <hr />
            <h1 className="card-title mt-3">Professional Information</h1>
            <Row gutter={20}>
                <Col span={8} xs={24} sm={24} lg={8}>
                    <Form.Item
                        required
                        label="Specialization"
                        name="specialization"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="Specialization" readOnly />
                    </Form.Item>
                </Col>
                <Col span={8} xs={24} sm={24} lg={8}>
                    <Form.Item
                        required
                        label="Experience"
                        name="experience"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="Experience" type="number" readOnly />
                    </Form.Item>
                </Col>
                <Col span={8} xs={24} sm={24} lg={8}>
                    <Form.Item
                        required
                        label="Fee Per Cunsultation"
                        name="feePerCunsultation"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="Fee Per Cunsultation" type="number" readOnly />
                    </Form.Item>
                </Col>
            </Row>

        </Form>
    );
}

export default DoctorFormAdmin;
