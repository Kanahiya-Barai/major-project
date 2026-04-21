export const riskColor = (level) => {
  const lower = level?.toLowerCase()
  if (lower === 'high') {
    return { bg: 'bg-danger/10', text: 'text-danger' }
  }
  if (lower === 'medium') {
    return { bg: 'bg-warning/10', text: 'text-warning' }
  }
  return { bg: 'bg-success/10', text: 'text-success' }
}