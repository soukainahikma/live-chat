import { useEffect, useState } from "react";
import './App.css'

function Chat(props) {
	const [currentMessage, setCurrentMessage] = useState("")
	const [messageList, setMessageList] = useState([])
	const sendMessage = async () => {
		if (currentMessage !== "") {
			const messageData = {
				room: props.room,
				author: props.username,
				message: currentMessage,
				time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
			};
			await props.socket.emit("send_message", messageData);
			setMessageList((list) => [...list, messageData])
			setCurrentMessage("");
		}

	}
	useEffect(() => {
		props.socket.on("receive_message", (data) => {
			setMessageList((list) => [...list, data])
		})
	}, [props.socket])
	return <div className="chat-window">
		<div className='chat-header'>
			<p>Live Chat</p>
		</div>
		<div className='chat-body'>
				{messageList.map((data, index) => {
					return <div key={index} className="message" id={data.author !== props.username ? "you" : "other"}>
						<div>
							<div className="message-content">
								<p>{data.message}</p>
							</div>
							<div className="message-meta">
								<p id="time">{data.time}</p>
								<p id="author">{data.author}</p>
							</div>
						</div>
					</div>
				})}
		</div>
		<div className='chat-footer'>
			<input type="text" value={currentMessage} placeholder="Hey..." onChange={(event) => {
				setCurrentMessage(event.target.value);
			}} onKeyPress={(event) => {
				if (event.key === "Enter")
					sendMessage();
			}} />
			<button onClick={sendMessage} >&#9658;</button>
		</div>
	</div>
}
export default Chat;