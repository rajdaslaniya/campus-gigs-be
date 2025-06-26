export const TERMS_GENERATION_PROMPT = (keywords: string[]) => `
Generate a professional Terms and Conditions document for **CampusGigs**, a two-sided service marketplace where **Users** request services and **Providers** bid to offer them. Cover the following topics: ${keywords.join(', ')}.

Structure the document using clear, rich text formatting with proper heading hierarchy and bullet points:

# Introduction  
**CampusGigs** is a platform that connects Users seeking services with Providers offering them through a bidding system. These terms govern the use of the platform, including ${keywords.join(', ')}.

## Platform Roles  
There are two main roles:  
- **User**: Posts service requests and selects a bid from Providers.  
- **Provider**: Bids on service requests and completes the selected tasks.

## User Responsibilities  
As a User, you agree to:  
- Post clear and accurate service requests  
- Choose bids in good faith based on qualifications and pricing  
- Provide fair ratings upon service completion  
- Raise complaints responsibly in cases of dissatisfaction

## Provider Responsibilities  
As a Provider, you agree to:  
- Submit honest and competitive bids  
- Deliver services within agreed timelines and standards  
- Maintain professionalism and communication  
- Accept that payment is contingent on a rating of 3 stars or higher

## Payment and Rating Policy  
- Payments are held in escrow until service completion  
- Users must rate the Provider after service completion  
- Ratings **3 stars or higher** release the payment to the Provider  
- Ratings **below 3 stars** will hold the payment and trigger a complaint process

## Dispute Resolution  
If a complaint is raised:  
- The **CampusGigs** admin will review evidence from both parties  
- Admin may request additional details or mediation  
- Final decisions will determine if payment is released or refunded

## Prohibited Actions  
You must NOT:  
- Post fake gigs or bids  
- Manipulate the rating or payment system  
- Harass, abuse, or scam other users or providers  
- Circumvent the **CampusGigs** platform for direct transactions

## Privacy Policy  
**CampusGigs** collects and uses data for:  
- User verification and secure transactions  
- Service matching and account management  
- Platform improvement and dispute handling

## Account Termination  
**CampusGigs** may suspend or terminate accounts for:  
- Breaching any of these terms  
- Consistent low ratings or unresolved complaints  
- Fraudulent or harmful behavior

**Formatting Requirements:**  
• Use clear hierarchy (Heading 1, Heading 2, etc.)  
• Avoid code blocks or monospace text  
• Limit paragraphs to 4 lines max  
• Always highlight "CampusGigs" in **bold**  
• Ensure readability on mobile and desktop devices  
`;

export const PRIVACY_POLICY_GENERATION_PROMPT = (keywords: string[]) => `
Generate a professional Privacy Policy document for **CampusGigs**, a two-sided service marketplace where **Users** request services and **Providers** bid to offer them. Cover the following privacy-related topics: ${keywords.join(', ')}.

Structure the document using clear, rich text formatting with proper heading hierarchy and bullet points:

# Introduction  
**CampusGigs** is committed to protecting the privacy of its Users and Providers. This policy explains how we collect, use, and safeguard your information, including ${keywords.join(', ')}.

## Data Collection  
We collect information to provide better services to all our users, including:
- Personal identification details
- Service request and bid information
- Communication and transaction records

## Use of Information  
Your data is used for:
- Account creation and management
- Service matching and communication
- Payment processing and dispute resolution
- Platform improvement and analytics

## Data Sharing  
We do not sell your personal information. Data may be shared with:
- Service Providers and Users for transaction purposes
- Third-party payment processors
- Legal authorities if required by law

## User Rights  
You have the right to:
- Access and update your information
- Request deletion of your account
- Object to certain data uses

## Data Security  
We implement security measures to protect your data, including:
- Encryption of sensitive information
- Regular security audits
- Restricted access to personal data

## Cookies and Tracking  
**CampusGigs** uses cookies and similar technologies to:
- Enhance user experience
- Analyze platform usage
- Personalize content and ads

## Policy Updates  
We may update this Privacy Policy from time to time. Users will be notified of significant changes via email or platform notifications.

**Formatting Requirements:**  
• Use clear hierarchy (Heading 1, Heading 2, etc.)  
• Avoid code blocks or monospace text  
• Limit paragraphs to 4 lines max  
• Always highlight "CampusGigs" in **bold**  
• Ensure readability on mobile and desktop devices  
`;

export const CONTACT_US_RESPONSE_PROMPT = (subject: string, message: string) => `
You are an admin for CampusGigs, a two-sided service marketplace. A user has submitted a contact request with the following details:

Subject: ${subject}
Message: ${message}

Generate a concise, plain text response email and a short, clear subject line, each 1-2 lines only. The output must be suitable for use in a mailto URL (no formatting, no line breaks, no special characters). Structure your output as:

Response Subject: <your suggested subject>
Response Message: <your generated message>

Requirements:
- Keep both subject and message very short (1-2 lines)
- Use only plain text (no formatting, no line breaks)
- Make the message polite and solution-oriented
- Avoid special characters that could break a mailto URL
`;
