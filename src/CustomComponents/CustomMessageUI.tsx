import {
	MessageInput,
	useMessageContext,
	MessageText,
	ReactionsList,
	Attachment,
	useChatContext,
	useTranslationContext,
	messageHasAttachments,
	messageHasReactions,
	MessageDeleted,
	isMessageBounced,
	isMessageEdited,
	Modal,
	EditMessageForm,
	Poll,
	MessageRepliesCountButton,
	MessageErrorIcon,
	MessageStatus,
	Avatar,
} from "stream-chat-react";

import {
	defaultMessageActionSet,
	MessageActions,
} from "stream-chat-react/experimental";

import clsx from "clsx";

import "./CustomMessageUI.css";
import { Timestamp } from "../../../stream-chat-react/dist/components/Message/Timestamp";

const ReactionSelectorButton = defaultMessageActionSet[1].Component;

const customMessageActionSet = defaultMessageActionSet.filter(
	(v) => v.type !== "react"
);

export const CustomMessageUI = () => {
	const {
		additionalMessageInputProps,
		clearEditingState,
		editing,
		endOfGroup,
		firstOfGroup,
		groupedByUser,
		handleAction,
		handleOpenThread,
		handleRetry,
		highlighted,
		isMyMessage,
		message,
		onUserClick,
		onUserHover,
		renderText,
		threadList,
	} = useMessageContext();
	const { client } = useChatContext();
	const { t } = useTranslationContext("MessageSimple");

	const hasAttachment = messageHasAttachments(message);
	const hasReactions = messageHasReactions(message);

	if (message.deleted_at || message.type === "deleted") {
		return <MessageDeleted message={message} />;
	}

	const showMetadata = !groupedByUser || endOfGroup;
	const showReplyCountButton = !threadList && !!message.reply_count;
	const allowRetry =
		message.status === "failed" && message.errorStatusCode !== 403;
	const isBounced = isMessageBounced(message);
	const isEdited = isMessageEdited(message);

	let handleClick: (() => void) | undefined = undefined;

	if (allowRetry) {
		handleClick = () => handleRetry(message);
	}

	const rootClassName = clsx(
		"str-chat__message str-chat__message-simple",
		`str-chat__message--${message.type}`,
		`str-chat__message--${message.status}`,
		isMyMessage()
			? "str-chat__message--me str-chat__message-simple--me"
			: "str-chat__message--other",
		message.text ? "str-chat__message--has-text" : "has-no-text",
		{
			"str-chat__message--has-attachment": hasAttachment,
			"str-chat__message--highlighted": highlighted,
			"str-chat__message--pinned pinned-message": message.pinned,
			"str-chat__message--with-reactions": hasReactions,
			"str-chat__message-send-can-be-retried":
				message?.status === "failed" && message?.errorStatusCode !== 403,
			"str-chat__message-with-thread-link": showReplyCountButton,
			"str-chat__virtual-message__wrapper--end": endOfGroup,
			"str-chat__virtual-message__wrapper--first": firstOfGroup,
			"str-chat__virtual-message__wrapper--group": groupedByUser,
		}
	);

	const poll = message.poll_id && client.polls.fromState(message.poll_id);

	return (
		<>
			{editing && (
				<Modal
					className="str-chat__edit-message-modal"
					onClose={clearEditingState}
					open={editing}
				>
					<MessageInput
						clearEditingState={clearEditingState}
						grow
						hideSendButton
						Input={EditMessageForm}
						message={message}
						{...additionalMessageInputProps}
					/>
				</Modal>
			)}
			{
				<div className={rootClassName} key={message.id}>
					{message.user && (
						<Avatar
							image={message.user.image}
							name={message.user.name || message.user.id}
							onClick={onUserClick}
							onMouseOver={onUserHover}
							user={message.user}
						/>
					)}
					<div
						className={clsx("str-chat__message-inner", {
							"str-chat__simple-message--error-failed": allowRetry || isBounced,
						})}
						data-testid="message-inner"
						onClick={handleClick}
						onKeyUp={handleClick}
					>
						<MessageActions messageActionSet={customMessageActionSet} />

						{showMetadata && (
							<div className="str-chat__message-metadata">
								<MessageStatus />
								{message.created_at && (
									<Timestamp
										customClass="str-chat__message-simple-timestamp"
										timestamp={message.created_at}
										format="h:mm A"
									/>
								)}
								{isEdited && (
									<span className="str-chat__mesage-simple-edited">
										{t<string>("Edited")}
									</span>
								)}
							</div>
						)}
						<div className="custom__message-author-name">
							{message.user?.name || message.user?.id}
						</div>
						<div className="str-chat__message-bubble">
							{poll && <Poll poll={poll} />}
							{message.attachments?.length && !message.quoted_message ? (
								<Attachment
									actionHandler={handleAction}
									attachments={message.attachments}
								/>
							) : null}
							<MessageText message={message} renderText={renderText} />
							<MessageErrorIcon />

							<div className="str-chat__message-reactions-host">
								{hasReactions && <ReactionsList reverse />}
								<ReactionSelectorButton />
							</div>
						</div>
					</div>
					{showReplyCountButton && (
						<MessageRepliesCountButton
							onClick={handleOpenThread}
							reply_count={message.reply_count}
						/>
					)}
				</div>
			}
		</>
	);
};
