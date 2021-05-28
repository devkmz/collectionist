import { Image as ImageAnt, Skeleton } from 'antd';
import { ZoomInOutlined } from '@ant-design/icons';
import { css, SerializedStyles } from '@emotion/core';
import React, { useEffect, useState } from 'react';

const styles = (): SerializedStyles => css`
    .ant-image,
    .custom-image {
        position: relative;
        background-size: cover;
        background-repeat: no-repeat;
        background-color:#f7f7f7;
    }

    .ant-image {
        overflow: hidden;

        &::after {
            display: block;
            content: "";
            padding-top: 61%;

            @media (max-width: 449px) {
                padding-top: 45%;
            }
        }

        img {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
        }
    }

    .custom-image {
        padding-top: 61%;

        @media (max-width: 449px) {
            padding-top: 45%;
        }

        > .no-image {
            position: absolute;
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .ant-skeleton-element {
            .ant-skeleton-image {
                background-color: transparent;
            }
        }
    }

    .zoom-icon {
        font-size: 40px;
    }
`;

interface Props {
    imageUrl?: string;
    hasPreview?: boolean;
}

const CardImage = ({ imageUrl, hasPreview = false }: Props): JSX.Element => {
    const [hasImage, setHasImage] = useState(false);

    const checkIfImageExists = (url: string | undefined) => {
        const img = new Image();
        
        if (!url) {
            setHasImage(false);
            return;
        }
    
        img.src = url;
        
        if (img.complete) {
            setHasImage(true);
            return;
        } else {
            img.onload = () => {
                setHasImage(true);
                return;
            }
    
            img.onerror = () => {
                setHasImage(false);
                return;
            }
        }
        setHasImage(false);
        return;
    }
    
    useEffect(() => {
        checkIfImageExists(imageUrl);
    }, [imageUrl]);
    
    return hasImage ? (
        <div css={styles}>
            {
                hasPreview ? (
                    <ImageAnt
                        width="100%"
                        src={imageUrl}
                        preview={{
                            mask: (
                                <div className="zoom-icon">
                                    <ZoomInOutlined />
                                </div>
                            )
                        }}
                    />
                ) : (
                    <div className="custom-image" style={{ backgroundImage: `url(${imageUrl})` }} />
                )
            }
        </div>
    ) : (
        <div css={styles}>
            <div className="custom-image">
                <div className="no-image">
                    <Skeleton.Image />
                </div>
            </div>
        </div>
    );
};

export default CardImage;