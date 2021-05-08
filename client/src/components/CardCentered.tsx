import { Card } from 'antd';
import { css, SerializedStyles } from '@emotion/core';

const style = (): SerializedStyles => css`
    margin-bottom: 0;
    width: 350px;
    height: 450px;
    max-width: 100%;
    max-height: 100%;
    box-shadow: 0px 9px 28px 0px rgba(0,0,0,0.05);
    -webkit-box-shadow: 0px 9px 28px 0px rgba(0,0,0,0.05);
    -moz-box-shadow: 0px 9px 28px 0px rgba(0,0,0,0.05);

    .ant-card-body {
        width: 100%;
        height: 100%;
        padding: 36px;
        position: relative;
        display: flex;
        flex-direction: column;
    }

    h1,
    h2 {
        text-align: center;
    }

    .footer {
        margin-top: auto;
        text-align: center;

        .ant-btn-link {
            line-height: 1;
            height: auto;
            margin-bottom: 5px;

            &:last-of-type {
                margin-bottom: 0;
            }
        }
    }
`;

interface Props {
    children: any;
    header?: string;
    subheader?: string;
    footer?: JSX.Element;
}

const CardCentered = ({ children, header, subheader, footer }: Props): JSX.Element => {
    return (
        <Card css={style}>
            { !!header && <h1>{ header }</h1>}
            { !!subheader && <h2>{ subheader }</h2>}
            { children }
            { !!footer && <div className="footer">{ footer }</div> }
        </Card>
    )
};

export default CardCentered;