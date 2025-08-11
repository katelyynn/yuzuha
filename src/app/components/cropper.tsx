"use client";

import Cropper from 'cropperjs';
import React, { useEffect, useRef, useState } from 'react';
import 'cropperjs/dist/cropper.css';
import styles from "./cropper.module.css";
import { useDropzone } from 'react-dropzone';

export default function AvatarCropper() {
    const [src, setSrc] = useState<string | null>(null);
    const [cropData, setCropData] = useState<string | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const cropperRef = useRef<Cropper | null>(null);

    useEffect(() => {
        if (imageRef.current && src) {
            cropperRef.current?.destroy();
            cropperRef.current = new Cropper(imageRef.current, {
                viewMode: 3,
                dragMode: 'crop',
                movable: true,
                zoomable: true,
                scalable: false,
                cropBoxMovable: true,
                cropBoxResizable: true,
                background: false,
                guides: true,
                autoCropArea: 1
            });
        }
    }, [src]);

    const handleFile = (file: File) => {
        if (!file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = () => setSrc(reader.result as string);
        reader.readAsDataURL(file);
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {'image/*': []},
        maxFiles: 1,
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) handleFile(acceptedFiles[0]);
        }
    });

    const cropImage = () => {
        if (!cropperRef.current) return;

        const canvas = cropperRef.current.getCroppedCanvas();
        setCropData(canvas.toDataURL('image/png'));
    }

    return (
        <div className={styles.cropper}>
            {!src && (
                <div className={`${styles.upload} ${isDragActive ? styles.dragging : ''}`} {...getRootProps()}>
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p>drop here</p>
                    ) : (
                        <p>click or drop an image</p>
                    )}
                </div>
            )}

            {src && (
                <div className={styles.container}>
                    <img ref={imageRef} src={src} alt="crop" />
                </div>
            )}

            {src && (
                <button onClick={cropImage}>crop</button>
            )}

            {cropData && (
                <div className={styles.preview}>
                    <img src={cropData} alt="crop" />
                </div>
            )}
        </div>
    )
}