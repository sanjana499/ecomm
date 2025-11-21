"use client";

import { Suspense } from "react";
import PaymentPage from "./PaymentPage";

export default function Wrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentPage />
    </Suspense>
  );
}
