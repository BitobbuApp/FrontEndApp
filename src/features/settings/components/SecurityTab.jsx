import React from 'react';
import ChangePasswordCard from './security/ChangePasswordCard';
import TwoFactorCard from './security/TwoFactorCard';
import CompanyTwoFactorPolicyCard from './security/CompanyTwoFactorPolicyCard';

/** Settings > Security: password, two-step verification and the company policy. */
export default function SecurityTab({ company }) {
    return (
        <div className="space-y-6">
            <ChangePasswordCard />
            <TwoFactorCard />
            {company?.id && <CompanyTwoFactorPolicyCard companyId={company.id} />}
        </div>
    );
}
