import { Bell, Building2, CheckCircle2, Globe2, KeyRound, Laptop, LockKeyhole, Mail, ShieldCheck, Smartphone, UserRound } from 'lucide-react';

export const countries = ['United States', 'United Kingdom', 'United Arab Emirates', 'Canada', 'Australia', 'Germany'];
export const authRoles = ['Owner', 'Admin', 'Manager', 'Employee', 'Viewer'];
export const roleDescriptions = {
  Owner: 'Full workspace ownership, billing, security, and irreversible account actions.',
  Admin: 'Manage users, roles, company settings, and operational security controls.',
  Manager: 'Coordinate teams, approve workflows, and review scoped performance data.',
  Employee: 'Work inside assigned modules with standard collaboration permissions.',
  Viewer: 'Read-only access for auditors, partners, and executive stakeholders.',
};

export const profile = {
  name: 'Alpha Weber Operations Lead',
  email: 'operations@alphaweber.com',
  phone: '+1 (415) 555-0187',
  company: 'Alpha Weber',
  country: 'United States',
  timezone: 'Pacific Time (PT)',
  language: 'English',
  theme: 'System preference',
  notifications: 'Security, product updates, and approvals',
};

export const settingsSections = [
  { title: 'Account', icon: UserRound, text: 'Profile identity, preferences, workspace membership, and account status.' },
  { title: 'Security', icon: ShieldCheck, text: 'Password, verification methods, sessions, and connected devices.' },
  { title: 'Privacy', icon: LockKeyhole, text: 'Data visibility, export readiness, consent, and communication preferences.' },
  { title: 'Notifications', icon: Bell, text: 'Email, in-app, security, and weekly summary notification controls.' },
];

export const devices = [
  { name: 'MacBook Pro', location: 'San Francisco, CA', seen: 'Active now', icon: Laptop },
  { name: 'iPhone 15 Pro', location: 'San Francisco, CA', seen: '12 minutes ago', icon: Smartphone },
  { name: 'Chrome on Windows', location: 'New York, NY', seen: 'Yesterday at 4:42 PM', icon: Globe2 },
];

export const notifications = [
  { title: 'Email verification pending', text: 'Confirm operations@alphaweber.com to unlock workspace invitations.', unread: true },
  { title: 'New device recognized', text: 'A trusted MacBook Pro session was created after password confirmation.', unread: true },
  { title: 'Profile completeness', text: 'Add a company logo and business category before inviting team members.', unread: false },
];

export const recentSearches = ['Security settings', 'Invite admin users', 'Change password', 'Notification preferences'];

export const onboardingSteps = [
  { title: 'Welcome to Alpha Weber CRM', icon: CheckCircle2, text: 'Set up a secure workspace foundation before connecting live business data.' },
  { title: 'Create workspace', icon: Building2, text: 'Reserve the company workspace name, domain, and regional defaults.' },
  { title: 'Complete profile', icon: UserRound, text: 'Add your personal details, timezone, language, and communication choices.' },
  { title: 'Secure access', icon: KeyRound, text: 'Prepare password policy, email verification, roles, and future Supabase Auth hooks.' },
];
