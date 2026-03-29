import React, { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

const RewardShop: React.FC = () => {
  const { coins, removeCoins } = useGameStore();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const items = [
    {
      id: '1',
      name: 'Extra Game Time',
      description: 'Unlock 30 minutes of gaming',
      cost: 100,
      icon: '🎮',
      category: 'Digital',
    },
    {
      id: '2',
      name: 'Movie Night',
      description: 'Watch your favorite movie',
      cost: 150,
      icon: '🍿',
      category: 'Entertainment',
    },
    {
      id: '3',
      name: 'Ice Cream Treat',
      description: 'Get ice cream of your choice',
      cost: 80,
      icon: '🍦',
      category: 'Snack',
    },
    {
      id: '4',
      name: 'New Book',
      description: 'Choose a new book to read',
      cost: 120,
      icon: '📕',
      category: 'Education',
    },
    {
      id: '5',
      name: 'Sports Gear',
      description: 'New sports equipment',
      cost: 200,
      icon: '⚽',
      category: 'Sports',
    },
    {
      id: '6',
      name: 'Extra Allowance',
      description: 'Bonus pocket money',
      cost: 180,
      icon: '💳',
      category: 'Money',
    },
  ];

  const item = items.find((i) => i.id === selectedItem);
  const canAfford = item && coins >= item.cost;

  const handlePurchase = () => {
    if (item && canAfford) {
      removeCoins(item.cost);
      // Show success and close modal
      setTimeout(() => setSelectedItem(null), 500);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-display font-bold text-accent-gold">Reward Shop</h2>
        <div className="text-2xl font-bold text-accent-gold">{coins} coins</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((shopItem) => (
          <Card
            key={shopItem.id}
            className={`p-4 cursor-pointer transition-all hover:border-accent-gold/50 ${
              coins < shopItem.cost ? 'opacity-50' : ''
            }`}
            onClick={() => setSelectedItem(shopItem.id)}
          >
            <div className="text-center">
              <div className="text-5xl mb-2">{shopItem.icon}</div>
              <h3 className="font-display font-bold mb-1 text-sm">{shopItem.name}</h3>
              <p className="text-xs text-gray-400 mb-3">{shopItem.description}</p>
              <div className="inline-block px-3 py-1 bg-accent-gold/20 text-accent-gold rounded-full text-sm font-bold">
                {shopItem.cost} coins
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedItem && item && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedItem(null)}
          title={item.name}
          actions={[
            {
              label: 'Cancel',
              onClick: () => setSelectedItem(null),
              variant: 'secondary',
            },
            {
              label: canAfford ? 'Purchase' : 'Not Enough Coins',
              onClick: handlePurchase,
              variant: canAfford ? 'primary' : 'secondary',
            },
          ]}
        >
          <div className="space-y-4">
            <div className="text-6xl text-center">{item.icon}</div>
            <p className="text-gray-300">{item.description}</p>
            <div className="bg-secondary rounded-lg p-4">
              <div className="flex justify-between">
                <span>Cost:</span>
                <span className="font-bold text-accent-gold">{item.cost} coins</span>
              </div>
              <div className="flex justify-between text-green-400 mt-2">
                <span>Your coins:</span>
                <span className="font-bold">{coins}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default RewardShop;
