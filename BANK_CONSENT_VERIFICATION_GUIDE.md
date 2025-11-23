# Bank Consent Verification Guide

## Overview

This guide explains how the bank consent and verification system works in KYCChain. When users grant consent to banks, those banks can see which users have consented to them in their Verification Logs dashboard.

## How It Works

### 1. User Consent Flow

When a user grants consent to a bank:

1. **User logs in** to their account
2. **Navigates to Consent Management** page
3. **Grants consent** to a specific bank (e.g., "State Bank of India")
4. The consent is **recorded on the blockchain** with:
   - User ID and name
   - Bank/Institution name
   - Timestamp
   - Transaction hash
   - Action type: `consent_granted`

### 2. Bank Verification Logs

When a bank logs in:

1. **Bank authenticates** with their institution account
2. **Navigates to Verification Logs** tab
3. **System filters logs** to show only:
   - Users who have granted consent to **their specific institution**
   - Users who have revoked consent from them
   - All consent-related activities for their bank

### 3. Data Flow

```
┌─────────────────┐
│   User Login    │
│  (John Doe)     │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Consent Management Page        │
│  - Grant consent to SBI         │
│  - Select "State Bank of India" │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Consent Recorded               │
│  - userId: john@example.com     │
│  - userName: John Doe           │
│  - admin: State Bank of India   │
│  - action: consent_granted      │
│  - tx: 0x123...abc              │
│  - timestamp: 2024-01-15        │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Stored in verificationLogs[]   │
└─────────────────────────────────┘


┌─────────────────┐
│   Bank Login    │
│  (SBI Account)  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  System checks:                 │
│  user.institutionName =         │
│    "State Bank of India"        │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Verification Logs Page         │
│  Filters logs where:            │
│  log.admin === "State Bank..."  │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Display Results:               │
│  ✓ John Doe - Consent Granted   │
│  ✓ Jane Smith - Consent Granted │
│  ✓ Bob Wilson - Consent Revoked │
└─────────────────────────────────┘
```

## Implementation Details

### User Type Extension

The `User` interface now includes `institutionName`:

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "bank" | "admin";
  institutionName?: string;  // ← Bank's institution name
  walletAddress?: string;
  bankId?: string;
  profilePic?: string;
  createdAt: string;
  lastLogin?: string;
}
```

### Consent Log Structure

Each consent action creates a log entry:

```typescript
{
  id: "log-1705334567890",
  ts: "2024-01-15T10:30:00.000Z",
  userId: "john@example.com",
  userName: "John Doe",
  docType: null,
  action: "consent_granted",  // or "consent_revoked"
  admin: "State Bank of India",  // ← Bank institution name
  tx: "0x742d35Cc6634C0532925a3b8D9C9f3b67f002c7B",
  status: "success"
}
```

### Filtering Logic

In `VerificationLogsPage.tsx`, logs are filtered for banks:

```typescript
if (user?.institutionName) {
  filteredItems = resp.items.filter((log) => {
    // Show consent logs where admin matches the bank's institution name
    if (
      log.action === "consent_granted" ||
      log.action === "consent_revoked"
    ) {
      return (
        log.admin.toLowerCase() === user.institutionName?.toLowerCase()
      );
    }
    // Show all other logs (approved, flagged, etc.)
    return true;
  });
}
```

## Testing the Feature

### Step 1: Create Bank Account

1. Click "Get Started" on landing page
2. Enter email and verify OTP
3. Select account type: **"Bank/Institution"**
4. Choose institution: **"State Bank of India"**
5. Complete registration

### Step 2: Create User Account

1. Logout from bank account
2. Register as a new user
3. Select account type: **"Individual User"**
4. Complete registration

### Step 3: Grant Consent

1. Login as the user
2. Navigate to **"Consent Management"** page
3. Click **"Grant New Consent"**
4. Select **"State Bank of India"**
5. Consent is granted and recorded

### Step 4: Verify as Bank

1. Logout and login as SBI bank account
2. Navigate to **"Verification Logs"** tab
3. You should see:
   - The user who granted consent
   - User's email and name
   - Timestamp of consent
   - Transaction hash
   - "Consent Granted" badge

### Step 5: Test Consent Revocation

1. Logout and login as the user again
2. Go to Consent Management
3. Click **"Revoke"** on SBI consent
4. Logout and login as SBI bank
5. Verification Logs will now show:
   - "Consent Revoked" entry for that user
   - Updated active consents count

## Dashboard Statistics

The Verification Logs page shows key metrics for banks:

| Metric | Description |
|--------|-------------|
| **Consents Granted** | Total number of users who have granted consent |
| **Active Consents** | Granted consents minus revoked consents |
| **Total Users** | Unique users who have consented |
| **Consent Revoked** | Number of revoked consents |

## API Endpoints

### Grant Consent (User Side)

```typescript
await grantConsent(institutionName: string)
```

- Creates consent record
- Logs to verification logs with `admin: institutionName`
- Returns consent record with status

### Get Verification Logs (Bank Side)

```typescript
await getVerificationLogs({
  q?: string,
  action?: 'consent_granted' | 'consent_revoked' | ...,
  from?: string,
  to?: string,
  page?: number,
  pageSize?: number
})
```

- Returns all logs
- Frontend filters by `user.institutionName`
- Shows only relevant consents for the logged-in bank

## Security Considerations

1. **Role-Based Access**: Only users with `role: "bank"` can access Verification Logs
2. **Institution Filtering**: Banks can only see consents granted to their institution
3. **Blockchain Recording**: All consent actions are recorded with transaction hashes
4. **Immutable Logs**: Logs cannot be modified once created

## Future Enhancements

- [ ] Add document access controls based on consent
- [ ] Implement consent expiration dates
- [ ] Add notification system for new consents
- [ ] Create consent analytics dashboard
- [ ] Add bulk consent management
- [ ] Implement consent templates for specific document types

## Troubleshooting

### Bank Not Seeing Any Consents

**Problem**: Bank logs in but Verification Logs shows no consents.

**Solutions**:
1. Verify the bank's `institutionName` is set correctly in their user profile
2. Check that users are granting consent to the exact bank name (case-insensitive matching)
3. Ensure the user has actually granted consent to this specific bank

### Institution Name Mismatch

**Problem**: Consent granted but not showing for bank.

**Solutions**:
1. Check the exact spelling of institution names
2. Verify bank registration used the same institution name from BankSelector
3. Check browser console for any filtering errors

### Logs Not Updating

**Problem**: New consents not appearing immediately.

**Solutions**:
1. Refresh the page (logs are loaded on mount)
2. Check localStorage for `kycchain_user` and verify `institutionName` field
3. Clear browser cache and re-login

## Code Files Modified

- `src/types/auth.ts` - Added `institutionName` to User interface
- `src/services/api.ts` - Added `institutionName` to LoginResponse
- `src/contexts/AuthContext.tsx` - Store institution name on login/register
- `src/pages/user/VerificationLogsPage.tsx` - Filter logs by institution
- `src/services/mockApi.ts` - Consent logs include institution name

## Summary

The consent verification system creates a transparent, blockchain-backed record of user permissions. Banks can easily track which users have granted them access, enabling secure and compliant KYC verification processes. The filtering ensures banks only see data relevant to their institution, maintaining privacy and security across the platform.