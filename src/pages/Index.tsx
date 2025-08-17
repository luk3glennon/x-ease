import { useState } from 'react';
import { PharmacyLayout } from '@/components/PharmacyLayout';
import { Dashboard } from '@/components/Dashboard';
import { Prescriptions } from '@/components/Prescriptions';
import { CustomerOrders } from '@/components/CustomerOrders';
import { Stock } from '@/components/Stock';
import { Settings } from '@/components/Settings';
import type { PharmacyView } from '@/types/pharmacy';

const Index = () => {
  const [activeView, setActiveView] = useState<PharmacyView>('dashboard');

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard onViewChange={setActiveView} />;
      case 'prescriptions':
        return <Prescriptions />;
      case 'orders':
        return <CustomerOrders />;
      case 'stock':
        return <Stock />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onViewChange={setActiveView} />;
    }
  };

  return (
    <PharmacyLayout activeView={activeView} onViewChange={setActiveView}>
      {renderActiveView()}
    </PharmacyLayout>
  );
};

export default Index;
