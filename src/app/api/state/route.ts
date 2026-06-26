import { NextResponse } from "next/server";
import { MOCK_REPORTS, MOCK_RESOURCES, Report, Resource } from "../../lib/mockData";

type DisasterState = {
  reports: Report[];
  resources: Resource[];
};

const globalForDisasterState = globalThis as typeof globalThis & {
  __disasterTrustState?: DisasterState;
};

function getInitialState(): DisasterState {
  return {
    reports: [...MOCK_REPORTS],
    resources: [...MOCK_RESOURCES],
  };
}

function getState(): DisasterState {
  if (!globalForDisasterState.__disasterTrustState) {
    globalForDisasterState.__disasterTrustState = getInitialState();
  }

  return globalForDisasterState.__disasterTrustState;
}

function setState(nextState: DisasterState): void {
  globalForDisasterState.__disasterTrustState = nextState;
}

export function GET() {
  return NextResponse.json(getState());
}

export async function POST(request: Request) {
  const body = (await request.json()) as
    | { action: "addReport"; report: Report }
    | { action: "updateReportStatus"; id: string; status: Report["status"]; volunteerName?: string }
    | { action: "confirmReport"; id: string }
    | { action: "addResource"; resource: Resource };

  const currentState = getState();

  switch (body.action) {
    case "addReport": {
      setState({
        ...currentState,
        reports: [body.report, ...currentState.reports],
      });
      break;
    }
    case "updateReportStatus": {
      setState({
        ...currentState,
        reports: currentState.reports.map((report) =>
          report.id === body.id
            ? {
                ...report,
                status: body.status,
                volunteerAssigned: body.volunteerName ?? report.volunteerAssigned,
              }
            : report
        ),
      });
      break;
    }
    case "confirmReport": {
      setState({
        ...currentState,
        reports: currentState.reports.map((report) =>
          report.id === body.id
            ? {
                ...report,
                communityConfirmations: report.communityConfirmations + 1,
                confidenceScore: Math.min(report.confidenceScore + 2, 100),
              }
            : report
        ),
      });
      break;
    }
    case "addResource": {
      setState({
        ...currentState,
        resources: [body.resource, ...currentState.resources],
      });
      break;
    }
  }

  return NextResponse.json(getState());
}