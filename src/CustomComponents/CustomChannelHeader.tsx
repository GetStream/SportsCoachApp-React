import { ChannelHeader, Modal } from "stream-chat-react";
import { InfoIcon } from "./InfoIcon";

import "./CustomChannelHeader.css";
import { useState } from "react";

export const CustomChannelHeader = () => {
	const [modalOpen, setModalOpen] = useState(false);

	return (
		<div className="custom__channel-header">
			<ChannelHeader />
			<button
				onClick={() => setModalOpen(true)}
				className="custom__channel-header__info-button"
			>
				<InfoIcon />
			</button>

			<Modal open={modalOpen} onClose={() => setModalOpen(false)}>
				text
			</Modal>
		</div>
	);
};
