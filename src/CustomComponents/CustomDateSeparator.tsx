import { DateSeparatorProps } from "stream-chat-react";
import { Timestamp } from "../../../stream-chat-react/dist/components/Message/Timestamp";

import "./CustomDateSeparator.css";

export const CustomDateSeparator = (props: DateSeparatorProps) => {
	return (
		<div className="custom__date-separator">
			<Timestamp
				customClass="custom__date-separator__date"
				timestamp={props.date}
				format="MMM DD"
			/>
		</div>
	);
};
