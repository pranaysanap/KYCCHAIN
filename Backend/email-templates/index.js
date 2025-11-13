// Email Templates Index
// Export all available OTP email templates

import premiumOTPTemplate from './otp-premium.js';
import elegantOTPTemplate from './otp-elegant.js';
import darkOTPTemplate from './otp-dark.js';

// Export individual templates
export { premiumOTPTemplate, elegantOTPTemplate, darkOTPTemplate };

// Export default template (you can change this to your preferred template)
export default premiumOTPTemplate;

// Template descriptions for easy selection
export const templates = {
  premium: {
    name: 'Premium Gradient',
    description: 'Ultra modern design with beautiful purple-blue gradient theme',
    template: premiumOTPTemplate
  },
  elegant: {
    name: 'Elegant Minimalist',
    description: 'Clean, professional design with subtle animations',
    template: elegantOTPTemplate
  },
  dark: {
    name: 'Dark Theme',
    description: 'Sleek, modern dark design with neon accents',
    template: darkOTPTemplate
  }
};

// Helper function to get template by name
export const getTemplate = (templateName = 'premium') => {
  const template = templates[templateName];
  return template ? template.template : premiumOTPTemplate;
};
