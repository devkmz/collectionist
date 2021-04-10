import { Skeleton } from 'antd';
import { css, SerializedStyles } from '@emotion/core';
import React, { useEffect, useState } from 'react';

const styles = (): SerializedStyles => css`
    position: relative;
    padding-top: 61%;
    background-size: cover;
    background-repeat: no-repeat;
    background-color:#f7f7f7;

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
`;

interface Props {
    imageURL?: string;
}

const CardImage = ({ imageURL }: Props): JSX.Element => {
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
        checkIfImageExists(imageURL);
    }, [imageURL]);
    
    return hasImage ? (
        <div css={styles} style={{ backgroundImage: `url(${imageURL})` }} />
    ) : (
        <div css={styles}>
            <div className="no-image">
                <Skeleton.Image />
            </div>
        </div>
    );
};

export default CardImage;