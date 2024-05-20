import { Stack } from "@mui/material";
import { Link } from "react-router-dom";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import { SearchBar } from "./";

const Navbar = () => (
  <Stack
    direction="row"
    alignItems="center"
    p={2}
    sx={{
      position: "sticky",
      background: "#000",
      top: 0,
      justifyContent: "space-between",
    }}
  >
    <Link to="/" style={{ display: "flex", alignItems: "center" }}>
      <SlideshowIcon
        style={{
          color: "#FC1503",
          background: "white",
          fontSize: "3rem",
          borderRadius: "10px",
        }}
      />
    </Link>
    <SearchBar />
  </Stack>
);

export default Navbar;
