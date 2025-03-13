import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { Typography, Box, Stack } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { fetchFromAPI } from "../utils/fetchFromAPI";
import { Videos, Loader } from "./";

// Kiểm tra nếu có thể import Worker từ src
let WorkerInstance;
try {
  WorkerInstance = require("../worker.js"); // Import từ src nếu có
} catch (e) {
  WorkerInstance = null; // Nếu lỗi thì sẽ dùng worker từ public/
}

// Custom Hook giữ cho trang hoạt động
const useKeepAlive = () => {
  useEffect(() => {
    const worker = WorkerInstance
      ? new WorkerInstance()
      : new Worker("/worker.js");

    worker.onmessage = () => {
      console.log("Web vẫn đang chạy ở background!");
    };

    return () => worker.terminate();
  }, []);
};

const VideoDetail = () => {
  const [videoDetail, setVideoDetail] = useState(null);
  const [videos, setVideos] = useState(null);
  const { id } = useParams();

  useKeepAlive(); // Chạy Web Worker để giữ web hoạt động

  useEffect(() => {
    fetchFromAPI(`videos?part=snippet,statistics&id=${id}`).then((data) =>
      setVideoDetail(data.items[0])
    );

    fetchFromAPI(`search?part=snippet&relatedToVideoId=${id}&type=video`).then(
      (data) => setVideos(data.items)
    );
  }, [id]);

  // Luôn gọi useEffect để xử lý Picture-in-Picture
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.querySelector("video")?.requestPictureInPicture();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Nếu videoDetail chưa tải xong thì hiển thị Loader
  if (!videoDetail) return <Loader />;

  const {
    snippet: { title, channelId, channelTitle } = {},
    statistics: { viewCount, likeCount } = {},
  } = videoDetail;

  return (
    <Box minHeight="95vh">
      <Stack direction={{ xs: "column", md: "row" }}>
        <Box flex={1}>
          <Box sx={{ width: "100%", position: "sticky", top: "86px" }}>
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${id}`}
              className="react-player"
              controls
              pip={true}
              playing={true}
            />
            <Typography color="#fff" variant="h5" fontWeight="bold" p={2}>
              {title}
            </Typography>
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ color: "#fff" }}
              py={1}
              px={2}
            >
              <Typography variant="h6" color="#fff">
                {channelTitle}
                <CheckCircleIcon
                  sx={{ fontSize: "12px", color: "gray", ml: "5px" }}
                />
              </Typography>
              <Stack direction="row" gap="20px" alignItems="center">
                <Typography variant="body1" sx={{ opacity: 0.7 }}>
                  {viewCount ? parseInt(viewCount).toLocaleString() : "N/A"}{" "}
                  views
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.7 }}>
                  {likeCount ? parseInt(likeCount).toLocaleString() : "N/A"}{" "}
                  likes
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Box>
        <Box
          px={2}
          py={{ md: 1, xs: 5 }}
          justifyContent="center"
          alignItems="center"
        >
          <Videos videos={videos} direction="column" />
        </Box>
      </Stack>
    </Box>
  );
};

export default VideoDetail;
