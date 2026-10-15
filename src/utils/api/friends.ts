export interface UserWithFriendshipStatus {
  id: string;
  name: string;
  username: string;
  nickname?: string;
  friendshipStatus: "friends" | "pending" | "none";
  isVerify?: boolean;
}
