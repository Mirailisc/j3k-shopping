import { Social } from '@/types/user'
import { Globe, Link as LinkIcon } from 'lucide-react'

type Props = {
  social: Partial<Social>
}

const ProfileSocial: React.FC<Props> = ({ social }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      {social.line && (
        <a
          href={social.line}
          className="flex items-center gap-2 text-zinc-700 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          <LinkIcon size={20} />
          Line
        </a>
      )}
      {social.facebook && (
        <a
          href={social.facebook}
          className="flex items-center gap-2 text-zinc-700 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          <Globe size={20} />
          Facebook
        </a>
      )}
      {social.instagram && (
        <a
          href={social.instagram}
          className="flex items-center gap-2 text-zinc-700 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          <Globe size={20} />
          Instagram
        </a>
      )}
      {social.tiktok && (
        <a
          href={social.tiktok}
          className="flex items-center gap-2 text-zinc-700 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          <Globe size={20} />
          TikTok
        </a>
      )}
      {social.website && (
        <a
          href={social.website}
          className="flex items-center gap-2 text-zinc-700 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          <Globe size={20} />
          Website
        </a>
      )}
    </div>
  )
}

export default ProfileSocial
