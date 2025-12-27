import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  Search,
  BarChart3,
  Zap,
  Target,
  Globe,
  BarChart as BarChartIcon,
} from "lucide-react";

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section: The Hook */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
            {/* <div className="mt-24 sm:mt-32 lg:mt-16">
              <span className="rounded-full bg-indigo-600/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-600/10">
                New: AI-Powered Sales Forecasting
              </span>
            </div> */}
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              Ache os produtos vencedores. <br />
              <span className="text-indigo-600">Escale seus lucros.</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Ache de forma fácil, simples e rápida os produtos que mais vendem
              no Tiktok.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                href="/stores"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all flex items-center"
              >
                Crie uma conta grátis <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              {/* <Link
                href="/products"
                className="text-sm font-semibold leading-6 text-slate-900 flex items-center"
              >
                Browse Products{" "}
                <span aria-hidden="true" className="ml-1">
                  →
                </span>
              </Link> */}
            </div>
          </div>
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <div className="-m-2 rounded-xl bg-slate-900/5 p-2 ring-1 ring-inset ring-slate-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                <img
                  src="https://picsum.photos/id/20/800/600"
                  alt="App screenshot"
                  width={2432}
                  height={1442}
                  className="w-[36rem] rounded-md shadow-2xl ring-1 ring-slate-900/10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="py-24 sm:py-32 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600 uppercase tracking-wide">
              O processo
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Como achar os melhores produtos para o Tiktok Shop?
            </p>
            {/* <p className="mt-6 text-lg leading-8 text-slate-600">
              We streamline the path from raw data to actionable competitive
              intelligence.
            </p> */}
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <Globe className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  1. Crie uma conta grátis
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                  <p className="flex-auto">
                    Crie uma conta totalmente gratuita clicando no botão "Crie
                    uma conta grátis" no topo dessa página.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <BarChartIcon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  2. Acesse o nosso sistema
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                  <p className="flex-auto">
                    Faça o login no sistema clicando no botão "Login" no topo
                    dessa página e acesse o nosso sistema.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <Target className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  3. Ache os melhores produtos
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                  <p className="flex-auto">
                    Procure pelos produtos que mais vendem e que mais tem
                    chances de colocar dinheiro no seu bolso.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      {/* <div className="relative isolate overflow-hidden bg-slate-900 py-24 sm:py-32">
        <img
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&crop=focalpoint&fp-y=.8&w=2830&h=1500&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply"
          alt=""
          className="absolute inset-0 -z-10 h-full w-full object-cover object-right md:object-center opacity-20"
        />
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Unlock Your Growth Potential
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Join 500+ retail brands using our platform to dominate their
              market segment.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base font-semibold leading-7 text-white sm:grid-cols-2 md:flex lg:gap-x-10">
              <div className="flex items-center gap-2">
                <Zap className="text-indigo-400 w-5 h-5" />
                Faster Decision Making
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="text-indigo-400 w-5 h-5" />
                Higher Profit Margins
              </div>
              <div className="flex items-center gap-2">
                <Search className="text-indigo-400 w-5 h-5" />
                Uncover Hidden Trends
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-indigo-400 w-5 h-5" />
                Validated Data
              </div>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col-reverse">
                <dt className="text-base leading-7 text-slate-300">
                  Active Stores Tracked
                </dt>
                <dd className="text-2xl font-bold leading-9 tracking-tight text-white">
                  12,000+
                </dd>
              </div>
              <div className="flex flex-col-reverse">
                <dt className="text-base leading-7 text-slate-300">
                  Revenue Processed Yearly
                </dt>
                <dd className="text-2xl font-bold leading-9 tracking-tight text-white">
                  $4.5B
                </dd>
              </div>
              <div className="flex flex-col-reverse">
                <dt className="text-base leading-7 text-slate-300">
                  Increase in ROI
                </dt>
                <dd className="text-2xl font-bold leading-9 tracking-tight text-white">
                  45%
                </dd>
              </div>
              <div className="flex flex-col-reverse">
                <dt className="text-base leading-7 text-slate-300">Uptime</dt>
                <dd className="text-2xl font-bold leading-9 tracking-tight text-white">
                  99.9%
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div> */}

      {/* Final CTA */}
      {/* <div className="bg-white">
        <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="relative isolate overflow-hidden bg-indigo-700 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:pt-0">
            <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to find your next bestseller?
                <br />
                Start using RetailMetrics today.
              </h2>
              <p className="mt-6 text-lg leading-8 text-indigo-100">
                Get instant access to top-tier retail performance rankings and
                start making data-backed decisions.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                <Link
                  href="/stores"
                  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors"
                >
                  Get started
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-semibold leading-6 text-white"
                >
                  Learn more <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            <div className="relative mt-16 h-80 lg:mt-8">
              <img
                className="absolute left-0 top-0 w-[57rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10"
                src="https://picsum.photos/id/2/1000/600"
                alt="App screenshot"
                width={1824}
                height={1080}
              />
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}

// Internal icon fix for missing ShieldCheck in the main import
const ShieldCheck = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
