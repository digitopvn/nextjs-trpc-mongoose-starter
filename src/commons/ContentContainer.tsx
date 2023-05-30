import type { ReactNode } from "react";
import React from "react";

const ContentContainer = (props?: { children?: ReactNode }) => {
	return <div className="content-container p-5">{props?.children}</div>;
};

export default ContentContainer;
