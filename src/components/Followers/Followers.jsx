import { Box, Button, Typography, useTheme } from "@mui/material";
import WidgetWrapper from "../WidgetWrapper";
import Avatar from "@mui/material/Avatar";
import styles from "./index.module.css";
import rohitimg from "../../assets/images/sanjai.png";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import NewReleasesRoundedIcon from "@mui/icons-material/NewReleasesRounded";
import { useDispatch } from "react-redux";
import {
  setDashboardView,
  setViewProfileId,
} from "../../redux/slices/profileSlice";
import { useChangeConnectionStatus } from "../../hooks/profile";
import Loader from "../Loader/Loader";

const Followers = (data) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const medium = palette.neutral.medium;
  const { mutate, isLoading } = useChangeConnectionStatus();

  const postData = {
    id: data?.data?._id,
    status: 3,
  };

  console.log(data?.data, "data");

  function handleUnfollow() {
    mutate(postData);
  }

  function handleClick() {
    if (data?.id) {
      dispatch(setViewProfileId(data?.id));
    }
    dispatch(setViewProfileId(data?.data?.followerId)),
      dispatch(setDashboardView("profile"));
  }

  if (isLoading) {
    <Loader />;
  }

  return (
    <WidgetWrapper className={styles.followmain}>
      <Typography color={medium} m="0.5rem 0">
        <Box className={styles.followersdiv}>
          <Box className={styles.avatardiv} onClick={() => handleClick()}>
            <Avatar
              alt="B"
              src={data?.fullName ? rohitimg : data?.data?.profile}
              sx={{ width: 40, height: 40 }}
            />
            <Typography className={styles.avatarname}>
              {data?.fullName ? data?.fullName : data?.data?.followerName}
            </Typography>
          </Box>
          <Box className={styles.unfollowdiv}>
            {data?.type === "following" && data?.unFollow && (
              <Button
                className={styles.unfollowbtn}
                onClick={() => handleUnfollow()}
                variant="dark"
              >
                Unfollow
              </Button>
            )}
            {data?.type === "following" && !data?.unFollow && (
              <VerifiedRoundedIcon />
            )}
            {data?.type === "connection" && <VerifiedRoundedIcon />}
            {data?.type === "followers" && <NewReleasesRoundedIcon />}
          </Box>
        </Box>
      </Typography>
    </WidgetWrapper>
  );
};

export default Followers;
