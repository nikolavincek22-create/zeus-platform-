export type UserRole = 'Buyer' | 'Seller' | 'Builder' | 'Investor';

export interface ZeusUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  reputationScore: number;
  completedModules: string[];
  joinedDate: string;
  avatarInitials: string;
}

export interface Deal {
  id: string;
  title: string;
  type: 'real_estate' | 'material';
  price: number;
  location: string;
  lat: number;
  lng: number;
  status: 'active' | 'pending' | 'closed';
  seller: string;
  sqm?: number;
  category?: string;
  imageHue: number;
}

export interface EducationModule {
  id: string;
  code: 'A' | 'B';
  title: string;
  subtitle: string;
  lessons: number;
  duration: string;
  topics: string[];
}

export const MOCK_USER: ZeusUser = {
  id: 'USR-001',
  name: 'Marko Horvat',
  email: 'marko.horvat@zeus.hr',
  role: 'Investor',
  reputationScore: 847,
  completedModules: ['A'],
  joinedDate: '2024-01-15',
  avatarInitials: 'MH',
};

export const MOCK_DEALS: Deal[] = [
  {
    id: 'D-001',
    title: 'Apartman Gornji Grad',
    type: 'real_estate',
    price: 285000,
    location: 'Zagreb, HR',
    lat: 45.8150,
    lng: 15.9819,
    status: 'active',
    seller: 'Ana Kovač',
    sqm: 68,
    imageHue: 210,
  },
  {
    id: 'D-002',
    title: 'Poslovni prostor Centar',
    type: 'real_estate',
    price: 520000,
    location: 'Split, HR',
    lat: 43.5081,
    lng: 16.4402,
    status: 'active',
    seller: 'Ivan Perić',
    sqm: 142,
    imageHue: 190,
  },
  {
    id: 'D-003',
    title: 'Armatura B500B – 20t',
    type: 'material',
    price: 18400,
    location: 'Rijeka, HR',
    lat: 45.3271,
    lng: 14.4422,
    status: 'active',
    seller: 'Gradnja d.o.o.',
    category: 'Čelik',
    imageHue: 30,
  },
  {
    id: 'D-004',
    title: 'Vila Makarska rivijera',
    type: 'real_estate',
    price: 1200000,
    location: 'Makarska, HR',
    lat: 43.2969,
    lng: 17.0178,
    status: 'pending',
    seller: 'Luka Blažević',
    sqm: 380,
    imageHue: 160,
  },
  {
    id: 'D-005',
    title: 'Portland cement CEM I – 500 vreća',
    type: 'material',
    price: 6250,
    location: 'Varaždin, HR',
    lat: 46.3044,
    lng: 16.3366,
    status: 'active',
    seller: 'EuroCement d.o.o.',
    category: 'Cement',
    imageHue: 50,
  },
  {
    id: 'D-006',
    title: 'Stan Trešnjevka 3s+kk',
    type: 'real_estate',
    price: 198000,
    location: 'Zagreb, HR',
    lat: 45.8003,
    lng: 15.9381,
    status: 'active',
    seller: 'Petra Mihalić',
    sqm: 82,
    imageHue: 270,
  },
];

export const EDUCATION_MODULES: EducationModule[] = [
  {
    id: 'MOD-A',
    code: 'A',
    title: 'Pravna sigurnost',
    subtitle: 'Pravni okvir nekretnina i ugovori',
    lessons: 12,
    duration: '~4h',
    topics: [
      'Zakon o vlasništvu i nekretninama',
      'Predugovori i ugovori o kupoprodaji',
      'Gruntovnica i ZK uložak',
      'Porezne obveze pri kupnji',
      'Ugovori o gradnji',
      'Rješavanje sporova',
    ],
  },
  {
    id: 'MOD-B',
    code: 'B',
    title: 'Operativna efikasnost',
    subtitle: 'Procesi i optimizacija transakcija',
    lessons: 10,
    duration: '~3.5h',
    topics: [
      'Due diligence nekretnine',
      'Pregovaranje i procjena vrijednosti',
      'Upravljanje gradilištem',
      'Nabava materijala i lanci opskrbe',
      'Digitalni alati i workflow',
      'Financijska analiza projekata',
    ],
  },
];

export function calcCommission(price: number, type: Deal['type']): number {
  return type === 'real_estate' ? price * 0.015 : price * 0.005;
}

export function getCommissionRate(type: Deal['type']): string {
  return type === 'real_estate' ? '1.5%' : '0.5%';
}

export function getReputationTier(score: number): { label: string; discount: string; color: string } {
  if (score >= 800) return { label: 'Elite',    discount: '−20% naknade', color: 'text-yellow-400' };
  if (score >= 600) return { label: 'Verified', discount: '−10% naknade', color: 'text-blue-400'   };
  if (score >= 400) return { label: 'Active',   discount: '−5% naknade',  color: 'text-green-400'  };
  return                     { label: 'Starter', discount: 'Standardna',   color: 'text-gray-400'   };
}
