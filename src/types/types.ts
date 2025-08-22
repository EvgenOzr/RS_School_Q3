type AuthUser = {
  name: string;
  age: number;
  email: string;
  password: string;
  gender: string;
  confirm: boolean;
  image: Blob;
  country: string;
};

export type { AuthUser };
