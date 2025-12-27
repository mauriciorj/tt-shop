"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductHeader } from "@/products/components/productHeader";
import { CoreMetrics } from "@/products/components/coreMetrics";
import { RevenueChart } from "@/products/components/revenueChart";
import { VideosTable } from "@/products/components/videosTable";

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div className="min-h-screen bg-background">
      <div>
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <Link
            href="/stores"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Produtos
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <ProductHeader productId={id} />

        {/* Core Metrics Section */}
        <div className="mt-8">
          <CoreMetrics productId={id} />
        </div>

        {/* Revenue Chart Section */}
        <div className="mt-8">
          <RevenueChart productId={id} />
        </div>
        <div>
          <VideosTable />
        </div>
      </div>
    </div>
  );
}
