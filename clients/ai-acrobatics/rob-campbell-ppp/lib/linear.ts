type LinearIssueResult = {
  identifier: string;
  url: string;
};

type CreateLinearIssueInput = {
  title: string;
  description: string;
  priority?: 1 | 2 | 3 | 4;
};

const LINEAR_ENDPOINT = "https://api.linear.app/graphql";

export async function createLinearIssue(input: CreateLinearIssueInput): Promise<LinearIssueResult | null> {
  const apiKey = process.env.LINEAR_API_KEY;
  if (!apiKey) return null;

  const teamId = process.env.LINEAR_TEAM_ID ?? await getLinearTeamId(apiKey);
  if (!teamId) return null;

  const projectId = process.env.LINEAR_PROJECT_ID || process.env.NEXT_PUBLIC_LINEAR_PROJECT_ID;
  const response = await fetch(LINEAR_ENDPOINT, {
    method: "POST",
    headers: {
      "Authorization": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        mutation CreateIssue($input: IssueCreateInput!) {
          issueCreate(input: $input) {
            success
            issue { identifier url }
          }
        }
      `,
      variables: {
        input: {
          teamId,
          ...(projectId ? { projectId } : {}),
          title: input.title,
          description: input.description,
          priority: input.priority ?? 3,
        },
      },
    }),
  });

  if (!response.ok) return null;
  const json = await response.json();
  const issue = json?.data?.issueCreate?.issue;
  return issue?.identifier && issue?.url ? issue : null;
}

async function getLinearTeamId(apiKey: string): Promise<string | null> {
  const response = await fetch(LINEAR_ENDPOINT, {
    method: "POST",
    headers: {
      "Authorization": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query Teams {
          teams {
            nodes { id key name }
          }
        }
      `,
    }),
  });
  if (!response.ok) return null;
  const json = await response.json();
  const teams: Array<{ id: string; key: string; name: string }> = json?.data?.teams?.nodes ?? [];
  return teams.find((team) => team.key === "AI")?.id ?? teams[0]?.id ?? null;
}

