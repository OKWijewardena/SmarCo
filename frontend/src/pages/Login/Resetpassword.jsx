import { Paper, Avatar, TextField, Button, Typography, Link, FormControlLabel, Checkbox } from '@material-ui/core';
import { Grid } from '@mui/material';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
const useStyles = makeStyles({
    label: {
        color: 'rgb(117, 40, 136)',
      },
  root: {
    '& label.Mui-focused': {
      color: 'rgb(117, 40, 136)',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'rgb(117, 40, 136)',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'rgb(117, 40, 136)',
      },
      '&:hover fieldset': {
        borderColor: 'rgb(117, 40, 136)',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'rgb(117, 40, 136)',
      },
     
    },
  },
});

export default function Resetpassword() {
  const [newPassword, setNewPassword] = useState('');
  const [reEnterPassword, setReEnterPassword] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const classes = useStyles();

  const paperStyle={
    padding :20,
    height:'50vh',
    width:'80%', 
    maxWidth: 350, 
    margin:"0 auto",
    borderRadius: '15px', 
    textAlign: 'center',
    backgroundColor: 'white',
  }

  const avatarStyle={backgroundColor:'rgba(218 188 225)'}

  const btnstyle={margin:'8px 0'}

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== reEnterPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.put(`http://podsaas.online/api/users/${user.email}`, { password: newPassword });
      if (res.status === 200) {
        alert("Update successful");
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Grid container style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(218 188 225)' }}>
      <Paper elevation={10} style={paperStyle}>
        <form onSubmit={handleSubmit}>
          <Grid align='center'>
            <Avatar style={avatarStyle}><LockOutlinedIcon/></Avatar>
            <h2 style={{color: 'rgb(117, 40, 136)'}}>Reset Password</h2>
          </Grid>
          <TextField className={classes.root} label='New_password' placeholder='Enter your new password' fullWidth required value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
          <TextField className={classes.root} label='ReEnter_password' placeholder='ReEnter your password' type='password' fullWidth required value={reEnterPassword} onChange={(e) => setReEnterPassword(e.target.value)}/>
          <Button type='submit' variant="contained" style={{...btnstyle, backgroundColor: 'rgb(117, 40, 136)', color: 'rgb(224, 206, 229)'}} fullWidth>Reset Password</Button>
        </form>
        
      </Paper>
    </Grid>
  )
}