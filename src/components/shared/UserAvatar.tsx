import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

type UserAvatarProps = {
  name: string
  imageUrl?: string | null
  className?: string
}

function initialsFromName(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function UserAvatar({ name, imageUrl, className }: UserAvatarProps) {
  return (
    <Avatar className={cn('size-9 border border-[var(--sn-border)]', className)}>
      {imageUrl ? <AvatarImage src={imageUrl} alt={name} /> : null}
      <AvatarFallback className="bg-[var(--sn-field)] text-xs font-semibold text-[var(--sn-text)]">
        {initialsFromName(name)}
      </AvatarFallback>
    </Avatar>
  )
}
