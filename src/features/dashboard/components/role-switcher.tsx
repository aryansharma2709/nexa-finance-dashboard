import { Check, ChevronDown, Shield } from 'lucide-react'
import { userRoles, type UserRole } from '@/features/finance/types'

type RoleSwitcherProps = {
  role: UserRole
  onChange: (role: UserRole) => void
}

export function RoleSwitcher({ role, onChange }: RoleSwitcherProps) {
  const isAdmin = role === 'Admin'

  return (
    <label className="relative w-full min-[420px]:w-auto">
      <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-text-muted">
        <Shield size={16} />
      </div>
      <select
        value={role}
        onChange={(event) => onChange(event.target.value as UserRole)}
        className={
          isAdmin
            ? 'h-12 w-full appearance-none rounded-[18px] border border-[rgba(99,245,174,0.24)] bg-[rgba(99,245,174,0.1)] pl-11 pr-14 text-sm text-text outline-none transition hover:border-[rgba(99,245,174,0.34)] focus:border-[rgba(99,245,174,0.34)]'
            : 'h-12 w-full appearance-none rounded-[18px] border border-line bg-[var(--surface-soft)] pl-11 pr-14 text-sm text-text outline-none transition hover:border-line-strong focus:border-[rgba(99,245,174,0.24)]'
        }
        aria-label="Switch user role"
      >
        {userRoles.map((option) => (
          <option key={option} value={option} className="bg-[#12151B] text-text">
            {option}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center gap-2 text-text-subtle">
        <Check size={14} className="text-accent" />
        <ChevronDown size={14} />
      </div>
      <p className="mt-2 px-1 text-xs text-text-subtle">{isAdmin ? 'Admin can create, edit, and delete transactions.' : 'Viewer can inspect data but cannot change it.'}</p>
    </label>
  )
}
