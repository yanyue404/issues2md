import axios, { AxiosInstance } from 'axios';
import { GitHubIssue, BlogConfig } from '../types';

export class GitHubClient {
  private client: AxiosInstance;
  private config: BlogConfig;

  constructor(config: BlogConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'issues2md-cli',
        ...(config.token && { Authorization: `token ${config.token}` }),
      },
    });
  }

  async getIssue(issueNumber: number): Promise<GitHubIssue> {
    const response = await this.client.get(
      `/repos/${this.config.owner}/${this.config.repo}/issues/${issueNumber}`,
    );
    return response.data;
  }

  async getIssues(
    state: 'open' | 'closed' | 'all' = 'all',
    per_page: number = 100,
  ): Promise<GitHubIssue[]> {
    const issues: GitHubIssue[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await this.client.get(
        `/repos/${this.config.owner}/${this.config.repo}/issues`,
        {
          params: {
            state,
            per_page,
            page,
            sort: 'created',
            direction: 'desc',
          },
        },
      );

      const pageIssues = response.data.filter(
        (issue: any) => !issue.pull_request,
      );
      issues.push(...pageIssues);

      hasMore = pageIssues.length === per_page;
      page++;
    }

    return issues;
  }

  static parseGitHubUrl(url: string): {
    owner: string;
    repo: string;
    issueNumber?: number;
  } {
    const match = url.match(
      /github\.com\/([^\/]+)\/([^\/]+)(?:\/issues\/(\d+))?/,
    );
    if (!match) {
      throw new Error('Invalid GitHub URL');
    }

    const [, owner, repo, issueNumber] = match;
    const result: {
      owner: string;
      repo: string;
      issueNumber?: number;
    } = {
      owner,
      repo,
    };

    if (issueNumber) {
      result.issueNumber = parseInt(issueNumber, 10);
    }

    return result;
  }
}
