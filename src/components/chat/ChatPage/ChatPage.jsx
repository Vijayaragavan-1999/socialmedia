import { useDispatch, useSelector } from "react-redux";
import styles from "./ChatPage.module.css";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Box, IconButton, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import { CancelScheduleSend } from "@mui/icons-material";
import {
  setSingleChatModeOff,
  setLiveUsers,
  resetLiveChatUsers,
} from "../../../redux/slices/chat";
import { useGetChatById, useUpdateChatStatus } from "../../../hooks/chat";
import Loader from "../../Loader/Loader";

const ChatPage = ({ data, socket, resetNotification }) => {
  const dispatch = useDispatch();
  const { chatliveUsers } = useSelector((state) => state.chat)
  const { mutate } = useUpdateChatStatus();
  const messagesDivRef = useRef(null);
  const { singleConnectionId } = useSelector((state) => state.chat);
  const [chatMessage, setChatMessage] = useState([]);
  const [sendMessage, setSendMessage] = useState("");
  const { userId } = useSelector((state) => state.profile.profileData);
  let filteredData = data?.filter((e) => e._id === singleConnectionId);
  const [messageEmitted, setMessageEmitted] = useState(false);
  const { data: chatData, isLoading: chatLoading, refetch } = useGetChatById(
    filteredData[0]._id
  );

  useEffect(() => {
    if (messagesDivRef.current) {
      messagesDivRef.current.scrollTop = messagesDivRef.current.scrollHeight;
    }
  }, [messagesDivRef.current, chatMessage]);

  useEffect(() => {
    if (chatData) {
      setChatMessage(chatData);
    }
    let payload = {};
    payload.userId = userId;
    payload.connectionId = filteredData[0]._id;
    mutate(payload);
  }, [chatData, socket]);

  // useEffect(() => {
  //   socket?.on("connect", () => {
  //     console.warn("connected");
  //   });

  //   emitMessageOnce();
  // }, [socket]);
  console.log("running")
  useEffect(() => {
    refetch()
    if (!messageEmitted) {
      socket?.on("getMessage", (data) => {
        console.log(data)
        const newChat = {
          message: data.message,
          createdAt: data.createdAt,
          senderId: data.senderId,
        };

        setChatMessage((prev) => [...prev, newChat]);
      });
      setMessageEmitted(true);
    }
    return () => {
      socket?.off("getMessage");
    };
  }, []);


  const sendChatMessage = (e) => {
    e.preventDefault();
    const newChat = {
      message: sendMessage,
      senderId: userId,
      senderName: filteredData[0].senderName,
      receiverId:
        filteredData[0].recipientId === userId
          ? filteredData[0].senderId
          : filteredData[0].recipientId,
      connectionId: filteredData[0]._id,
    };

    socket?.emit("sendNotification", {
      senderId: userId,
      receiverId:
        filteredData[0].recipientId === userId
          ? filteredData[0].senderId
          : filteredData[0].recipientId,
    });

    setChatMessage((prev) => [...prev, newChat]);
    socket.emit("sendMessage", {
      senderId: userId,
      receiverId:
        filteredData[0].recipientId === userId
          ? filteredData[0].senderId
          : filteredData[0].recipientId,
      connectionId: filteredData[0]._id,
      senderName: filteredData[0].senderName,
      message: sendMessage.trim(),
      createdAt: moment().toISOString(),
    });
    setSendMessage("");
    setMessageEmitted(false);
  };

  function isUserIdPresent(array, object) {
    let userPresent;
    if (userId != object.senderId) {
      userPresent = array.some((item) => item.userId === object.senderId);
    } else {
      userPresent = array.some((item) => item.userId === object.recipientId);
    }

    return userPresent;
  }

  const formatDate = (date) => {
    if (moment(date).isSame(moment(), "day")) {
      return moment(date).fromNow().replace("seconds", "sec").replace("minutes","min").replace("hours","hr");
    } else {
      return moment(date).format(" h:mm A");
    }
  };

  // const getMessageDate = (createdAt) => {
  //   const today = moment().startOf("day");
  //   const yesterday = moment().subtract(1, "day").startOf("day");
  //   const messageDate = moment(createdAt).startOf("day");

  //   if (messageDate.isSame(today, "day")) {
  //     return "Today";
  //   } else if (messageDate.isSame(yesterday, "day")) {
  //     return "Yesterday";
  //   } else {
  //     return moment(createdAt).format("MMM DD, YYYY");
  //   }
  // };


  if (chatLoading) {
    return <Loader />;
  }

  return (
    <Box className={styles.chatPage} sx={{ height: "65vh" }}>
      <KeyboardBackspaceIcon
        sx={{ cursor: "pointer" }}
        onClick={() =>{ dispatch(setSingleChatModeOff()); resetNotification()}}
      />
      <Box className={styles.chatHeader}>
        <p className={styles.contactName}>
          {filteredData[0].senderId === userId
            ? filteredData[0].recipientName
            : filteredData[0].senderName}
        </p>
        <p className={styles.activeLogo}>
          {chatliveUsers && isUserIdPresent(chatliveUsers, filteredData[0])
            ? "Online"
            : "Offline"}
        </p>
      </Box>
      <Box className={styles.chatMessages} ref={messagesDivRef}>
        {chatMessage?.map((message) => (
          <Box key={message.id} className={styles.messageContainer}>
            {chatMessage && (
              <Box>
                {message.senderId !== userId && (
                  <Box>
                    <Typography className={styles.sender}>
                      {message.message}
                    </Typography>
                    <p className={styles.senderTime}>
                      {formatDate(message?.createdAt)}
                    </p>
                  </Box>
                )}
                {message.senderId === userId && (
                  <Box>
                    {console.log(message.message)}
                    <Typography className={styles.receiver}>
                      {message.message}
                    </Typography>

                    <p className={`${styles.receiverTime}`}>
                      {formatDate(message?.createdAt)}
                    </p>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        ))}
      </Box>
      <Box className={styles.chatInput}>
        <form onSubmit={sendChatMessage} className={styles.sendform}>
          <input
            type="text"
            placeholder="Type a message..."
            className={styles.messageInput}
            value={sendMessage}
            onChange={(e) => setSendMessage(e.target.value)}
          />
          <Box>
            {sendMessage.length > 0 ? (
              <IconButton
                onClick={sendChatMessage}
                className={styles.sendButton}
              >
                <SendIcon />
              </IconButton>
            ) : (
              <CancelScheduleSend className={styles.sendButton} />
            )}
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default ChatPage;
