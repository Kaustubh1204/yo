"use client";
import { useState, useEffect } from "react";

export function useImagePreloader(path: string, frameCount: number) {
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const loadedImages: HTMLImageElement[] = [];
        let loadedCount = 0;

        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            const frameIndex = i.toString().padStart(3, "0");
            img.src = `${path}/ezgif-frame-${frameIndex}.jpg`;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === frameCount) setLoaded(true);
            };
            loadedImages.push(img);
        }
        setImages(loadedImages);
    }, [path, frameCount]);

    return { images, loaded };
}
