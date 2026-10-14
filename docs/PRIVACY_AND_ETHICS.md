# VitaTwin — Privacy, Ethics & Responsible AI

## 1. Ethical AI Principles in Healthcare
1. **Preventive Decision Support, Not Autonomous Diagnosis**:
   VitaTwin is architected as an educational preventive screening tool. It does not replace clinical evaluation by a licensed physician, does not prescribe pharmaceutical treatments, and does not alter therapeutic regimens.
2. **Probability Calibration & Transparency**:
   Models output calibrated probability percentages and discrete risk tiers. Feature contribution factors and model versioning are displayed alongside predictions.
3. **Absence of False Reassurance**:
   A low probability score is explicitly accompanied by standard lifestyle guidance and routine monitoring notes, preventing users from neglecting standard health checkups.

## 2. Privacy & Multi-Tenant Data Protection
- **Ownership Scoping**: All database queries (`find`, `update`, `delete`) include `userId: req.user.id`.
- **Session Tokens**: JWT tokens are transmitted via secure HTTP-only cookies and Bearer headers.
- **Password Protection**: Passwords are encrypted with bcrypt before being written to MongoDB.
- **Portability**: Users can export their entire biomarker history in standard CSV format at any time.
