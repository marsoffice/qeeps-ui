export interface UserDto {
  id: string;
  email: string;
  hasSignedContract: boolean;
  name: string;
  isDisabled?: boolean;
  roles?: string[];
}
