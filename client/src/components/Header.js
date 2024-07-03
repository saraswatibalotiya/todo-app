import React from "react";
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import {purple } from "@mui/material/colors";

import { useParams, useNavigate } from "react-router-dom"; // Import useHistory from react-router-dom

const url = window.location.href;
console.log(url);
let pages = [],
  settings = [];
const Header = () => {
  const location = useLocation();

  const [isuser, setUser] = useState(false);

  // Sessions
  const { sessionId } = useParams() || null;
  const [sessionData, setSessionData] = useState(null);
  const [isusername, setUsername] = useState("");

  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleMenuItemClick = (e) => {
    handleCloseUserMenu();
    const setting = e.currentTarget.getAttribute("data-value");
    console.log(setting);
    // Check if the selected setting is 'Logout'
    if (setting === "Logout") {
      sessionStorage.removeItem(sessionId);
      setSessionData(null);
      navigate("/login");
      setUser(false);
    }
  };

  useEffect(() => {
    if (
      location.pathname.startsWith("/todo/") ||
      location.pathname.startsWith("/categorys/") ||
      location.pathname.startsWith("/kanban/")

    ) {
      pages = ["Category","Kanban-Board"];
      settings = ["Logout"];

      setUser(true);
      const dataFromSession = sessionStorage.getItem(sessionId);
      // Parse the data if needed
      const parsedData = JSON.parse(dataFromSession);

      // Update the state with the retrieved data
      setSessionData(parsedData[0]);
      setUsername(parsedData[0].username);

    }
  }, [location.pathname]);

  return (
    <AppBar position="static" >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={isuser ? Link : "div"}
            to={isuser ? `/todo/${sessionId}` : undefined}
            navigateTo
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            TODO
          </Typography>

          {isuser && (
            <> 
              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>

              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              // "Category","Kanban-Board"
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" ,'&:hover': {
                  color: 'yellow', // Change the color on hover
                },
                '&:active': {
                  color: 'red', // Change the color when clicked
                },}}
                href={
                  page === 'Category'
                  ? `/categorys/${sessionId}`
                  : `/kanban/${sessionId}`}
              >
                {page}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
              {/* Hello {isusername} */}
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  {/* <span style={{ marginLeft: '8px' }}> {isusername}</span> */}

                  {/* <Avatar alt="Remy Sharp"  /> */}
                  <Avatar
                    sx={{
                      bgcolor: purple[100],
                      color: "black",
                      width: 100,
                      height: 40,
                    }}
                    variant="rounded"
                  >
                    {isusername}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={(e) => {
                      handleMenuItemClick(e);
                    }}
                    data-value={setting}
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            </>
          )}

        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Header;
