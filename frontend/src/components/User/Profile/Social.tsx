import { Social } from '@/types/user'

type Props = {
  social: Partial<Social>
}

const ProfileSocial: React.FC<Props> = ({ social }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      {social.line && (
        <a href={social.line} className="text-zinc-700 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-50">
          Line
        </a>
      )}
      {social.facebook && (
        <a
          href={social.facebook}
          className="text-zinc-700 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          Facebook
        </a>
      )}
      {social.instagram && (
        <a
          href={social.instagram}
          className="text-zinc-700 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          Instagram
        </a>
      )}
      {social.tiktok && (
        <a
          href={social.tiktok}
          className="text-zinc-700 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          TikTok
        </a>
      )}
      {social.website && (
        <a
          href={social.website}
          className="text-zinc-700 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          Website
        </a>
      )}
    </div>
  )
}

export default ProfileSocial
