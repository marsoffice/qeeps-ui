export interface OrganisationDto {
  id: string;
  name: string;
  children?: OrganisationDto[];
}
