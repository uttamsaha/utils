"use client";

import React from "react";
import { Modal } from "antd";
import { twMerge } from "tailwind-merge";
import { ModalCloseIcon } from "@/assets/icons";

const DefaultModal = ({
    open,
    setOpen,
    header = true,
    className,
    modalContent,
    titleClass,
    title = "Title",
    headerClass,
    width = 640,
}) => {
    return (
        <Modal
            title={false}
            open={open}
            footer={false}
            closeIcon={false}
            className="custom-modal" // Add custom class
            onCancel={() => setOpen(false)}
            width={width}
            maskStyle={{
                backgroundColor: "#16161666", // Set outside modal color
            }}
        >
            <div
                className={twMerge(
                    "relative !z-[99999] overflow-hidden", className)}>
                {header && (
                    <div
                        className={twMerge(
                            "text-sm pl-6 pr-[17px] leading-[18px] font-medium text-gray-950 flex items-center justify-between py-[14px] border-b border-gray-200", headerClass)}
                    >
                        <h1
                            className={twMerge(
                                "!text-base-text leading-[14px] md:!text-lg-text font-medium md:leading-[20px] text-[var(--text-dark-color)]", titleClass)}
                        >
                            {title}
                        </h1>
                        <button className="w-5 h-5 flex items-center justify-center" onClick={() => setOpen(false)}>
                            <ModalCloseIcon />
                        </button>
                    </div>
                )}
                <div className="px-2.5 pt-2.5 md:pt-4 pb-3.5 md:pb-6 md:px-6">
                    {modalContent ? (
                        modalContent
                    ) : (
                        <div>Please provide a modal content to show here.</div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default DefaultModal;
