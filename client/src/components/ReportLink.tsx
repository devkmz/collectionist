import { message } from "antd";
import axios from "axios";
import React, { createRef } from "react";
import { useTranslation } from "react-i18next";

interface Props {
    url: string;
    filename: string;
    children?: JSX.Element;
}

const ReportLink = ({ url, filename, children }: Props): JSX.Element => {
    const link = createRef<HTMLAnchorElement>();
    const { t } = useTranslation();

    const handleDownload = async () => {
        try {
            if (link?.current?.href) {
                return;
            }
      
            const result = await axios({
                url,
                method: 'GET',
                responseType: 'blob'
            });
            const href = window.URL.createObjectURL(result.data);

            if (link.current) {
                link.current.download = filename;
                link.current.href = href;
                link.current.click();
            } else {
                throw new Error();
            }
        } catch (error) {
            message.error(t('common.messages.error'));
        }
    };

    return (
        <>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a role="button" ref={link} onClick={handleDownload}>{ children }</a>
        </>
    )
};

export default ReportLink;