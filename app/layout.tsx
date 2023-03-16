import '../styles/globals.css'
import { getServerSession } from 'next-auth'
import { authOptions } from '../pages/api/auth/[...nextauth]'
import Login from './components/login'
import { SessionProvider } from './components/sessionprovider';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode,
  session: any,
}) {

  const session  = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          {!session ? (
          //  <div>{children}</div>
           <div className='flex flex-col justify-between p-[20px] min-h-screen w-screen bg-[#fcfcfc]'>
            <div className='hidden '></div>
            <Login />
            </div>
          ) : (
           <div>{children}</div>
          )}



        
        </SessionProvider>
        </body>
    </html>
  )
}
