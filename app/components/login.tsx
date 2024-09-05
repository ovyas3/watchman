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
    <div className="flex flex-col items-center justify-between p-[200px] h-screen bg-[#fcfcfc]">
    <div className='flex flex-col items-center w-full max-w-[530px] gap-[48px]'>
        <div className='top w-full'>
          <div className="label text-[32px] text-[#1A1A1A] font-bold mt-[32px] ">
            Sign in
          </div>
          <p>Fill your details correctly</p>
        </div>
        <div className='center flex flex-col w-full' >
          <form className='flex flex-col gap-[16px] w-[400px]'>
        <TextField id="outlined-basic" label="Email" variant="outlined" value={username} onChange={e => setUsername(e.target.value)} />
        {/* <TextField id="outlined-basic" label="Password" variant="outlined" value={password} onChange={e => setPassword(e.target.value)} /> */}
        
        <FormControl variant="outlined" fullWidth>
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
        <div className='bottom w-full'>
        <div className="w-[400px] py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-center" onClick={handleSignIn}>
                <button  className='buttonLabel'>Sign in</button>
            </div>
        </div>
    </div>
    <div className="footer w-full flex items-center justify-center mt-[150px] mr-[100px]">
      <Image src ={smartruck} 
      width={500}
      alt="Powered by smartruck"
      />
    </div>
    </div>
  )
}

export default Login
