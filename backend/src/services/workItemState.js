/**
 * State Pattern for Work Item Transitions
 */

class WorkItemState {
  constructor(workItem) {
    this.workItem = workItem;
  }

  transitionTo(nextStatus, rcaData = null) {
    throw new Error(`Transition from ${this.workItem.status} to ${nextStatus} not allowed`);
  }
}

class OpenState extends WorkItemState {
  transitionTo(nextStatus) {
    if (nextStatus === "INVESTIGATING") return "INVESTIGATING";
    if (nextStatus === "RESOLVED") return "RESOLVED";
    return super.transitionTo(nextStatus);
  }
}

class InvestigatingState extends WorkItemState {
  transitionTo(nextStatus) {
    if (nextStatus === "RESOLVED") return "RESOLVED";
    return super.transitionTo(nextStatus);
  }
}

class ResolvedState extends WorkItemState {
  transitionTo(nextStatus, rcaData) {
    if (nextStatus === "CLOSED") {
      if (!rcaData || !rcaData.root_cause || !rcaData.fix_applied) {
        throw new Error("RCA (Root Cause and Fix Applied) is mandatory to close the incident.");
      }
      return "CLOSED";
    }
    if (nextStatus === "OPEN") return "OPEN"; // Re-open
    return super.transitionTo(nextStatus);
  }
}

class ClosedState extends WorkItemState {
  transitionTo(nextStatus) {
    if (nextStatus === "OPEN") return "OPEN"; // Re-open
    return super.transitionTo(nextStatus);
  }
}

export class WorkItemContext {
  static getStatusHandler(workItem) {
    switch (workItem.status) {
      case "OPEN": return new OpenState(workItem);
      case "INVESTIGATING": return new InvestigatingState(workItem);
      case "RESOLVED": return new ResolvedState(workItem);
      case "CLOSED": return new ClosedState(workItem);
      default: throw new Error("Invalid status");
    }
  }

  static validateTransition(workItem, nextStatus, rcaData) {
    const handler = this.getStatusHandler(workItem);
    return handler.transitionTo(nextStatus, rcaData);
  }
}
