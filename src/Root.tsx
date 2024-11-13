import {
	Chat,
	Channel,
	ChannelList,
	useCreateChatClient,
	MessageInput,
	Window,
	Thread,
	MessageList,
} from "stream-chat-react";

import "stream-chat-react/css/v2/index.css";

import {
	CustomDateSeparator,
	CustomMessageUI,
	UploadIcon,
	CustomChannelHeader,
} from "./CustomComponents";

const parseUserIdFromToken = (token: string) => {
	const [, payload] = token.split(".");

	if (!payload) throw new Error("Token is missing");

	return JSON.parse(atob(payload))?.user_id;
};

const streamAPIKey = import.meta.env.VITE_STREAM_API_KEY;
const streamUserToken = import.meta.env.VITE_STREAM_USER_TOKEN;
const userId = parseUserIdFromToken(streamUserToken);

function Root() {
	const client = useCreateChatClient({
		apiKey: streamAPIKey, // "7s8zcn2pru4z",
		tokenOrProvider: streamUserToken, // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYm9iIn0.E3DAA5QSyioND9ZbOT2vFSOBvXHG4gcaxJ1OEOQujbU",
		userData: { id: userId },
	});

	if (!client) return <div>Loading...</div>;

	return (
		<Chat client={client}>
			<ChannelList
				filters={{ members: { $in: [userId] }, type: "messaging" }}
			/>
			<Channel
				AttachmentSelectorInitiationButtonContents={UploadIcon}
				DateSeparator={CustomDateSeparator}
				Message={CustomMessageUI}
			>
				<Window>
					<CustomChannelHeader />
					<MessageList />
					<MessageInput hideSendButton />
				</Window>
				<Thread />
			</Channel>
		</Chat>
	);
}

export default Root;
