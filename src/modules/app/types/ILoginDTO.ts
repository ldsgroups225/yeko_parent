export interface ILoginDTO {
  email: string;
  password: string;
}

interface ISchoolDTO {
  id: string;
  name: string;
  imageUrl: string;
}

interface IClassDTO {
  id: string;
  name: string;
}

export interface IStudentDTO {
  id: string;
  firstName: string;
  lastName: string;
  idNumber: string;
  school: ISchoolDTO;
  class: IClassDTO;
}

export interface IUserDTO {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  pushToken: string;
  children: IStudentDTO[];
}

export enum ERole {
  PARENT = 1,
  TEACHER = 2,
  DIRECTOR = 3,
  ADMIN = 4,
}
