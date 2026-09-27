import React from 'react';
import RegisterWizard from './components/RegisterWizard';

export default function RegisterPage({ onGoToLogin }) {
    return <RegisterWizard onGoToLogin={onGoToLogin} />;
}
