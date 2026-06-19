export type MemberRole = "CLIENT" | "FREELANCER";

export const ROLE_LABEL: Record<MemberRole, string> = {
  CLIENT: "예비부부",
  FREELANCER: "프리랜서",
};

interface RoleTheme {
  badgeClass: string;
  avatarBgClass: string;
  avatarTextClass: string;
}

const ROLE_THEME: Record<MemberRole, RoleTheme> = {
  CLIENT: {
    badgeClass: "bg-[#fbe4ea] text-[#8a4b5a]",
    avatarBgClass: "bg-[#fbe4ea]",
    avatarTextClass: "text-[#8a4b5a]",
  },
  FREELANCER: {
    badgeClass: "bg-[#e8f5d0] text-[#4f6231]",
    avatarBgClass: "bg-[#d3ebac]",
    avatarTextClass: "text-[#4f6231]",
  },
};

export function getRoleTheme(role: MemberRole | null): RoleTheme {
  return role ? ROLE_THEME[role] : ROLE_THEME.FREELANCER;
}
