import React, { Fragment, useState, useContext, useEffect } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import { deepOrange, blue } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Button from "@material-ui/core/Button";
import cookies from "next-cookies";
import { chirp, like, fetchChirps } from "../api";
import ErrorContext from "../utils/error-context";

const useStyles = makeStyles(({ palette, spacing }) =>
  createStyles({
    root: {
      width: "40%",
      backgroundColor: palette.background.paper,
      margin: "auto",
      marginTop: spacing(1),
    },
    inline: {
      display: "inline",
    },
    orange: {
      color: palette.getContrastText(deepOrange[500]),
      backgroundColor: deepOrange[500],
    },
    like: {
      color: blue[400],
      marginLeft: spacing(0.5),
      marginRight: spacing(0.5),
      fontSize: 16,
      cursor: "pointer",
      position: "relative",
      top: 3,
    },
    newChirp: {
      resize: "none",
      width: "100%",
    },
    chirpBtn: {
      textAlign: "right",
    },
  })
);

type Chirps = {
  userName: string;
  chirps: Array<{ chirpId: string; text: string; likes: number }>;
};

const Chirps = ({ chirps }: { chirps: Chirps }) => {
  const classes = useStyles();
  const [newChirp, setNewChirp] = useState<string | null>(null);
  const [latestChirps, setLatestChirps] = useState<Chirps>(chirps);
  const { setErrorMessage } = useContext(ErrorContext);
  const [loading, setLoading] = useState<boolean>(false);
  const accessToken = cookies({}).access_token!;

  useEffect(() => {
    setLatestChirps(chirps);
  }, [chirps]);

  const recordChirp = (event: React.SyntheticEvent) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setNewChirp(event.target.value);
  };

  const userNameToBadge = (userName: string) =>
    (userName[0] + userName[userName.length - 1]).toUpperCase();

  const handleChirp = async () => {
    try {
      setLoading(true);
      const success = await chirp(
        latestChirps.userName,
        newChirp!,
        accessToken
      );
      if (success) {
        const refetchedChirps = await fetchChirps(
          latestChirps.userName,
          accessToken
        );
        setLatestChirps(refetchedChirps);
        setNewChirp(null);
      } else {
        setErrorMessage(
          "Something went wrong during saving your chirp. Please try again later!"
        );
      }
    } catch (e) {
      setErrorMessage(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (chirpId: string) => {
    try {
      const success = await like(latestChirps.userName, chirpId, accessToken);
      if (success) {
        const refetchedChirps = await fetchChirps(
          latestChirps.userName,
          accessToken
        );
        setLatestChirps(refetchedChirps);
        setNewChirp(null);
      } else {
        setErrorMessage(
          "Something went wrong during saving your like. Please try again later!"
        );
      }
    } catch (e) {
      setErrorMessage(e.message);
    }
  };

  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      className={classes.root}
    >
      <Grid item xs={12}>
        <TextareaAutosize
          className={classes.newChirp}
          aria-label="empty textarea"
          placeholder=" Say something..."
          autoFocus
          rows={5}
          rowsMax={5}
          rowsMin={5}
          value={newChirp || ""}
          onChange={recordChirp}
        />
      </Grid>
      <Grid item xs={12} className={classes.chirpBtn}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!newChirp && !loading}
          onClick={handleChirp}
        >
          Chirp
        </Button>
      </Grid>
      <Grid item xs={12}>
        <List>
          {latestChirps.chirps.map(({ chirpId, text, likes }) => (
            <Fragment key={chirpId}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar className={classes.orange}>
                    {userNameToBadge(chirps.userName)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={text}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.inline}
                        color="textPrimary"
                      >
                        by {chirps.userName}
                      </Typography>
                      {" — "}
                      <FavoriteIcon
                        className={classes.like}
                        onClick={() => handleLike(chirpId)}
                      />
                      {likes}
                    </>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </Fragment>
          ))}
        </List>
      </Grid>
    </Grid>
  );
};

export default Chirps;
