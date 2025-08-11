"use client";

import * as Select from '@radix-ui/react-select';
import Cropper from 'cropperjs';
import React, { useEffect, useRef, useState } from 'react';
import 'cropperjs/dist/cropper.css';
import styles from "./cropper.module.css";
import { useDropzone } from 'react-dropzone';
import { Check, ChevronDown, ChevronLeft, Crop, Download } from 'tabler-icons-react';

export default function AvatarCropper() {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [src, setSrc] = useState<string | null>(null);
    const [cropData, setCropData] = useState<string | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const cropperRef = useRef<Cropper | null>(null);
    const [downloadType, setDownloadType] = useState<"image/png" | "image/jpeg" | "image/webp">("image/png");
    const [originalFileName, setOriginalFileName] = useState<string | null>(null);

    useEffect(() => {
        if (step == 2 && imageRef.current && src) {
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
    }, [step, src]);

    const handleFile = (file: File) => {
        if (!file.type.startsWith('image/')) return;

        setOriginalFileName(file.name);

        const reader = new FileReader();
        reader.onload = () => {
            setSrc(reader.result as string);
            setStep(2);
        }
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
        setStep(3);
    }

    const goBack = () => {
        if (step == 2) {
            setStep(1);
            setSrc(null);
            setCropData(null);

            cropperRef.current?.destroy();
            cropperRef.current = null;
        }
        if (step == 3) {
            setStep(2);
            setCropData(null);
            cropperRef.current?.destroy();
            cropperRef.current = null;
        }
    }

    const handleDownload = () => {
        if (!cropperRef.current) return;

        const canvas = cropperRef.current.getCroppedCanvas();
        const mimeType = downloadType;
        const extension = mimeType.split("/")[1];

        let baseName = "avatar";
        if (originalFileName) baseName = originalFileName.replace(/\.[^/.]+$/, '');

        const dataUrl = canvas.toDataURL(mimeType);

        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `${baseName}_crop.${extension}`;
        document.body.appendChild(link);

        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className={styles.cropper}>
            {step == 1 && (
                <div className={`${styles.upload} ${isDragActive ? styles.dragging : ''}`} {...getRootProps()}>
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p>drop file</p>
                    ) : (
                        <p>upload or drop file</p>
                    )}
                </div>
            )}

            {step == 2 && src && (
                <>
                    <div className={styles.container}>
                        <img ref={imageRef} src={src} alt="crop" />
                    </div>
                    <div className={styles.actions}>
                        <button className="normal" onClick={goBack}>
                            <ChevronLeft />
                            back
                        </button>
                        <button onClick={cropImage}>
                            <Crop />
                            crop
                        </button>
                    </div>
                </>
            )}

            {step == 3 && cropData && (
                <>
                    <div className={styles.preview}>
                        <img src={cropData} alt="crop" />
                    </div>
                    <div className={styles.actions}>
                        <button className="normal" onClick={goBack}>
                            <ChevronLeft />
                            back
                        </button>
                        <div className={styles.button_wrap}>
                            <button onClick={handleDownload}>
                                <Download />
                                download as
                            </button>
                            <Select.Root value={downloadType} onValueChange={value => setDownloadType(value as any)}>
                                <>
                                    <Select.Trigger className={styles.select}>
                                        <Select.Value />
                                        <Select.Icon><ChevronDown /></Select.Icon>
                                    </Select.Trigger>

                                    <Select.Portal>
                                        <Select.Content className={styles.select_menu}>
                                            <Select.Viewport>
                                                <Select.Item value="image/png" className={styles.select_item}>
                                                    <Select.ItemText>.png</Select.ItemText>
                                                    <Select.ItemIndicator><Check /></Select.ItemIndicator>
                                                </Select.Item>
                                                <Select.Item value="image/jpeg" className={styles.select_item}>
                                                    <Select.ItemText>.jpeg</Select.ItemText>
                                                    <Select.ItemIndicator><Check /></Select.ItemIndicator>
                                                </Select.Item>
                                                <Select.Item value="image/webp" className={styles.select_item}>
                                                    <Select.ItemText>.webp</Select.ItemText>
                                                    <Select.ItemIndicator><Check /></Select.ItemIndicator>
                                                </Select.Item>
                                            </Select.Viewport>
                                        </Select.Content>
                                    </Select.Portal>
                                </>
                            </Select.Root>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}