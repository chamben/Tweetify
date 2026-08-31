export interface AuthorRef {
  _id: string;
  username: string;
}

export interface Post {
  _id: string;
  author: AuthorRef;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  post: string;
  author: AuthorRef;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface LikesResponse {
  count: number;
  likes: Array<{ _id: string; user: AuthorRef }>;
}
