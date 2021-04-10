import { Breadcrumb, Button, Card, Col, Row } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../../types/user';

interface Props {
    user?: User;
}

const CollectionSingle = ({ user }: Props): JSX.Element => {
    return (
        <Row gutter={[24, 24]}>
            <Col span={5}>
                <Card title="Filtrowanie i eksport">
                    <p>Lorem ipsum</p>
                </Card>
            </Col>
            <Col span={19}>
                <div className="top-row">
                    <Breadcrumb>
                        <Breadcrumb.Item key="collections"><Link to="/collections">Kolekcje</Link></Breadcrumb.Item>
                        <Breadcrumb.Item key="collection">Tytuł kolekcji</Breadcrumb.Item>
                    </Breadcrumb>
                    {
                        user?.role === 'ADMIN' && <Button type="primary">Dodaj</Button>
                    }
                </div>
                <Row gutter={[24, 24]}>

                </Row>
            </Col>
        </Row>
    );
};

export default CollectionSingle;