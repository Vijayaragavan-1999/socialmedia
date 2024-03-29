import {
  Box,
  Typography,
  Button,
  useTheme,
  CircularProgress,
  IconButton,
} from "@mui/material";
import WidgetWrapper from "../WidgetWrapper";
import Avatar from "@mui/material/Avatar";
import styles from "./index.module.css";
import Followers from "../Followers/Followers";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetFollowList,
  useGetProfile,
  useGetFollowingList,
  useGetConnectionList,
  useGetMainUserFollowingList,
  useGetUserFollowList,
  useGetMainUserConnectionList,
} from "../../hooks/profile";
import Loader from "../Loader/Loader";
import PostWidget from "../../view/User/Private/Posts/PostWidget";
import { useGetMyPostList } from "../../hooks/posts";
import {
  setCompanyId,
  setDashboardView,
  setSideView,
  setViewCompanyId,
  setViewProfileId,
} from "../../redux/slices/profileSlice";
import LookingEmpty from "../LookingEmpty/LookingEmpty";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import BusinessIcon from "@mui/icons-material/Business";
import { useChangeConnectionStatus, useSendFrdRequest } from "../../hooks/user";
import { toast } from "react-toastify";
import ProfileSkeleton from "../Skeleton/ProfileSkeleton/ProfileSkeleton";
import Close from "@mui/icons-material/Close";

const Profile = () => {
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const [viewList, setViewList] = useState("post");
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const userId = useSelector((state) => state.profile.profileData.userId);
  const profileId = useSelector((state) => state.profile.viewProfileId);
  const { data, isLoading } = useGetProfile(profileId);
  const { data: followList, isLoading: followLoading } = useGetFollowList(
    profileId,
    viewList
  );
  const { data: followingList, isLoading: followingLoading } =
    useGetFollowingList(profileId, viewList);
  const { data: connectionList, isLoading: connectionLoading } =
    useGetConnectionList(profileId, viewList);
  const { data: postList, isLoading: postLoading } = useGetMyPostList(
    profileId,
    viewList
  );

  const { data: mainUserFollowList, isLoading: mainUserFollowListLoading } =
    useGetUserFollowList(userId);

  const { data: mainUserfollowingList, isLoading: mainUserfollowingLoading } =
    useGetMainUserFollowingList(userId);

  const { data: mainUserConnectionList, isLoading: mainUserConnectionLoading } =
    useGetMainUserConnectionList(userId);

  const frdRequestSentSuccess = (data) => {
    // toast.success(data);
    setShowSuccessAnimation(true);
    setTimeout(() => {
      setShowSuccessAnimation(false);
    }, 2000);
  };
  const { mutate: frdRequestMutate, isPending } = useSendFrdRequest(
    frdRequestSentSuccess
  );
  const unFollowSuccess = (data) => {
    // toast.success(data);
    setShowSuccessAnimation(true);
    setTimeout(() => {
      setShowSuccessAnimation(false);
    }, 2000);
  };
  const { mutate: unfollowMutate, isPending: isUnfollowPending } =
    useChangeConnectionStatus(unFollowSuccess);
  const companyId = data?.pageData?._id;

  if (
    isLoading ||
    followLoading ||
    followingLoading ||
    connectionLoading ||
    postLoading ||
    mainUserfollowingLoading ||
    mainUserConnectionLoading ||
    mainUserFollowListLoading
  ) {
    return <ProfileSkeleton />;
  }
  function checkIsNumber(number) {
    if (number != null) {
      return number;
    }
    return 0;
  }
  function handleEdit() {
    dispatch(setSideView("editprofile"));
  }
  const checkUserInConnection = (id, array) => {
    return (
      array &&
      array.some((item) => item.recipientId === id || item.senderId === id)
    );
  };

  const unFollowFn = () => {
    const connection = mainUserConnectionList.find(
      (item) => item.recipientId === profileId || item.senderId === profileId
    );
    if (connection === undefined) {
      const connection = mainUserfollowingList.find(
        (item) => item.recipientId === profileId || item.senderId === profileId
      );
      unfollowMutate({ id: connection._id, status: 0 });
    } else {
      unfollowMutate({ id: connection._id, status: 3 });
    }
    return 0;
  };

  const acceptFn = () => {
    const connection = mainUserFollowList.find(
      (item) => item.senderId === profileId
    );
    unfollowMutate({ id: connection._id, status: 1 });
    return 0;
  };

  const getRequestBtn = () => {
    if (
      mainUserConnectionList &&
      mainUserConnectionList.some(
        (item) =>
          item?.recipientId === profileId || item?.senderId === profileId
      )
    ) {
      return (
        <Button
          disabled={isUnfollowPending}
          variant="outlined"
          className={styles.editbtn}
          style={{ cursor: "context-menu" }}
        >
          {isUnfollowPending ? (
            <CircularProgress style={{ color: "white" }} size={20} />
          ) : (
            "Connected"
          )}
        </Button>
      );
    } else if (
      mainUserfollowingList &&
      mainUserfollowingList.some((item) => item?.recipientId === profileId)
    ) {
      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Button
            disabled={isUnfollowPending}
            onClick={unFollowFn}
            variant="dark"
            className={styles.editbtn}
          >
            {isUnfollowPending ? (
              <CircularProgress style={{ color: "white" }} size={20} />
            ) : (
              "Unfollow"
            )}
          </Button>
          {showSuccessAnimation && (
            <div className={styles.successAnimation}>
              <svg
                className={styles.checkmark}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 52 52"
              >
                <circle
                  className={styles.checkmarkCircle}
                  cx="26"
                  cy="26"
                  r="25"
                  fill="none"
                />
                <path
                  className={styles.checkmarkCheck}
                  fill="none"
                  d="M14.1 27.2l7.1 7.2 16.7-16.8"
                />
              </svg>
            </div>
          )}
        </Box>
      );
    } else if (
      mainUserFollowList &&
      mainUserFollowList.some((item) => item?.senderId === profileId)
    ) {
      return (
        <Button
          disabled={isUnfollowPending}
          onClick={acceptFn}
          variant="dark"
          className={styles.editbtn}
        >
          {isUnfollowPending ? (
            <CircularProgress style={{ color: "white" }} size={20} />
          ) : (
            "Accept"
          )}
        </Button>
      );
    } else {
      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Button
            disabled={isPending}
            onClick={() =>
              frdRequestMutate({
                senderId: userId,
                recipientId: profileId,
              })
            }
            variant="dark"
            className={styles.editbtn}
          >
            {isPending ? (
              <CircularProgress style={{ color: "white" }} size={20} />
            ) : (
              "Connect"
            )}
          </Button>
          {showSuccessAnimation && (
            <div className={styles.successAnimation}>
              <svg
                className={styles.checkmark}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 52 52"
              >
                <circle
                  className={styles.checkmarkCircle}
                  cx="26"
                  cy="26"
                  r="25"
                  fill="none"
                />
                <path
                  className={styles.checkmarkCheck}
                  fill="none"
                  d="M14.1 27.2l7.1 7.2 16.7-16.8"
                />
              </svg>
            </div>
          )}
        </Box>
      );
    }
  };


  return data?.userData ? (
    <Box className={styles.maindiv}>
      <Box className={styles.profilemain}>
        <Typography color={medium} className={styles.profiledetailsdiv}>
          {profileId !== userId && (
            <Box className={styles.closediv}>
              <Button
                className={styles.closebtn}
                onClick={() => dispatch(setViewProfileId(userId))}
              >
                <CloseRoundedIcon />
              </Button>
            </Box>
          )}
          <Box className={styles.avatardiv}>
            <Avatar
              alt="B"
              src={data?.userData?.profile}
              sx={{ width: 80, height: 80, border: "1px solid #9e9e9e" }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: "10px",
                width: "100%",
                marginLeft: "20px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  mt: "3px",
                }}
              >
                <Box
                  sx={{ textAlign: "center", cursor: "pointer" }}
                  onClick={() => setViewList("post")}
                >
                  <Typography color={dark} variant="h5" fontWeight="500">
                    {checkIsNumber(data?.detailsCounts?.postCount)}
                  </Typography>
                  <Typography color={dark} variant="h5" fontWeight="400">
                    Posts
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  mt: "3px",
                }}
              >
                <Box
                  sx={{ textAlign: "center", cursor: "pointer" }}
                  onClick={() => setViewList("followers")}
                >
                  <Typography color={dark} variant="h5" fontWeight="500">
                    {checkIsNumber(data?.detailsCounts?.followersCount)}
                  </Typography>
                  <Typography color={dark} variant="h5" fontWeight="400">
                    Followers
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  mt: "3px",
                }}
              >
                <Box
                  sx={{ textAlign: "center", cursor: "pointer" }}
                  onClick={() => setViewList("following")}
                >
                  <Typography color={dark} variant="h5" fontWeight="500">
                    {checkIsNumber(data?.detailsCounts?.followingCount)}
                  </Typography>
                  <Typography color={dark} variant="h5" fontWeight="400">
                    Following
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  mt: "3px",
                }}
              >
                <Box
                  sx={{ textAlign: "center", cursor: "pointer" }}
                  onClick={() => setViewList("connection")}
                >
                  <Typography color={dark} variant="h5" fontWeight="500">
                    {checkIsNumber(data?.detailsCounts?.connectionCount)}
                  </Typography>
                  <Typography color={dark} variant="h5" fontWeight="400">
                    Connections
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box className={styles.nameandeditdiv}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography color={dark} className={styles.avatarname}>
                {data?.userData?.fullName}
              </Typography>
              <Typography color={dark}>({data?.userData?.userName})</Typography>
            </Box>
            <Box className={styles.btndiv}>
              {profileId === userId && (
                <Button onClick={() => handleEdit()} className={styles.editbtn}>
                  Edit Profile
                </Button>
              )}
              {profileId !== userId && getRequestBtn()}
              {/* {profileId !== userId &&
                (mainUserfollowingList &&
                mainUserfollowingList.some(
                  (item) => item?.recipientId === profileId
                ) ? (
                  <Button
                    disabled={isUnfollowPending}
                    onClick={unFollowFn}
                    variant="dark"
                    className={styles.editbtn}
                  >
                    {isUnfollowPending ? <CircularProgress /> : "Unfollow"}
                  </Button>
                ) : (
                  <Button
                    disabled={isPending}
                    onClick={() =>
                      frdRequestMutate({
                        senderId: userId,
                        recipientId: profileId,
                      })
                    }
                    variant="dark"
                    className={styles.editbtn}
                  >
                    {isPending ? <CircularProgress /> : "Connect"}
                  </Button>
                ))} */}
              {/* {profileId === userId && data?.pageData === null && (
                <Box className={styles.closediv}>
                  <Button
                    variant="dark"
                    onClick={() => handleEdit()}
                    className={styles.editbtn}
                  >
                    Edit Profile
                  </Button>
                )} */}
              {profileId === userId && data?.pageData === null && (
                <Box className={styles.closediv}>
                  <Button
                    className={styles.createbtn}
                    onClick={() => dispatch(setSideView("createcompany"))}
                  >
                    Create Company Page
                    <BusinessIcon />
                  </Button>
                </Box>
              )}
              {profileId === userId && data?.pageData?.status === 2 && (
                <Box className={styles.closediv}>
                  <Button
                    className={styles.createbtn}
                    onClick={() => dispatch(setSideView("pagesotp"))}
                  >
                    OTP Pending
                  </Button>
                </Box>
              )}
              {profileId === userId && data?.pageData?.status === 3 && (
                <Box className={styles.pendingdivs}>
                  <p className={styles.pendingdiv}>Pending</p>
                </Box>
              )}
              {profileId === userId && data?.pageData?.status === 4 && (
                <Box className={styles.rejecteddivs}>
                  <p className={styles.rejecteddiv}>Rejected</p>
                </Box>
              )}
              {profileId === userId && data?.pageData?.status === 1 && (
                <Box className={styles.closediv}>
                  <Button
                    className={styles.createbtn}
                    onClick={() => {
                      dispatch(setDashboardView("postprofile"));
                      dispatch(setSideView("companyPage"));
                      dispatch(setCompanyId(companyId));
                      dispatch(setViewCompanyId(companyId));
                    }}
                  >
                    Company Account
                  </Button>
                </Box>
              )}
              {profileId === userId && data?.pageData?.status === 5 && (
                <Box className={styles.closediv}>
                  <Button
                    className={styles.createbtn}
                    onClick={() => {
                      dispatch(setDashboardView("postprofile"));
                      dispatch(setSideView("companyPage"));
                      dispatch(setCompanyId(companyId));
                      dispatch(setViewCompanyId(companyId));
                    }}
                  >
                    Company Account
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
          <Typography variant="h6" fontWeight="400" className={styles.abouttxt}>
            {data?.userData?.about}
          </Typography>
        </Typography>
        <Box className={styles.profilecontant}>
          {viewList === "post" && (
            <Box className={styles.contantdiv}>
              <Box>
                <Typography className={styles.profiletitle}>Posts</Typography>
              </Box>
              <Box className={styles.postdiv}>
                {postList?.map((data) => (
                  <PostWidget key={data._id} postData={data} page={"profile"} />
                ))}
                {postList?.length === 0 && <LookingEmpty />}
              </Box>
            </Box>
          )}
          {viewList === "followers" && (
            <Box>
              <Box>
                <Typography className={styles.profiletitle}>
                  Followers
                </Typography>
              </Box>
              <Box className={styles.postdiv}>
                {followList?.map((e, i) => {
                  return (
                    <Followers
                      key={i}
                      id={e?.senderId}
                      fullName={e?.senderName}
                      data={e}
                      type="followers"
                    />
                  );
                })}
                {followList?.length === 0 && <LookingEmpty />}
              </Box>
            </Box>
          )}
          {viewList === "following" && (
            <Box>
              <Box>
                <Typography className={styles.profiletitle}>
                  Following
                </Typography>
              </Box>
              <Box className={styles.postdiv}>
                {followingList?.map((e, i) => {
                  return (
                    <Followers
                      key={i}
                      id={e?.recipientId}
                      imgLink={""}
                      companyName={e.followerName}
                      fullName={e?.recipientName}
                      data={e}
                      type="following"
                      unFollow={profileId === userId ? true : false}
                    />
                  );
                })}
                {followingList?.length === 0 && <LookingEmpty />}
              </Box>
            </Box>
          )}
          {viewList === "connection" && (
            <Box>
              <Box>
                <Typography className={styles.profiletitle}>
                  Connections
                </Typography>
              </Box>
              <Box className={styles.postdiv}>
                {connectionList?.map((e, i) => {
                  return (
                    <Followers
                      key={i}
                      id={e?.senderId}
                      fullName={e?.senderName}
                      imgLink={e?.senderProfile}
                      data={e}
                      type="connection"
                    />
                  );
                })}
                {connectionList?.length === 0 && <LookingEmpty />}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  ) : (
    <>
      <Box>
        <Box className={styles.closeIcons}>
          <IconButton onClick={() => dispatch(setDashboardView("home"))}>
            <Close />
          </IconButton>
        </Box>
        <LookingEmpty description="User Not Found" />
      </Box>
    </>
  );
};

export default Profile;
