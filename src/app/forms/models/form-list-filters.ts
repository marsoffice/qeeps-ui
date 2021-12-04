export interface FormListFilters {
  page?: number;
  elementsPerPage?: number;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: string;
  search?: string;
  tags?: string[];
}
