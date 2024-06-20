import { Paper, Avatar, TextField, Button, Typography, Link, FormControlLabel, Checkbox } from '@material-ui/core';
import { Grid } from '@mui/material';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
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

export default function Forget_password(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [otpBoxVisible, setOtpBoxVisible] = useState(false);
  const [buttonLabel, setButtonLabel] = useState('send ');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

const classes = useStyles();
const paperStyle={
  padding :20,
  height:'50vh',
  width:'80%', 
  maxWidth: 350, 
  margin:"0 auto",
  borderRadius: '15px', 
  textAlign: 'center',
  backgroundColor: 'white', // Glassy effect, little bit bluer and transparent
}
const avatarStyle={backgroundColor:'rgba(218 188 225)'}
const btnstyle={margin:'8px 0'}



const handleSubmit = async (e) => {
  e.preventDefault();
  console.log(`Email: ${email}`);
  try {
    const res = await axios.get(`http://podsaas.online/api/users/${email}`);
    if (res.data) {
      sessionStorage.setItem('user', JSON.stringify(res.data));
      console.log(res.data);
      setOtpBoxVisible(true);
      setButtonLabel('Verify OTP');

      // Generate a random 4-digit OTP
      const otp_code = Math.floor(1000 + Math.random() * 9000);
      setGeneratedOtp(otp_code); // Store the generated OTP

      // Send email using EmailJS
      emailjs.send('service_rp48zn9', 'template_5upimbk', {
        from_email: 'SmartCo@gmail.com', // replace with your email
        to_email: res.data.email, // user's email
        customer_name:res.data.name,
        otp_code: otp_code, // generated OTP
      }, 'l80KzJlwdVwy0cDHA') // replace with your user ID
      .then((result) => {
          console.log('Email sent:', result.text);
      }, (error) => {
          console.log('Email error:', error.text);
      });

    } else {
      alert('Email not found!');
    }
  } catch (err) {
    console.error(err);
    alert('Email is not registerd ');
  }
}
const handleOtpVerification = (e) => {
  e.preventDefault();
  // Convert both values to string before comparing
  if (String(otp) === String(generatedOtp)) {
    navigate('/Reset_password'); // Redirect to reset password page
  } else {
    alert('Invalid OTP. Please try again.');
  }
}


  return (
    <Grid container style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(218 188 225)' }}>
    <Paper elevation={10} style={paperStyle}>
    <form onSubmit={buttonLabel === 'send ' ? handleSubmit : handleOtpVerification}>
      <Grid align='center'>
        <Avatar style={avatarStyle}><LockOutlinedIcon/></Avatar>
        <h2 style={{color: 'rgb(117, 40, 136)'}}>Forget password</h2>
      </Grid>
      <TextField className={classes.root} label='Email' placeholder='Enter email' fullWidth required value={email} onChange={(e) => setEmail(e.target.value)}/>
      {otpBoxVisible && (
        <TextField className={classes.root} label='OTP' placeholder='Enter OTP' fullWidth required value={otp} onChange={(e) => setOtp(e.target.value)}/>
      )}
      
      <Button 
        type='submit' 
        variant="contained" 
        style={{...btnstyle, backgroundColor: 'rgb(117, 40, 136)', color: 'rgb(224, 206, 229)'}} 
        fullWidth
      >
        {buttonLabel}
      </Button>
      <Typography style={{color: 'rgb(117, 40, 136)'}}>

      </Typography>
    </form>
    </Paper>
  </Grid>
  )
}
