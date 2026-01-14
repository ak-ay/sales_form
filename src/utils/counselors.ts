export interface Counselor {
  id?: string;
  name: string;
  specialization?: string;
}

export const counselors: Counselor[] = [
  { id: '1', name: 'Rajesh Kumar', specialization: 'Technical Analysis' },
  { id: '2', name: 'Priya Sharma', specialization: 'Options Trading' },
  { id: '3', name: 'Amit Patel', specialization: 'Futures & Derivatives' },
  { id: '4', name: 'Sneha Reddy', specialization: 'Price Action' },
  { id: '5', name: 'Vikram Singh', specialization: 'Risk Management' },
];

export function getCounselorDisplay(
  idOrName: string,
  options?: { includeSpecialization?: boolean }
): string {
  if (!idOrName) return 'Not selected';
  const counselor = counselors.find(item => item.id === idOrName);
  if (!counselor) return idOrName;
  if (options?.includeSpecialization && counselor.specialization) {
    return `${counselor.name} - ${counselor.specialization}`;
  }
  return counselor.name;
}
