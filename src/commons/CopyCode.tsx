import { CheckOutlined, CopyOutlined } from "@ant-design/icons";
import { Button, Input, Space } from "antd";
import { isEmpty } from "lodash";
import type { ReactElement } from "react";
import { useCopyToClipboard } from "usehooks-ts";

const CopyCode = (props: { children?: ReactElement | ReactElement[]; value: string; mode?: "block" | "inline"; type?: "text" | "password" }) => {
	const { children, value, type = "text" } = props;
	const [copiedValue, copy] = useCopyToClipboard();

	return (
		<Space.Compact style={{ width: 350 }}>
			<Input
				type={type}
				className="flex-none"
				disabled
				value={value}
				style={{ fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace" }}
				suffix={
					<Button
						type="ghost"
						danger={!isEmpty(copiedValue)}
						size="large"
						onClick={() => copy(value)}
						icon={copiedValue ? <CheckOutlined /> : <CopyOutlined />}
					/>
				}
			/>
		</Space.Compact>
	);
};

export default CopyCode;
