"use client";

import { api } from "@/trpc/react";
import { Info } from "lucide-react";
import { useState } from "react";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import { createCheckoutSession } from "@/lib/stripe";

export default function BillingPageComponent() {
  const { data: user } = api.project.getMyCredits.useQuery();
  const [creditsToBuy, setCreditsToBuy] = useState<number[]>([100]);
  const creditsToBuyAmount = creditsToBuy[0];
  const price = (creditsToBuyAmount / 50).toFixed(2);
  return (
    <div className="p-4">
      <h1 className="mt-2 text-xl font-semibold">Billing</h1>
      <p className="text-sm text-gray-500">
        You currently have {user?.credits} credits.
      </p>
      <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-blue-500">
        <div className="flex items-center gap-2">
          <Info className="size-4"></Info>
          <p className="text-sm">
            Each credit allows you to index 1 file in a repository.
          </p>
        </div>
        <p className="text-sm">
          E.g. If your project has 100 files, you will need 100 credits to index
          it.
        </p>
      </div>
      <Slider
        defaultValue={[100]}
        max={1000}
        min={10}
        step={10}
        onValueChange={(value) => setCreditsToBuy(value)}
        value={creditsToBuy}
        className="mb-4"
      />
      <Button
        onClick={async () => {
          await createCheckoutSession(creditsToBuyAmount);
        }}
      >
        Buy {creditsToBuyAmount} credits for ${price}
      </Button>
    </div>
  );
}
