'use client';
import React from 'react'
import TextField from '@mui/material/TextField';
import smartruck from '../../assets/powered_by_smartruck_svg.svg'
import Image from 'next/image';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import { signIn } from 'next-auth/react';
function Login() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState('')
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleSignIn = async () => {
    const data = await signIn('credentials', {username: username, password: password});
    
    
  }
  return (
    <div className="flex flex-col justify-between p-[20px] h-screen w-screen bg-[#fcfcfc]">
    <div className='px-[20px]  flex flex-col w-screen h-screen gap-[48px]'>
        <div className='top'>
          <div className="label text-[32px] text-[#1A1A1A] font-bold mt-[32px] ">
            Sign in
          </div>
        </div>
        <div className='center flex flex-col ' >
          <form className='flex flex-col gap-[16px]'>
        <TextField id="outlined-basic" label="Email" variant="outlined" value={username} onChange={e => setUsername(e.target.value)} />
        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined" className='m-[0] w-full'>
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
          value={password}
          onChange={e => setPassword(e.target.value)}
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>

          </form>

        </div>
        <div className='bottom'>
        <div className="button" onClick={handleSignIn}>
                <button  className='buttonLabel'>Sign in</button>
            </div>
        </div>
    </div>
    <div className="footer w-screen">
      <Image src ={smartruck} 
      alt="Powered by smartruck"
      />
    </div>
    </div>
  )
}

export default Login
