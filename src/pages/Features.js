import { HeartIcon, ClockIcon, EyeIcon  } from '@heroicons/react/24/solid';

function FeatureCard({ icon, title, children}) {
    return <div className="mb-12 lg:mb-0">
        <div className="p-4 bg-blue-600 rounded-lg shadow-lg inline-block mb-6">
            {icon}
        </div>
        <h5 className="text-lg font-bold mb-4">{title}</h5>
        <p className="text-gray-500">
            {children}
        </p>
    </div>
}

export default function Features() {
    return <div className="container my-24 px-6 mx-auto">
        <section className="mb-32 text-gray-800 text-center">
            <h2 className="text-3xl font-bold mb-12">Why is it so <u className="text-blue-600">great?</u></h2>
            <div className="grid lg:grid-cols-3">
                <FeatureCard
                    icon={<HeartIcon className="w-5 h-5 text-white" />}
                    title="Top class healthcare"
                >
                    From remote appointments to detailed nutrition plans, petlink offers the best
                    services to keep your best friend healthy so that you can rest assured and enjoy
                    your time with it.
                </FeatureCard>

                <FeatureCard
                    icon={<EyeIcon className="w-5 h-5 text-white" />}
                    title="Looking after your pet"
                >
                    Receive automatic notifications and reminders for scheduled appointments
                    or checkups that need to be scheduled, constantly updating nutritional plans
                    and product recomendations ensure your animal is always happy and healthy.
                </FeatureCard>

                <FeatureCard
                    icon={<ClockIcon className="w-5 h-5 text-white" />}
                    title="Save time"
                >
                    Long are the days of going to the supermarket to buy food and toys for your pet
                    thanks to our online store and shipping services. And thanks to the integrated healthcare,
                    medicine can also be ordered.
                </FeatureCard>
            </div>
        </section>
    </div>;
}
