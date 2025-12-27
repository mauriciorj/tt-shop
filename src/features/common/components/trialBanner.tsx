"use client";

import { Button } from "@/ui/button";
import { Card } from "@/ui/card";

export function TrialBanner() {
  return (
    <Card className="mb-6 bg-blue-50 border-blue-200 p-4">
      <div className="flex items-center gap-3 text-sm">
        <div className="text-blue-600">ℹ️</div>
        <div className="flex-1">
          <span className="text-blue-900">
            Trial accounts get{" "}
            <span className="font-bold text-blue-700">10 searches per day</span>
            . You have{" "}
            <span className="font-bold text-blue-700">9 remaining</span>.
          </span>
        </div>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
          Upgrade Now
        </Button>
      </div>
    </Card>
  );
}
