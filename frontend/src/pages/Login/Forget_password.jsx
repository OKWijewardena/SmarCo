import { Paper, Avatar, TextField, Button, Typography, Link, FormControlLabel, Checkbox } from '@material-ui/core';
import { Grid } from '@mui/material';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


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

export const Forget_password = () => {

    const [email, setEmail] = useState('');
    const navigate = useNavigate();


  const classes = useStyles();
  const paperStyle={
    padding :20,
    height:'50vh',
    width:'80%', 
    maxWidth: 350, 
    margin:"0 auto",
    borderRadius: '15px', 
    textAlign: 'center',
    backgroundColor: 'rgb(224 206 229)', // Glassy effect, little bit bluer and transparent
  }
  const avatarStyle={backgroundColor:'rgba(218 188 225)'}
  const btnstyle={margin:'8px 0'}



  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log(`Email: ${email}`);
   
    try {
      axios
      .post('http://podsaas.online/api/forgot-password', { email })
      .then((res) => {
        if (res.data.Status === 'Success') {
          navigate('/login');
        }
      })
      } 
    catch (err) {
      console.error(err);
      alert('Password not matched!');
    }
  }



  return (
    <Grid container style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(218 188 225)' }}>
      <Paper elevation={10} style={paperStyle}>
      <form onSubmit={handleSubmit}>

        <Grid align='center'>
          <Avatar style={avatarStyle}><LockOutlinedIcon/></Avatar>
          <h2 style={{color: 'rgb(117, 40, 136)'}}>Forget Password</h2>
   
        </Grid>
        <TextField className={classes.root} label='Username' placeholder='Enter username' fullWidth required value={email} onChange={(e) => setEmail(e.target.value)}/>
       
       

<Button 
            type='submit' 
            variant="contained" 
            style={{...btnstyle, backgroundColor: 'rgb(117, 40, 136)', color: 'rgb(224, 206, 229)'}} 
            fullWidth
          >
  Sign in
</Button>
        <Typography style={{color: 'rgb(117, 40, 136)'}}>
          <Link href="/"  style={{color: 'rgb(117, 40, 136)'}}>
            You want To Sign In
          </Link>
        </Typography>
        
        </form>
      </Paper>
    </Grid>
  )
}