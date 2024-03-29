import { useDispatch, useSelector } from "react-redux";
import WidgetWrapper from "../../../../components/WidgetWrapper";
import ChatPage from "../../../../components/chat/ChatPage/ChatPage";
import ChatPerson from "../../../../components/chat/ChatPersonList/ChatPerson";
import { Box, IconButton, InputBase, Typography } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { useTheme } from "@emotion/react";
import { usegetAllChatInfo } from "../../../../hooks/chat";
import { setSideView } from "../../../../redux/slices/profileSlice";
import { useEffect, useState } from "react";
import { useGetProfile } from "../../../../hooks/profile";
import LookingEmpty from "../../../../components/LookingEmpty/LookingEmpty";
import { setLiveUsers, setSingleChatModeOff } from "../../../../redux/slices/chat";
import { useSocket } from "../../../../hooks/socket";
import { useQueryClient } from "@tanstack/react-query";
import ChatSkeleton from "../../../../components/Skeleton/ChatSkeleton/ChatSkeleton";

const ChatLayout = () => {
  const { palette } = useTheme();
  const queryclient = useQueryClient();
  const dark = palette.neutral.dark;
  const [liveUser, setLiveUser] = useState(null);
  const socket = useSocket();
  const [notification, setNotification] = useState([])
  const [text, setText] = useState("");
  const { userId } = useSelector((state) => state.profile.profileData);
  const { isSingleChatOn } = useSelector((state) => state.chat);
  const { data: allChatInfo, isLoading, refetch } = usegetAllChatInfo(userId);
  const { data } = useGetProfile(userId);
  const dispatch = useDispatch();

  const resetNotification = () => {
    setNotification([])
  }
 
  useEffect(() => {
    refetch()
    socket?.on("connect", () => {
      console.warn("connected");
    });

    socket?.emit("users", userId);
    socket?.on("getUsers", (users) => {
      setLiveUser(users);
      dispatch(setLiveUsers(users))
    });
  }, [socket]);

  useEffect(() => {
    if (allChatInfo != null) {
      socket?.on("getNotification", () => {
        queryclient.invalidateQueries(["chat"]);

      });
    }
  }, [allChatInfo, notification]);
  

  if (isLoading) {
    return <ChatSkeleton />;
  }

  function updateNamesToEmptyString(messages) {
    for (const message of messages) {
      if (message.senderName === data.userData.fullName) {
        message.senderName = "";
      }
      if (message.recipientName === data.userData.fullName) {
        message.recipientName = "";
      }
    }
    return messages;
  }

  return (
    <WidgetWrapper >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignContent: "center"
        }}
      >
        <Typography color={dark} sx={{ fontSize: "22px", fontWeight: "bold" }}>
          Messenger
        </Typography>
        <IconButton
          onClick={() => {
            socket.disconnect();
            dispatch(setSideView("companyPage"));
            dispatch(setSingleChatModeOff());
          }}
        >
          <ClearIcon
            sx={{ fontSize: "24px", cursor: "pointer" }}
          />
        </IconButton>
      </Box>

      {!isSingleChatOn && allChatInfo?.length > 0 && (
        <InputBase
          placeholder="Search Contact..."
          style={{
            width: "100%",
            position: "static",
            borderBottom: "1px solid black",
            paddingLeft: "2px",
            marginTop: "2px",
            marginBottom: "2px"
          }}
          onChange={(e) => setText(e.target.value)}
        />
      )}
      <Box
        sx={{
          marginRight: "5px",
          height: '68vh',
          overflow: 'scroll',
          paddingBottom: '10px'
        }}
      >
        {allChatInfo?.length > 0 && data ? (
          updateNamesToEmptyString(allChatInfo)
            .filter((e) => e.senderId === userId || e.recipientId === userId)
            .filter(
              (e) =>
                e.recipientName
                  .toLowerCase()
                  .includes(text.toLowerCase().trim()) ||
                e.senderName.toLowerCase().includes(text.toLowerCase().trim())
            )
            .map((e, i) => (
              <Box
                key={i}
                sx={{
                  margin: "1px",
                }}
              >
                {!isSingleChatOn && <ChatPerson id={i} data={e} socket={socket} notification={notification} />}
              </Box>
            ))
        ) : (
          <LookingEmpty />
        )}

        {isSingleChatOn && <ChatPage data={allChatInfo} socket={socket} resetNotification={resetNotification} />}
      </Box>
    </WidgetWrapper>
  );
};

export default ChatLayout;
