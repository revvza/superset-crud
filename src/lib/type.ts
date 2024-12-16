export interface User {
    user_id: number;
    username: string;
  }
  export interface Frame {
    frame_id: number;
    frame_name: string;
    frame_url: string;
  }
  export interface Role {
    role_id: number;
    role_name: string;
  }

  export interface FrameRole {
    framerole_id: number;
    frame_id: number;
    role_id: number;
  }
  
  export interface UserRole {
    userrole_id: number;
    user_id: number;
    role_id: number;
  }

  export interface Role{
    role_id: number;
    role_name: string;
    description: string;
  }