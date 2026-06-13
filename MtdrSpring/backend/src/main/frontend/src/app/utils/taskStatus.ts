export function isDoneStatus(status: string | undefined | null): boolean {
  const normalized = status?.toLowerCase().replace(/_/g, "-") ?? "";
  return ["done", "completed", "finished"].includes(normalized);
}

export function isInProgressStatus(status: string | undefined | null): boolean {
  const normalized = status?.toLowerCase().replace(/_/g, "-") ?? "";
  return ["in-progress", "inprogress", "in progress"].includes(normalized);
}
