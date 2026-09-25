// components/Footer.tsx
import Image from 'next/image';
import Link from 'next/link';

const footerLinks = [
  'Privacy',
  'Do Not Sell My Personal Information',
  'Modern Slavery Statement',
  'Terms',
  'Trademark',
  'Certification & Compliance',
  'Vulnerability Disclosure Policy',  
];

type FooterProps = {
  logoUrl?: string | null;
  siteName?: string;
};

export default function Footer({ logoUrl, siteName = 'Automation Anywhere' }: FooterProps) {
  return (
    <footer className="bg-[#1a1a1a] py-8 px-4">
      <div className="max-w-6xl mx-auto">
       
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-300">
          {footerLinks.map((label, i) => (
            <span key={label} className="flex items-center gap-x-4">
              <a href="#" className="hover:text-white transition-colors">
                {label}
              </a>
              {i < footerLinks.length - 1 && <span className="text-gray-600">|</span>}
            </span>
          ))}
        </nav>
        <p className="text-sm text-gray-400 mt-4 text-center">
          ©{new Date().getFullYear()} {siteName}, Inc.
        </p>
      </div>
    </footer>
  );
}