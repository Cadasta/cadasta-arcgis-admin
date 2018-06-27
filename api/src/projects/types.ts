interface ProjectRequestBody {
  name: string;
}

interface ProjectResponseBody {
  name: string;
  slug: string;
  created_by: string;
  created_date: string;
  modified_by: string;
  modified_date: string;
}