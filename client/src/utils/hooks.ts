import { useEffect, useState } from 'react';

export const useWindowWidth = () => {
    const [width, setWidth] = useState<number | undefined>(undefined);

    useEffect(() => {
        const handleWindowResize = () => {
            setWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleWindowResize);
        handleWindowResize();

        return () => window.removeEventListener("resize", handleWindowResize);
    }, []);

    return width;
}
