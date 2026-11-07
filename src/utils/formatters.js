export function formatCurrency(amount) {
  if (typeof amount !== 'number') return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function getDaysRemaining(dateString) {
  if (!dateString) return { days: 0, label: "No date", isUrgent: false, isPast: false };
  const target = new Date(dateString);
  const now = new Date();
  
  // Set both to midnight for clean day calculation
  const targetMidnight = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const diffTime = targetMidnight - nowMidnight;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return { days: diffDays, label: "Closed", isUrgent: false, isPast: true };
  } else if (diffDays === 0) {
    return { days: 0, label: "Due Today!", isUrgent: true, isPast: false };
  } else if (diffDays === 1) {
    return { days: 1, label: "Due Tomorrow", isUrgent: true, isPast: false };
  } else if (diffDays <= 7) {
    return { days: diffDays, label: `${diffDays} days left`, isUrgent: true, isPast: false };
  } else if (diffDays <= 21) {
    return { days: diffDays, label: `${diffDays} days left`, isUrgent: false, isPast: false };
  } else {
    return { days: diffDays, label: `${Math.round(diffDays / 7)} weeks left`, isUrgent: false, isPast: false };
  }
}
