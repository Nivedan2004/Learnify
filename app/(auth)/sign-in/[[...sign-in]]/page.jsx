import { Loader2 } from 'lucide-react';
import { SignIn, ClerkLoaded, ClerkLoading } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className='min-h-screen grid grid-cols-1 lg:grid-cols-2'>
      <div className='h-full lg:flex flex-col items-center justify-center px-4'>
        <div className='text-center space-y-4 pt-16'>
          <h1 className='font-bold text-3xl text-[black]'>
            Welcome to Learnify!
          </h1>
          <p className='text-base text-[#7E8CA0]'>
            Log in or create account to get started!
          </p>
        </div>
        <div className='flex items-center justify-center mt-8'>
          <ClerkLoaded>
            <SignIn />
          </ClerkLoaded>
          <ClerkLoading>
            <Loader2 className='animate-spin text-muted-foreground' />
          </ClerkLoading>
        </div>
      </div>

      <div className='h-full bg-blue-600 hidden lg:flex items-center justify-center p-4'>
        <div className="bg-white rounded-xl p-2 shadow-lg">
          <iframe
            src="https://www.loom.com/embed/422ed924fbaf454a82730825725c6717?sid=5a664f93-1e44-4e39-b128-c2d373e31c37"
            width="750"
            height="450"
            allowFullScreen
            className="rounded-md"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

