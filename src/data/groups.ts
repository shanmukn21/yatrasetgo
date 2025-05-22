import { Group } from '../types';

export const groups: Group[] = [
  {
    id: '1',
    destination: 'Rishikesh',
    startDate: '2025-06-15',
    endDate: '2025-06-22',
    budget: 8000,
    maxMembers: 5,
    currentMembers: 3,
    creator: 'Rahul S.'
  },
  {
    id: '2',
    destination: 'Goa',
    startDate: '2025-07-10',
    endDate: '2025-07-15',
    budget: 10000,
    maxMembers: 6,
    currentMembers: 4,
    creator: 'Priya M.'
  },
  {
    id: '3',
    destination: 'Udaipur',
    startDate: '2025-08-05',
    endDate: '2025-08-10',
    budget: 12000,
    maxMembers: 4,
    currentMembers: 2,
    creator: 'Vikram K.'
  },
  {
    id: '4',
    destination: 'Varanasi',
    startDate: '2025-09-20',
    endDate: '2025-09-25',
    budget: 9000,
    maxMembers: 8,
    currentMembers: 5,
    creator: 'Ananya R.'
  }
];

export const getGroupById = (id: string) => {
  return groups.find(group => group.id === id);
};