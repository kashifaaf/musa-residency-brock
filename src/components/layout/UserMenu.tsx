'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { getInitials } from '@/lib/utils'
import { User, Settings, LogOut, Home, Calendar } from 'lucide-react'

interface UserMenuProps {
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    isHost: boolean
  }
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await signOut({ redirect: false })
    router.push('/')
  }

  const displayName = user.name || user.email || 'User'
  const initials = getInitials(displayName)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar>
          <AvatarImage src={user.image || undefined} alt={displayName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.name || 'Anonymous User'}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => router.push('/profile')}>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => router.push('/bookings')}>
          <Calendar className="mr-2 h-4 w-4" />
          My Bookings
        </DropdownMenuItem>
        
        {user.isHost && (
          <DropdownMenuItem onClick={() => router.push('/host/homes')}>
            <Home className="mr-2 h-4 w-4" />
            My Homes
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem onClick={() => router.push('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleSignOut} disabled={isSigningOut}>
          <LogOut className="mr-2 h-4 w-4" />
          {isSigningOut ? 'Signing out...' : 'Sign out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}