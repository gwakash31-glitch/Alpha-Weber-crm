import type { Config } from 'tailwindcss';
const config: Config = { content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'], theme: { extend: { colors: { obsidian: '#05060d', panel: '#0b1020', gold: '#d6b35a', aqua: '#55e6c1' }, boxShadow: { glow: '0 24px 80px rgba(85,230,193,.18)' } } }, plugins: [] };
export default config;
