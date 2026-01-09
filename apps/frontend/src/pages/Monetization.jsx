import { useState, useEffect } from 'react';
import { monetizationAPI } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { Check } from 'lucide-react';
import toast from 'react-hot-toast';

function Monetization() {
  const { user } = useAuthStore();
  const [subscription, setSubscription] = useState(null);

  const plans = [
    { name: 'Free', price: 0, features: ['1 stream/month', 'Basic analytics', 'Email support'] },
    { name: 'Basic', price: 29, features: ['10 streams/month', 'Multi-platform', 'AI features', 'Priority support'] },
    { name: 'Pro', price: 99, features: ['Unlimited streams', 'Advanced AI', 'Custom branding', '24/7 support'] },
    { name: 'Enterprise', price: 299, features: ['Everything in Pro', 'White-label', 'Dedicated account manager'] },
  ];

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const { data } = await monetizationAPI.getSubscription();
      setSubscription(data.data.subscription);
    } catch (error) {
      console.error('Failed to load subscription:', error);
    }
  };

  const handleUpgrade = async (planName) => {
    try {
      const { data } = await monetizationAPI.createCheckout(planName.toLowerCase());
      window.location.href = data.data.url;
    } catch (error) {
      toast.error('Failed to create checkout session');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Monetization</h1>

      <div className="card">
        <h2 className="text-lg font-semibold mb-2">Current Plan</h2>
        <p className="text-3xl font-bold capitalize">{user?.subscription_tier || 'Free'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <div key={plan.name} className={`card ${
            user?.subscription_tier?.toLowerCase() === plan.name.toLowerCase()
              ? 'border-2 border-brand-primary'
              : ''
          }`}>
            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
            <p className="text-3xl font-bold mb-4">
              ${plan.price}
              <span className="text-sm text-gray-600 dark:text-gray-400">/month</span>
            </p>
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center space-x-2">
                  <Check size={16} className="text-green-600" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            {user?.subscription_tier?.toLowerCase() !== plan.name.toLowerCase() && plan.name !== 'Free' && (
              <button onClick={() => handleUpgrade(plan.name)} className="w-full btn-primary">
                Upgrade
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Monetization;
