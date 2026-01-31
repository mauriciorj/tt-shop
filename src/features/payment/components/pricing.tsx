import Link from "next/link";
import { Check } from "lucide-react";

export default function ProductsPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for exploring the market basics.",
      features: [
        "Track up to 5 stores",
        "Top 10 products ranking",
        "Monthly trend reports",
        "Standard data refresh",
      ],
      cta: "Get Started",
      mostPopular: false,
    },
    {
      name: "Beginner",
      price: "$29",
      description: "Ideal for growing businesses and startups.",
      features: [
        "Track up to 50 stores",
        "Full product rankings",
        "Weekly analytics reports",
        "Sales velocity alerts",
        "Competitor benchmarking",
      ],
      cta: "Start Free Trial",
      mostPopular: true,
    },
    {
      name: "Pro",
      price: "$99",
      description: "For enterprises needing deep market insights.",
      features: [
        "Unlimited store tracking",
        "Real-time data streaming",
        "Advanced AI forecasting",
        "Custom API access",
        "Dedicated account manager",
        "Team collaboration tools",
      ],
      cta: "Contact Sales",
      mostPopular: false,
    },
  ];

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            Pricing
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Choose the right plan for your business
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-slate-600">
          Start with our free plan and upgrade as your analysis needs grow.
          Every plan includes our core marketplace ranking engine.
        </p>
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col justify-between rounded-3xl p-8 ring-1 ring-slate-200 xl:p-10 ${
                plan.mostPopular ? "bg-slate-900 ring-slate-900" : "bg-white"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3
                    id={plan.name}
                    className={`text-lg font-semibold leading-8 ${
                      plan.mostPopular ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {plan.name}
                  </h3>
                  {plan.mostPopular && (
                    <p className="rounded-full bg-indigo-500 px-2.5 py-1 text-xs font-semibold leading-5 text-white">
                      Most popular
                    </p>
                  )}
                </div>
                <p
                  className={`mt-4 text-sm leading-6 ${plan.mostPopular ? "text-slate-300" : "text-slate-600"}`}
                >
                  {plan.description}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span
                    className={`text-4xl font-bold tracking-tight ${plan.mostPopular ? "text-white" : "text-slate-900"}`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`text-sm font-semibold leading-6 ${plan.mostPopular ? "text-slate-300" : "text-slate-600"}`}
                  >
                    /month
                  </span>
                </p>
                <ul
                  role="list"
                  className={`mt-8 space-y-3 text-sm leading-6 ${
                    plan.mostPopular ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check
                        className="h-6 w-5 flex-none text-indigo-500"
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/signup"
                aria-describedby={plan.name}
                className={`mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors ${
                  plan.mostPopular
                    ? "bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500"
                    : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 ring-1 ring-inset ring-indigo-200"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
