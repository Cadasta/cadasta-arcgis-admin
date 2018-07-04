interface ProjectCreateRequestBody {
  name: string;
  groups: string[];
}

interface ProjectCreateResponseBody {
  name: string;
  slug: string;
  created_by: string;
  created_date: string;
  modified_by: string;
  modified_date: string;
}
