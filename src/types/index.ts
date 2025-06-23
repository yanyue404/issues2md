export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  created_at: string;
  updated_at: string;
  labels: GitHubLabel[];
  user: GitHubUser;
  html_url: string;
}

export interface GitHubLabel {
  id: number;
  name: string;
  color: string;
  description?: string;
}

export interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface BlogConfig {
  owner: string;
  repo: string;
  token?: string;
}

export interface MarkdownOptions {
  includeLabels?: boolean;
  includeMetadata?: boolean;
  dateFormat?: string;
}

export interface CLIOptions {
  output?: string;
  token?: string;
  proxy?: string;
}
