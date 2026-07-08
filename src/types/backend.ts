export interface User {
  id: string;
  name: string;
  phone: string;
  unreadMessages: number;
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  href: string;
  tabKey: string;
  isAccent?: boolean;
}
