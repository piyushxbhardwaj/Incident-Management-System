/**
 * Strategy Pattern for Alerting
 */

class AlertingStrategy {
  send(signal) {
    throw new Error("Strategy method 'send' must be implemented");
  }
}

class P0AlertStrategy extends AlertingStrategy {
  send(signal) {
    console.log(`[ALERT P0] 🚨 CRITICAL: ${signal.component_id} failed! Dispatching on-call engineers. Message: ${signal.message}`);
    // Here you would integrate with PagerDuty, OpsGenie, etc.
  }
}

class P1AlertStrategy extends AlertingStrategy {
  send(signal) {
    console.log(`[ALERT P1] ⚠️ HIGH: ${signal.component_id} warning. Sending Slack/Email notification. Message: ${signal.message}`);
  }
}

class P2AlertStrategy extends AlertingStrategy {
  send(signal) {
    console.log(`[ALERT P2] ℹ️ INFO: ${signal.component_id} anomaly. Logging to dashboard. Message: ${signal.message}`);
  }
}

class AlertContext {
  constructor() {
    this.strategies = {
      RDBMS: new P0AlertStrategy(),
      API: new P1AlertStrategy(),
      CACHE: new P2AlertStrategy(),
      DEFAULT: new P2AlertStrategy(),
    };
  }

  getStrategy(componentId) {
    if (componentId.includes("RDBMS") || componentId.includes("DB")) return this.strategies.RDBMS;
    if (componentId.includes("API")) return this.strategies.API;
    if (componentId.includes("CACHE")) return this.strategies.CACHE;
    return this.strategies.DEFAULT;
  }

  alert(signal) {
    const strategy = this.getStrategy(signal.component_id);
    strategy.send(signal);
  }
}

export const alertManager = new AlertContext();
