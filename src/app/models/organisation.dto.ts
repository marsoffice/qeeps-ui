export interface OrganisationDto {
  id: string;
  fullId?: string;
  name: string;
  children?: OrganisationDto[];
}
