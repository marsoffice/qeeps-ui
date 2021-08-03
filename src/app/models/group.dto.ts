export interface GroupDto {
  id: string;
  name: string;
  children?: GroupDto[];
}
