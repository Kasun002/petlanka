import homeData from '../data/home.json';
import type { HomePet, HomeNotification } from '../types/home';
import RegisterPetBanner from '../components/home/RegisterPetBanner';
import PetCard from '../components/home/PetCard';
import NotificationItem from '../components/home/NotificationItem';

// TODO: replace with API call when /home endpoint exists
const pets = homeData.pets as HomePet[];
const notifications = homeData.notifications as HomeNotification[];

export default function HomePage() {
  return (
    <div className="px-5 pt-[18px] pb-4 md:max-w-[1180px] md:mx-auto md:px-10 md:pt-8">

      {/* Desktop: greeting header row */}
      <div className="hidden md:flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[24px] font-bold font-display">Good morning</h1>
          <p className="text-[13.5px] text-[#6E6A5F] mt-1">Here's what's happening with your pets.</p>
        </div>
        <RegisterPetBanner compact />
      </div>

      {/* Mobile: full-width CTA banner */}
      <div className="md:hidden mb-4">
        <RegisterPetBanner />
      </div>

      {/* Single-col on mobile, 2-col (2fr 1fr) on desktop */}
      <div className="md:grid md:grid-cols-[2fr_1fr] md:gap-5">

        {/* My pets */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-[15px] font-bold">My pets</h2>
            <button className="text-[12.5px] text-primary font-semibold">View all</button>
          </div>
          {/* Mobile: horizontal scroll; Desktop: 2-col grid */}
          <div className="flex gap-3 overflow-x-auto pb-1.5 mb-5 md:overflow-visible md:grid md:grid-cols-2">
            {pets.map((pet) => <PetCard key={pet.id} pet={pet} />)}
          </div>
        </div>

        {/* Notifications */}
        <div>
          <h2 className="text-[15px] font-bold mb-2.5">Notifications</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
            {notifications.map((n, i) => (
              <NotificationItem
                key={n.id}
                notification={n}
                isLast={i === notifications.length - 1}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
