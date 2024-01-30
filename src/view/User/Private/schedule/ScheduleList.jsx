import FlexBetween from "../../../../components/FlexBetween";
import WidgetWrapper from "../../../../components/WidgetWrapper";
import TextField from "@mui/material/TextField";
import { Box, Typography } from "@mui/material";
import styles from "./index.module.css";
import LikeComment from "./LikeComment";
import {
  useDeleteSchedule,
  useGetAllSchedules,
} from "../../../../hooks/schedule";
import Loader from "../../../../components/Loader/Loader";
import { useSelector } from "react-redux";
import moment from "moment";
import PostTitle from "./PostTitle";

const ScheduleList = () => {
  const profileData = useSelector((state) => state.profile.profileData);
  const { data, isLoading } = useGetAllSchedules();
  const { mutate } = useDeleteSchedule();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {data &&
        data.map((e, i) => {
          return (
            <WidgetWrapper key={i} sx={{ marginBottom: "20px" }}>
              <PostTitle data={e} />
              <Box className={styles.scheduleListDiv}>
                <Box className={styles.scheduleListSubDiv}>
                  <Typography>POL: </Typography>{" "}
                  <Typography>{e.pol}</Typography>
                </Box>
                <Box className={styles.scheduleListSubDiv}>
                  <Typography>POD: </Typography>{" "}
                  <Typography>{e.pod}</Typography>
                </Box>
                <Box className={styles.scheduleListSubDiv}>
                  <Typography>Cut Off: </Typography>
                  <Typography>
                    {moment(e.bookingCutOff).format("DD-MM-YYYY")}
                  </Typography>
                </Box>
              </Box>
              {e.description !== "" && (
                <Box className={styles.descriptiondiv}>
                  <p>{e.description} </p>
                </Box>
              )}
              <Box>
                <LikeComment key={e._id} postData={e} scheduleId={e._id} />
              </Box>
            </WidgetWrapper>
          );
        })}
    </>
  );
};

export default ScheduleList;
