import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles(({ palette, spacing }) => ({
  paper: {
    marginTop: spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: spacing(1),
    backgroundColor: palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: spacing(1),
  },
  submit: {
    margin: spacing(3, 0, 2),
  },
}));

const Login = () => {
  const classes = useStyles();

  const saveName = async (event: React.SyntheticEvent<EventTarget>) => {
    event.preventDefault();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const username = event.target[0].value;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore[0].value;
    const password = event.target[2].value;

    document.cookie = `name=${username}; path=/`;

    const response = await fetch(
      `${window.location.origin}/api/user/${username}/login`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      }
    );
    const jsonResponse = await response.json();
    document.cookie = `access_token=${jsonResponse.accessToken}; path=/`;
    window.location.reload();
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar} />
        <Typography component="h1" variant="h5">
          Greeting
        </Typography>
        <form className={classes.form} autoComplete="off" onSubmit={saveName}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            inputProps={{
              pattern: "[a-zA-Z]{3,8}",
              title:
                "Username should be alphabetical characters only with min 3 max 8 length!",
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Go! 🚀 🚀 🚀
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default Login;
