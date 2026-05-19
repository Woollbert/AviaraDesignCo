import data from "@/content/team.json";

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  photoUrl?: string;
};

export const founder: TeamMember = data.founder as TeamMember;
export const team: TeamMember[] = data.members as TeamMember[];
