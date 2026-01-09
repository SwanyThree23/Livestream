import { ShoppingBag } from 'lucide-react';

function Marketplace() {
  const items = [
    { name: 'Premium Overlay Pack', price: 49, category: 'Graphics' },
    { name: 'Stream Manager Extension', price: 29, category: 'Tools' },
    { name: 'Chat Bot Pro', price: 99, category: 'Automation' },
    { name: 'Analytics Dashboard', price: 39, category: 'Analytics' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Marketplace</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.name} className="card">
            <div className="w-full h-32 bg-gradient-to-br from-brand-primary to-brand-accent rounded-lg mb-4 flex items-center justify-center">
              <ShoppingBag size={48} className="text-white opacity-50" />
            </div>
            <h3 className="font-semibold mb-2">{item.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{item.category}</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">${item.price}</span>
              <button className="btn-primary">Install</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Marketplace;
